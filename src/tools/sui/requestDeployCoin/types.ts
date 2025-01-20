import { z } from "zod";

export const TokenCreationSchema = z.object({
  name: z.string(),
  symbol: z.string(),
  totalSupply: z.union([z.string(), z.number()]),
  decimals: z.number().optional(),
  imageUrl: z.string().optional(),
  description: z.string(),
  fixedSupply: z.boolean(),
});

export type TokenCreationInterface = z.infer<typeof TokenCreationSchema>;
