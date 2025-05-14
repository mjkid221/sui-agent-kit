import { z } from "zod";
import { BaseAgentKitClass } from "./agent";
import { SuiAgentKit } from "@/agent/sui";

/**
 * Example of an action with input and output
 */
export interface ActionExample {
  input: Record<string, any>;
  output: Record<string, any>;
  explanation: string;
}

/**
 * Handler function type for executing the action
 */
export type Handler<T extends BaseAgentKitClass, Schema> = (
  agent: T,
  input: Schema,
) => Promise<Record<string, any>>;

/**
 * Main Action interface inspired by ELIZA and Solana Agent Kit
 * This interface makes it easier to implement actions across different frameworks
 */
export interface Action<T extends BaseAgentKitClass, Schema> {
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
   * Zod schema for input validation
   */
  schema: z.ZodType<Schema>;

  /**
   * Function that executes the action
   */
  handler: Handler<T, Schema>;
}

export type SuiAction<Schema = any> = Action<SuiAgentKit, Schema>;

/**
 * ActionBuilder interface for creating actions in a chainable way
 */
export interface ActionBuilder<T extends BaseAgentKitClass, Schema = any> {
  name(name: string): ActionBuilder<T, Schema>;
  similes(similes: string[]): ActionBuilder<T, Schema>;
  description(description: string): ActionBuilder<T, Schema>;
  examples(examples: ActionExample[][]): ActionBuilder<T, Schema>;
  schema<S>(schema: z.ZodType<S>): ActionBuilder<T, S>;
  handler<S = Schema>(handler: Handler<T, S>): Action<T, S>;
}

/**
 * SuiActionBuilder - specialized for SuiAgentKit
 */
export type SuiActionBuilder<Schema = any> = ActionBuilder<SuiAgentKit, Schema>;
