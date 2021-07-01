import { CLI, CLIArgs } from "../mod.ts";

const nested = new CLI([
  [
    "sample2 foo",
    "Run sample2",
    ({ foo }) => console.log(`running sample2 with foo=${foo}`),
  ],
]);
nested.setPrompt("nested >>");

const root = new CLI([
  ["sample1", "Run sample1", ({}) => console.log("running sample1")],
  ["nest", "Run the nested CLI", await nested.run],
]);
root.setPrompt("root >>");
await root.run();
