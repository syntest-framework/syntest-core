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

import { ControlFlowGraph } from "../lib/graph/ControlFlowGraph";
import { Node, Statement } from "../lib/graph/Node";
import { NodeType } from "../lib/graph/NodeType";

const expect = chai.expect;

describe("CFG suite", function () {
  it("filterNodesOfType test", () => {
    const entry: Node = new Node("0", NodeType.ENTRY, "root", [], {
      lineNumbers: [],
    });
    const exit: Node = new Node("1", NodeType.EXIT, "exit", [], {
      lineNumbers: [],
    });
    const branchNode: Node = new Node("2", NodeType.NORMAL, "2", [], {
      lineNumbers: [],
    });
    const cfg = new ControlFlowGraph(
      entry,
      exit,
      exit,
      new Map([entry, exit, branchNode].map((node) => [node.id, node])),
      []
    );

    expect(cfg.getNodesByType(NodeType.ENTRY)).to.deep.contain(entry);

    expect(cfg.getNodesByType(NodeType.EXIT)).to.deep.contain(exit);

    expect(cfg.getNodesByType(NodeType.NORMAL)).to.deep.contain(branchNode);
  });

  it("findNodeByPredicate test", () => {
    const entry: Node = new Node(
      "0",
      NodeType.ENTRY,
      "root",
      [
        <Statement>{
          location: {
            start: {
              line: 32,
            },
            end: {
              line: 32,
            },
          },
        },
      ],
      {}
    );
    const exit: Node = new Node(
      "1",
      NodeType.EXIT,
      "exit",
      [
        <Statement>{
          location: {
            start: {
              line: 26,
              column: 0,
              index: 0,
            },
            end: {
              line: 26,
              column: 0,
              index: 0,
            },
          },
        },
      ],
      {}
    );
    const branchNode: Node = new Node("2", NodeType.NORMAL, "2", [], {
      lineNumbers: [],
    });

    const cfg = new ControlFlowGraph(
      entry,
      exit,
      exit,
      new Map([entry, exit, branchNode].map((node) => [node.id, node])),
      []
    );

    expect(cfg.getNodeByPredicate((n: Node) => n.id === "2")).to.deep.equal(
      branchNode
    );
    expect(cfg.getNodesByLineNumbers(new Set([26]))[0]).to.deep.equal(exit);
  });

  it("filterNodesByPredicates test", () => {
    const entry: Node = new Node(
      "0",
      NodeType.ENTRY,
      "root",
      [<Statement>(<unknown>{
          location: {
            start: {
              line: 26,
              column: 0,
              index: 0,
            },
            end: {
              line: 26,
              column: 0,
              index: 0,
            },
          },
        })],
      {}
    );
    const exit: Node = new Node(
      "1",
      NodeType.EXIT,
      "exit",
      [<Statement>(<unknown>{
          location: {
            start: {
              line: 26,
              column: 0,
              index: 0,
            },
            end: {
              line: 26,
              column: 0,
              index: 0,
            },
          },
        })],
      {}
    );
    const branchNode: Node = new Node("2", NodeType.NORMAL, "2", [], {
      lineNumbers: [],
    });

    const cfg = new ControlFlowGraph(
      entry,
      exit,
      exit,
      new Map([entry, exit, branchNode].map((node) => [node.id, node])),
      []
    );

    expect(cfg.getNodesByPredicates((n: Node) => n.id === "2")).to.deep.equal([
      branchNode,
    ]);
    expect(cfg.getNodesByLineNumbers(new Set([26]))).to.deep.equal([
      entry,
      exit,
    ]);
    expect(cfg.getNodeOfTypeByLine(26, NodeType.ENTRY)).to.deep.equal(entry);
    expect(cfg.getNodeById("1")).to.deep.equal(exit);
  });

  it("getNodeById test", () => {
    const entry: Node = new Node(
      "0",
      NodeType.ENTRY,
      "root",
      [<Statement>(<unknown>{
          location: {
            start: {
              line: 26,
              column: 0,
              index: 0,
            },
            end: {
              line: 26,
              column: 0,
              index: 0,
            },
          },
        })],
      {}
    );
    const exit: Node = new Node(
      "1",
      NodeType.EXIT,
      "exit",
      [<Statement>(<unknown>{
          location: {
            start: {
              line: 26,
              column: 0,
              index: 0,
            },
            end: {
              line: 26,
              column: 0,
              index: 0,
            },
          },
        })],
      {}
    );
    const branchNode: Node = new Node("2", NodeType.NORMAL, "2", [], {
      lineNumbers: [],
    });

    const cfg = new ControlFlowGraph(
      entry,
      exit,
      exit,
      new Map([entry, exit, branchNode].map((node) => [node.id, node])),
      []
    );

    expect(cfg.getNodeById("2")).to.deep.equal(branchNode);
    expect(cfg.getNodeById("1")).to.deep.equal(exit);
    expect(cfg.getNodeById("0")).to.deep.equal(entry);
    expect(cfg.getNodeById("3")).to.deep.equal(undefined);
  });

  it("filterNodesByLineNumbers test", () => {
    const entry: Node = new Node(
      "0",
      NodeType.ENTRY,
      "root",
      [<Statement>(<unknown>{
          location: {
            start: {
              line: 26,
              column: 0,
              index: 0,
            },
            end: {
              line: 26,
              column: 0,
              index: 0,
            },
          },
        })],
      {}
    );
    const exit: Node = new Node(
      "1",
      NodeType.EXIT,
      "exit",
      [<Statement>(<unknown>{
          location: {
            start: {
              line: 26,
              column: 0,
              index: 0,
            },
            end: {
              line: 26,
              column: 0,
              index: 0,
            },
          },
        })],
      {}
    );
    const branchNode: Node = new Node(
      "2",
      NodeType.NORMAL,
      "2",
      [<Statement>(<unknown>{
          location: {
            start: {
              line: 26,
              column: 0,
              index: 0,
            },
            end: {
              line: 26,
              column: 0,
              index: 0,
            },
          },
        }), <Statement>(<unknown>{
          location: {
            start: {
              line: 32,
              column: 0,
              index: 0,
            },
            end: {
              line: 32,
              column: 0,
              index: 0,
            },
          },
        })],
      {}
    );

    const cfg = new ControlFlowGraph(
      entry,
      exit,
      exit,
      new Map([entry, exit, branchNode].map((node) => [node.id, node])),
      []
    );

    expect(cfg.getNodesByLineNumbers(new Set<number>([26]))).to.deep.equal([
      entry,
      exit,
      branchNode,
    ]);
    expect(cfg.getNodesByLineNumbers(new Set<number>([27]))).to.deep.equal([]);
    expect(cfg.getNodesByLineNumbers(new Set<number>([32]))).to.deep.equal([
      branchNode,
    ]);
    expect(cfg.getNodesByLineNumbers(new Set<number>([26, 32]))).to.deep.equal([
      entry,
      exit,
      branchNode,
    ]);
  });

  it("findNodeOfTypeByLine test", () => {
    const entry: Node = new Node(
      "0",
      NodeType.ENTRY,
      "root",
      [<Statement>(<unknown>{
          location: {
            start: {
              line: 26,
              column: 0,
              index: 0,
            },
            end: {
              line: 26,
              column: 0,
              index: 0,
            },
          },
        })],
      {}
    );
    const exit: Node = new Node(
      "1",
      NodeType.EXIT,
      "exit",
      [<Statement>(<unknown>{
          location: {
            start: {
              line: 26,
              column: 0,
              index: 0,
            },
            end: {
              line: 26,
              column: 0,
              index: 0,
            },
          },
        })],
      {}
    );
    const branchNode: Node = new Node(
      "2",
      NodeType.NORMAL,
      "2",
      [<Statement>(<unknown>{
          location: {
            start: {
              line: 26,
              column: 0,
              index: 0,
            },
            end: {
              line: 26,
              column: 0,
              index: 0,
            },
          },
        }), <Statement>(<unknown>{
          location: {
            start: {
              line: 32,
              column: 0,
              index: 0,
            },
            end: {
              line: 32,
              column: 0,
              index: 0,
            },
          },
        })],
      {}
    );

    const cfg = new ControlFlowGraph(
      entry,
      exit,
      exit,
      new Map([entry, exit, branchNode].map((node) => [node.id, node])),
      []
    );

    expect(cfg.getNodeOfTypeByLine(26, NodeType.ENTRY)).to.deep.equal(entry);
    expect(cfg.getNodeOfTypeByLine(32, NodeType.ENTRY)).to.deep.equal(
      undefined
    );
    expect(cfg.getNodeOfTypeByLine(26, NodeType.NORMAL)).to.deep.equal(
      branchNode
    );
    expect(cfg.getNodeOfTypeByLine(32, NodeType.NORMAL)).to.deep.equal(
      branchNode
    );
    expect(cfg.getNodeOfTypeByLine(27, NodeType.NORMAL)).to.deep.equal(
      undefined
    );
  });
});
