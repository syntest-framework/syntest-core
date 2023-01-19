import { DummyLauncher } from "./mocks/DummyLauncher.mock";
import { CommandLineInterface, EventManager } from "@syntest/core";
import { DummyEncoding } from "./mocks/DummyEncoding.mock";

describe("", () => {
  it("Valid path", () => {
    const eventManager = new EventManager({});
    const cli = new CommandLineInterface();
    const launcher = new DummyLauncher<DummyEncoding>("dummy", eventManager, cli);
    const args = [
      "--use_plugin",
      "../plugins/example-plugin/src",
      "--target_root_directory",
      ".",
    ];
    launcher.run(args);
  });
  it("Invalid path", () => {
    const eventManager = new EventManager({});
    const cli = new CommandLineInterface();
    const launcher = new DummyLauncher<DummyEncoding>("dummy", eventManager, cli);
    const args = ["--use_plugin", "../plugins", "--target_root_directory", "."];
    launcher.run(args);
  });
});
