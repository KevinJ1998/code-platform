"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExerciseDb } from "@/types/db";

export default function ExercisesPage() {
    const [exercises, setExercises] = useState<ExerciseDb[]>([]);

    useEffect(() => {
        fetch("/api/exercises")
            .then((res) => res.json())
            .then((data: ExerciseDb[]) => setExercises(data))
            .catch((err) => {
                console.error("Error fetching exercises:", err);
            });
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Ejercicios</h2>
            {exercises.length === 0 ? (
                <p className="text-gray-500">Cargando...</p>
            ) : (
                exercises.map((ex) => (
                    <div key={ex.id} className="border flex rounded-md p-4 mb-3 bg-white shadow-sm">
                        <div>
                            <h3 className="text-lg font-bold">{ex.title}</h3>
                            <p className="text-sm text-gray-700 mb-2">{ex.description}</p>
                            <span className="text-xs text-gray-500">Dificultad: {ex.difficulty}</span>
                        </div>
                        <div>
                            <Link href={`/exercises/${ex.id}`} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Intentar
                            </Link>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
