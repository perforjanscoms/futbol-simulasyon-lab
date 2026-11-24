# BYBORA Market Desk — Android

Native Android terminal with the TradingView Advanced Chart embed restored. The app bundles the UI and loads TradingView's embedded chart widget inside its own screen.

## Latest APK
[Download BYBORA-Market-Desk.apk](https://github.com/perforjanscoms/futbol-simulasyon-lab/releases/latest/download/BYBORA-Market-Desk.apk)

## Chart and timeframes
The app uses TradingView's Advanced Chart widget, not the full TradingView website. The terminal's 1m, 5m, 15m, 30m, 1h, 4h, 1D, 1W and 1M controls remain available and reload the chart with the selected interval.

## Saved indicator sets
- Use the **Gösterge setim** panel below the chart to add RSI, MACD, EMA, SMA, Bollinger Bands, VWAP, Stochastic or ATR.
- Added study IDs are stored in Android WebView local storage and passed back to the TradingView embed after symbol or timeframe changes.
- Name and save multiple presets, load one later, or delete it.
- This saves the indicator selection created in BYBORA's panel. The public cross-origin TradingView widget does not expose an API for reading back arbitrary manual changes or custom indicator inputs made inside its iframe, so those exact internal input/style edits cannot be automatically captured. The panel is the reliable saved-set route for the listed built-in indicators.

## TradingView symbols
- Petkim: `BIST:PETKM`
- Gram Altın / TRY: `ICE:XAUTRYG`
- BIST 100: `BIST:XU100`
- USD/TRY: `FX_IDC:USDTRY`
- Bitcoin / USDT: `BINANCE:BTCUSDT`

**PETKM widget limitation:** TradingView's official widget FAQ says “This symbol is only available on TradingView” means the symbol is not permitted in its widgets in any timeframe. If PETKM returns that exact message, it cannot be unblocked by an app code change. PETKM needs a different BIST data provider or the full TradingView site. The terminal displays a notice when PETKM is selected. Source: [TradingView widget data FAQ](https://www.tradingview.com/widget-docs/faq/data/).

## Data
Yahoo Finance is not used. All displayed chart data and preconfigured studies are provided by TradingView. BIST quotes in the widget may be delayed according to exchange-data licensing. The gram gold shortcut uses TradingView's ICE:XAUTRYG symbol.

## Install
Download the APK on Android, open it, and allow installation from the browser or file manager when prompted.

Minimum Android version: Android 7.0 (API 24). Keep Android System WebView or Chrome up to date. Chart data requires an internet connection.

The Android app's 1.2.0 version is built through `.github/workflows/android-apk.yml`; the workflow uploads the APK artifact and creates a GitHub release. The workflow caches the debug signing key so subsequent APK updates use the same signature.
