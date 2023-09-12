/*
 * Copyright 2020-2023 Delft University of Technology and SynTest contributors
 *
 * This file is part of SynTest Framework - SynTest Javascript.
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

import { Datapoint, ExecutionResult } from "@syntest/search";

export enum JavaScriptExecutionStatus {
  PASSED,
  FAILED,
  TIMED_OUT,
  MEMORY_OVERFLOW,
  INFINITE_LOOP,
}

/**
 * JavaScript specific implementation of the execution results.
 *
 * @author Mitchell Olsthoorn
 */
export class JavaScriptExecutionResult implements ExecutionResult {
  /**
   * Execution status.
   * @protected
   */
  protected _status: JavaScriptExecutionStatus;

  /**
   * ARRAY of traces of the execution.
   * @protected
   */
  protected _traces: Datapoint[];

  /**
   * Duration of the execution.
   * @protected
   */
  protected _duration: number;

  /**
   * Exception of execution.
   * @protected
   */
  protected _exception: string;

  /**
   * Constructor.
   *
   * @param status The status of the execution
   * @param traces The traces of the execution
   * @param duration The duration of the execution
   * @param exception The exception of the execution
   */
  public constructor(
    status: JavaScriptExecutionStatus,
    traces: Datapoint[],
    duration: number,
    exception?: string | undefined
  ) {
    this._status = status;
    this._traces = traces;
    this._duration = duration;
    this._exception = exception;
  }

  /**
   * @inheritDoc
   */
  public coversId(id: string): boolean {
    if (
      this._status === JavaScriptExecutionStatus.INFINITE_LOOP ||
      this._status === JavaScriptExecutionStatus.MEMORY_OVERFLOW
    ) {
      return false;
    }

    const trace = this._traces.find((trace) => trace.id === id);

    if (!trace) {
      if (id.startsWith("placeholder")) {
        // TODO maybe this already fixed?
        // TODO stupit hack because the placeholder nodes we add in the cfg are not being registred by the instrumentation
        // should fix
        return false;
      }

      throw new Error(
        `Could not find a matching trace for the given id: ${id}`
      );
    }

    return trace.hits > 0;
  }

  /**
   * @deprecated
   */
  public coversLine(line: number): boolean {
    for (const trace of this._traces) {
      if (
        (trace.type === "statement" ||
          trace.type === "function" ||
          trace.type === "branch") && // this line is needed for branches with no control dependent statements
        trace.location.start.line === line &&
        trace.hits > 0
      )
        return true;
    }
    return false;
  }

  /**
   * @inheritDoc
   */
  public getDuration(): number {
    return this._duration;
  }

  /**
   * @inheritDoc
   */
  public getExceptions(): string {
    return this._exception;
  }

  /**
   * @inheritDoc
   */
  public getTraces(): Datapoint[] {
    return this._traces;
  }

  /**
   * @inheritDoc
   */
  public hasExceptions(): boolean {
    return this._exception !== null && this._exception !== undefined;
  }

  /**
   * @inheritDoc
   */
  public hasPassed(): boolean {
    return this._status === JavaScriptExecutionStatus.PASSED;
  }

  /**
   * @inheritDoc
   */
  public hasTimedOut(): boolean {
    return this._status === JavaScriptExecutionStatus.TIMED_OUT;
  }
}