import { Exercise, Submission, TestCase, User } from "@prisma/client";

export type UserDb = User;
export type ExerciseDb = Exercise;
export type TestCaseDb = TestCase;
export type SubmissionDb = Submission;

export type ExercisePayload = Pick<Exercise, "id" | "title" | "description" | "difficulty">;
export type CreateExercisePayload = Pick<Exercise, "title" | "description" | "difficulty">;
export type RunCodePayload = {
    code: string;
    exerciseId: string;
    userId: string;
};
