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
export type Handler<T extends BaseAgentKitClass> = (
  agent: T,
  input: Record<string, any>,
) => Promise<Record<string, any>>;

/**
 * Main Action interface inspired by ELIZA and Solana Agent Kit
 * This interface makes it easier to implement actions across different frameworks
 */
export interface Action<T extends BaseAgentKitClass> {
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
  schema: z.ZodType<any>;

  /**
   * Function that executes the action
   */
  handler: Handler<T>;
}

export type SuiAction<TSchema extends z.ZodType = z.ZodType> = {
  name: string;
  similes: string[];
  description: string;
  examples: Array<
    [
      {
        input: z.infer<TSchema>;
        output: any;
        explanation: string;
      },
    ]
  >;
  schema: TSchema;
  handler: (agent: SuiAgentKit, input: z.infer<TSchema>) => Promise<any>;
};
