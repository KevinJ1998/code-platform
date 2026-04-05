"use client";

import { useEffect, useState } from "react";
import CodeEditorWrapper from "@/components/code-editor/CodeEditorWrapper";
import { ExerciseDb, TestCaseDb } from "@/types/db";

interface TestCase extends TestCaseDb {
}

interface Exercise extends ExerciseDb {
    testCases?: TestCase[];
}

interface ExerciseDetailProps {
    params: Promise<{ id: string }>;
}

export default function ExerciseDetail() {
    // const { id } = await params;

    const [exercise, setExercise] = useState<Exercise | null>(null);

    useEffect(() => {
        fetch(`/api/exercises/exercise-1`)
            .then((res) => res.json())
            .then(setExercise);
    }, []);

    if (!exercise) return <p className="p-4">Cargando...</p>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{exercise.title}</h1>
            <p className="text-gray-700 mb-6">{exercise.description}</p>

            <h3 className="text-xl font-semibold mb-4">Test cases:</h3>
            <div className="mb-6">
                {exercise.testCases?.map((tc, i) => (
                    <div key={i} className="mb-2">
                        <strong>Input:</strong> {tc.input} |{" "}
                        <strong>Output:</strong> {tc.output}
                    </div>
                ))}
            </div>

            <hr className="mb-6" />

            <CodeEditorWrapper params={{ id: "exercise-1" }} />
        </div>
    );
}