# PROJECT DEVELOPMENT ENVIRONMENT

- NODE : `v20.11.0`
- PACKAGE MANAGER : `9.4.0`
- FRAMEWORK : PLASMO [Documentation](https://docs.plasmo.com/)
- FRONTEND : REACT + TYPESCRIPT
- OS : `windows 11 home`
- IDE : `visual studio code `

## INSTALL THE PROJECTS DECENCIES

'https://partner.microsoft.com/en-us/dashboard/microsoftedge/7c62f3e2-7f24-4ea8-a3b7-39ae0c92124d/packages/dashboard'

In the terminal run

```bash
pnpm install
```

Note: if you encounter an error run

```bash
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope Process
```

## RUNNING THE PROJECT

Install packages:

```bash
pnpm install
```

Run (the project locally) the development server:

```bash
pnpm dev
```

Note: if that does not work run

```bash
pnpm plasmo dev --verbose
```

For firefox use :

```bash
pnpm dev --verbose --target=firefox-mv2
```

Open your browser and load the appropriate development build.
For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

## PRODUCTION BUILD

Run the following:

```bash
pnpm build
```

For firefox : (this will create a zip file specifically for firefox)

```bash
pnpm build --zip --target=firefox-mv2
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.
