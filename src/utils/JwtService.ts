import type { users } from "#/db/schema";
import { TOKEN_SECRET } from "astro:env/server";
import * as jose from "jose";

class JwtService {
  private encodedSecret = new TextEncoder().encode(TOKEN_SECRET);
  private algorithm: jose.JWSAlgorithm = "HS256";
  private expirationTime: number = 24 * 60 * 60;

  async generateJwt<T extends Record<string, unknown>>(payload: T) {
    return await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: this.algorithm })
      .setIssuedAt()
      .setIssuer("job-board")
      .setAudience("user")
      .setExpirationTime("1d")
      .sign(this.encodedSecret);
  }

  async verifyJwt(token: string) {
    try {
      const { payload } = await jose.jwtVerify<
        Omit<typeof users.$inferSelect, "password">
      >(token, this.encodedSecret, {
        algorithms: [this.algorithm],
        audience: "user",
        issuer: "job-board",
      });
      return { payload, isExpired: false, unknownFailure: false };
    } catch (e) {
      if (e instanceof Error && e.name === jose.errors.JWTExpired.name) {
        return { payload: null, isExpired: true, unknownFailure: false };
      }
      console.error({ func: "verify", e });
      return { payload: null, isExpired: false, unknownFailure: true };
    }
  }
}

const jwtService = new JwtService();

export default jwtService;
