import { Request, Response, NextFunction } from "express";
import { prisma } from "@/prisma";
import { UserCreateDTOSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import axios from "axios";
import { EMAIL_SERVICE, USER_SERVICE } from "@/config";
import { generateCode } from "@/utils/generateCode";

const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Validate the request body
    const parsedBody = UserCreateDTOSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error.issues });
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: parsedBody.data.email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(parsedBody.data.password, salt);

    // Create the Auth User
    const user = await prisma.user.create({
      data: {
        ...parsedBody.data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        verified: true,
      },
    });

    // Create the User Profile by calling the User Service
    await axios.post(`${USER_SERVICE}/users`, {
      authUserId: user.id,
      name: user.name,
      email: user.email,
    });

    // Generate verification code
    const code = generateCode();
    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // Code expires in 15 minutes
      },
    });

    // Send verification email
    await axios.post(`${EMAIL_SERVICE}/emails/send`, {
      recipient: user.email,
      subject: "Email Verification",
      body: `Your verification code is: ${code}`,
      source: "user-registration",
    });

    return res.status(201).json({
      message:
        "User registered successfully. Please check your email for the verification code.",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export default userRegistration;
