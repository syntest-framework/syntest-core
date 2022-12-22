import { BranchObjectiveFunction, Decoder } from "../../src";
import { Encoding, EncodingSampler } from "../../src";

export class DummyEncodingMock extends Encoding {
  private static counter = 0;

  constructor() {
    DummyEncodingMock.counter++;

    super();
  }

  public setDummyEvaluation(
    objective: BranchObjectiveFunction<DummyEncodingMock>[],
    values: number[]
  ) {
    if (objective.length != values.length)
      throw new Error("Something bad happened");

    for (let i = 0; i < objective.length; i++) {
      this.setDistance(objective[i], values[i]);
    }
  }

  copy(): DummyEncodingMock {
    return null;
  }

  getLength(): number {
    return 0;
  }

  hashCode(decoder: Decoder<DummyEncodingMock, string>): number {
    return 0;
  }

  mutate(sampler: EncodingSampler<DummyEncodingMock>): DummyEncodingMock {
    return undefined;
  }
}
