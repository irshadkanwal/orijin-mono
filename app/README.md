# Orijin React App

* Remember to read all the 3 Readmes: 
   * ```/README.md```
   * ```app/README.md``` (this one)
   * ```server/README.md```

## Getting Started

```
# 1) Make sure you've set up the backend first!!
# ...

# 2) Installing dependencies
npm install

# 3) Running the setup script to install Husky & Playwright
npm run setup

# 4) Create local env file
cp .env.local .env

# 5) Log in with this user (works in our Firebase dev env)
# email: uprwebdev@gmail.com
# pass:  qwerty  
```

---

## Daily development

### 1) Tanstack router

We're using a lot of Tanstack libs, and especially the router is a bit different from other React routers. If you're not familiar with it:
* Browse through [Tanstack Router Docs](https://tanstack.com/router/latest/docs/framework/react/overview)
* Check out some [Tanstack Router Examples](https://tanstack.com/router/latest/docs/framework/react/examples/kitchen-sink-file-based)

A good example in the code is the ``farms/index.tsx``

### 2) Tanstack router gotchas (hot reload of routes)

Tanstack router uses a file-based routing system, which two oddities:
1. It automatically generates a route file of ``routeTree.gen.ts``, which is used for example on type checking of Links
    2. It's automatically built via the `vite-plugin-pages` plugin, but sometimes it gets stuck and you must restart "npm run dev" to get it compiled again
2. It automatically changes location of the folder in the line ``createFileRoute(' <location in folders> ')`` inside the router files

### 3) State

Transient state can be stored in the Tanstack router's context or using regular useState. 

Long-term state is stored using Zustand.

### 4) Storybook

Whenever developing larger components, do them in Storybook first!

```
npm run storybook
```

---

## Tanstack router

### How to do filters?

* Tanstack router uses URL Search Params to store filters and allow exact linking - https://tanstack.com/router/latest/docs/framework/react/guide/search-params
* ...

---

## Testing

*NOTE: Our frontend testing is still WIP, but we definitely want to get there. Probably with a focus on E2E tests.*

Unit testing is handled by React Testing Library and Vitest while End-to-End (E2E) Testing is conducted by Playwright.

If you'd like to run all tests, Unit and E2E alike, execute the following command:

```
npm run test
```

### 1) Unit Testing

When running unit test scripts, it is assumed that unit tests will be colocated with the source files. Take a look at the placeholder README file in `src/components` for [an example](src/components/README.md).

If you'd like to execute unit tests specifically, the below command will execute vitest:

```
npm run test:unit
```

If instead you are interested in coverage reporting, run:

```
npm run test:unit:coverage
```

All unit tests run in watch mode by default. If you'd like to disable watch mode, change the package.json test scripts with the following

before:

```
"scripts": {
  	"test:unit": "vitest src/",
	"test:unit:coverage": "vitest --coverage src/"
}
```

After:

```
"scripts": {
  	"test:unit": "vitest run src/",
	"test:unit:coverage": "vitest run --coverage src/"
}
```

### 2) Faker

Faker is included [Faker](https://fakerjs.dev/) is included to provide mock data and encourage more isolated testing and allow for rapid development of demos and MVPs. However, please make note that, [due to a bug](https://github.com/faker-js/faker/issues/1791), importing Faker from the main package (without a locale) will result in the entire Faker lib being imported causing bundle sizes to increase up to 2+ MB. Instead prefer [localized imports](https://fakerjs.dev/guide/localization.html#individual-localized-packages) as shown below.

   ```
   // import { faker } from '@faker-js/faker';
   import { faker } from '@faker-js/faker/locale/en'; // prefer localization when possible
   ```

The imported lib will instead be around 600 KB. Nonetheless, Faker should **NOT** be used in production and instead be limited to testing and demos.


### 3) End-to-End (E2E) Testing

Running E2E tests use a similar syntax to running unit tests:

```
npm run test:e2e
```

If you wish to see the reports, run:

```
npm run test:e2e:report
```

---

## Devtools

This project includes a set of Devtools. Some are additional package dependencies whereas others come built-in to the packages themselves.

### Devtool dependencies:

- [@tanstack/react-query-devtools](https://tanstack.com/query/v4/docs/react/devtools) - Dedicated dev tools to help visualize the inner workings of React Query
- [@tanstack/router-devtools](https://tanstack.com/router/v1/docs/devtools) - Dedicated dev tools to help visualize the inner workings of TanStack Router
- [@tanstack/react-table-devtools](https://www.npmjs.com/package/@tanstack/react-table-devtools) - Dedicated dev tools to help visualize the inner workings of TanStack Table
- [@hookform/DevTools](https://react-hook-form.com/dev-tools) - React Hook Form Devtools to help debug forms with validation

A set of utility components are provided in `src/components/utils/development-tools/`. These [wrapper components](https://tanstack.com/router/v1/docs/devtools#only-importing-and-using-devtools-in-developmentgit) check whether the application is running in development or production mode and render the component or null respectively. In other words, you can confidently use them during development without having to worry about them showing up for end users in production.

**TanStack Query Devtools** are ready to go out of the box. The development vs. production rendering mechanism is built into the devtools. If you do wish to [render the devtools in production](https://tanstack.com/query/latest/docs/react/devtools) you can freely do so by following the TanStack Query Devtools documentation. The devtools component can be found in `src/App.tsx`.

When running the application in development mode you can find the TanStack Query Devtools icon in the bottom left corner of the page sporting the [React Query Logo](https://img.stackshare.io/service/25599/default_c6db7125f2c663e452ba211df91b2ced3bb7f0ff.png).

**TanStack Router Devtools**, however, utilizes its respective utility component in this project. The initial setup has been taken care of but if you wish to modify or remove the component, have a look in `src/App.tsx`.

The TanStack Router Devtools icon can be found in the bottom right corner of the page denoted by the vertically stacked "TANSTACK ROUTER" logo.

The above components, along with their imports, are commented out to start.

**TanStack Table Devtools** Documentation is, at the time of writing this, non-existent. Having said that, usage is similar to the other TanStack devtools. A utility component restricting the devtools to development builds has been provided. The difference in comparison to the other TanStack devtools is the lack of floating mode. Instead, the Devtools are rendered as a component within the actual TanStack Table you define. An additional caveat being that the DevTools component (built-in and provided utility alike) require a table prop from the `useReactTable()` hook. In other words, if you have multiple tables, each table must have its own Devtools component. Check the simplified code below.

```
function Table(): FunctionComponent {
  /* some code */

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {/* table code */}
      <TanStackTableDevelopmentTools table={table} />
    </>
  )
}
```

**React Hook Form DevTools** icon can be recognized in the top right corner of the page by the pink React Hook Form clipboard logo. A utility component has also provided. Like the TanStack Table Devtools component above, a prop must be passed from a specific hook. In this case, it is the control prop from the `useForm()` hook. Similar to TanStack Table, use of React Hook Form DevTools requires the component be added to each unique form. More information can be found in the [React Hook Form DevTools documentation](https://react-hook-form.com/dev-tools).

To reiterate, if you wish to restrict the Devtools to development builds use the provided components found at `src/components/utils/development-tools` instead of the built-in components from their respective modules.

### Built-in Devtools:

- Zustand

**Zustand** provides a built-in [devtools middleware](https://github.com/pmndrs/zustand#redux-devtools) for use with [Redux DevTools](https://github.com/reduxjs/redux-devtools#redux-devtools).


## Overview of installed packages

- [TypeScript](https://www.typescriptlang.org) - A typed superset of JavaScript designed with large scale applications in mind
- [ESLint](https://eslint.org) - Static code analysis to help find problems within a codebase
- [Prettier](https://prettier.io) - An opinionated code formatter
- [Vite](https://vitejs.dev) - Feature rich and highly optimized frontend tooling with TypeScript support out of the box
- [React](https://react.dev) - A modern front-end JavaScript library for building user interfaces based on components
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework packed with classes to build any web design imaginable
- [Storybook](https://storybook.js.org) - A frontend workshop for building UI components and pages in isolation
- [TanStack Router](https://tanstack.com/router/v1) - Fully typesafe, modern and scalable routing for React applications
- [TanStack Query](https://tanstack.com/query/latest) - Declarative, always-up-to-date auto-managed queries and mutations
- [TanStack Table](https://tanstack.com/table/v8) - Headless UI for building powerful tables & datagrids
- [Zustand](https://zustand-demo.pmnd.rs) - An unopinionated, small, fast and scalable bearbones state-management solution
- [React Hook Form](https://react-hook-form.com) - Performant, flexible and extensible forms with easy-to-use validation
- [Zod](https://zod.dev) - TypeScript-first schema validation with static type inference
- [React Testing Library](https://testing-library.com) - A very light-weight, best practice first, solution for testing React components
- [Vitest](https://vitest.dev) - A blazing fast unit test framework powered by Vite
- [Playwright](https://playwright.dev) - Enables reliable end-to-end testing for modern web apps
- [Nivo](https://nivo.rocks) - A rich set of data visualization components, built on top of D3 and React
- [Faker](https://fakerjs.dev/) - Generate massive amounts of fake (but realistic) data for testing and development
- [Dayjs](https://day.js.org/en/) - A minimalist JavaScript library that parses, validates, manipulates, and displays dates and times for modern browsers
- [Husky](https://github.com/typicode/husky#readme) + [Commitizen](https://github.com/commitizen/cz-cli#readme) + [Commitlint](https://github.com/conventional-changelog/commitlint#readme) - Git hooks and commit linting to ensure use of descriptive and practical commit messages
- [ts-reset](https://github.com/total-typescript/ts-reset#readme) - Improvements for TypeScripts built-in typings for use in applications
- [Docker](https://www.docker.com) - Containerization tool for deploying your app

