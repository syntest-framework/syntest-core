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
import Yargs = require("yargs");

export type LoggingOptions = {
  logDirectory: string;
  consoleLogLevel: string;
  fileLogLevel: string[];
};

export enum OptionGroups {
  Logging = "Logging Options:",
}

export class Configuration {
  static configureOptions(yargs: Yargs.Argv) {
    return (
      yargs
        // logging options
        .options("log-directory", {
          alias: [],
          default: "logs",
          description: "The path where the logs should be saved",
          group: OptionGroups.Logging,
          hidden: false,
          normalize: true,
          type: "string",
        })
        .options("console-log-level", {
          alias: [],
          choices: [
            "silent",
            "debug",
            "error",
            "warn",
            "info",
            "verbose",
            "silly",
          ],
          default: "error",
          description: "Log level of the tool",
          group: OptionGroups.Logging,
          hidden: false,
          type: "string",
        })
        .options("file-log-level", {
          alias: [],
          default: ["info", "warn", "error"],
          description: "Which levels should be logged to file",
          group: OptionGroups.Logging,
          hidden: false,
          type: "array",
        })
    );
  }
}
