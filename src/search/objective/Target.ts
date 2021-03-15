import { Objective } from "./Objective";
import {CFG, drawCFG} from "../..";
import {getProperty} from "../..";
import * as path from "path";

export abstract class Target {
  private _name: string;
  private _cfg: CFG;
  private _functionMap: any;

  constructor(name: string, cfg: CFG, functionMap: any) {
    this._name = name;
    this._cfg = cfg;
    this._functionMap = functionMap;

    if (getProperty('draw_cfg')) {
      drawCFG(this.cfg, path.join(getProperty("cfg_directory"), `${name}.svg`))
    }
  }

  getObjectives(): Objective[] {
    return this._cfg.nodes.filter((n: any) => !n.absoluteRoot);
  }

  // TODO rename this
  abstract getPossibleActions(
    type?: string,
    returnType?: string
  ): ActionDescription[];

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get cfg(): CFG {
    return this._cfg;
  }

  set cfg(value: CFG) {
    this._cfg = value;
  }

  get functionMap(): any {
    return this._functionMap;
  }

  set functionMap(value: any) {
    this._functionMap = value;
  }
}

export interface ActionDescription {
  name: string;
  type: string;
}
