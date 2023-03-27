/*
 * Copyright 2020-2021 Delft University of Technology and SynTest contributors
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

import { Encoding } from "../../Encoding";
import { crowdingDistance } from "../../operators/ranking/CrowdingDistance";
import { fastNonDomSorting } from "../../operators/ranking/FastNonDomSorting";

import { EvolutionaryAlgorithm } from "./EvolutionaryAlgorithm";

/**
 * Non-dominated Sorting Genetic Algorithm (NSGA-II).
 *
 * Based on:
 * A fast and elitist multiobjective genetic algorithm: NSGA-II
 * K. Deb; A. Pratap; S. Agarwal; T. Meyarivan
 *
 * @author Mitchell Olsthoorn
 * @author Annibale Panichella
 * @author Dimitri Stallenberg
 */
export class NSGAII<T extends Encoding> extends EvolutionaryAlgorithm<T> {
  /**
   * @inheritDoc
   * @protected
   */
  protected _environmentalSelection(size: number): void {
    const F = fastNonDomSorting(
      this._population,
      this._objectiveManager.getCurrentObjectives()
    );

    // select new population
    const nextPopulation = [];
    let remain = size;
    let index = 0;

    // Obtain the next front
    let currentFront: T[] = F[index];

    while (remain > 0 && remain >= currentFront.length) {
      // Assign crowding distance to individuals
      crowdingDistance(
        currentFront,
        this._objectiveManager.getCurrentObjectives()
      );

      // Add the individuals of this front
      nextPopulation.push(...currentFront);

      // Decrement remain
      remain = remain - currentFront.length;

      // Obtain the next front
      index++;

      currentFront = F[index];
    }

    // Remain is less than front(index).size, insert only the best one
    if (remain > 0 && currentFront.length > 0) {
      // front contains individuals to insert
      crowdingDistance(
        currentFront,
        this._objectiveManager.getCurrentObjectives()
      );

      // sort in descending order of crowding distance
      currentFront.sort(
        (a: T, b: T) => b.getCrowdingDistance() - a.getCrowdingDistance()
      );

      for (const individual of currentFront) {
        if (remain === 0) break;

        nextPopulation.push(individual);
        remain--;
      }
    }

    this._population = nextPopulation;
  }
}
