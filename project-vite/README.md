# Vite Template

## Developing

### Requirements

Latest version of [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/).

### Project Variables

Adjust project name and other project constants using `src/config/settings.ts`.

````typescript

#### Environment Variables

Copy the `.env.example` file to `.env.local` and set the `VITE_API_URL` variable to the URL of your FastAPI server.

```plaintext
# .env.local
VITE_API_URL= # Example: http://localhost:8000
````
