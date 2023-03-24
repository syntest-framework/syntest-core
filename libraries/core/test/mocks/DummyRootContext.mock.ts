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

import { ActionDescription } from "../../lib/analysis/static/ActionDescription";
import { RootContext } from "../../lib/analysis/static/RootContext";
import { SubTarget } from "../../lib/analysis/static/Target";

export class DummyRootContext extends RootContext {
  getSource(): string {
    throw new Error("Method not implemented.");
  }
  getSubTargets(): SubTarget[] {
    throw new Error("Method not implemented.");
  }
  getActionDescriptionMap<A extends ActionDescription>(): Map<string, A> {
    throw new Error("Method not implemented.");
  }
  getActionDescriptionMaps<A extends ActionDescription>(): Map<
    string,
    Map<string, A>
  > {
    throw new Error("Method not implemented.");
  }
  getControlFlowProgram<S>(): ControlFlowProgram<S> {
    throw new Error("Method not implemented.");
  }
  getAbstractSyntaxTree<S>(): S {
    throw new Error("Method not implemented.");
  }

  getDependencies(): string[] {
    throw new Error("Method not implemented.");
  }
}
