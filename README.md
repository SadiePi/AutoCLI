# AutoCLI

A small library for creating CLI's in TypeScript

## Usage example

```ts
import { CLI, CLIArgs } from "/path/to/AutoCLI/";

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
cli.run();
```

Run with sample inputs:

```
$ deno run example.ts
? >> help
command1: Run handler1
command2 foo: Run handler2_1 with an argument named foo
command2 foo bar: Run handler 2_2 with 2 arguments, named foo and bar

? >> command1
running handler1
? >> command1 test
Invalid command 'command1 test'. Type 'help' for a list of commands.
? >> command2
Invalid command 'command2'. Type 'help' for a list of commands.
? >> command2 test
running handler2_1 with foo=test
? >> command2 test1 test2
running handler2_2 with foo=test1 and bar=test2
? >> command3
Unknown command 'command3'. Type 'help' for a list of commands.
? >> quit
```
