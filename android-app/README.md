# BYBORA Market Desk — Android

A native Android shell around the bundled market-desk interface. The HTML, CSS and JavaScript are packaged inside the APK; only TradingView's hosted chart widgets and market data require an internet connection.

## Build
The GitHub Actions workflow `.github/workflows/android-apk.yml` builds a debug-signed installable APK whenever the Android project or bundled terminal files change. It uploads the APK as an Actions artifact and attaches it to a GitHub Release.

## Install
[Download the latest BYBORA-Market-Desk.apk](https://github.com/perforjanscoms/futbol-simulasyon-lab/releases/latest/download/BYBORA-Market-Desk.apk), open it on Android, and allow installation from the browser/file manager when prompted.

Minimum Android version: Android 7.0 (API 24). The Android System WebView or Chrome WebView provider should be up to date. TradingView charts cannot load without internet access.

## Data
Yahoo Finance is not used. Market charts, instruments, and displayed market prices are provided by TradingView's embedded widget. The app's local interface remains bundled in the APK.
