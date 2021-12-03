/*
 * Copyright 2020-2021 Delft University of Technology and SynTest contributors
 *
 * This file is part of SynTest Framework.
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

import { Encoding } from "../Encoding";
import { Archive } from "../Archive";
import { SearchSubject } from "../SearchSubject";
import { ObjectiveManager } from "../objective/managers/ObjectiveManager";
import { BudgetManager } from "../budget/BudgetManager";
import { getUserInterface } from "../../ui/UserInterface";
import { TerminationManager } from "../termination/TerminationManager";
import { SearchListener } from "../SearchListener";

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
   * List of search listeners.
   *
   * These listeners can be used to notify other services with updates about the search process.
   * @protected
   */
  protected _listeners: SearchListener<T>[];

  /**
   * Abstract constructor.
   *
   * @param objectiveManager The objective manager
   * @protected
   */
  protected constructor(objectiveManager: ObjectiveManager<T>) {
    this._objectiveManager = objectiveManager;
    this._listeners = [];
  }

  /**
   * Initialization phase of the search process.
   *
   * @protected
   * @param budgetManager The budget manager to track budget progress
   * @param terminationManager The termination trigger manager
   */
  protected abstract _initialize(
    budgetManager: BudgetManager<T>,
    terminationManager: TerminationManager
  ): void;

  /**
   * Iteration phase of the search process.
   *
   * @protected
   * @param budgetManager The budget manager to track budget progress
   * @param terminationManager The termination trigger manager
   */
  protected abstract _iterate(
    budgetManager: BudgetManager<T>,
    terminationManager: TerminationManager
  ): void;

  /**
   * Search the search space for an optimal solution until one of the termination conditions are met.
   *
   * @param subject The subject of the search
   * @param budgetManager The budget manager to track budget progress
   * @param terminationManager The termination trigger manager
   */
  public async search(
    subject: SearchSubject<T>,
    budgetManager: BudgetManager<T>,
    terminationManager: TerminationManager
  ): Promise<Archive<T>> {
    // Load search subject into the objective manager
    this._objectiveManager.load(subject);

    // Start initialization budget tracking
    budgetManager.initializationStarted();
    getUserInterface().startProgressBar();

    // Inform listeners that the search started
    this._listeners.forEach((listener) => {
      listener.searchStarted(this, budgetManager, terminationManager);
    });
    getUserInterface().updateProgressBar(
      this.progress,
      budgetManager.getBudget()
    );

    // Initialize search process
    await this._initialize(budgetManager, terminationManager);

    // Stop initialization budget tracking, inform the listeners, and start search budget tracking
    budgetManager.initializationStopped();
    this._listeners.forEach((listener) =>
      listener.initializationDone(this, budgetManager, terminationManager)
    );
    getUserInterface().updateProgressBar(
      this.progress,
      budgetManager.getBudget()
    );
    budgetManager.searchStarted();

    // Start search until the budget has expired, a termination trigger has been triggered, or there are no more objectives
    while (
      this._objectiveManager.hasObjectives() &&
      budgetManager.hasBudgetLeft() &&
      !terminationManager.isTriggered()
    ) {
      // Start next iteration of the search process
      await this._iterate(budgetManager, terminationManager);

      // Inform the budget manager and listeners that an iteration happened
      budgetManager.iteration(this);
      this._listeners.forEach((listener) =>
        listener.iteration(this, budgetManager, terminationManager)
      );
      getUserInterface().updateProgressBar(
        this.progress,
        budgetManager.getBudget()
      );
    }

    // Stop search budget tracking
    budgetManager.searchStopped();
    getUserInterface().stopProgressBar();

    // Inform listeners that the search stopped
    this._listeners.forEach((listener) => {
      listener.searchStarted(this, budgetManager, terminationManager);
    });

    // Return the archive of covered objectives
    return this._objectiveManager.getArchive();
  }

  /**
   * Return the objective manager.
   */
  public getObjectiveManager(): ObjectiveManager<T> {
    return this._objectiveManager;
  }

  /**
   * The progress of the search process.
   */
  public get progress(): number {
    const numberOfCoveredObjectives =
      this._objectiveManager.getCoveredObjectives().size;
    const numberOfUncoveredObjectives =
      this._objectiveManager.getUncoveredObjectives().size;
    const progress =
      (numberOfCoveredObjectives /
        (numberOfCoveredObjectives + numberOfUncoveredObjectives)) *
      100;
    const factor = 10 ** 2;
    return Math.round(progress * factor) / factor;
  }

  /**
   * Add a search listener to monitor the search process.
   *
   * @param listener The listener to add
   */
  public addListener(listener: SearchListener<T>): SearchAlgorithm<T> {
    this._listeners.push(listener);
    return this;
  }

  /**
   * Remove a search listener from the search process.
   *
   * @param listener The listener to remove
   */
  public removeListener(listener: SearchListener<T>): SearchAlgorithm<T> {
    this._listeners.slice(this._listeners.indexOf(listener), 1);
    return this;
  }
}
