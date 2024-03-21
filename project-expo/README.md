# Expo Template

## Getting Started

1. Update `app.json` and `package.json` with your app details
2. Run `eas init` or `eas build` to create a new eas expo build
3. Link project to Expo account and project id

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

### Expo

[Routing](https://docs.expo.dev/router/create-pages/)

[Environment Variables](https://docs.expo.dev/guides/environment-variables/)
