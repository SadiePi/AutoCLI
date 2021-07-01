import { CLI, CLIArgs } from "../index.ts";

const cli = new CLI([
  ["command1", "Run handler1", handler1],
  ["command2 foo", "Run handler2_1 with an argument named foo", handler2_1],
  [
    "command2 foo bar",
    "Run handler 2_2 with 2 arguments, named foo and bar",
    handler2_2,
  ],
]);

function handler1({}: CLIArgs) {
  console.log("running handler1");
}

function handler2_1({ foo }: CLIArgs) {
  console.log(`running handler2_1 with foo=${foo}`);
}

function handler2_2({ foo, bar }: CLIArgs) {
  console.log(`running handler2_2 with foo=${foo} and bar=${bar}`);
}

cli.setPrompt(">>");
cli.setInvalid((s) => {
  console.log("nope");
});
cli.run();
