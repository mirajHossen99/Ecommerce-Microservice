import { z } from "zod";

export const orderDTOSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  userEmail: z.string(),
  cartSessionId: z.string(),
});
