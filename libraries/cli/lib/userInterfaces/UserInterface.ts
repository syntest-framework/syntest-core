/*
 * Copyright 2020-2021 Delft University of Technology and SynTest contributors
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

import chalk = require("chalk");
import figlet = require("figlet");

export abstract class UserInterface {
  abstract setupEventListener(): void;

  print(text: string): void {
    console.log(text);
  }

  printTitle(): void {
    this.print(
      chalk.yellow(figlet.textSync("SynTest", { horizontalLayout: "full" }))
    );
  }

  printHeader(text: string): void {
    this.print(chalk.yellow(`\n${text}`));
  }

  printError(text: string): void {
    this.print(chalk.red(text));
  }

  printWarning(text: string): void {
    this.print(chalk.yellow(text));
  }
}
