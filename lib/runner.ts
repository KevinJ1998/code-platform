export async function runCode(code: string, testCases: any[]) {
    return testCases.map((tc) => {
        // Simulación básica
        const [a, b] = tc.input.split(" ").map(Number);
        const output = String(a + b);

        return {
            input: tc.input,
            expected: tc.output,
            output,
            passed: output === tc.output,
        };
    });
}
