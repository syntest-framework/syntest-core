import * as chai from "chai";
import {
  guessCWD,
  loadConfig,
  Objective,
  processConfig,
  setupLogger,
  setupOptions,
} from "../../../src";
import { DummyIndividual } from "../../mocks/DummyTestCase.mock";
import { fastNonDomSorting } from "../../../src/search/operators/ranking/FastNonDomSorting";

const expect = chai.expect;

/**
 * @author Annibale Panichella
 */
describe("Fast non-dominated sorting", function () {
  before(async () => {
    await guessCWD(null);
    await setupOptions("", "");
    await loadConfig();
    await processConfig({}, "");
    await setupLogger();
  });

  it("Sort three solutions", () => {
    const objective1: Objective = { target: "mock", line: 1, locationIdx: 1 };
    const objective2: Objective = { target: "mock", line: 1, locationIdx: 2 };

    const ind1 = new DummyIndividual();
    ind1.setDummyEvaluation([objective1, objective2], [0, 1]);

    const ind2 = new DummyIndividual();
    ind2.setDummyEvaluation([objective1, objective2], [3, 3]);

    const ind3 = new DummyIndividual();
    ind3.setDummyEvaluation([objective1, objective2], [2, 0]);

    const F = fastNonDomSorting([ind1, ind2, ind3]);
    expect(F[0].length).to.equal(2);
    expect(F[0]).to.contain(ind1);
    expect(F[0]).to.contain(ind3);
    expect(F[1].length).to.equal(1);
    expect(F[1]).to.contain(ind2);
  });
});
