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

import { Preset } from "@syntest/module";
import { ArgumentsCamelCase } from "yargs";

import { ArgumentsObject } from "../Configuration";

/**
 * Pareto Corner Search Evolutionary Algorithm (PCSEA), adapted for test case generation.
 *
 * Implementation is based on:
 * "A Pareto Corner Search Evolutionary Algorithm and Dimensionality Reduction in Many-Objective
 * Optimization Problems" by H. K. Singh; A. Isaacs; T. Ray
 */
export class MOSAPCSEAPreset extends Preset {
  constructor() {
    super("MOSAPCSEA", "MOSAPCSEA preset");
  }

  modifyArgs<T>(arguments_: ArgumentsCamelCase<T>): void {
    (<ArgumentsObject>(<unknown>arguments_)).searchAlgorithm = "DynaPCSEA";
    (<ArgumentsObject>(<unknown>arguments_)).objectiveManager = "uncovered";
    (<ArgumentsObject>(<unknown>arguments_)).procreation = "default";
    (<ArgumentsObject>(<unknown>arguments_)).secondaryObjectives = ["length"];
    (<ArgumentsObject>(<unknown>arguments_)).populationSize = 50;
  }
}
