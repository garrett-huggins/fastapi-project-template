# Expo Template

<br>

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Configuration

#### Environment Variables

Copy `.env.example` file to `.env` and update the variables

- `EXPO_PUBLIC_API_URL` - Public API URL
- `SENTRY_DSN` - Sentry DSN

#### Project Info and EAS

- Update `app.json` and `package.json` with your app details
- Run `eas init` or `eas build` to create a new eas expo build
- Link project to Expo account and project id

### Build Profiles

- `development` - Development profile for physical devices
- `development-simulator` - Development profile for simulators
- `preview` - Preview profile for OTA updates
- `production` - Production profile for App Store and Google Play

### Build Command

- `npm run build-simulator` - Build for simulators

Other profiles can be built using the following command:

```bash
eas build --profile <profile>
```

### Running

- `npm start` - Start the development server

<br/>

## Documentation

### Config

- `config` - Contains configuration files for the project and app.

### Components

- `components/forms` - Contains pre-built form components using MUI and wrapped with React Hook Form.

- `components/ui` - Contains pre-built UI components using MUI.
