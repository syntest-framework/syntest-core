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
import {
  Encoding,
  ObjectiveManager,
  StructuralUncoveredObjectiveManager,
} from "@syntest/search";

import {
  ObjectiveManagerOptions,
  ObjectiveManagerPlugin,
} from "../ObjectiveManagerPlugin";

/**
 * Plugin for the structural uncovered objective manager
 *
 * @author Mitchell Olsthoorn
 */
export class StructuralObjectiveManagerPlugin<
  T extends Encoding
> extends ObjectiveManagerPlugin<T> {
  constructor() {
    super("structural-uncovered", "A structural uncovered objective manager");
  }

  createObjectiveManager(
    options: ObjectiveManagerOptions<T>
  ): ObjectiveManager<T> {
    return new StructuralUncoveredObjectiveManager(
      options.runner,
      options.secondaryObjectives
    );
  }

  override getOptions() {
    return new Map();
  }
}
