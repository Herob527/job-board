# Job board

Fullstack project aimed to create job board mainly for learning purposes.

Stack to be determined

## Service Scope

Fullstack job board

- [ ] Auth
- [ ] Creating and editing job offers for recruiters
- [ ] Job offer will contain information regarding job title, salary, description, skills (by seniority) and location
- [ ] Searching and applying for job offers for candidates
- [ ] Storing resumes to apply later
- [ ] Feedback system so user will know about their application status

### Current schema

User:

- id
- name
- surname
- skills
- cv ref
- role

Job offer:

- id
- title
- description
- location
- skills

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
- [ ] Used skill will improve when working or having incentive to learn
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
- [ ] Project will provide revenue, but it's not guaranteed to succeed

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
