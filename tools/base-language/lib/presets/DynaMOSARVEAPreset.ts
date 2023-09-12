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
 * Reference Vector Guided Evolutionary Algorithm MOSA.
 *
 * Based on:
 * A Reference Vector Guided Evolutionary Algorithm for Many-Objective Optimization
 * R. Cheng; Y. Jin; M. Olhofer; B. Sendhoff
 *
 * and on:
 * Automated Test Case Generation as a Many-Objective Optimisation Problem with Dynamic Selection of the Targets
 * A. Panichella; F. K. Kifetew; P. Tonella
 *
 */
export class DynaMOSARVEAPreset extends Preset {
  constructor() {
    super("DynaMOSARVEA", "DynaMOSARVEA preset");
  }

  modifyArgs<T>(arguments_: ArgumentsCamelCase<T>): void {
    (<ArgumentsObject>(<unknown>arguments_)).searchAlgorithm = "MOSARVEA";
    (<ArgumentsObject>(<unknown>arguments_)).objectiveManager =
      "structural-uncovered";
    (<ArgumentsObject>(<unknown>arguments_)).procreation = "default";
    (<ArgumentsObject>(<unknown>arguments_)).secondaryObjectives = ["length"];
    (<ArgumentsObject>(<unknown>arguments_)).populationSize = 50;
  }
}
