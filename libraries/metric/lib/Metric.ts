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

export type Metric =
  | PropertyMetric
  | DistributionMetric
  | SeriesMetric
  | SeriesDistributionMetric;

export interface PropertyMetric {
  type: MetricType.PROPERTY;
  name: MetricName;
}

export interface DistributionMetric {
  type: MetricType.DISTRIBUTION;
  name: MetricName;
}

export interface SeriesMetric {
  type: MetricType.SERIES;
  name: MetricName;
  seriesType: SeriesType;
}

export interface SeriesDistributionMetric {
  type: MetricType.SERIES_DISTRIBUTION;
  name: MetricName;
  seriesType: SeriesType;
}

export type MetricName = string;

export enum MetricType {
  PROPERTY = "property",
  DISTRIBUTION = "distribution",
  SERIES = "series",
  SERIES_DISTRIBUTION = "series-distribution",
}

export type Distribution = number[];

export enum SeriesType {
  SEARCH_TIME = "search-time",
  TOTAL_TIME = "total-time",
  ITERATION = "iteration",
  EVALUATION = "evaluation",
}

export type Series<T> = Map<SeriesIndex, T>;
export type SeriesIndex = number;
