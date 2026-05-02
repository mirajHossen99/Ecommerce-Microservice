import { z } from "zod";

export const createEmailDTOSchema = z.object({
  recipient: z.string().email(),
  subject: z.string(),
  body: z.string(),
  source: z.string(),
  sender: z.string().email().optional(),
});
