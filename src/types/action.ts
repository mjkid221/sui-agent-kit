import { z } from "zod";
import { BaseAgentKitClass } from "./agent";

/**
 * Example of an action with input and output
 */
export interface ActionExample {
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  explanation: string;
}

/**
 * Common properties shared by all actions
 */
export interface ActionBase<Schema = z.ZodType<unknown>> {
  /**
   * Unique name of the action
   */
  name: string;

  /**
   * Alternative names/phrases that can trigger this action
   */
  similes: string[];

  /**
   * Detailed description of what the action does
   */
  description: string;

  /**
   * Array of example inputs and outputs for the action
   * Each inner array represents a group of related examples
   */
  examples: ActionExample[][];

  /**
   * Optional Zod schema for input validation
   */
  schema?: z.ZodType<Schema>;
}

/**
 * Unified handler function type with conditional input parameter based on Schema
 */
export type Handler<
  T extends BaseAgentKitClass,
  Schema = undefined,
> = Schema extends undefined
  ? (agent: T) => Promise<Record<string, unknown>>
  : (agent: T, input: Schema) => Promise<Record<string, unknown>>;

/**
 * Main Action interface with conditional handler type based on schema presence
 */
export type Action<
  T extends BaseAgentKitClass,
  Schema = unknown,
> = ActionBase<Schema> & {
  handler: Handler<T, Schema>;
};

/**
 * Interface for action builder with common methods
 */
export interface ActionBuilderBase<T extends BaseAgentKitClass, B> {
  name(name: string): B;
  similes(similes: string[]): B;
  description(description: string): B;
  examples(examples: ActionExample[][]): B;
  schema<S>(schema: z.ZodType<S>): ActionBuilder<T, S>;
}

/**
 * ActionBuilder interface with schema support and conditional handler typing
 */
export interface ActionBuilder<T extends BaseAgentKitClass, Schema = undefined>
  extends ActionBuilderBase<T, ActionBuilder<T, Schema>> {
  handler: (handler: Handler<T, Schema>) => Action<T, Schema>;
}
