import type { users } from "#/db/schema";
import { TOKEN_SECRET } from "astro:env/server";
import * as jose from "jose";

class JwtService {
  private encodedSecret = new TextEncoder().encode(TOKEN_SECRET);
  private algorithm: jose.JWSAlgorithm = "HS256";
  private expirationTime: string = "1d";
  private issuer = "job-board";
  private audience = "user";

  async generateJwt<T extends Record<string, unknown>>(payload: T) {
    return await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: this.algorithm })
      .setIssuedAt()
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setExpirationTime(this.expirationTime)
      .sign(this.encodedSecret);
  }

  async verifyJwt(token: string) {
    try {
      const { payload } = await jose.jwtVerify<
        Omit<typeof users.$inferSelect, "password">
      >(token, this.encodedSecret, {
        algorithms: [this.algorithm],
        audience: this.audience,
        issuer: this.issuer,
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
