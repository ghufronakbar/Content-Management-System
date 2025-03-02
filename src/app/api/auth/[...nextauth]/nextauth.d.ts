import { User as AdapterUser } from "next-auth/adapters";
import { User as PrismaUser } from "@prisma/client";

// Mendeklarasikan tipe pengguna
interface User extends AdapterUser, PrismaUser {}

export { User };
