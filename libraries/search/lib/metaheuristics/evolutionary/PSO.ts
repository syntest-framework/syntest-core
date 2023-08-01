/*
 * Copyright 2020-2023 Delft University of Technology and SynTest contributors
 *
 * This file is part of SynTest Framework - SynTest Core.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { getLogger, Logger } from "@syntest/logging";

import { DominanceComparator } from "../../comparators/DominanceComparator";
import { Encoding } from "../../Encoding";
import { EncodingSampler } from "../../EncodingSampler";
import { ObjectiveManager } from "../../objective/managers/ObjectiveManager";
import { ObjectiveFunction } from "../../objective/ObjectiveFunction";
import { Procreation } from "../../operators/procreation/Procreation";
import { shouldNeverHappen } from "../../util/diagnostics";

import { EvolutionaryAlgorithm } from "./EvolutionaryAlgorithm";

/**
 * Particle Swarm Optimization algorithm.
 *
 * @author Diego Viero
 */
export class PSO<T extends Encoding> extends EvolutionaryAlgorithm<T> {
  protected static override LOGGER: Logger;
  private W = 0.5;
  private c1 = 0.25;
  private c2 = 0.25;
  private pBestMap: Map<string, T> = undefined; // Map containing best current solution for each particle
  private velocityMap: Map<string, { id: string; value: number }[]> = undefined; // Map containing velocity vectors for each particle
  private allObjectives: ObjectiveFunction<T>[] = [];
  private maximumVelocity: number;
  private minimumVelocity: number;

  constructor(
    objectiveManager: ObjectiveManager<T>,
    encodingSampler: EncodingSampler<T>,
    procreation: Procreation<T>,
    populationSize: number
  ) {
    super(objectiveManager, encodingSampler, procreation, populationSize);

    this.maximumVelocity = Number.NEGATIVE_INFINITY;
    this.minimumVelocity = Number.POSITIVE_INFINITY;

    PSO.LOGGER = getLogger("PSO");
  }

  protected _environmentalSelection(): void {
    if (
      this._objectiveManager.getCurrentObjectives().size === 0 &&
      this._objectiveManager.getUncoveredObjectives().size > 0
    )
      throw new Error(shouldNeverHappen("Objective Manager"));

    if (
      this._objectiveManager.getCurrentObjectives().size === 0 &&
      this._objectiveManager.getUncoveredObjectives().size === 0
    )
      return; // the search should end

    // non-dominated sorting
    PSO.LOGGER.debug(
      `Number of objectives = ${
        this._objectiveManager.getCurrentObjectives().size
      }`
    );

    if (
      this.pBestMap === undefined ||
      this.velocityMap === undefined ||
      this.allObjectives.length === 0
    )
      this._initializeObjectivesAndMaps(); // Necessary step since the population is not available in the constructor

    const mutatedPopulation: T[] = this._mutatePopulation(); // Population mutated based on PSO approach

    this._population = mutatedPopulation;
  }

  protected _mutatePopulation(): T[] {
    const archive = this.getNonDominatedFront(
      this._objectiveManager.getCurrentObjectives(),
      this._population
    );

    const currentObjectivesMap = new Map(
      [...this._objectiveManager.getCurrentObjectives()].map((objective) => [
        objective.getIdentifier(),
        objective,
      ])
    );

    const mutatedPopulation: T[] = [];

    for (const particle of this._population) {
      const gBest = this._selectGbest(particle, archive);
      const pBest = this._selectPbest(particle);

      this._updateVelocity(particle, pBest, gBest, currentObjectivesMap);

      mutatedPopulation.push(this._updatePosition(particle));
    }

    return mutatedPopulation;
  }

  /** Method used to update the position of a particle.
   *  If the particle has high velocity values, mutation
   *  is more likely to be applied multiple times.
   *
   * @param particle Particle to be mutated
   * @returns The possibly mutated particle
   */
  protected _updatePosition(particle: T): T {
    const velocity = this.velocityMap.get(particle.id);

    // Normalize vector through min-max normalization
    const normalizedVelocity = velocity.map(
      ({ value }) =>
        (value - this.minimumVelocity) /
        (this.maximumVelocity - this.minimumVelocity)
    );

    for (const velocityValue of normalizedVelocity) {
      if (Math.random() > velocityValue) particle.mutate(this._encodingSampler);
    }

    return particle;
  }

  /** Updates velocity of a particle using PSO formula
   *
   * @param particle Particle for which the velocity should be calculated
   * @param pBest Global best solution so far
   * @param gBest Local best solution so far
   */
  protected _updateVelocity(
    particle: T,
    pBest: T,
    gBest: T,
    currentObjectivesMap: Map<string, ObjectiveFunction<T>>
  ): void {
    const r1 = Math.random();
    const r2 = Math.random();

    if (!this.velocityMap.has(particle.id))
      // If current particle doesn't have a velocity, initialize it
      this.velocityMap.set(
        particle.id, // Initiate velocity matrix with zero values
        this.allObjectives.map((objectiveFunction) => ({
          id: objectiveFunction.getIdentifier(),
          value: 0,
        }))
      );

    // Update velocity according to PSO formula
    const newVelocity = this.velocityMap
      .get(particle.id)
      .map(({ id, value }) => {
        // The objective relative to this dimension is in the current objectives
        if (currentObjectivesMap.has(id)) {
          const currentObjective = currentObjectivesMap.get(id);
          const particleDistance = particle.getDistance(currentObjective);
          const pBestDistance = pBest.getDistance(currentObjective);
          const gBestDistance = gBest.getDistance(currentObjective);

          return {
            id: id,
            value:
              this.W * value +
              this.c1 * r1 * (pBestDistance - particleDistance) +
              this.c2 * r2 * (gBestDistance - particleDistance),
          };
        } // Objective is not currently considered
        else return { id, value };
      });

    // Update max and min velocity if necessary
    this.maximumVelocity = Math.max(
      ...newVelocity.map((object) => object.value),
      this.maximumVelocity
    );
    this.minimumVelocity = Math.min(
      ...newVelocity.map((object) => object.value),
      this.minimumVelocity
    );

    this.velocityMap.set(particle.id, newVelocity);
  }

  /** Select global best
   *  The method uses the PROB approach explained in the MOPSO paper
   *  by Coello Coello et al.
   *
   * @param particle The particle for which the global best should be selected
   * @param archive  Current archive of non-dominated solutions
   * @returns Global best solution
   */
  protected _selectGbest(particle: T, archive: T[]): T {
    if (archive.includes(particle))
      return this._weightedProbabilitySelection(archive);

    const dominatingParticles = archive.filter(
      (archiveParticle) =>
        DominanceComparator.compare(
          archiveParticle,
          particle,
          this._objectiveManager.getCurrentObjectives()
        ) === -1
    );

    if (dominatingParticles.length === 0)
      throw new Error("The dominating particles list shouldn't be empty");

    return this._weightedProbabilitySelection(dominatingParticles);
  }

  /** Updates current particle local best if the new value
   *  dominates the old one
   *
   * @param particle Particle to be compared with local best
   * @returns Either particle passed as parameter or old local best
   */
  protected _selectPbest(particle: T): T {
    const pbest = this.pBestMap.get(particle.id);

    if (pbest === undefined) {
      // PBest is not in the map, so return passed particle
      this.pBestMap.set(particle.id, particle);
      return particle;
    }

    const flag = DominanceComparator.compare(
      particle,
      this.pBestMap.get(particle.id),
      this._objectiveManager.getCurrentObjectives()
    );

    if (flag === -1) {
      this.pBestMap.set(particle.id, particle);
      return particle;
    }

    return this.pBestMap.get(particle.id);
  }

  /** Method of selecting global best from passed archive,
   *  the method calculates the amount of particles dominated by
   *  each solution in the archive and randomly selects one with
   *  probability inversely proportional to the amount of dominated
   *  particles
   *
   * @param archive Archive of non-dominated solutions
   * @returns A randmoly selected particle from the archive
   */
  protected _weightedProbabilitySelection(archive: T[]): T {
    // Population consists of only non-dominated solutions
    if (archive.length === this._population.length)
      return archive[Math.floor(Math.random() * archive.length)];

    /*
      Creates an array of objects containing the current particle 
      from the archive and the number of particles dominated by it.
    */
    const customArchive = archive.map((archiveParticle) => {
      const dominatedParticles = this._population.filter((particle) => {
        const flag = DominanceComparator.compare(
          archiveParticle,
          particle,
          this._objectiveManager.getCurrentObjectives()
        );

        return flag === -1;
      });

      return {
        particle: archiveParticle,
        dominatedParticles: dominatedParticles.length,
      };
    });

    const cleanCustomArchive = customArchive.filter(
      (particle) => particle.dominatedParticles !== 0
    );

    const weightsSum = cleanCustomArchive.reduce(
      (accumulator, { dominatedParticles }) =>
        accumulator + 1 / dominatedParticles,
      0
    );

    // Random number between 0 and weightsSum
    let rand = Math.random() * weightsSum;

    // Inversely proportional weighted probability selection
    for (const particle of customArchive) {
      rand -= 1 / particle.dominatedParticles;
      if (rand <= 0) return particle.particle;
    }

    // Throws error in case weighted selection didn't work.
    throw new Error(shouldNeverHappen("weighted probability selection"));
  }

  /** Initializes velocity map, pBest map and allObjectives list.
   *  The values should ideally be intialized in the constructor,
   *  although in that step the population and objectives are not
   *  yet generated, thus we need this method.
   */
  protected _initializeObjectivesAndMaps() {
    this.allObjectives = [
      ...this._objectiveManager.getUncoveredObjectives(),
      ...this._objectiveManager.getCoveredObjectives(),
    ];

    this.pBestMap = new Map<string, T>();
    this.velocityMap = new Map<string, { id: string; value: number }[]>();

    for (const particle of this._population) {
      this.pBestMap.set(particle.id, particle); // Initiate pBest to current value of each particle

      this.velocityMap.set(
        particle.id, // Initiate velocity matrix with zero values
        this.allObjectives.map((objectiveFunction) => ({
          id: objectiveFunction.getIdentifier(),
          value: 0,
        }))
      );
    }
  }

  /**
   * It retrieves the front of non-dominated solutions from a list
   */
  public getNonDominatedFront(
    uncoveredObjectives: Set<ObjectiveFunction<T>>,
    remainingSolutions: T[]
  ): T[] {
    const front: T[] = [];
    let isDominated: boolean;

    for (const current of remainingSolutions) {
      isDominated = false;
      const dominatedSolutions: T[] = [];
      for (const best of front) {
        const flag = DominanceComparator.compare(
          current,
          best,
          uncoveredObjectives
        );
        if (flag == -1) {
          dominatedSolutions.push(best);
        }
        if (flag == +1) {
          isDominated = true;
        }
      }

      if (isDominated) continue;

      for (const dominated of dominatedSolutions) {
        const index = front.indexOf(dominated);
        front.splice(index, 1);
      }

      front.push(current);
    }
    return front;
  }
}
