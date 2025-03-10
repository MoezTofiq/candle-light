# PROJECT DEVELOPMENT ENVIRONMENT

- NODE : `v22.12.0`
- PNPM PACKAGE MANAGER : `10.6.1`
- FRAMEWORK : PLASMO [Documentation](https://docs.plasmo.com/)
- FRONTEND : REACT + TYPESCRIPT
- OS : `Ubuntu 24.04.1 LTS`
- OS RELEASE : ` 24.04`
- IDE : `visual studio code`

## INSTALL THE PROJECTS DECENCIES

<!-- 'https://partner.microsoft.com/en-us/dashboard/microsoftedge/7c62f3e2-7f24-4ea8-a3b7-39ae0c92124d/packages/dashboard' -->

Install Node.js
Install pnpm package manager

In the terminal run

```bash
pnpm install
```

## RUNNING THE PROJECT

Run (the project locally) the development server:

```bash
pnpm dev
```

For firefox use :

```bash
pnpm dev --verbose --target=firefox-mv3
```

Open your browser and load the appropriate development build.
For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

## CREATING PRODUCTION BUILD

Run the following:

```bash
pnpm build
```

For firefox : (this will create a zip file specifically for firefox)

```bash
pnpm build --zip --target=firefox-mv3
```

This should create a production bundle similar to the one submitted, will be available in the build/firefox-mv2-prod directory.
