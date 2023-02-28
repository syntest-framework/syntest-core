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
import { Crossover } from "../../lib";
import { minimumValue } from "../../lib/util/diagnostics";
import { DummyEncodingMock } from "./DummyEncoding.mock";

export class DummyCrossover implements Crossover<DummyEncodingMock> {
  crossOver(parents: DummyEncodingMock[]): DummyEncodingMock[] {
    if (parents.length < 2) {
      throw new Error(minimumValue("number of parents", 2, parents.length));
    }
    return [parents[0].copy(), parents[1].copy()];
  }
}