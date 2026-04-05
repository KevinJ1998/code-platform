import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { CreateExercisePayload } from "@/types/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const exercises = await prisma.exercise.findMany();
        return res.json(exercises);
    }

    if (req.method === "POST") {
        const { title, description, difficulty } = req.body as CreateExercisePayload;

        const exercise = await prisma.exercise.create({
            data: { title, description, difficulty },
        });

        return res.json(exercise);
    }
}
