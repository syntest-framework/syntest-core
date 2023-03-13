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
import * as chai from "chai";
import {
  ControlFlowGraph,
  NodeType,
  Node,
  Edge,
  EdgeType,
  edgeContraction,
} from "@syntest/cfg-core";
import { createSimulation } from "../lib/D3Simulation";

const expect = chai.expect;

describe("simulationTest", () => {
  it("SimpleTest", async () => {
    const nodes = new Map<string, Node<unknown>>();
    const nodeRoot = new Node("ROOT", NodeType.ENTRY, "ROOT", [], {
      lineNumbers: [],
    });
    const nodeExit = new Node("EXIT", NodeType.EXIT, "EXIT", [], {
      lineNumbers: [],
    });
    nodes.set("ROOT", nodeRoot);
    nodes.set("EXIT", nodeExit);
    // Construct CFG
    for (let i = 65; i < 72; i++) {
      nodes.set(
        String.fromCharCode(i),
        new Node(
          String.fromCharCode(i),
          NodeType.NORMAL,
          String.fromCharCode(i),
          [],
          { lineNumbers: [] }
        )
      );
    }
    const edges = [
      new Edge("A", EdgeType.NORMAL, "A", "ROOT", "A"),
      new Edge("B", EdgeType.CONDITIONAL_FALSE, "B", "A", "B"),
      new Edge("C", EdgeType.CONDITIONAL_TRUE, "C", "A", "C"),
      new Edge("D", EdgeType.CONDITIONAL_TRUE, "D", "C", "D"),
      new Edge("E", EdgeType.CONDITIONAL_FALSE, "E", "C", "E"),
      new Edge("F", EdgeType.CONDITIONAL_TRUE, "F", "D", "F"),
      new Edge("G", EdgeType.CONDITIONAL_FALSE, "G", "D", "G"),
      new Edge("H", EdgeType.NORMAL, "H", "F", "A"),
      new Edge("I", EdgeType.NORMAL, "I", "G", "A"),
      new Edge("J", EdgeType.NORMAL, "J", "E", "A"),
    ];
    let cfg = new ControlFlowGraph(nodeRoot, nodeExit, nodeExit, nodes, edges);
    cfg = edgeContraction(cfg);

    const svgHtml = await createSimulation(cfg);

    expect(svgHtml);
  });
});
