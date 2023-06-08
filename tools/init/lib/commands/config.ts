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
import { writeFileSync } from "node:fs";
import * as path from "node:path";

import { Command, ModuleManager, Plugin, Tool } from "@syntest/module";
import Yargs = require("yargs");

const manualRequired = "TODO fill this in yourself";

function addCommandOptions(
  options: { [key: string]: unknown },
  tool: Tool,
  command: Command,
  moduleManager: ModuleManager
) {
  for (const [name, option] of command.options.entries()) {
    options[name] =
      option.default === undefined ? manualRequired : option.default;
  }

  for (const pluginsOfType of moduleManager.plugins.values()) {
    for (const plugin of pluginsOfType.values()) {
      addPluginOptions(options, tool, command, plugin);
    }
  }
}

function addPluginOptions(
  options: { [key: string]: unknown },
  tool: Tool,
  command: Command,
  plugin: Plugin
) {
  const toolOptions = plugin.getOptions(tool.name, tool.labels);

  for (const [name, option] of toolOptions.entries()) {
    options[name] =
      option.default === undefined ? manualRequired : option.default;
  }

  const commandOptions = plugin.getOptions(
    tool.name,
    tool.labels,
    command.command
  );
  for (const [name, option] of commandOptions.entries()) {
    options[name] =
      option.default === undefined ? manualRequired : option.default;
  }
}

export function getConfigCommand(
  tool: string,
  moduleManager: ModuleManager
): Command {
  const options = new Map<string, Yargs.Options>();

  return new Command(
    moduleManager,
    tool,
    "config",
    "Create a configuration file for the tool.",
    options,
    (arguments_: Yargs.ArgumentsCamelCase) => {
      const allOptions: { [key: string]: unknown } = {};

      // Set default values for each option provided by the modules
      for (const tool of moduleManager.tools.values()) {
        for (const [name, option] of tool.toolOptions.entries()) {
          allOptions[name] =
            option.default === undefined ? manualRequired : option.default;
        }

        for (const command of tool.commands) {
          addCommandOptions(allOptions, tool, command, moduleManager);
        }
      }

      // Set the values provided by the user
      for (const argument of Object.keys(arguments_)) {
        if (
          argument.includes("_") ||
          /[A-Z]/.test(argument) ||
          argument === "_" ||
          argument.length === 1 ||
          argument === "help" ||
          argument === "version" ||
          argument === "$0"
        ) {
          continue;
        }
        allOptions[argument] = arguments_[argument];
      }

      writeFileSync(
        path.resolve(".syntest.json"),
        JSON.stringify(allOptions, undefined, 2)
      );
    }
  );
}
