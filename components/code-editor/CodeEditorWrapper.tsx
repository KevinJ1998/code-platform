"use client";

import { useEffect, useState } from "react";
import CodeEditor from "@/components/code-editor/CodeEditor";
import type { ExerciseDb, TestCaseDb } from "@/types/db";

type TestCase = TestCaseDb;

type Exercise = ExerciseDb & {
    testCases?: TestCase[];
};

type Result = {
    input: string;
    expected: string;
    output: string;
    passed: boolean;
};

interface ExerciseDetailProps {
    params: {
        id: string;
    };
}

export default function CodeEditorWrapper({ params }: ExerciseDetailProps) {
    const { id } = params;

    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadExercise() {
            setError(null);

            try {
                const res = await fetch(`/api/exercises/${id}`, {
                    signal: controller.signal,
                });

                if (!res.ok) {
                    throw new Error("No se pudo cargar el ejercicio");
                }

                const data: Exercise = await res.json();
                setExercise(data);
            } catch (err) {
                if (!(err instanceof DOMException && err.name === "AbortError")) {
                    setError("Error cargando el ejercicio");
                }
            }
        }

        loadExercise();

        return () => controller.abort();
    }, [id]);

    const handleRun = async (code: string) => {
        setLoading(true);
        setResults([]);
        setError(null);

        try {
            const res = await fetch("/api/run", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    exerciseId: id,
                    userId: "d037c9bf-d867-4f1f-9e38-f05b218dbe3a",
                }),
            });

            if (!res.ok) {
                throw new Error("Error ejecutando el código");
            }

            const data = await res.json();
            setResults(data.results ?? []);
        } catch {
            setError("No se pudieron obtener los resultados");
        } finally {
            setLoading(false);
        }
    };

    if (!exercise && !error) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="rounded-2xl bg-slate-50 p-8 shadow-sm">
                    <p className="text-center text-base text-slate-600">Cargando ejercicio…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-8">
                    <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
                        {exercise?.title ?? "Ejercicio"}
                    </h1>
                    <p className="mt-4 max-w-3xl text-slate-600">{exercise?.description}</p>
                    {exercise?.difficulty && (
                        <span className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                            Dificultad: {exercise.difficulty}
                        </span>
                    )}
                </div>

                {error && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-slate-900">Casos de prueba</h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {exercise?.testCases?.map((tc, index) => (
                            <div
                                key={tc.id ?? index}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                            >
                                <p className="text-sm text-slate-500">Entrada</p>
                                <p className="mt-1 text-base text-slate-800">{tc.input}</p>
                                <p className="mt-4 text-sm text-slate-500">Salida esperada</p>
                                <p className="mt-1 text-base font-medium text-slate-900">{tc.output}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <CodeEditor onRunAction={handleRun} />
                </div>

                {loading && (
                    <div className="mt-6 rounded-2xl bg-blue-50 p-4 text-blue-700">
                        Ejecutando código…
                    </div>
                )}

                <section className="mt-8">
                    <h2 className="text-2xl font-semibold text-slate-900">Resultados</h2>
                    {results.length === 0 && !loading ? (
                        <p className="mt-4 text-slate-500">Ejecuta tu solución para ver los resultados.</p>
                    ) : (
                        <div className="mt-4 space-y-4">
                            {results.map((result, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <span className="text-sm font-semibold text-slate-700">
                                            Caso #{index + 1}
                                        </span>
                                        <span
                                            className={`rounded-full px-3 py-1 text-sm font-semibold ${result.passed
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {result.passed ? "Correcto" : "Incorrecto"}
                                        </span>
                                    </div>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-slate-400">Input</p>
                                            <p className="mt-1 text-sm text-slate-800">{result.input}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-slate-400">Esperado</p>
                                            <p className="mt-1 text-sm text-slate-800">{result.expected}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-slate-400">Output</p>
                                            <p className="mt-1 text-sm text-slate-800">{result.output}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
