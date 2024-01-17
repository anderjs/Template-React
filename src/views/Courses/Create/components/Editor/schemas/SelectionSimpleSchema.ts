import { z } from "zod";

const answer = z.object({
  uuid: z.number(),
  value: z.string(),
});

export const answerSchema = z
  .string()
  .min(1, "La longitud de la respuesta debe ser mínimo de 1")
  .max(100, "La logintud de la respuesta debe ser mínimo de 100");

export const selectionSchema = z
  .object({
    question: z.string(),
    correct: z.number(),
    answers: z.array(answer),
  })
  .refine((ref) => ref.correct < ref.answers.length, {
    message: "El índice correcto debe ser válido",
  });
