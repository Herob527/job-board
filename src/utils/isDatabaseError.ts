import { DrizzleQueryError } from "drizzle-orm";
import { DatabaseError } from "pg";

export const getDatabaseError = (error: unknown): DatabaseError | null => {
  if (error instanceof DatabaseError) {
    return error;
  }
  if (
    error instanceof DrizzleQueryError &&
    error.cause instanceof DatabaseError
  ) {
    return error.cause;
  }
  return null;
};
