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
import { ControlFlowFunction } from "./ControlFlowFunction";
import { ContractedControlFlowGraph } from "./graph/ContractedControlFlowGraph";
import { ControlFlowGraph } from "./graph/ControlFlowGraph";

/**
 * Control Flow Program
 * While Control Flow Functions represent the control flow of a single procedure, Inter-procedural Control Flow Graphs (Control Flow Program) represent the control flow of whole programs.
 * https://en.wikipedia.org/wiki/Control-flow_graph
 */
export interface ControlFlowProgram {
  graph: ControlFlowGraph | ContractedControlFlowGraph;
  functions: ControlFlowFunction[];
}
