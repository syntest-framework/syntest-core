import { Budget } from "./Budget";
import { Encoding } from "../Encoding";
import { SearchAlgorithm } from "../metaheuristics/SearchAlgorithm";

/**
 * Budget for the number of iterations performed during the search process.
 */
export class IterationBudget<T extends Encoding> implements Budget<T> {
  /**
   * The current number of iterations.
   * @protected
   */
  protected _currentIterations: number;

  /**
   * The maximum number of iterations allowed.
   * @protected
   */
  protected readonly _maxIterations: number;

  /**
   * If the budget is tracking progress
   * @protected
   */
  protected _tracking: boolean;

  /**
   * Constructor.
   *
   * @param maxIterations The maximum number of iterations of this budget
   */
  public constructor(maxIterations: number) {
    this._currentIterations = 0;
    this._maxIterations = maxIterations;
    this._tracking = false;
  }

  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  public evaluation(encoding: T): void {}

  /**
   * @inheritDoc
   */
  public getAvailableBudget(): number {
    return this._maxIterations - this._currentIterations;
  }

  /**
   * @inheritDoc
   */
  public getCurrentBudget(): number {
    return this._currentIterations;
  }

  /**
   * @inheritDoc
   */
  public getTotalBudget(): number {
    return this._maxIterations;
  }

  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public iteration(searchAlgorithm: SearchAlgorithm<T>): void {
    if (this._tracking && this._currentIterations < this._maxIterations) {
      this._currentIterations++;
    }
  }

  /**
   * @inheritDoc
   */
  public reset(): void {
    this._currentIterations = 0;
    this._tracking = false;
  }

  /**
   * @inheritDoc
   */
  public start(): void {
    this._tracking = true;
  }

  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public startInitialization(): void {}

  /**
   * @inheritDoc
   */
  public stop(): void {
    this._tracking = false;
  }

  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public stopInitialization(): void {}
}