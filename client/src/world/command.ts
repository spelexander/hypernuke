import { World } from "./world";

export type CommandType = string;

type CommandListener<T> = (properties: T) => void;

export class Commands {
  private commands: [CommandType, any][] = [];
  private readonly listeners: Record<string, CommandListener<any>[]> = {};

  public send = <T>(command: CommandType, properties?: T) => {
    this.commands.push([command, properties]);
  };

  public onCommand = <T>(
    command: CommandType,
    listener: CommandListener<T>
  ) => {
    const existing = this.listeners[command] || [];
    existing.push(listener);
    this.listeners[command] = existing;
  };

  public flush = () => {
    this.commands.forEach(([command, properties]) => {
      this.listeners[command]?.forEach((listener) => {
        listener(properties);
      });
    });

    this.commands = [];
  };
}

export const commandSystem = (world: World) => {
  world.command.flush();
  return world;
};
