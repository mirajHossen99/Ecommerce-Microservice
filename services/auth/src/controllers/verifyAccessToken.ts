import { Request, Response, NextFunction } from "express";
import { prisma } from "@/prisma";
import { AccessTokenDTOSchema } from "@/schemas";
import jwt from "jsonwebtoken";

const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Validate the request body
    const parsedBody = AccessTokenDTOSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error.issues });
    }

    // Verify the access token
    const { accessToken } = parsedBody.data;
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string);
    const userId = (decoded as { userId: string }).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({ message: "Authorized", user });
  } catch (error) {
    next(error);
  }
};

export default verifyAccessToken;
