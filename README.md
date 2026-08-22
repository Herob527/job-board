# Job board

Fullstack project aimed to create job board mainly for learning purposes.

Fullstack Stack:

- Astro
- PostreSQL
- Docker compose (later check k8s)

AI Stack:

- To be determined

## Service Scope

Fullstack job board

- [ ] Auth
- [ ] Creating and editing job offers for recruiters
- [ ] Job offer will contain information regarding job title, salary, description, skills (by seniority) and location
- [ ] Searching and applying for job offers for candidates
- [ ] Storing resumes to apply later
- [ ] Candidates will be able to tell about their skills and projects more in detail
- [ ] Feedback system so user will know about their application status

### Current schema

> Every table carries `createdAt` / `updatedAt` timestamps (omitted below for brevity).

Enums:

- `remote_type`: Office, Hybrid, Remote
- `employment_type`: Employment Contact, B2B, Mandate
- `seniority`: Junior, Mid, Senior
- `application_status`: Sent, Seen, Interested, Hired, Rejected
- `corporate_role`: company_admin, recruiter
- `role`: candidate, corporate, platform_admin

User:

- id (uuid)
- name
- surname?
- email (unique)
- password
- country?

Roles — a user may hold several roles; each is a row in `UserRole`:

- `UserRole`: userId, role (`candidate` | `corporate` | `platform_admin`) — PK (userId, role)
- A `corporate` user can belong to multiple companies via `CorporateMembership`:
  - userId, role (constant `corporate`), companyId, subRoles (`corporate_role`[]) — PK (userId, role, companyId)
  - FK (userId, role) → `UserRole` (ON DELETE CASCADE): a membership can only exist if the `corporate` role row exists

Candidate data (a user with the `candidate` role):

- `CandidateSkill`: userId, name, seniority — PK (userId, name)
- `CandidateExperience`: id, userId, companyName, startDate, endDate?, description (markdown), stack[] — unique (userId, companyName, startDate)
- `CandidateProject`: id, userId, link?, description (markdown), stack[]

Company:

- id
- name (unique)
- location[]

JobOffer:

- id
- companyId (FK Company)
- title
- description (markdown)
- remoteType (`remote_type`)[]
- minSalary (int?), maxSalary (int?), currency (varchar(3))
- employmentType (`employment_type`)[]
- seniority (`seniority`)[]
- location[]
- skill (`JobOfferSkill`)[]

JobOfferSkill:

- jobOfferId, name, seniority — PK (jobOfferId, name)

Resume:

- userId (PK)
- cvFileRef (url)

Application:

- userId, jobOfferId — PK (userId, jobOfferId)
- resumeId (FK Resume)
- additionalInfo (markdown)
- status (`application_status`, default Sent)
- additionalResponseInfo (markdown?)

Note: a `corporate` user may also hold the `candidate` role and apply to jobs like any candidate.

## AI Village

For testing, I have general idea to create agents for recruiters and candidates

It'd be pretty much simulation, so agents would work on own infrastructure,
but still use job board for operations

To be thought out, since it's difficult to define processes like creation, interview, working or morale
But not impossible

### Scope

- [ ] Time will be measured in ticks that will correspond to month
- [ ] Morale system when working
- [ ] Limiting agents capabilities to mimic human and time limitations

### Candidate

- [ ] Agents have limited learning capability, so they cannot be master of all trades, just know a lot
- [ ] Unused skill will decay over time regardless of experience, but relearning will be faster than learning for the first time
- [ ] Used skill will improve when working faster or creating projects
- [ ] Agents have limited lifespan or might get fired
- [ ] Will create projects that will raise skill (when having job, it'll raise slowly)
- [ ] Will create CV that will include own projects, skills and experience in previous companies
- [ ] Will live in specific location
- [ ] Will have balance
- [ ] Will search for jobs
- [ ] Will have morale that'll determine if they go searching for another job or how efficient they will go about their tasks
- [ ] Seniors will have more morale penalty than juniors, but will be more efficient
- [ ] Will have memory of application

### Recruiter

- [ ] Will belong to company
- [ ] Will create job offers in specific locations with required skills and suggested salary
- [ ] Will interview candidates
- [ ] Will have limited capability to interview all, so it'll pick the ones matching (the more candidates, the stricte criteria)
- [ ] Will prefer seniors to juniors, but when seniors are scarse, or they cost a lot, it'll pick most matching junior

### Company

- [ ] Will create project with given stack
- [ ] Will tell recruter, what to look for in candidates
- [ ] Will have specific budget
- [ ] Will have specific location
- [ ] Will have specific capacity
- [ ] Will fire candidates when they are not needed for too long or cannot be sustained due to limited budget
- [ ] Project will provide revenue, but it's not guaranteed to succeed and still will cost

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun dev`             | Starts local dev server at `localhost:4321`      |
| `bun build`           | Build your production site to `./dist/`          |
| `bun preview`         | Preview your build locally, before deploying     |
| `bun astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help` | Get help using the Astro CLI                     |
