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
import { EncodingRunner } from "../search/EncodingRunner";
import { EncodingSampler } from "../search/EncodingSampler";
import { Crossover, Encoding, EventManager } from "..";
import { SearchAlgorithm } from "../search/metaheuristics/SearchAlgorithm";
import { ObjectiveManager } from "../search/objective/managers/ObjectiveManager";
import { PluginInterface } from "./PluginInterface";

export type SearchAlgorithmOptions<T extends Encoding> = {
  eventManager?: EventManager<T>;
  objectiveManager?: ObjectiveManager<T>;
  encodingSampler?: EncodingSampler<T>;
  runner?: EncodingRunner<T>;
  crossover?: Crossover<T>;
};

export interface SearchAlgorithmPlugin<T extends Encoding>
  extends PluginInterface<T> {
  createSearchAlgorithm<O extends SearchAlgorithmOptions<T>>(
    options: O
  ): SearchAlgorithm<T>;
}
