# Instructions

* Remember to read all the 3 Readmes:
   * ```/README.md```
   * ```app/README.md```
   * ```server/README.md``` (this one)

---

## Getting Started

### 0) Know the stack

1. If you're not familiar with Prisma, go read an overview at https://www.prisma.io/docs
2. If you're not familiar with NestJS, go read an overview at https://nestjs.com/

### 1) Init dev environment (first time)

1. Run `npm install`
2. (Optional) Install the Docker-based Postgres - you can skip if you have one running already
   1. Run `npm run docker:db`
3. Create these database schemas
   1. "orijin"
   2. "orijin-test"
4. Copy .env.example to .env AND .env.tests
    1. Modify Postgres password and other values as needed
    2. ```.env``` should contain schema "orijin"
    3. ```.env.tests``` should contain "orijin-test" or any other schema name, to avoid reseting your dev DB when running tests
        * More info here if needed: https://www.prisma.io/docs/orm/more/development-environment/environment-variables/using-multiple-env-files
5. Fill the values accordingly, a DB password must be set (it's going to be used in DB init)
6. Run `npm run prisma:migrate:dev`
   * This creates the DB from `server/prisma/migrations/*/migration.sql` files...
   * ...and seeds it with initial data from `server/prisma/seed.ts` 
7. Run `npm run test:e2e:local` to make sure tests work too

### 2) Optional tools

1. Install Prisma CLI if you wish to use it directly from the command line: `npm install -g prisma`

### 3) Start the application

1. Run `npm run start:dev` to start the app

----

## Daily development

### Running E2E (= integration) tests

#### 1) Generic

* NOTE: The tests run against a real DB which gets cleared between every run, but with values from .env.tests overriding your confs! This means the changes are happening in your "orijin-tests" schema, and not your "orijin" schema which is for regular development. 
* To run all test: "npm run test:e2e:local"
* If the test DB gets corrupt or out of sync with changes: "npm run test:e2e:local:reset"
* Adding unit tests should be done only when there is complex logic inside the service. Otherwise use E2E tests. 

#### 2) To run a specific test file

- Append the package.json target like this: `npm run test:e2e:local -- [--watch] <part-of-filename>`,
  - For example: `npm run test:e2e:local -- --watch farms"` will match only e2e files that contains "farms" and will watch for test file changes.
  - Note that there must be a space between the -- and the filename, otherwise it's considered a parameter

#### 3) To run a specific test case

* Standard Jest commands apply, i.e. you can say ```"description.only(.."```, ```"it.only(.."```, ```"it.skip(.."```, etc..

#### 4) When ADDING a new test

* Use our Test utils to establish the test data and setup everything:
```
import { createTestingModuleWithPrisma } from './test-util';

  beforeEach(async () => {
    const initialized = await createTestingModuleWithPrisma({
      imports: [TheModuleThatYouAreTesting, RequiredModule1, RequiredModule2...],
      providers: [
        // To easily provide mocks of services instead (note: doesnt work if imported as Module first?)
        // { provide: FirestoreSeasonImporterService, useValue: null },
        // { provide: FirestoreLocationImporterService, useValue: null },
        // { provide: FirestoreFarmImporterService, useValue: null },
      ],
    });
    app = initialized.app;
    farmsService = initialized.moduleFixture.get<FarmsService>(FarmsService);
  });
```

### Doing DB schema changes

#### 1) Modify Prisma's schema and create migration

1. Make changes to the schema in `server/prisma/schema.prisma`
2. Run `npm run prisma:migrate:dev` to generate a new migration file (and commit those to Git, as it's often forgotten)

#### 2) Add Seed data 

1. If you're adding a new schema, add examples of it to ```seed.ts``` as well!  

#### 3) Add E2E test

1. Make sure it's covered by E2E test somewhere

----

## Deploying to Dev/Prod

* UAT gets updated on every merge to main
* Prod releases: See Notion

## Common issues

### ReferenceError: Cannot access 'FarmsService' before initialization

* Due to a circular dependency, use forwardRef() in the module import (search src for examples)

### Prisma showing Typescript errors in IDE for newly added tables

* Just access the Prisma client code, and it should refresh and start working
