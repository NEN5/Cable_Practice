# Cable Master: offline Android APK

The game is fully offline (no fonts or scripts loaded from the internet). GitHub builds the APK for you, so you don't need Android Studio.

## Build the APK (once)
1. Create a new GitHub repo (private is fine).
2. Upload everything in this folder, keeping the structure:
   - `www/` (the whole folder: `index.html`, `css/`, `js/`, `assets/`)
   - `package.json`
   - `capacitor.config.json`
   - `.gitignore`
   - `.github/workflows/main.yml`
3. Open the repo's **Actions** tab. The "Build APK" workflow runs on push (or press **Run workflow**).
4. After about 5-8 minutes, open the finished run and download the **cable-master-apk** artifact (a zip containing `app-debug.apk`).

## Install on your phone
1. Move `app-debug.apk` to your phone.
2. Open it and allow "Install unknown apps" for your file manager or browser if asked.
3. Launch "Cable Master". It opens in landscape, fullscreen, no internet needed.

## Updating the game
Edit the files under `www/` in the repo and commit. The workflow rebuilds a new APK.

Code layout (plain `<script>` tags, loaded in this order by `www/index.html`):
`core.js` config and state, `skins.js` shop skins, `audio.js` sound effects and music, `settings.js` settings and Edit UI, `world.js` arena, `screens.js` menu/shop/game over, `combat.js` cables and update loop, `render.js` drawing and main loop, `input.js` touch and keyboard, `main.js` start-up. Background music is `www/assets/bgm.mp3`.
To test in a browser, serve `www/` over http (for example `python -m http.server` inside `www/`).

## Notes
- This is a **debug** APK: fine for personal use, not for the Play Store (that needs a signed release build).
- The workflow edits the generated Android manifest/theme with `sed` to lock landscape and fullscreen. I haven't run this build, so if a step fails, send me the Actions log and I'll fix it.
- App id: `com.nen.fannytrainer` (change it in `capacitor.config.json` if you like).
- The app icon is the default Capacitor icon. I can generate a custom one if you want.
