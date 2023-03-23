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

import { Module, ModuleManager } from "@syntest/module";
import { SFuzzPlugin } from "./plugins/SFuzzPlugin";
import { SFuzzObjectiveManagerPlugin } from "./plugins/SFuzzObjectiveManagerPlugin";
import { SFuzzPreset } from "./SFuzzPreset";

export default class SFuzzModule extends Module {
  async register(moduleManager: ModuleManager): Promise<void> {
    moduleManager.registerPlugin(this.name, new SFuzzObjectiveManagerPlugin());
    moduleManager.registerPlugin(this.name, new SFuzzPlugin());
    moduleManager.registerPreset(this.name, new SFuzzPreset());
  }
}
