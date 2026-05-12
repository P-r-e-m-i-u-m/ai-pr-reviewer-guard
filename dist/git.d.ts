import type { GitDiffResult } from "./types.js";
export declare function resolveRef(ref: string | undefined, fallback: string, cwd: string): string;
export declare function getDefaultBase(cwd: string): string;
export declare function getDiff(baseInput: string | undefined, headInput: string | undefined, cwd?: string): GitDiffResult;
