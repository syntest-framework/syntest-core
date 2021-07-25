import { Budget } from "./Budget";
import { Encoding } from "../Encoding";
import { SearchAlgorithm } from "../metaheuristics/SearchAlgorithm";
import { BudgetListener } from "./BudgetListener";

/**
 * Manager for the budget of the search process.
 *
 * Keeps track how much budget is left before the search process has to be terminated.
 *
 * @author Mitchell Olsthoorn
 */
export class BudgetManager<T extends Encoding> implements BudgetListener<T> {
  /**
   * List of currently active budgets.
   * @protected
   */
  protected _budgets: Budget<T>[];

  constructor() {
    this._budgets = [];
  }

  /**
   * Return the available budget as a value from zero to one.
   *
   * Loops over all active budgets to find the one with the lowest budget.
   */
  public getAvailableBudget(): number {
    const budget = this._budgets.reduce((minBudget, budget) =>
      budget.getAvailableBudget() / budget.getTotalBudget() <
      minBudget.getAvailableBudget() / minBudget.getTotalBudget()
        ? budget
        : minBudget
    );

    const value = (budget.getAvailableBudget() / budget.getTotalBudget()) * 100;
    const factor = 10 ** 2;
    return Math.round(value * factor) / factor;
  }

  /**
   * Return whether the budget manager has any budget left.
   */
  public hasBudgetLeft(): boolean {
    return this._budgets.every((budget) => budget.getAvailableBudget() > 0.0);
  }

  /**
   * Add budget to the list of active budgets.
   *
   * @param budget The budget to add
   */
  public addBudget(budget: Budget<T>): BudgetManager<T> {
    this._budgets.push(budget);
    return this;
  }

  /**
   * Remove budget from the list of active budgets.
   *
   * @param budget The budget to remove
   */
  public removeBudget(budget: Budget<T>): BudgetManager<T> {
    this._budgets.slice(this._budgets.indexOf(budget), 1);
    return this;
  }

  /**
   * @inheritDoc
   */
  public evaluation(encoding: T): void {
    this._budgets.forEach((budget) => budget.evaluation(encoding));
  }

  /**
   * @inheritDoc
   */
  public iteration(searchAlgorithm: SearchAlgorithm<T>): void {
    this._budgets.forEach((budget) => budget.iteration(searchAlgorithm));
  }

  /**
   * @inheritDoc
   */
  public start(): void {
    this._budgets.forEach((budget) => budget.start());
  }

  /**
   * @inheritDoc
   */
  public startInitialization(): void {
    this._budgets.forEach((budget) => budget.startInitialization());
  }

  /**
   * @inheritDoc
   */
  public stop(): void {
    this._budgets.forEach((budget) => budget.stop());
  }

  /**
   * @inheritDoc
   */
  public stopInitialization(): void {
    this._budgets.forEach((budget) => budget.stopInitialization());
  }
}
