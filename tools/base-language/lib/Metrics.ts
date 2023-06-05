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
import { Metric, MetricType, SeriesType } from "@syntest/metric";

export enum SeriesName {
  BRANCHES_COVERED = "branches-covered",
  STATEMENTS_COVERED = "statements-covered",
  FUNCTIONS_COVERED = "functions-covered",

  PATH_OBJECTIVES_COVERED = "path-objectives-covered",
  BRANCH_OBJECTIVES_COVERED = "branch-objectives-covered",
  EXCEPTION_OBJECTIVES_COVERED = "exception-objectives-covered",
  FUNCTION_OBJECTIVES_COVERED = "function-objectives-covered",
  LINE_OBJECTIVES_COVERED = "line-objectives-covered",
  IMPLICIT_BRANCH_OBJECTIVES_COVERED = "implicit-branch-objectives-covered",
  OBJECTIVES_COVERED = "objectives-covered",

  ARCHIVE_SIZE = "archive-size",
}

export enum PropertyName {
  BRANCHES_COVERED = "branches-covered",
  STATEMENTS_COVERED = "statements-covered",
  FUNCTIONS_COVERED = "functions-covered",

  BRANCHES_TOTAL = "branches-total",
  STATEMENTS_TOTAL = "statements-total",
  FUNCTIONS_TOTAL = "functions-total",

  PATH_OBJECTIVES_COVERED = "path-objectives-covered",
  BRANCH_OBJECTIVES_COVERED = "branch-objectives-covered",
  EXCEPTION_OBJECTIVES_COVERED = "exception-objectives-covered",
  FUNCTION_OBJECTIVES_COVERED = "function-objectives-covered",
  LINE_OBJECTIVES_COVERED = "line-objectives-covered",
  IMPLICIT_BRANCH_OBJECTIVES_COVERED = "implicit-branch-objectives-covered",
  OBJECTIVES_COVERED = "objectives-covered",

  PATH_OBJECTIVES_TOTAL = "path-objectives-total",
  BRANCH_OBJECTIVES_TOTAL = "branch-objectives-total",
  EXCEPTION_OBJECTIVES_TOTAL = "exception-objectives-total",
  FUNCTION_OBJECTIVES_TOTAL = "function-objectives-total",
  LINE_OBJECTIVES_TOTAL = "line-objectives-total",
  IMPLICIT_BRANCH_OBJECTIVES_TOTAL = "implicit-branch-objectives-total",
  OBJECTIVES_TOTAL = "objectives-total",

  RANDOM_SEED = "random-seed",
  TARGET = "target",
  SEARCH_ALGORITHM = "search-algorithm",
  SEARCH_EVALUATIONS = "search-evaluations",
  SEARCH_ITERATIONS = "search-iterations",
  CONSTANT_POOL_ENABLED = "constant-pool-enabled",

  INITIALIZATION_TIME = "initialization-time",
  SEARCH_TIME = "search-time",
  TOTAL_TIME = "total-time",
  INSTRUMENTATION_TIME = "instrumentation-time",

  ARCHIVE_SIZE = "archive-size",
  MINIMIZED_ARCHIVE_SIZE = "minimized-archive-size",
}

export const metrics: Metric[] = [
  // coverage
  // search time
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.STATEMENTS_COVERED,
    seriesType: SeriesType.SEARCH_TIME,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.BRANCHES_COVERED,
    seriesType: SeriesType.SEARCH_TIME,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.FUNCTIONS_COVERED,
    seriesType: SeriesType.SEARCH_TIME,
  },

  {
    type: MetricType.SERIES,
    seriesName: SeriesName.PATH_OBJECTIVES_COVERED,
    seriesType: SeriesType.SEARCH_TIME,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.BRANCH_OBJECTIVES_COVERED,
    seriesType: SeriesType.SEARCH_TIME,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.EXCEPTION_OBJECTIVES_COVERED,
    seriesType: SeriesType.SEARCH_TIME,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.FUNCTION_OBJECTIVES_COVERED,
    seriesType: SeriesType.SEARCH_TIME,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.LINE_OBJECTIVES_COVERED,
    seriesType: SeriesType.SEARCH_TIME,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.IMPLICIT_BRANCH_OBJECTIVES_COVERED,
    seriesType: SeriesType.SEARCH_TIME,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.OBJECTIVES_COVERED,
    seriesType: SeriesType.SEARCH_TIME,
  },

  // total time
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.STATEMENTS_COVERED,
    seriesType: SeriesType.TOTAL_TIME,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.BRANCHES_COVERED,
    seriesType: SeriesType.TOTAL_TIME,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.FUNCTIONS_COVERED,
    seriesType: SeriesType.TOTAL_TIME,
  },

  {
    type: MetricType.SERIES,
    seriesName: SeriesName.PATH_OBJECTIVES_COVERED,
    seriesType: SeriesType.TOTAL_TIME,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.BRANCH_OBJECTIVES_COVERED,
    seriesType: SeriesType.TOTAL_TIME,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.EXCEPTION_OBJECTIVES_COVERED,
    seriesType: SeriesType.TOTAL_TIME,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.FUNCTION_OBJECTIVES_COVERED,
    seriesType: SeriesType.TOTAL_TIME,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.LINE_OBJECTIVES_COVERED,
    seriesType: SeriesType.TOTAL_TIME,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.IMPLICIT_BRANCH_OBJECTIVES_COVERED,
    seriesType: SeriesType.TOTAL_TIME,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.OBJECTIVES_COVERED,
    seriesType: SeriesType.TOTAL_TIME,
  },

  // iterations
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.STATEMENTS_COVERED,
    seriesType: SeriesType.ITERATION,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.BRANCHES_COVERED,
    seriesType: SeriesType.ITERATION,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.FUNCTIONS_COVERED,
    seriesType: SeriesType.ITERATION,
  },

  {
    type: MetricType.SERIES,
    seriesName: SeriesName.PATH_OBJECTIVES_COVERED,
    seriesType: SeriesType.ITERATION,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.BRANCH_OBJECTIVES_COVERED,
    seriesType: SeriesType.ITERATION,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.EXCEPTION_OBJECTIVES_COVERED,
    seriesType: SeriesType.ITERATION,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.FUNCTION_OBJECTIVES_COVERED,
    seriesType: SeriesType.ITERATION,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.LINE_OBJECTIVES_COVERED,
    seriesType: SeriesType.ITERATION,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.IMPLICIT_BRANCH_OBJECTIVES_COVERED,
    seriesType: SeriesType.ITERATION,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.OBJECTIVES_COVERED,
    seriesType: SeriesType.ITERATION,
  },

  // evaluations
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.STATEMENTS_COVERED,
    seriesType: SeriesType.EVALUATION,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.BRANCHES_COVERED,
    seriesType: SeriesType.EVALUATION,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.FUNCTIONS_COVERED,
    seriesType: SeriesType.EVALUATION,
  },

  {
    type: MetricType.SERIES,
    seriesName: SeriesName.PATH_OBJECTIVES_COVERED,
    seriesType: SeriesType.EVALUATION,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.BRANCH_OBJECTIVES_COVERED,
    seriesType: SeriesType.EVALUATION,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.EXCEPTION_OBJECTIVES_COVERED,
    seriesType: SeriesType.EVALUATION,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.FUNCTION_OBJECTIVES_COVERED,
    seriesType: SeriesType.EVALUATION,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.LINE_OBJECTIVES_COVERED,
    seriesType: SeriesType.EVALUATION,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.IMPLICIT_BRANCH_OBJECTIVES_COVERED,
    seriesType: SeriesType.EVALUATION,
  },
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.OBJECTIVES_COVERED,
    seriesType: SeriesType.EVALUATION,
  },

  // totals
  {
    type: MetricType.PROPERTY,
    property: PropertyName.STATEMENTS_TOTAL,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.BRANCHES_TOTAL,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.FUNCTIONS_TOTAL,
  },

  {
    type: MetricType.PROPERTY,
    property: PropertyName.PATH_OBJECTIVES_TOTAL,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.BRANCH_OBJECTIVES_TOTAL,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.FUNCTION_OBJECTIVES_TOTAL,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.EXCEPTION_OBJECTIVES_TOTAL,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.LINE_OBJECTIVES_TOTAL,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.IMPLICIT_BRANCH_OBJECTIVES_TOTAL,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.OBJECTIVES_TOTAL,
  },

  // final coverage
  {
    type: MetricType.PROPERTY,
    property: PropertyName.STATEMENTS_COVERED,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.BRANCHES_COVERED,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.FUNCTIONS_COVERED,
  },

  {
    type: MetricType.PROPERTY,
    property: PropertyName.PATH_OBJECTIVES_COVERED,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.BRANCH_OBJECTIVES_COVERED,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.FUNCTION_OBJECTIVES_COVERED,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.EXCEPTION_OBJECTIVES_COVERED,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.LINE_OBJECTIVES_COVERED,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.IMPLICIT_BRANCH_OBJECTIVES_COVERED,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.OBJECTIVES_COVERED,
  },

  // TODO

  // general properties
  {
    type: MetricType.PROPERTY,
    property: PropertyName.RANDOM_SEED,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.TARGET,
  },

  // search
  {
    type: MetricType.PROPERTY,
    property: PropertyName.SEARCH_ALGORITHM,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.SEARCH_EVALUATIONS,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.SEARCH_ITERATIONS,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.CONSTANT_POOL_ENABLED,
  },

  // Time
  {
    type: MetricType.PROPERTY,
    property: PropertyName.INITIALIZATION_TIME,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.SEARCH_TIME,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.TOTAL_TIME,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.INSTRUMENTATION_TIME,
  },

  // Archive
  {
    type: MetricType.SERIES,
    seriesName: SeriesName.ARCHIVE_SIZE,
    seriesType: SeriesType.TOTAL_TIME,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.ARCHIVE_SIZE,
  },
  {
    type: MetricType.PROPERTY,
    property: PropertyName.MINIMIZED_ARCHIVE_SIZE,
  },
];
