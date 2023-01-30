import { EventManager } from "../event/EventManager";
import { Encoding } from "../search/Encoding";
import { CrossoverPlugin } from "./CrossoverPlugin";
import { ListenerPlugin } from "./ListenerPlugin";
import { ObjectiveManagerPlugin } from "./ObjectiveManagerPlugin";
import { PluginInterface } from "./PluginInterface";
import { SamplerPlugin } from "./SamplerPlugin";
import { SearchAlgorithmPlugin } from "./SearchAlgorithmPlugin";
import { TerminationPlugin } from "./TerminationPlugin";
import { UserInterfacePlugin } from "./UserInterfacePlugin";
import Yargs = require("yargs");

export class PluginManager<T extends Encoding> {
  private _listeners: Map<string, ListenerPlugin<T>>;
  private _searchAlgorithms: Map<string, SearchAlgorithmPlugin<T>>;
  private _crossoverOperators: Map<string, CrossoverPlugin<T>>;
  private _samplers: Map<string, SamplerPlugin<T>>;
  private _terminationTriggers: Map<string, TerminationPlugin<T>>;
  private _objectiveManagers: Map<string, ObjectiveManagerPlugin<T>>;
  private _userInterfaces: Map<string, UserInterfacePlugin<T>>;

  constructor() {
    this._listeners = new Map();
    this._searchAlgorithms = new Map();
    this._crossoverOperators = new Map();
    this._samplers = new Map();
    this._terminationTriggers = new Map();
    this._objectiveManagers = new Map();
    this._userInterfaces = new Map();
  }

  get listeners() {
    return this._listeners;
  }

  get searchAlgorithms() {
    return this._searchAlgorithms;
  }

  get crossoverOperators() {
    return this._crossoverOperators;
  }

  get samplers() {
    return this._samplers;
  }

  get terminationTriggers() {
    return this._terminationTriggers;
  }

  get objectiveManagers() {
    return this._objectiveManagers;
  }

  get userInterfaces() {
    return this._userInterfaces;
  }

  async addPluginOptions<Y>(yargs: Yargs.Argv<Y>) {
    yargs = await this._addPluginOptionsSpecific(yargs, this._listeners);
    yargs = await this._addPluginOptionsSpecific(yargs, this._searchAlgorithms);
    yargs = await this._addPluginOptionsSpecific(
      yargs,
      this._crossoverOperators
    );
    yargs = await this._addPluginOptionsSpecific(yargs, this._samplers);
    yargs = await this._addPluginOptionsSpecific(
      yargs,
      this._terminationTriggers
    );
    yargs = await this._addPluginOptionsSpecific(
      yargs,
      this._objectiveManagers
    );
    yargs = await this._addPluginOptionsSpecific(yargs, this._userInterfaces);

    return yargs;
  }

  private async _addPluginOptionsSpecific<Y, X extends PluginInterface<T>>(
    yargs: Yargs.Argv<Y>,
    plugins: Map<string, X>
  ) {
    for (const plugin of plugins.values()) {
      if (plugin.getConfig) {
        const options = await plugin.getConfig();

        for (const option of options.keys()) {
          yargs = yargs.option(`${plugin.name}-${option}`, options.get(option));
        }
      }
    }
    return yargs;
  }

  async cleanup() {
    await this._cleanupSpecific(this._listeners);
    await this._cleanupSpecific(this._searchAlgorithms);
    await this._cleanupSpecific(this._crossoverOperators);
    await this._cleanupSpecific(this._samplers);
    await this._cleanupSpecific(this._terminationTriggers);
    await this._cleanupSpecific(this._objectiveManagers);
    await this._cleanupSpecific(this._userInterfaces);
  }

  private async _cleanupSpecific<X extends PluginInterface<T>>(
    plugins: Map<string, X>
  ) {
    for (const plugin of plugins.values()) {
      if (plugin.cleanup) {
        await plugin.cleanup();
      }
    }
  }

  async prepare() {
    await this._prepareSpecific(this._listeners);
    await this._prepareSpecific(this._searchAlgorithms);
    await this._prepareSpecific(this._crossoverOperators);
    await this._prepareSpecific(this._samplers);
    await this._prepareSpecific(this._terminationTriggers);
    await this._prepareSpecific(this._objectiveManagers);
    await this._prepareSpecific(this._userInterfaces);
  }

  private async _prepareSpecific<X extends PluginInterface<T>>(
    plugins: Map<string, X>
  ) {
    for (const plugin of plugins.values()) {
      if (plugin.prepare) {
        await plugin.prepare();
      }
    }
  }

  async loadPlugin(pluginPath: string): Promise<void> {
    try {
      const { plugin } = await import(pluginPath);
      const pluginInstance: PluginInterface<T> = new plugin.default();

      if (!pluginInstance.register) {
        throw new Error(
          `Could not load plugin\nPlugin has no register function\nPlugin: ${pluginPath}`
        );
      }

      pluginInstance.register(this);
    } catch (e) {
      console.trace(e);
    }
  }

  async registerListener(plugin: ListenerPlugin<T>): Promise<void> {
    if (this.listeners.has(plugin.name)) {
      throw new Error(
        `Plugin with name: ${plugin.name} is already registered as a listener plugin.`
      );
    }
    this.listeners.set(plugin.name, plugin);
  }

  async registerSearchAlgorithm(
    plugin: SearchAlgorithmPlugin<T>
  ): Promise<void> {
    if (this.searchAlgorithms.has(plugin.name)) {
      throw new Error(
        `Plugin with name: ${plugin.name} is already registered as a search algorithm plugin.`
      );
    }
    this.searchAlgorithms.set(plugin.name, plugin);
  }

  async registerCrossover(plugin: CrossoverPlugin<T>): Promise<void> {
    if (this.crossoverOperators.has(plugin.name)) {
      throw new Error(
        `Plugin with name: ${plugin.name} is already registered as a crossover plugin.`
      );
    }
    this.crossoverOperators.set(plugin.name, plugin);
  }

  async registerSampler(plugin: SamplerPlugin<T>): Promise<void> {
    if (this.samplers.has(plugin.name)) {
      throw new Error(
        `Plugin with name: ${plugin.name} is already registered as a sampler plugin.`
      );
    }
    this.samplers.set(plugin.name, plugin);
  }

  async registerTermination(plugin: TerminationPlugin<T>): Promise<void> {
    if (this.terminationTriggers.has(plugin.name)) {
      throw new Error(
        `Plugin with name: ${plugin.name} is already registered as a termination trigger plugin.`
      );
    }
    this.terminationTriggers.set(plugin.name, plugin);
  }

  async registerObjectiveManager(
    plugin: ObjectiveManagerPlugin<T>
  ): Promise<void> {
    if (this.objectiveManagers.has(plugin.name)) {
      throw new Error(
        `Plugin with name: ${plugin.name} is already registered as a objective manager plugin.`
      );
    }
    this.objectiveManagers.set(plugin.name, plugin);
  }

  async registerUserInterface(plugin: UserInterfacePlugin<T>): Promise<void> {
    if (this.userInterfaces.has(plugin.name)) {
      throw new Error(
        `Plugin with name: ${plugin.name} is already registered as a user-interface plugin.`
      );
    }
    this.userInterfaces.set(plugin.name, plugin);
  }
}