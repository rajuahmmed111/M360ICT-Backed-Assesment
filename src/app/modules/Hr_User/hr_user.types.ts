import { HrUser as PrismaHrUser } from "@prisma/client";

export type HrUser = Omit<PrismaHrUser, "passwordHash">;

export interface CreateHrUserDto {
  email: string;
  password: string;
  name: string;
}
