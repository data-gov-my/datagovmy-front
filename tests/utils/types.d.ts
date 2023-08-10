import type { Locator } from "@playwright/test";
type TestExecute = (project: string, port: number) => void;

export const testDevelopment: TestExecute;
export const testProduction: TestExecute;
export type Locators = Map<string, Locator>;
export type * from "@playwright/test";
