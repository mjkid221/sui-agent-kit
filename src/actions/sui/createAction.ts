import {
  ActionBase,
  ActionBuilder,
  ActionExample,
  Action,
  Handler,
} from "@/types/action";
import { BaseAgentKitClass } from "@/types/agent";
import { z } from "zod";

/**
 * Implementation of the ActionBuilder interface
 */
class ActionBuilderImpl<T extends BaseAgentKitClass, Schema = undefined>
  implements ActionBuilder<T, Schema>
{
  private _baseAction: ActionBase<Schema> = {
    name: "",
    similes: [],
    description: "",
    examples: [],
  };

  name(name: string): ActionBuilder<T, Schema> {
    this._baseAction.name = name;
    return this;
  }

  similes(similes: string[]): ActionBuilder<T, Schema> {
    this._baseAction.similes = similes;
    return this;
  }

  description(description: string): ActionBuilder<T, Schema> {
    this._baseAction.description = description;
    return this;
  }

  examples(examples: ActionExample[][]): ActionBuilder<T, Schema> {
    this._baseAction.examples = examples;
    return this;
  }

  schema<S>(schema: z.ZodType<S>): ActionBuilder<T, S> {
    const builder = new ActionBuilderImpl<T, S>();
    builder._baseAction = {
      ...this._baseAction,
      schema,
    } as ActionBase<S>;
    return builder;
  }

  handler = ((handler: Handler<T, Schema>) => {
    return {
      ...this._baseAction,
      handler,
    } as Action<T, Schema>;
  }) as ActionBuilder<T, Schema>["handler"];
}

/**
 * Creates an action builder for the specified agent kit class
 */
export function createActionBuilderFor<
  T extends BaseAgentKitClass,
>(_agentClass: { new (...args: any[]): T }): ActionBuilder<T> {
  return new ActionBuilderImpl<T>();
}
