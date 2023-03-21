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
import { ControlFlowProgram } from "@syntest/cfg-core";
import { SubTarget, RootContext } from "../../lib";
import { ActionDescription } from "../../lib/analysis/static/ActionDescription";

export class DummyRootContext extends RootContext {
  getSource(path: string): string {
    throw new Error("Method not implemented.");
  }
  getSubTargets(path: string): SubTarget[] {
    throw new Error("Method not implemented.");
  }
  getActionDescriptionMap<A extends ActionDescription>(
    path: string,
    id: string
  ): Map<string, A> {
    throw new Error("Method not implemented.");
  }
  getActionDescriptionMaps<A extends ActionDescription>(
    path: string
  ): Map<string, Map<string, A>> {
    throw new Error("Method not implemented.");
  }
  getControlFlowProgram<S>(path: string): ControlFlowProgram<S> {
    throw new Error("Method not implemented.");
  }
  getAbstractSyntaxTree<S>(path: string): S {
    throw new Error("Method not implemented.");
  }

  getDependencies(path: string): string[] {
    throw new Error("Method not implemented.");
  }
}
