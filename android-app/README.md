# BYBORA Market Desk — Android

Native Android terminal with TradingView embedded charts for supported symbols and alternate Investing.com candlestick charts for PETKM and gram gold.

## Latest APK
[Download BYBORA-Market-Desk.apk](https://github.com/perforjanscoms/futbol-simulasyon-lab/releases/latest/download/BYBORA-Market-Desk.apk)

## Chart providers
- BIST 100, supported BIST symbols, crypto, FX and other supported markets use the original TradingView Advanced Chart widget inside the app. The app keeps its 1m, 5m, 15m, 30m, 1h, 4h, 1D, 1W and 1M timeframe controls.
- PETKM routes to the Investing.com PETKM candlestick chart: https://tr.investing.com/equities/petkim-candlestick
- Gram gold routes to the Investing.com GAU/TRY candlestick chart: https://tr.investing.com/currencies/gau-try-candlestick
- Investing's candlestick pages offer 1m/5m/15m/30m and larger timeframes. BIST data on PETKM is delayed; Investing states BIST prices are subject to delay. GAU/TRY is classified as an FX instrument.
- Both external chart pages are opened in the same Android WebView. Press Android Back to return to BYBORA Market Desk.

## Saved indicator sets
- Use the **Gösterge setim** panel under the embedded TradingView chart for supported symbols to add RSI, MACD, EMA, SMA, Bollinger Bands, VWAP, Stochastic or ATR.
- The selected built-in studies and named presets are saved in Android WebView local storage and applied when TradingView symbols or timeframes change.
- Investing.com charts have their own chart/indicator interface. BYBORA's embedded-widget study presets do not control the Investing.com page; any preferences there are governed by Investing.com and its account/cookie settings.

## Correct symbol routing
- Petkim: `BIST:PETKM` → Investing.com PETKM candlestick chart
- Gram Altın / TRY: `ICE:XAUTRYG` → Investing.com GAU/TRY candlestick chart
- BIST 100: `BIST:XU100` → TradingView
- Bitcoin / USDT: `BINANCE:BTCUSDT` → TradingView
- USD/TRY: `FX_IDC:USDTRY` → TradingView

## Build
The GitHub Actions workflow `.github/workflows/android-apk.yml` builds an installable debug-signed APK whenever the Android project or bundled terminal files change. It uploads the APK as an Actions artifact and attaches it to a GitHub Release.

## Install
Download the APK on Android, open it, and allow installation from the browser or file manager when prompted.

Minimum Android version: Android 7.0 (API 24). Keep Android System WebView or Chrome up to date. Chart data requires an internet connection.

The workflow caches the debug signing key so subsequent APK updates use the same signature.
