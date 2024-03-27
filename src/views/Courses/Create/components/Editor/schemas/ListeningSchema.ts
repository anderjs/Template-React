import { z } from "zod";

const answer = z.object({
  id: z.string(),
  value: z.string(),
});

export const listeningSchema = z
  .object({
    source: z.string(),
    answers: z.array(answer),
    correct: z.number(),
    question: z.string(),
  })
  .refine((ref) => ref.correct < ref.answers.length, {
    message: "El índice correcto debe ser válido",
  });
