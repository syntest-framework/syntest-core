/*
 * Copyright 2020-2023 SynTest contributors
 *
 * This file is part of SynTest Framework - SynTest JavaScript.
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
import { setupLogger } from "@syntest/logging";
import { StorageManager } from "@syntest/storage";
import * as chai from "chai";

import { StateStorage } from "../lib/StateStorage";

const expect = chai.expect;

describe("simulationTest", () => {
  it("SimpleTest", () => {
    setupLogger("", [""], "");
    new StateStorage(new StorageManager("", "", ""), "");

    expect(true);
  });
});