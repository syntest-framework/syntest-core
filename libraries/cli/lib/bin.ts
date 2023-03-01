#!/usr/bin/env node
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

import yargHelper = require("yargs/helpers");
import { BaseOptions, Configuration } from "./util/Configuration";
import { ModuleManager } from "./ModuleManager";
import { getLogger, setupLogger } from "@syntest/logging";
import * as path from "path";
import {
  DefaultUserInterfacePlugin,
  UserInterfacePlugin,
} from "./module/plugins/UserInterfacePlugin";
import { ListenerPlugin } from "./module/plugins/ListenerPlugin";
import { PluginType } from "./module/plugins/PluginType";

async function main() {
  // Remove binary call from args
  const args = yargHelper.hideBin(process.argv);

  /**
   * Configure base usage
   *
   * We disable help and version here because, we don't want the help command to be triggered.
   * When we did not configure the commands and options from the added modules yet.
   */
  let yargs = Configuration.configureUsage().help(false).version(false);

  // Configure general options
  yargs = Configuration.configureOptions(yargs);

  // Parse the arguments and config using only the base options
  const baseArguments = yargs.wrap(yargs.terminalWidth()).parseSync(args);

  // Setup logger
  setupLogger(
    path.join(
      (<BaseOptions>(<unknown>baseArguments)).syntestDirectory,
      (<BaseOptions>(<unknown>baseArguments)).logDirectory
    ),
    (<BaseOptions>(<unknown>baseArguments)).fileLogLevel,
    (<BaseOptions>(<unknown>baseArguments)).consoleLogLevel
  );
  const LOGGER = getLogger("cli");

  // Setup module manager
  ModuleManager.initializeModuleManager();

  yargs = yargs.showHelpOnFail(true);

  // Import defined modules
  const modules = (<BaseOptions>(<unknown>baseArguments)).modules;
  LOGGER.info("Loading modules...", modules);
  await ModuleManager.instance.loadModules(modules);
  await ModuleManager.instance.loadPlugin(new DefaultUserInterfacePlugin());
  yargs = await ModuleManager.instance.configureModules(yargs);

  // Setup user interface
  const userInterfacePlugin = ModuleManager.instance.getPlugin(
    PluginType.UserInterface,
    (<BaseOptions>(<unknown>baseArguments)).userInterface
  );
  const userInterface = (<UserInterfacePlugin>(
    userInterfacePlugin
  )).createUserInterface();
  userInterface.printTitle();

  // Setup cleanup on exit handler
  process.on("exit", (code) => {
    if (code !== 0) {
      LOGGER.error("Process exited with code: " + code);
      userInterface.printError("Process exited with code: " + code);
    }
    LOGGER.info("Cleaning up...");
    ModuleManager.instance.cleanup();
    LOGGER.info("Cleanup done! Exiting...");
  });

  userInterface.printHeader("Modules loaded");
  userInterface.printModules([...ModuleManager.instance.modules.values()]);

  // Register all listener plugins
  for (const plugin of ModuleManager.instance
    .getPluginsOfType(PluginType.Listener)
    .values()) {
    (<ListenerPlugin>plugin).setupEventListener();
  }

  // Prepare modules
  LOGGER.info("Preparing modules...");
  await ModuleManager.instance.prepare();
  LOGGER.info("Modules prepared!");

  const versions = [...ModuleManager.instance.modules.values()]
    .map((module) => `${module.name} (${module.version})`)
    .join("\n");

  // Execute program
  LOGGER.info("Executing program...");
  await yargs
    .wrap(yargs.terminalWidth())
    .help(true)
    .version(versions)
    .showHidden(false)
    .demandCommand()
    .parse(args);
}

main();
