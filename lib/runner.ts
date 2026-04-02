export async function runCode(code: string, testCases: any[]) {
    // Simulación simple
    return testCases.map((tc) => ({
        input: tc.input,
        expected: tc.output,
        output: "mock_output",
        passed: true,
    }));
}
