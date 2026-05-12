const order = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4
};
export function shouldFail(level, threshold) {
    if (threshold === "never") {
        return false;
    }
    return order[level] >= order[threshold];
}
export function parseThreshold(value) {
    const normalized = (value ?? "high").toLowerCase();
    if (normalized === "low" || normalized === "medium" || normalized === "high" || normalized === "critical" || normalized === "never") {
        return normalized;
    }
    throw new Error(`Invalid threshold "${value}". Use low, medium, high, critical, or never.`);
}
//# sourceMappingURL=threshold.js.map