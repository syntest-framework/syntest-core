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
import * as path from "path";
import { existsSync } from "fs";
import globalModules = require("global-modules");
import Yargs = require("yargs");
import { Plugin } from "./module/Plugin";
import { Tool } from "./module/Tool";
import { Module } from "./module/Module";

import {
  moduleAlreadyLoaded,
  moduleCannotBeLoaded,
  moduleNotCorrectlyImplemented,
  moduleNotInstalled,
  modulePathNotFound,
  pluginAlreadyLoaded,
  pluginNotFound,
  pluginsNotFound,
  toolAlreadyLoaded,
} from "./util/diagnostics";
import { getLogger } from "@syntest/logging";

export class ModuleManager {
  static LOGGER;
  static instance: ModuleManager;

  static initializeModuleManager() {
    ModuleManager.instance = new ModuleManager();
    ModuleManager.LOGGER = getLogger("ModuleManager");
  }

  private _modules: Map<string, Module>;
  private _tools: Map<string, Tool>;
  // type -> name -> plugin
  private _plugins: Map<string, Map<string, Plugin>>;

  constructor() {
    this._modules = new Map();
    this._tools = new Map();
    this._plugins = new Map();
  }

  get modules() {
    return this._modules;
  }

  get tools() {
    return this._tools;
  }

  get plugins() {
    return this._plugins;
  }

  getPlugin(type: string, name: string): Plugin {
    if (!this._plugins.has(type)) {
      throw new Error(pluginNotFound(name, type));
    }

    if (!this._plugins.get(type).has(name)) {
      throw new Error(pluginNotFound(name, type));
    }

    return this._plugins.get(type).get(name);
  }

  getPluginsOfType(type: string): Map<string, Plugin> {
    if (!this._plugins.has(type)) {
      return new Map();
    }

    return this._plugins.get(type);
  }

  async prepare() {
    ModuleManager.LOGGER.info("Preparing modules");
    for (const module of this.modules.values()) {
      if (module.prepare) {
        ModuleManager.LOGGER.info(`Preparing module: ${module.name}`);
        await module.prepare();
        ModuleManager.LOGGER.info(`Module prepared: ${module.name}`);
      }
    }
  }

  async cleanup() {
    ModuleManager.LOGGER.info("Cleaning up modules");
    for (const module of this.modules.values()) {
      if (module.cleanup) {
        ModuleManager.LOGGER.info(`Cleaning up module: ${module.name}`);
        await module.cleanup();
        ModuleManager.LOGGER.info(`Module cleaned up: ${module.name}`);
      }
    }
  }

  async getModulePath(module: string): Promise<string> {
    let modulePath = "";

    if (module.startsWith("file:")) {
      // It is a file path
      modulePath = path.resolve(module.replace("file:", ""));
      if (!existsSync(modulePath)) {
        throw new Error(modulePathNotFound(module));
      }
    } else {
      // It is a npm package
      modulePath = path.resolve(path.join("node_modules", module));

      if (!existsSync(modulePath)) {
        // it is not locally installed lets try global
        modulePath = path.resolve(path.join(globalModules, module));
      }

      if (!existsSync(modulePath)) {
        // it is not installed locally nor globally
        // TODO maybe auto install?
        throw new Error(moduleNotInstalled(module));
      }
    }

    return modulePath;
  }

  async loadModule(moduleId: string) {
    ModuleManager.LOGGER.info(`Loading module: ${moduleId}`);
    const modulePath = await this.getModulePath(moduleId);
    const { module } = await import(modulePath);

    const moduleInstance: Module = new module.default();

    // check requirements
    if (!moduleInstance.name) {
      throw new Error(moduleNotCorrectlyImplemented("name", moduleId));
    }
    if (!moduleInstance.getTools) {
      throw new Error(moduleNotCorrectlyImplemented("getTools", moduleId));
    }
    if (!moduleInstance.getPlugins) {
      throw new Error(moduleNotCorrectlyImplemented("getPlugins", moduleId));
    }

    if (this.modules.has(moduleInstance.name)) {
      throw new Error(moduleAlreadyLoaded(moduleInstance.name, moduleId));
    }

    this.modules.set(moduleInstance.name, moduleInstance);
    ModuleManager.LOGGER.info(`Module loaded: ${moduleId}`);
  }

  async loadModules(modules: string[]) {
    for (const module of modules) {
      try {
        await this.loadModule(module);
      } catch (e) {
        console.log(e);
        throw new Error(moduleCannotBeLoaded(module));
      }
    }

    for (const module of this.modules.values()) {
      for (const tool of await module.getTools()) {
        this.loadTool(tool);
      }

      for (const plugin of await module.getPlugins()) {
        this.loadPlugin(plugin);
      }
    }
  }

  loadTool(tool: Tool) {
    if (this.tools.has(tool.name)) {
      throw new Error(toolAlreadyLoaded(tool.name));
    }

    ModuleManager.LOGGER.info(`Tool loaded: ${tool.name}`);
    this.tools.set(tool.name, tool);
  }

  loadPlugin(plugin: Plugin) {
    if (!this.plugins.has(plugin.type)) {
      this.plugins.set(plugin.type, new Map());
    }

    if (this.plugins.get(plugin.type).has(plugin.name)) {
      throw new Error(pluginAlreadyLoaded(plugin.name, plugin.type));
    }

    ModuleManager.LOGGER.info(
      `- Plugin loaded: ${plugin.type} - ${plugin.name}`
    );
    this.plugins.get(plugin.type).set(plugin.name, plugin);
  }

  async configureModules(yargs: Yargs.Argv) {
    ModuleManager.LOGGER.info("Configuring modules");
    for (const tool of this.tools.values()) {
      const plugins = [];
      for (const pluginsOfType of this.plugins.values()) {
        for (const plugin of pluginsOfType.values()) {
          plugins.push(plugin);
        }
      }
      await tool.addPluginOptions(plugins);
      yargs = yargs.command(tool);
    }
    return yargs;
  }
}
