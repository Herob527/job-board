import { company, jobOffer } from "#/db/schema";
import { eq } from "drizzle-orm";
import { NotImplementedError } from "./exceptions";

type Drizzle = ReturnType<typeof import("drizzle-orm/node-postgres").drizzle>;

export default class JobOfferService {
  #db;
  constructor(db: Drizzle) {
    this.#db = db;
  }
  public getJobOfferById(id: string) {
    throw new NotImplementedError("Not implemented");
  }

  public async getJobOffersPaginated(page: number, pageSize: number) {
    const jobOffers = await this.#db
      .select()
      .from(jobOffer)
      .innerJoin(company, eq(jobOffer.companyId, company.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return jobOffers;
  }
}
