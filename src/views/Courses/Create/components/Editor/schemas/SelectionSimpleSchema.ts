import { z } from "zod";

const answer = z.object({
  uuid: z.number(),
  value: z.string(),
});

export const selectionSchema = z
  .object({
    question: z.string(),
    correct: z.number(),
    answers: z.array(answer),
  })
  .refine((ref) => ref.correct < ref.answers.length, {
    message: "El índice correcto debe ser válido",
  });
