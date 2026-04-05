"use client";

import { useState } from "react";
import CodeEditor from "@/components/code-editor/CodeEditor";

type RunResult = {
    input: string;
    expected: string;
    output: string;
    passed: boolean;
};

type ExerciseRunnerProps = {
    exerciseId: string;
};

export default function ExerciseRunner({ exerciseId }: ExerciseRunnerProps) {
    const [results, setResults] = useState<RunResult[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRun = async (code: string) => {
        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await fetch("/api/run", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    exerciseId,
                    userId: "anonymous",
                }),
            });

            if (!response.ok) {
                throw new Error(`Error ejecutando el código (${response.status})`);
            }

            const data = await response.json();
            setResults(data.results ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error ejecutando el código");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Editor</p>
                        <h2 className="text-xl font-semibold text-slate-900">Escribe y prueba tu solución</h2>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">Ejercicio activo</span>
                </div>

                <CodeEditor onRunAction={handleRun} />

                {loading && <p className="mt-3 text-sm text-slate-600">Ejecutando...</p>}
                {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
            </section>

            {results && (
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Resultados</h3>
                    <div className="space-y-4">
                        {results.map((result, index) => (
                            <div
                                key={index}
                                className={`rounded-2xl border p-4 ${result.passed ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"
                                    }`}
                            >
                                <p className="text-sm text-slate-700 mb-1">
                                    <strong>Entrada:</strong> {result.input}
                                </p>
                                <p className="text-sm text-slate-700 mb-1">
                                    <strong>Esperado:</strong> {result.expected}
                                </p>
                                <p className="text-sm text-slate-700 mb-1">
                                    <strong>Salida:</strong> {result.output}
                                </p>
                                <p className={`text-sm font-semibold ${result.passed ? "text-emerald-700" : "text-rose-700"}`}>
                                    {result.passed ? "Correcto" : "Incorrecto"}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
