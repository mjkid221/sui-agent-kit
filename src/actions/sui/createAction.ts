import { Action, ActionExample, ActionBuilder } from "@/types/action";
import { BaseAgentKitClass } from "@/types/agent";
import { z } from "zod";

/**
 * Generic implementation of ActionBuilder for any agent kit class
 */
class GenericActionBuilderImpl<T extends BaseAgentKitClass, Schema = unknown>
  implements ActionBuilder<T, Schema>
{
  private _name: string = "";
  private _similes: string[] = [];
  private _description: string = "";
  private _examples: ActionExample[][] = [];
  private _schema?: z.ZodType<Schema>;

  name(name: string): ActionBuilder<T, Schema> {
    this._name = name;
    return this;
  }

  similes(similes: string[]): ActionBuilder<T, Schema> {
    this._similes = similes;
    return this;
  }

  description(description: string): ActionBuilder<T, Schema> {
    this._description = description;
    return this;
  }

  examples(examples: ActionExample[][]): ActionBuilder<T, Schema> {
    this._examples = examples;
    return this;
  }

  schema<S>(schema: z.ZodType<S>): ActionBuilder<T, S> {
    this._schema = schema as unknown as z.ZodType<Schema>;
    return this as unknown as ActionBuilder<T, S>;
  }

  handler<S = Schema>(
    handler: (agent: T, input: S) => Promise<Record<string, any>>,
  ): Action<T, S> {
    if (!this._schema) {
      throw new Error("Schema must be defined before handler");
    }

    return {
      name: this._name,
      similes: this._similes,
      description: this._description,
      examples: this._examples,
      schema: this._schema as unknown as z.ZodType<S>,
      handler: handler,
    };
  }
}

/**
 * Creates an action builder for the specified agent kit class
 */
export function createActionBuilderFor<T extends BaseAgentKitClass>(
  _agentClass: new (...args: any[]) => T,
): ActionBuilder<T, any> {
  return new GenericActionBuilderImpl<T>();
}
