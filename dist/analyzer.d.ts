import type { AnalyzeOptions, ReviewSummary, RiskLevel } from "./types.js";
export declare function analyzePullRequest(options?: AnalyzeOptions): ReviewSummary;
export declare function scoreToLevel(score: number, hasCritical?: boolean): RiskLevel;
