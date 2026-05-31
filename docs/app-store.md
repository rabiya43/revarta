# Shipping iOS and Android

## One time

1. Install EAS CLI: `npm i -g eas-cli`
2. Login: `eas login`
3. In `apps/mobile`: `eas init` (fills project id in app.json)
4. Add icon assets under `apps/mobile/assets/` (see assets/README.md)

## API URL

Mobile talks to the Next.js API. Set in `apps/mobile/.env`:

```
EXPO_PUBLIC_API_URL=https://your-vercel-domain.vercel.app
```

For local dev on a physical phone, use your PC LAN IP, e.g. `http://192.168.1.10:3000`, and run `npm run dev` from the repo root.

## Builds

From repo root:

```bash
npm install
cd apps/mobile
eas build --platform ios --profile production
eas build --platform android --profile production
```

## Store submit

```bash
eas submit --platform ios
eas submit --platform android
```

Update `eas.json` with your Apple ID and Play service account path before submit.

Bundle IDs:

- iOS: `com.rabiya43.revarta`
- Android: `com.rabiya43.revarta`
