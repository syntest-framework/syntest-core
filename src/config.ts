/*
 * Copyright 2020-2021 Delft University of Technology and SynTest contributors
 *
 * This file is part of Syntest Framework - Syntest Core.
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
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Properties, properties } from "./properties";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Yargs = require("yargs/yargs");
import decamelize = require("decamelize");
import path = require("path");
import shell = require("shelljs");

let cwd: string = null;
let argv: any = null;

export let yargs: any = null;

export async function guessCWD(givenCwd?: string): Promise<void> {
  cwd = givenCwd || process.env.NYC_CWD || process.cwd();
}

export function setupOptions(
  program: string,
  additionalOptions: Record<string, unknown>[]
): void {
  if (!cwd) {
    throw new Error("Please call guessCWD before calling setupOptions");
  }

  yargs = Yargs([]).usage(`${program} [options]`).showHidden(false);

  yargs
    .example(`${program} --population_size 10`, "Setting the population size")
    .epilog("visit https://syntest.org for more documentation")
    .boolean("h")
    .boolean("version")
    .help(false)
    .version(false);

  const loadArg = ([name, setup]: [string, Record<string, unknown>]) => {
    const option = {
      description: setup.description,
      default: setup.default,
      required: setup.required,
      type: setup.type,
      items: setup.items,
      alias: setup.alias,
      global: false,
    };

    if (name === "cwd") {
      option.default = cwd;
      option.global = true;
    }

    if (option.type === "array") {
      option.type = "string";
    }

    if (name === "src_directory") {
      option.default = path.join(cwd, "/src");
    }

    if (name === "test_directory") {
      option.default = path.join(cwd, "/temp_test");
    }

    const optionName = decamelize(name, "-");
    yargs.option(optionName, option);
  };

  Object.entries(properties).forEach(loadArg);
  Object.entries(additionalOptions).forEach(loadArg);
}

export function loadConfig(args: any = {}, baseConfig: any = {}): any {
  if (!cwd || !yargs) {
    throw new Error("Please call setupOptions before calling loadConfig");
  }

  args.cwd = args.cwd || cwd;

  let config;
  let finalConfig;

  // Handle --config flag
  args.config
    ? (config = path.join(args.cwd, args.config))
    : (config = path.join(args.cwd, ".syntest.js"));

  // Catch syntestjs syntax errors
  if (shell.test("-e", config)) {
    try {
      finalConfig = require(config);
    } catch (error) {
      throw new Error(error);
    }
    // Config is optional
  } else {
    finalConfig = {};
  }

  finalConfig.cwd = args.cwd;

  // Solidity-Coverage writes to Truffle config
  args.mocha = args.mocha || {};

  if (finalConfig.mocha && typeof finalConfig.mocha === "object") {
    args.mocha = Object.assign(args.mocha, finalConfig.mocha);
  }

  return finalConfig;
}

export function processConfig(config: any = {}, args: any = {}): void {
  if (!cwd || !yargs) {
    throw new Error("Please call loadConfig before calling processConfig");
  }

  yargs.config(config);

  argv = yargs.wrap(yargs.terminalWidth()).parse(args);

  for (const setting of Object.keys(argv)) {
    Properties[setting] = argv[setting];
  }
}
