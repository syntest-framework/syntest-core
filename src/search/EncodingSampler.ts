/*
 * Copyright 2020-2021 Delft University of Technology and SynTest contributors
 *
 * This file is part of SynTest Framework.
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

import { Encoding } from "./Encoding";
import { SearchSubject } from "./SearchSubject";
import { Parameter } from "../analysis/static/graph/parsing/Parameter";
import { Statement } from "../testcase/statements/Statement";

/**
 * Sampler for encodings.
 *
 * @author Mitchell Olsthoorn
 * @author Dimitri Stallenberg
 */
export abstract class EncodingSampler<T extends Encoding> {
  protected _subject: SearchSubject<T>;

  /**
   * Constructor
   * @param subject     the subject
   */
  protected constructor(subject: SearchSubject<T>) {
    this._subject = subject;
  }

  /**
   * Sample an encoding.
   */
  abstract sample(): T;

  /**
   * Should sample any statement based on the type.
   *
   * @param depth      the current depth of the statement tree
   * @param types      the return types of the statement to sample
   * @param geneType   the type of the statement
   * @return Statement a sampled statement
   */
  abstract sampleStatement(
    depth: number,
    types: Parameter[],
    geneType: string
  ): Statement;

  get subject(): SearchSubject<T> {
    return this._subject;
  }

  set subject(value: SearchSubject<T>) {
    this._subject = value;
  }
}
