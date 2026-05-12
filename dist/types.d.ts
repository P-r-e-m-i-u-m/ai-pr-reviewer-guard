export type RiskLevel = "low" | "medium" | "high" | "critical";
export type FindingCategory = "security" | "dependency" | "test-coverage" | "maintainability" | "ci" | "reviewability";
export interface ChangedFile {
    path: string;
    additions: number;
    deletions: number;
    status: "added" | "modified" | "deleted" | "renamed" | "unknown";
    patch?: string;
}
export interface Finding {
    ruleId: string;
    title: string;
    detail: string;
    category: FindingCategory;
    level: RiskLevel;
    points: number;
    files: string[];
}
export interface ReviewSummary {
    score: number;
    level: RiskLevel;
    changedFiles: number;
    additions: number;
    deletions: number;
    findings: Finding[];
    recommendations: string[];
}
export interface AnalyzeOptions {
    base?: string;
    head?: string;
    cwd?: string;
    configPath?: string;
}
export interface GitDiffResult {
    base: string;
    head: string;
    files: ChangedFile[];
}
export interface GuardConfig {
    ignorePaths: string[];
    ruleWeights: Record<string, number>;
}
