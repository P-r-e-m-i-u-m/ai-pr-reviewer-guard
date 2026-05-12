import type { ChangedFile, GuardConfig } from "./types.js";
export declare function loadConfig(cwd: string, configPath?: string): GuardConfig;
export declare function applyConfig(files: ChangedFile[], config: GuardConfig): ChangedFile[];
export declare function applyRuleWeights<T extends {
    ruleId: string;
    points: number;
}>(findings: T[], config: GuardConfig): T[];
