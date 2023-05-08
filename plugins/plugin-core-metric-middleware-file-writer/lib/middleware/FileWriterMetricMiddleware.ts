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

import * as fs from "node:fs";
import * as path from "node:path";

import * as csv from "@fast-csv/format";
import {
  DistributionMetric,
  Metric,
  MetricManager,
  MiddleWare,
  PropertyMetric,
  SeriesDistributionMetric,
  SeriesMetric,
} from "@syntest/metric";

export class FileWriterMetricMiddleware extends MiddleWare {
  private rootOutputDirectory: string;

  constructor(
    metrics: Metric[],
    outputMetrics: Metric[],
    rootOutputDirectory: string
  ) {
    super(metrics, outputMetrics);
    this.rootOutputDirectory = rootOutputDirectory;
  }

  async run(metricManager: MetricManager): Promise<void> {
    if (metricManager.namespace !== "global") {
      return;
    }
    const namespaces = [...metricManager.namespacedManagers.keys()];
    // process all namespaces
    for (const namespace of namespaces) {
      // get the merged manager (global + local)
      const mergedManager = metricManager.getMergedNamespacedManager(namespace);

      const properties = mergedManager.collectProperties(
        <PropertyMetric[]>(
          this.outputMetrics.filter((metric) => metric.type === "property")
        )
      );

      const distributions = mergedManager.collectDistributions(
        <DistributionMetric[]>(
          this.outputMetrics.filter((metric) => metric.type === "distribution")
        )
      );

      const series = mergedManager.collectSeries(
        <SeriesMetric[]>(
          this.outputMetrics.filter((metric) => metric.type === "series")
        )
      );

      const seriesDistributions = mergedManager.collectSeriesDistributions(
        <SeriesDistributionMetric[]>(
          this.outputMetrics.filter(
            (metric) => metric.type === "series-distribution"
          )
        )
      );

      if (properties.size > 0) {
        await this.writePropertiesToCSV(
          this.rootOutputDirectory,
          namespace,
          properties
        );
      }
      if (distributions.size > 0) {
        await this.writeDistributionsToCSV(
          this.rootOutputDirectory,
          namespace,
          distributions
        );
      }
      if (series.size > 0) {
        await this.writeSeriesToCSV(
          this.rootOutputDirectory,
          namespace,
          series
        );
      }
      if (seriesDistributions.size > 0) {
        await this.writeSeriesDistributionToCSV(
          this.rootOutputDirectory,
          namespace,
          seriesDistributions
        );
      }
    }
  }

  /**
   * Creates a CSV file with the properties
   * Create one line per namespace
   *
   * The format is:
   * namespace,property1,property2,property3
   *
   * @param filePath
   * @param namespace
   * @param properties
   */
  async writePropertiesToCSV(
    filePath: string,
    namespace: string,
    properties: Map<string, string>
  ): Promise<void> {
    filePath = path.resolve(path.join(filePath, "properties.csv"));
    const exists = fs.existsSync(filePath);

    const data = {
      namespace: namespace,
      ...Object.fromEntries(properties),
    };

    const dataAsString = await csv.writeToString([data], {
      headers: !exists,
      includeEndRowDelimiter: true,
    });

    if (exists) {
      fs.appendFileSync(filePath, dataAsString);
    } else {
      fs.writeFileSync(filePath, dataAsString);
    }
  }

  /**
   * Creates a CSV file with the distributions
   * Create one line per value
   *
   * The format is:
   * namespace,distributionName,value
   *
   * @param filePath
   * @param namespace
   * @param distributions
   */
  async writeDistributionsToCSV(
    filePath: string,
    namespace: string,
    distributions: Map<string, number[]>
  ): Promise<void> {
    filePath = path.resolve(path.join(filePath, "distributions.csv"));
    const exists = fs.existsSync(filePath);

    const fullData = [];

    for (const [
      distributionName,
      distributionData,
    ] of distributions.entries()) {
      for (const value of distributionData) {
        fullData.push({
          namespace: namespace,
          distributionName: distributionName,
          value: value,
        });
      }
    }

    const dataAsString = await csv.writeToString(fullData, {
      headers: !exists,
      includeEndRowDelimiter: true,
    });

    if (exists) {
      fs.appendFileSync(filePath, dataAsString);
    } else {
      fs.writeFileSync(filePath, dataAsString);
    }
  }

  /**
   * Creates a CSV file with the series
   * Create one line per index
   *
   * The format is:
   * namespace,seriesName,seriesTypeName,index,value
   *
   * @param filePath
   * @param namespace
   * @param series
   */
  async writeSeriesToCSV(
    filePath: string,
    namespace: string,
    series: Map<string, Map<string, Map<number, number>>>
  ): Promise<void> {
    filePath = path.resolve(path.join(filePath, "series.csv"));
    const exists = fs.existsSync(filePath);

    const fullData = [];

    for (const [seriesName, seriesType] of series.entries()) {
      for (const [seriesTypeName, seriesTypeData] of seriesType.entries()) {
        for (const [index, value] of seriesTypeData.entries()) {
          fullData.push({
            namespace: namespace,
            seriesName: seriesName,
            seriesTypeName: seriesTypeName,
            index: index,
            value: value,
          });
        }
      }
    }

    const dataAsString = await csv.writeToString(fullData, {
      headers: !exists,
      includeEndRowDelimiter: true,
    });

    if (exists) {
      fs.appendFileSync(filePath, dataAsString);
    } else {
      fs.writeFileSync(filePath, dataAsString);
    }
  }

  /**
   * Creates a CSV file with the series distributions
   * Create one line per value
   *
   * The format is:
   * namespace,distributionName,seriesName,seriesType,index,value
   *
   * @param filePath
   * @param namespace
   * @param seriesDistributions
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async writeSeriesDistributionToCSV(
    filePath: string,
    namespace: string,
    seriesDistributions: Map<
      string,
      Map<string, Map<string, Map<number, number[]>>>
    >
  ): Promise<void> {
    filePath = path.resolve(path.join(filePath, "series-distributions.csv"));
    const exists = fs.existsSync(filePath);

    const fullData = [];

    for (const [
      distributionName,
      distributionData,
    ] of seriesDistributions.entries()) {
      for (const [seriesName, seriesNameData] of distributionData.entries()) {
        for (const [seriesType, seriesTypeData] of seriesNameData.entries()) {
          for (const [index, value] of seriesTypeData.entries()) {
            for (const distributionValue of value) {
              fullData.push({
                namespace: namespace,
                distributionName: distributionName,
                seriesName: seriesName,
                seriesType: seriesType,
                index: index,
                value: distributionValue,
              });
            }
          }
        }
      }
    }

    const dataAsString = await csv.writeToString(fullData, {
      headers: !exists,
      includeEndRowDelimiter: true,
    });

    if (exists) {
      fs.appendFileSync(filePath, dataAsString);
    } else {
      fs.writeFileSync(filePath, dataAsString);
    }
  }
}
