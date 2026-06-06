import { FlatConfigComposer } from "eslint-flat-config-utils";
import type { FlatConfig } from "./types";

/**
 * Factory to create a flat ESLint config
 * @returns Flat ESLint config
 */
export function favorodera() {
  const configs: FlatConfig[] = []

  
  return new FlatConfigComposer<FlatConfig>(...configs)
}