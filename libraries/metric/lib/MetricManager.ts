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
import { MiddleWare } from "./Middleware";
import { getLogger } from "@syntest/logging";
import { Metric, PropertyMetric } from "./Metric";
import {
  distributionNotRegistered,
  propertyNotRegistered,
  seriesDistributionNotRegistered,
  seriesDistributionSeriesNotRegistered,
  seriesDistributionTypeNotRegistered,
  seriesNotRegistered,
  seriesTypeNotRegistered,
} from "./util/diagnostics";

export class MetricManager {
  static LOGGER;

  static _instance: MetricManager;

  static get instance() {
    if (!MetricManager._instance) {
      throw new Error("MetricManager not initialized");
    }

    return MetricManager._instance;
  }

  static init(metrics: Metric[]) {
    MetricManager._instance = new MetricManager("global", metrics);
    MetricManager.LOGGER = getLogger("MetricManager");
  }

  private namespacedManagers: Map<string, MetricManager>;

  getNamespaced(namespace: string) {
    if (!this.namespacedManagers.has(namespace)) {
      this.namespacedManagers.set(
        namespace,
        new MetricManager(namespace, this.metrics)
      );
    }

    return this.namespacedManagers.get(namespace);
  }

  private namespace: string;
  private metrics: Metric[];

  private properties: Map<string, string>;
  private distributions: Map<string, number[]>;
  private series: Map<string, Map<string, Map<number, number>>>;
  private seriesDistributions: Map<
    string,
    Map<string, Map<string, Map<number, number[]>>>
  >;

  constructor(namespace: string, metrics: Metric[]) {
    this.namespace = namespace;
    this.metrics = metrics;
    this.namespacedManagers = new Map();

    this.properties = new Map();
    this.distributions = new Map();
    this.series = new Map();
    this.seriesDistributions = new Map();

    this.metrics.forEach((metric) => {
      switch (metric.type) {
        case "property":
          this.properties.set(metric.property, "");
          break;
        case "distribution":
          this.distributions.set(metric.distributionName, []);
          break;
        case "series":
          this.series.set(metric.seriesName, new Map());
          this.series.get(metric.seriesName).set(metric.seriesType, new Map());
          break;
        case "series-distribution":
          this.seriesDistributions.set(metric.distributionName, new Map());
          this.seriesDistributions
            .get(metric.distributionName)
            .set(metric.seriesName, new Map());
          this.seriesDistributions
            .get(metric.distributionName)
            .get(metric.seriesName)
            .set(metric.seriesType, new Map());
          break;
      }
    });
  }

  runPipeline(middleware: MiddleWare[]) {
    // TODO check order of middleware
    middleware.forEach((middleware) => {
      MetricManager.LOGGER.debug(
        `Running middleware ${middleware.constructor.name}`
      );
      middleware.run(this);
    });
  }

  recordProperty(property: string, value: string) {
    MetricManager.LOGGER.debug(`Recording property ${property} = ${value}`);

    if (!this.properties.has(property)) {
      throw new Error(propertyNotRegistered(property));
    }

    this.properties.set(property, value);
  }

  recordDistribution(distributionName: string, value: number) {
    MetricManager.LOGGER.debug(
      `Recording distribution ${distributionName} = ${value}`
    );

    if (!this.distributions.has(distributionName)) {
      throw new Error(distributionNotRegistered(distributionName));
    }

    this.distributions.get(distributionName).push(value);
  }

  recordSeries(
    seriesName: string,
    seriesType: string,
    index: number,
    value: number
  ) {
    MetricManager.LOGGER.debug(
      `Recording series ${seriesName}.${seriesType}[${index}] = ${value}`
    );

    if (!this.series.has(seriesName)) {
      throw new Error(seriesNotRegistered(seriesName));
    }

    if (!this.series.get(seriesName).has(seriesType)) {
      throw new Error(seriesTypeNotRegistered(seriesName, seriesType));
    }

    this.series.get(seriesName).get(seriesType).set(index, value);
  }

  recordSeriesDistribution(
    distributionName: string,
    seriesName: string,
    seriesType: string,
    index: number,
    value: number
  ) {
    MetricManager.LOGGER.debug(
      `Recording series distribution ${distributionName}.${seriesName}.${seriesType}[${index}] = ${value}`
    );

    if (!this.seriesDistributions.has(distributionName)) {
      throw new Error(seriesDistributionNotRegistered(distributionName));
    }

    if (!this.seriesDistributions.get(distributionName).has(seriesName)) {
      throw new Error(
        seriesDistributionSeriesNotRegistered(distributionName, seriesName)
      );
    }

    if (
      !this.seriesDistributions
        .get(distributionName)
        .get(seriesName)
        .has(seriesType)
    ) {
      throw new Error(
        seriesDistributionTypeNotRegistered(
          distributionName,
          seriesName,
          seriesType
        )
      );
    }

    if (
      !this.seriesDistributions
        .get(distributionName)
        .get(seriesName)
        .get(seriesType)
        .has(index)
    ) {
      this.seriesDistributions
        .get(distributionName)
        .get(seriesName)
        .get(seriesType)
        .set(index, []);
    }

    this.seriesDistributions
      .get(distributionName)
      .get(seriesName)
      .get(seriesType)
      .get(index)
      .push(value);
  }

  getProperty(property: string): string | undefined {
    MetricManager.LOGGER.debug(`Getting property ${property}`);

    return this.properties.get(property);
  }

  getDistribution(distributionName: string): number[] | undefined {
    MetricManager.LOGGER.debug(`Getting distribution ${distributionName}`);

    return this.distributions.get(distributionName);
  }

  getSeries(
    seriesName: string,
    seriesType: string
  ): Map<number, number> | undefined {
    MetricManager.LOGGER.debug(`Getting series ${seriesName}.${seriesType}`);

    if (!this.series.has(seriesName)) {
      return undefined;
    }

    return this.series.get(seriesName).get(seriesType);
  }

  getSeriesDistribution(
    distributionName: string,
    seriesName: string,
    seriesType: string
  ): Map<number, number[]> | undefined {
    MetricManager.LOGGER.debug(
      `Getting series distribution ${distributionName}.${seriesName}.${seriesType}`
    );

    if (!this.seriesDistributions.has(distributionName)) {
      return undefined;
    }

    if (!this.seriesDistributions.get(distributionName).has(seriesName)) {
      return undefined;
    }

    return this.seriesDistributions
      .get(distributionName)
      .get(seriesName)
      .get(seriesType);
  }

  getAllProperties(): Map<string, string> {
    return this.properties;
  }

  getAllDistributions(): Map<string, number[]> {
    return this.distributions;
  }

  getAllSeries(): Map<string, Map<string, Map<number, number>>> {
    return this.series;
  }

  getAllSeriesDistributions(): Map<
    string,
    Map<string, Map<string, Map<number, number[]>>>
  > {
    return this.seriesDistributions;
  }

  collectProperties(wanted: PropertyMetric[]): Map<string, string> {
    const properties = new Map<string, string>();

    for (const property of wanted) {
      const value = this.getProperty(property.property);

      properties.set(property.property, value);
    }

    return properties;
  }
}
