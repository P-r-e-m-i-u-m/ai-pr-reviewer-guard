import type { RiskLevel } from "./types.js";

const order: Record<RiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4
};

export type FailThreshold = RiskLevel | "never";

export function shouldFail(level: RiskLevel, threshold: FailThreshold): boolean {
  if (threshold === "never") {
    return false;
  }
  return order[level] >= order[threshold];
}

export function parseThreshold(value: string | undefined): FailThreshold {
  const normalized = (value ?? "high").toLowerCase();
  if (normalized === "low" || normalized === "medium" || normalized === "high" || normalized === "critical" || normalized === "never") {
    return normalized;
  }
  throw new Error(`Invalid threshold "${value}". Use low, medium, high, critical, or never.`);
}
