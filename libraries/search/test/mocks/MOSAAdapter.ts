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
import { Encoding } from "../../lib/Encoding";
import { MOSAFamily } from "../../lib/metaheuristics/evolutionary/MOSAFamily";

import { DummySearchSubject } from "./DummySubject.mock";

export class MockedMOSA<T extends Encoding> extends MOSAFamily<T> {
  setPopulation(population: T[], size: number) {
    this._populationSize = size;
    for (const test of population) this._population.push(test);
  }

  getPopulation(): T[] {
    return this._population;
  }

  public environmentalSelection(size: number): void {
    super._environmentalSelection(size);
  }

  public updateObjectives(subject: DummySearchSubject<T>) {
    this._objectiveManager.load(subject);
  }
}
