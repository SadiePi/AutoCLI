/**
 * A small library for creating CLIs
 */

import Ask from "https://deno.land/x/ask@1.0.6/mod.ts";
const ask = new Ask();

export interface CLIArgs {
  [args: string]: string;
}
export type Handler = (args: CLIArgs) => void;
export type CommandShape = [string, string, Handler];

type HandlerArgNames = string[];
type HandlerInfo = [Handler, HandlerArgNames];
type OverloadMap = Map<number, HandlerInfo>;
type CommandMap = Map<string, OverloadMap>;

export class CLI {
  private cmds: CommandMap = new Map();
  private helpMessage: string = "";
  private prompt: string = "";
  private invalid = (args: string) => {
    console.log(
      `Invalid command '${args}'. Type 'help' for a list of commands.`
    );
  };
  private unknown = (args: string) => {
    console.log(
      `Unknown command '${args}'. Type 'help' for a list of commands.`
    );
  };

  constructor(commands: CommandShape[]) {
    commands.forEach((shape) => {
      const parts: string[] = shape[0].split(" ");
      const argc = parts.length - 1;
      let overloads = this.cmds.get(parts[0]);
      if (!overloads) {
        overloads = new Map<number, HandlerInfo>();
        this.cmds.set(parts[0], overloads);
      }
      if (overloads.get(argc)) throw new Error("invalid overloading");
      overloads.set(argc, [shape[2], parts.slice(1)]);
      this.helpMessage += shape[0] + ": " + shape[1] + "\n";
    });
  }

  public readonly run = async () => {
    while (true) {
      const input = (await this.getCommand()) ?? "";
      const args = input.split(" ");
      if (args.length == 0) continue;
      if (args.length == 1 && args[0] == "quit") break;
      if (args.length == 1 && args[0] == "help") {
        console.log(this.helpMessage);
        continue;
      }
      const result = this.execute(args);
      if (result == 1) this.unknown(input);
      if (result == 2) this.invalid(input);
    }
  };

  private readonly execute = (args: string[]): number => {
    const argc = args.length - 1;
    const overloads = this.cmds.get(args[0]);
    if (!overloads) return 1;

    const handlerInfo = overloads.get(argc);
    if (!handlerInfo) return 2;

    const data: CLIArgs = {};
    for (let i = 0; i < argc; i++) data[handlerInfo[1][i]] = args[i + 1];
    handlerInfo[0](data);
    return 0;
  };

  private readonly getCommand = async () => {
    const { cmd } = await ask.input({
      name: "cmd",
      message: this.prompt,
    });
    return cmd;
  };

  public readonly setPrompt = (prompt: string) => {
    this.prompt = prompt;
  };

  public readonly setInvalid = (func: (args: string) => void): void => {
    this.invalid = func;
  };

  public readonly setUnknown = (func: (args: string) => void): void => {
    this.unknown = func;
  };
}
