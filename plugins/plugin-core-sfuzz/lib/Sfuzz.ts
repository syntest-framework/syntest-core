/*
 * Copyright 2020-2023 Delft University of Technology and SynTest contributors
 *
 * This file is part of SynTest Framework - SynTest Core Sfuzz plugin.
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

import {
  Encoding,
  MOSAFamily,
  EncodingSampler,
  Crossover,
  getUserInterface,
  ObjectiveManager,
  SearchAlgorithmPlugin,
  SearchAlgorithm,
  SearchAlgorithmOptions,
  EventManager,
} from "@syntest/core";
import { SfuzzObjectiveManager } from "./SfuzzObjectiveManager";

/**
 * sFuzz
 *
 * Based on:
 * sFuzz: An Efficient Adaptive Fuzzer for Solidity Smart Contracts
 * Tai D. Nguyen, Long H. Pham, Jun Sun, Yun Lin, Quang Tran Minh
 *
 * @author Mitchell Olsthoorn
 * @author Annibale Panichella
 */
export class Sfuzz<T extends Encoding> extends MOSAFamily<T> {
  constructor(
    eventManager: EventManager<T>,
    objectiveManager: ObjectiveManager<T>,
    encodingSampler: EncodingSampler<T>,
    crossover: Crossover<T>
  ) {
    super(eventManager, objectiveManager, encodingSampler, crossover);
  }

  protected _environmentalSelection(): void {
    if (
      this._objectiveManager.getCurrentObjectives().size == 0 &&
      this._objectiveManager.getUncoveredObjectives().size != 0
    )
      throw Error(
        "This should never happen. There is a likely bug in the objective manager"
      );

    if (
      this._objectiveManager.getCurrentObjectives().size == 0 &&
      this._objectiveManager.getUncoveredObjectives().size == 0
    )
      return; // the search should end

    // non-dominated sorting
    getUserInterface().debug(
      "Number of objectives = " +
        this._objectiveManager.getCurrentObjectives().size
    );

    const F = this.preferenceSortingAlgorithm(
      this._population,
      this._objectiveManager.getCurrentObjectives()
    );

    getUserInterface().debug("First front size = " + F[0].length);

    // select new population
    this._population = F[0];
  }
}
