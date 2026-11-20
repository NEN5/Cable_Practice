# Fanny Trainer: offline Android APK

The game is fully offline (no fonts or scripts loaded from the internet). GitHub builds the APK for you, so you don't need Android Studio.

## Build the APK (once)
1. Create a new GitHub repo (private is fine).
2. Upload everything in this folder, keeping the structure:
   - `www/index.html`
   - `package.json`
   - `capacitor.config.json`
   - `.gitignore`
   - `.github/workflows/build-apk.yml`
3. Open the repo's **Actions** tab. The "Build APK" workflow runs on push (or press **Run workflow**).
4. After about 5-8 minutes, open the finished run and download the **fanny-trainer-apk** artifact (a zip containing `app-debug.apk`).

## Install on your phone
1. Move `app-debug.apk` to your phone.
2. Open it and allow "Install unknown apps" for your file manager or browser if asked.
3. Launch "Fanny Trainer". It opens in landscape, fullscreen, no internet needed.

## Updating the game
Replace `www/index.html` in the repo and commit. The workflow rebuilds a new APK.

## Notes
- This is a **debug** APK: fine for personal use, not for the Play Store (that needs a signed release build).
- The workflow edits the generated Android manifest/theme with `sed` to lock landscape and fullscreen. I haven't run this build, so if a step fails, send me the Actions log and I'll fix it.
- App id: `com.nen.fannytrainer` (change it in `capacitor.config.json` if you like).
- The app icon is the default Capacitor icon. I can generate a custom one if you want.
