import { HrUser as PrismaHrUser } from "@prisma/client";

export type HrUser = Omit<PrismaHrUser, "passwordHash">;

export interface CreateHrUserDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}
