import e, { Request, Response, NextFunction } from "express";
import { prisma } from "@/prisma";
import { User } from "../../prisma/generated/prisma/client";

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  // /users/:id?field=id or authUserId

  try {
    const { id } = req.params;
    const field = req.query.field as string;

    let user: User | null = null;

    if (field === "authUserId") {
      // Find the user by authUserId
      user = await prisma.user.findUnique({
        where: { authUserId: id as string },
      });
    } else {
      // Find the user by Id
      user = await prisma.user.findUnique({
        where: { id: id as string },
      });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export default getUserById;
