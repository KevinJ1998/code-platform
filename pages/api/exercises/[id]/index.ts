import { prisma } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === "GET") {
        try {
            const exercise = await prisma.exercise.findUnique({
                where: { id: String(id) },
                include: {
                    testCases: true,
                },
            });

            return res.json(exercise);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching exercise" });
        }
    }

    return res.status(405).json({ message: "Method not allowed" });
}