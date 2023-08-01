type TestExecute = (project: string, port: number) => void;

export const testDevelopment: TestExecute;
export const testProduction: TestExecute;

export type * from "@playwright/test";
