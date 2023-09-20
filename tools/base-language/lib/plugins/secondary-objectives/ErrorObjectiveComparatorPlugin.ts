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
  ErrorObjectiveComparator,
  SecondaryObjectiveComparator,
} from "@syntest/search";

import { SecondaryObjectivePlugin } from "../SecondaryObjectivePlugin";

/**
 * Plugin for ErrorObjectiveComparator
 */
export class ErrorObjectiveComparatorPlugin<
  T extends Encoding
> extends SecondaryObjectivePlugin<T> {
  constructor() {
    super(
      "error",
      "Secondary objective based on wether the encoding introduces an error"
    );
  }

  createSecondaryObjective(): SecondaryObjectiveComparator<T> {
    return new ErrorObjectiveComparator();
  }

  override getOptions() {
    return new Map();
  }
}
