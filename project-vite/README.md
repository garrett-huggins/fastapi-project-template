# Vite Template

<br>

## Installing and Running

Install Vite and all dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

<br>

## Developing

### Requirements

Latest version of [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/).

### Project Variables

#### Environment Variables

Copy the `.env.example` file to `.env.local`

- Set `VITE_API_URL` variable to the URL of your FastAPI server.
- Set `VITE_SENTRY_DSN` variable to the DSN of your Sentry project.
- Set `SENTRY_AUTH_TOKEN` variable to the auth token of your Sentry project.

```plaintext
# .env.local
VITE_API_URL=http://localhost:8000
VITE_SENTRY_DSN=https://example.ingest.sentry.io/123456
SENTRY_AUTH_TOKEN=123456
```

> **Note:** Do not add Sentry to local development, only to production. If you want to test Sentry locally, add your auth token to `.env.sentry-build-plugin` and run `npm run build` then `npm run preview`.

#### Project Config

The `config/project.ts` file contains the project information and styles used throughout the application. Update the file to fit your project.

> **Important:** The project name property is used in the email templates.

```typescript
// config/project.ts example

// project information
export const project = {
  name: "Vite Template",
  description: "A template for Vite projects.",
  organization: "Organization",
};

// API URL (used for api calls)
export const API_URL = import.meta.env.VITE_API_URL;

// styles (used for ui components)
export const styles = {
  primaryColor: "#1890ff",
  secondaryColor: "#f5222d",
  successColor: "#52c41a",
  warningColor: "#faad14",
  infoColor: "#1890ff",
  errorColor: "#f5222d",
};
```
