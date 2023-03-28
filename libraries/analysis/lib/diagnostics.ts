/*
 * Copyright 2023-2023 Delft University of Technology and SynTest contributors
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

/**
 * This file is meant to provide consistent error messages throughout the tool.
 */
export const shouldNeverHappen = (bugLocation: string) =>
  `This should never happen.\nThere is likely a bug in the ${bugLocation}.`;

export const pathNotInRootPath = (rootPath: string, path: string) =>
  `The given path is not in the given root path!\nRootpath: ${rootPath}\nPath: ${path}`;

export const fileIsNotAFile = (filePath: string) =>
  `The given path is not a file!\nPath: ${filePath}`;

export const fileDoesNotExist = (filePath: string) =>
  `The given file does not exist!\nPath: ${filePath}`;

export const fileDoesNotHaveExtension = (filePath: string) =>
  `The given file does not have an extension!\nPath: ${filePath}`;
