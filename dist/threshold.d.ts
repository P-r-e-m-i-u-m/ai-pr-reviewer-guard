import type { RiskLevel } from "./types.js";
export type FailThreshold = RiskLevel | "never";
export declare function shouldFail(level: RiskLevel, threshold: FailThreshold): boolean;
export declare function parseThreshold(value: string | undefined): FailThreshold;
