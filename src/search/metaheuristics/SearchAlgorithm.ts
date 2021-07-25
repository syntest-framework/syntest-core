import { Encoding } from "../Encoding";
import { Archive } from "../Archive";
import { SearchSubject } from "../SearchSubject";
import { ObjectiveManager } from "../objective/managers/ObjectiveManager";
import { BudgetManager } from "../budget/BudgetManager";
import { getLogger } from "../../util/logger";

/**
 * Abstract search algorithm to search for an optimal solution within the search space.
 *
 * The search algorithm is dependent on the encoding of the search space.
 *
 * @author Mitchell Olsthoorn
 */
export abstract class SearchAlgorithm<T extends Encoding> {
  /**
   * Manager that keeps track of which objectives have been covered and are still to be searched.
   * @protected
   */
  protected _objectiveManager: ObjectiveManager<T>;

  /**
   * Abstract constructor.
   *
   * @param objectiveManager The Objective manager
   * @protected
   */
  protected constructor(objectiveManager: ObjectiveManager<T>) {
    this._objectiveManager = objectiveManager;
  }

  /**
   * Initialization phase of the search process.
   *
   * @protected
   * @param budgetManager The budget manager to track budget progress
   */
  protected abstract _initialize(budgetManager: BudgetManager<T>): void;

  /**
   * Iteration phase of the search process.
   *
   * @protected
   * @param budgetManager The budget manager to track budget progress
   */
  protected abstract _iterate(budgetManager: BudgetManager<T>): void;

  /**
   * Search the search space for an optimal solution until one of the termination conditions are met.
   *
   * @param subject The subject of the search
   * @param budgetManager The budget manager to track budget progress
   */
  public async search(
    subject: SearchSubject<T>,
    budgetManager: BudgetManager<T>
  ): Promise<Archive<T>> {
    // Initialize search process
    budgetManager.startInitialization();

    // Load search subject into the objective manager
    this._objectiveManager.load(subject);

    await this._initialize(budgetManager);
    budgetManager.stopInitialization();

    getLogger().info(
      `Coverage ${this.getProgress()}%, Remaining Budget ${budgetManager.getAvailableBudget()}%`
    );

    // Search loop that runs until the budget has expired or there are no more objectives
    budgetManager.start();
    while (
      this._objectiveManager.hasObjectives() &&
      budgetManager.hasBudgetLeft()
    ) {
      await this._iterate(budgetManager);
      budgetManager.iteration(this);

      getLogger().info(
        `Coverage ${this.getProgress()}%, Remaining Budget ${budgetManager.getAvailableBudget()}%`
      );
    }
    budgetManager.stop();

    // Return the archive of covered objectives
    return this._objectiveManager.getArchive();
  }

  /**
   * Return the progress of the search process.
   */
  public getProgress(): number {
    const numberOfCoveredObjectives = this._objectiveManager.getCoveredObjectives()
      .size;
    const numberOfUncoveredObjectives = this._objectiveManager.getUncoveredObjectives()
      .size;
    const progress =
      (numberOfCoveredObjectives /
        (numberOfCoveredObjectives + numberOfUncoveredObjectives)) *
      100;
    const factor = 10 ** 2;
    return Math.round(progress * factor) / factor;
  }
}
