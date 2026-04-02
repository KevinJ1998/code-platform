import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { runCode } from "@/lib/runner";

type RunRequestBody = {
    code: string;
    exerciseId: string;
    userId: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { code, exerciseId, userId } = req.body as RunRequestBody;

    const testCases = await prisma.testCase.findMany({
        where: { exerciseId },
    });

    const results = await runCode(code, testCases);

    const submission = await prisma.submission.create({
        data: {
            code,
            status: "completed",
            userId,
            exerciseId,
        },
    });

    return res.json({ results, submission });
}
