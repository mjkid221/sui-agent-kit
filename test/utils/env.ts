import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

export const EnvironmentVariablesSchema = z.object({
  SUI_PRIVATE_KEY: z.string(),
  AGENT_NETWORK: z.enum(["testnet", "mainnet"]),
  FEE_TREASURY_ADDRESS: z.string(),
  COIN_DEPLOY_FIXED_FEE: z.coerce.number(),
  TRADING_COMMISSION_FEE_BPS: z.coerce.number(),
  OPENAI_API_KEY: z.string(),
});

export function getEnv() {
  const env = EnvironmentVariablesSchema.parse(process.env);
  return env;
}
