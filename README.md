# Label Rescan

A phone web app that turns the **2D Data Matrix** code on a label into a **1D barcode** on the phone screen, so a 1D-only field scanner can scan it.

It was built for labels whose 1D barcode printed badly while the square 2D code next to it is still readable. Instead of keying long codes into the field scanner by hand, staff scan the square code with their phone and hold the phone's screen up to the field scanner.

The whole app is one file, `index.html`. There is nothing to install and no server or database.

---

## Features

- **Live camera scanning.** Point the phone at the square code and it is read automatically, with no shutter button. A small camera window shows a guide: scan the square code (green tick), not the striped barcode (red cross).
- **Reads damaged codes.** Smudged, creased, curled and over-inked 2D codes are repaired using the code's own error correction. A result is only accepted when it passes that check with capacity to spare, so a damaged code gives the right ID or nothing.
- **Progress bar.** It shows when the app is looking for a code, when it has found one and is repairing it, and when to straighten the label or enter the ID by hand.
- **Scan from photo.** A fallback for codes that are hard to read live.
- **Manual entry.** For labels where the 2D code is also unreadable:
  - big-button **number pad** and **letter pad** (letters A–F by default)
  - **voice entry**: tap *Say the ID* and read it out
  - the phone keyboard, as a last resort
- **Full-screen barcode** for the field scanner, with **Scan next** to go straight back to the camera.
- **Session list and export.** Every label handled is listed with its full 2D code data, date and time, and how it was read (Camera, Photo, Typed or Voice). **Export list** creates a CSV file to send to the manufacturer showing which items had misprinted barcodes.
- **Auto / Light / Dark** colour theme.

---

## Using the app

### Scan a label

1. Tap **Start camera**. Allow camera access the first time.
2. Fit the **square code** inside the box, about 10–15 cm away.
3. The ID barcode opens full screen. Scan it with the field scanner.
4. Tap **Scan next** for the next label.

If the bar fills and says *Very hard to read*, flatten the label, avoid glare and hold steady. If that doesn't work, enter the ID by hand.

### Enter an ID by hand

Open the **Type code** tab and enter the characters printed after **ID:** on the label (8 characters, for example `54099B87`).

- **Keypad:** tap **ABC** for letters and **123** for numbers.
- **Voice:** tap **Say the ID** and read each character. Use the phonetic alphabet where possible:

  | Letter | Say |
  |---|---|
  | A | Alpha |
  | B | Bravo |
  | C | Charlie |
  | D | Delta |
  | E | Echo |
  | F | Foxtrot |

  For example: *"five four zero nine nine Bravo eight seven"*. "Double nine" and "oh" for zero also work. The app stops listening once the ID is complete.

Always check the ID on screen against the label before scanning.

### Export the session

At the bottom of the main screen, **This session** lists every label handled. Tap a row to show its barcode again.

- **Export list** creates a CSV file (opens in Excel), with one row per label: ID, how it was read, first and last seen, number of times, serial (250), field (90), part number (240), and the full 2D code data. Labels where the 2D code couldn't be read are marked *2D code unreadable, ID entered by hand*.
- **Start new session** clears the list. It asks you to tap twice to confirm.

The session is stored on the phone only. Export it before clearing, changing phones or clearing browser data.

---

## Setting up on GitHub Pages

1. Create a repository, for example `label-rescan`, and set it to **Public**.
2. Upload `index.html` (and this `README.md`) to the root of the repository.
3. Go to **Settings → Pages → Source: Deploy from a branch**, branch `main`, folder `/ (root)`, and tap **Save**.
4. After a minute or two the app is live at `https://<your-username>.github.io/label-rescan/`.
5. On each phone, open the link and **Add to Home Screen** so it opens like an app.

The camera and microphone only work over **https**, which GitHub Pages provides.

### Updating

Upload the new `index.html` over the old one and **Commit changes**. The version shows at the bottom of the main screen (for example *Label Rescan · 9 Oct 2026 · v20*). If a phone still shows the old version after a few minutes, fully close the app and reopen it, or add `?v=20` to the end of the link.

---

## Settings (⚙)

| Setting | Default | Notes |
|---|---|---|
| What the 1D barcode should contain | ID only (Code 128) | Or the full label code (fields 90 + 250) as GS1-128, or a custom setup |
| Letters on the letter pad | A–F | Only the letters your IDs use |
| ID = last how many characters of field (250) | 8 | |
| Show text under barcode | On | |
| Open full screen straight after a scan | On | |
| Colour theme | Auto | Also on the main screen |

Settings are saved on each phone.

---

## Label format

The app expects the 2D code to hold GS1 data like this:

```
(90)SE018 (250)7000126xxxxxxxx (240)10351xx (30)1 (37)1 (20)00
```

- **ID** = the last 8 characters of field **(250)**.
- The 1D barcode printed on the label holds **(90)** + **(250)**, shown in the app as the *Full label code* option.

The damaged-code repair uses this layout. It knows which parts of the code never change, so it can spend all of the error correction on the parts that do. If the manufacturer changes the layout, scanning still works using the standard decoders, but heavily damaged codes are less likely to read. The app needs updating for the new layout to get that strength back.

---

## Privacy and data

- Scanning, decoding and barcode generation all happen **on the phone**. No label data is sent anywhere.
- The session list and settings are stored in the phone's browser storage.
- **Voice entry** uses the phone's built-in speech recognition. On most phones this sends the audio to Apple or Google to turn it into text, so it needs internet access.
- The app loads two open-source libraries from public CDNs when it opens, so it needs internet access to start.

---

## Stopping the Allow pop-ups

The phone, not the app, decides whether to ask for camera and microphone permission. These steps make it remember. The same steps are in the app under **⚙ Settings → Stop the Allow pop-ups**.

**iPhone (Safari)**
1. Open the app's link in Safari.
2. Tap **aA** (or the page menu) in the address bar → **Website Settings**.
3. Set **Camera** and **Microphone** to **Allow**.

Or for every site: **Settings → Apps → Safari → Camera** and **Microphone** → **Allow**. When the app is opened from a home-screen icon, an iPhone may still ask once each time the app is opened. That is an iPhone limit.

**Android (Chrome)**
Chrome remembers after the first **Allow**. If it keeps asking, tap the icon to the left of the web address → **Permissions** (or **Site settings**) → set **Camera** and **Microphone** to **Allow**.

The app also keeps the camera open for 3 minutes after a scan, so **Scan next** starts instantly without asking again. Tap **Stop**, switch to another app, or leave it idle and the camera turns off.

---

## Phone and browser support

| | iPhone (Safari) | Android (Chrome) |
|---|---|---|
| Live camera scanning | ✓ | ✓ |
| Voice entry | ✓ (asks for microphone and speech recognition permission) | ✓ |
| Share the export | ✓ (share sheet) | ✓ (share sheet) |
| Vibrate on scan | — | ✓ |

If the **Say the ID** button is missing, that browser doesn't support voice. Try opening the link directly in Safari or Chrome rather than from another app.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Camera won't open | Allow camera access for the site (see *Stopping the Allow pop-ups*), and make sure you're on the `https://` link |
| Asked to Allow every time | See *Stopping the Allow pop-ups* |
| Voice won't take a new ID | Fixed in v20. Update the app. Tapping the keypad or **Clear** now always stops voice entry |
| Code won't read | Flatten the label, avoid glare, fill most of the box with the code; or use **Scan from photo**; or enter the ID by hand |
| Field scanner won't read the phone screen | Turn screen brightness up, and hold the scanner a little further from the screen at a slight angle |
| *That's the label you just scanned* | The app ignores the previous label for 5 seconds after **Scan next**. Move to the next label |
| Voice gets letters wrong | Use Alpha, Bravo, Charlie, Delta, Echo, Foxtrot |
| Still on an old version | Close the app fully and reopen it, or add `?v=` and the version number to the link |

---

## Built with

- [JsBarcode](https://github.com/lindell/JsBarcode) (MIT licence): draws the 1D barcode
- [zxing-wasm](https://github.com/Sec-ant/zxing-wasm) (MIT licence), based on [zxing-cpp](https://github.com/zxing-cpp/zxing-cpp) (Apache 2.0 licence): reads the 2D code
- A built-in Data Matrix repair decoder (grid fitting and Reed–Solomon error and erasure correction) for damaged labels
