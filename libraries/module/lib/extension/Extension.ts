/*
 * Copyright 2020-2023 SynTest contributors
 *
 * This file is part of SynTest Framework - SynTest Framework.
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

import { UserInterface } from "@syntest/cli-graphics";
import { MetricManager } from "@syntest/metric";
import { StorageManager } from "@syntest/storage";

import { ExtensionManager } from "../ExtensionManager";

export abstract class Extension {
  name: Readonly<string>;

  constructor(name: string) {
    this.name = name;
  }
}

export type ExtensionAPI = {
  storageManager: StorageManager;
  extensionManager: ExtensionManager;
  metricManager: MetricManager;
  config: unknown;
  userInterface: UserInterface;
};

export type ExtensionRegistrationAPI = Pick<
  ExtensionManager,
  "registerPlugin" | "registerPreset" | "registerTool"
>;
