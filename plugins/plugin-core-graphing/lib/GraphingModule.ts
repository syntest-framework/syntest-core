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

import { Module, Plugin, Tool } from "@syntest/cli";
import GraphingPlugin, { GraphOptions } from "./GraphingPlugin";
import { mkdirSync } from "fs";
import { CONFIG } from "@syntest/base-testing-tool";

export default class GraphingModule extends Module {
  async getTools(): Promise<Tool[]> {
    return [];
  }
  async getPlugins(): Promise<Plugin[]> {
    return [new GraphingPlugin()];
  }

  async prepare(): Promise<void> {
    await mkdirSync((<GraphOptions>(<unknown>CONFIG)).cfgDirectory, {
      recursive: true,
    });
  }
}