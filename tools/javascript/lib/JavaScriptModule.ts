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

import { Module, ModuleManager, Tool } from "@syntest/module";
import yargs = require("yargs");

import { getTestCommand } from "./commands/test";
import { Configuration, TestingToolModule } from "@syntest/base-language";
import { UserInterface } from "@syntest/cli-graphics";
import { MetricManager } from "@syntest/metric";
import { StorageManager } from "@syntest/storage";
import { RandomSamplerPlugin } from "./plugins/sampler/RandomSamplerPlugin";
import { TreeCrossoverPlugin } from "./plugins/crossover/TreeCrossoverPlugin";
import { SearchProgressBarListener } from "./plugins/listeners/SearchProgressBarListener";

export default class JavaScriptModule extends TestingToolModule {
  constructor() {
    super(
      // eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
      require("../../package.json").name,
      // eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
      require("../../package.json").version
    );
  }

  override register(
    moduleManager: ModuleManager,
    metricManager: MetricManager,
    storageManager: StorageManager,
    userInterface: UserInterface,
    modules: Module[]
  ): void {
    const name = "javascript";
    const labels = ["javascript", "testing"];
    const commands = [
      getTestCommand(
        name,
        moduleManager,
        metricManager,
        storageManager,
        userInterface
      ),
    ];

    const additionalOptions: Map<string, yargs.Options> = new Map();

    const configuration = new Configuration();

    for (const [key, value] of Object.entries(configuration.getOptions())) {
      additionalOptions.set(key, value);
    }

    const javascriptTool = new Tool(
      name,
      labels,
      "A tool for testing javascript projects.",
      commands,
      additionalOptions
    );

    moduleManager.registerTool(this, javascriptTool);

    moduleManager.registerPlugin(this, new TreeCrossoverPlugin());
    moduleManager.registerPlugin(this, new RandomSamplerPlugin());
    moduleManager.registerPlugin(
      this,
      new SearchProgressBarListener(userInterface)
    );

    super.register(
      moduleManager,
      metricManager,
      storageManager,
      userInterface,
      modules
    );
  }
}