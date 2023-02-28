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
  EncodingRunner,
  EncodingSampler,
  UncoveredObjectiveManager,
  EventManager,
} from "../../../lib";
import { MOSAFamily } from "../../../lib/search/metaheuristics/evolutionary/MOSAFamily";
import { DummyEncodingMock } from "../../mocks/DummyEncoding.mock";
import { DummySearchSubject } from "../../mocks/DummySubject.mock";
import { BranchObjectiveFunction } from "../../../lib";
import { MockedMOSA } from "../../mocks/MOSAAdapter";
import { DummyCrossover } from "../../mocks/DummyCrossover.mock";

const expect = chai.expect;

/**
 * @author Annibale Panichella
 */
describe("Test MOSA", function () {
  let objectives: Set<BranchObjectiveFunction<DummyEncodingMock>>;

  beforeEach(function () {
    const objective1 = new BranchObjectiveFunction<DummyEncodingMock>(
      null,
      "1",
      1,
      true
    );
    const objective2 = new BranchObjectiveFunction<DummyEncodingMock>(
      null,
      "1",
      1,
      false
    );
    objectives = new Set<BranchObjectiveFunction<DummyEncodingMock>>();
    objectives.add(objective1);
    objectives.add(objective2);
  });

  it("Test Preference criterion", () => {
    const ind1 = new DummyEncodingMock();
    ind1.setDummyEvaluation(Array.from(objectives), [2, 3]);

    const ind2 = new DummyEncodingMock();
    ind2.setDummyEvaluation(Array.from(objectives), [0, 2]);

    const ind3 = new DummyEncodingMock();
    ind3.setDummyEvaluation(Array.from(objectives), [2, 0]);

    const mockedRunner = <EncodingRunner<DummyEncodingMock>>{};
    const mockedSampler = <EncodingSampler<DummyEncodingMock>>{};
    const mockedCrossover = new DummyCrossover();

    const mosa = new MOSAFamily(
      new EventManager({}),
      new UncoveredObjectiveManager(mockedRunner),
      mockedSampler,
      mockedCrossover,
      50,
      0.8
    );
    const frontZero = mosa.preferenceCriterion(
      [ind1 as DummyEncodingMock, ind2, ind3],
      objectives
    );

    expect(frontZero.length).to.equal(2);
    expect(frontZero).to.contain(ind2);
    expect(frontZero).to.contain(ind3);
  });

  it("Test Non Dominated front", () => {
    const ind1 = new DummyEncodingMock();
    ind1.setDummyEvaluation(Array.from(objectives), [2, 3]);

    const ind2 = new DummyEncodingMock();
    ind2.setDummyEvaluation(Array.from(objectives), [0, 2]);

    const ind3 = new DummyEncodingMock();
    ind3.setDummyEvaluation(Array.from(objectives), [2, 0]);

    const ind4 = new DummyEncodingMock();
    ind4.setDummyEvaluation(Array.from(objectives), [1, 1]);

    const ind5 = new DummyEncodingMock();
    ind5.setDummyEvaluation(Array.from(objectives), [5, 5]);

    const mockedRunner = <EncodingRunner<DummyEncodingMock>>{};
    const mockedSampler = <EncodingSampler<DummyEncodingMock>>{};
    const mockedCrossover = new DummyCrossover();

    const mosa = new MOSAFamily(
      new EventManager({}),
      new UncoveredObjectiveManager(mockedRunner),
      mockedSampler,
      mockedCrossover,
      50,
      0.8
    );
    const front = mosa.getNonDominatedFront(objectives, [
      ind1,
      ind2,
      ind3,
      ind4,
      ind5,
    ]);

    expect(front.length).to.equal(3);
    expect(front).to.contain(ind2);
    expect(front).to.contain(ind3);
    expect(front).to.contain(ind4);
  });

  it("Test Preference Sorting", () => {
    const ind1 = new DummyEncodingMock();
    ind1.setDummyEvaluation(Array.from(objectives), [2, 3]);

    const ind2 = new DummyEncodingMock();
    ind2.setDummyEvaluation(Array.from(objectives), [0, 2]);

    const ind3 = new DummyEncodingMock();
    ind3.setDummyEvaluation(Array.from(objectives), [2, 0]);

    const ind4 = new DummyEncodingMock();
    ind4.setDummyEvaluation(Array.from(objectives), [1, 1]);

    const mockedRunner = <EncodingRunner<DummyEncodingMock>>{};
    const mockedSampler = <EncodingSampler<DummyEncodingMock>>{};
    const mockedCrossover = new DummyCrossover();

    const mosa = new MOSAFamily(
      new EventManager({}),
      new UncoveredObjectiveManager(mockedRunner),
      mockedSampler,
      mockedCrossover,
      4,
      0.8
    );
    const front = mosa.preferenceSortingAlgorithm(
      [ind1, ind2, ind3, ind4],
      objectives
    );

    expect(front[0].length).to.equal(2);
    expect(front[0]).to.contain(ind2);
    expect(front[0]).to.contain(ind3);
    expect(front[1].length).to.equal(1);
    expect(front[1]).to.contain(ind4);
    expect(front[2].length).to.equal(1);
    expect(front[2]).to.contain(ind1);
  });

  it("Environmental Selection", async () => {
    const ind1 = new DummyEncodingMock();
    ind1.setDummyEvaluation(Array.from(objectives), [2, 3]);

    const ind2 = new DummyEncodingMock();
    ind2.setDummyEvaluation(Array.from(objectives), [0, 2]);

    const ind3 = new DummyEncodingMock();
    ind3.setDummyEvaluation(Array.from(objectives), [2, 0]);

    const ind4 = new DummyEncodingMock();
    ind4.setDummyEvaluation(Array.from(objectives), [1, 1]);

    const ind5 = new DummyEncodingMock();
    ind5.setDummyEvaluation(Array.from(objectives), [3, 2]);

    const searchSubject = new DummySearchSubject(Array.from(objectives));

    const mockedRunner = <EncodingRunner<DummyEncodingMock>>{};
    const mockedSampler = <EncodingSampler<DummyEncodingMock>>{};
    const mockedCrossover = new DummyCrossover();

    const mosa = new MockedMOSA(
      new EventManager({}),
      new UncoveredObjectiveManager(mockedRunner),
      mockedSampler,
      mockedCrossover,
      50,
      0.8
    );

    mosa.setPopulation([ind1, ind2, ind3, ind4, ind5], 4);
    mosa.updateObjectives(searchSubject);
    await mosa.environmentalSelection(4);

    expect(mosa.getPopulation().length).to.equal(4);
    expect(mosa.getPopulation()).contain(ind1);
    expect(mosa.getPopulation()).contain(ind2);
    expect(mosa.getPopulation()).contain(ind3);
    expect(mosa.getPopulation()).contain(ind4);
  });
});