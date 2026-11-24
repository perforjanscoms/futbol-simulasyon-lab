# BYBORA Market Desk — Android

Native Android shell for a bundled BYBORA symbol launcher and the first-party TradingView Supercharts website.

## Latest APK
[Download BYBORA-Market-Desk.apk](https://github.com/perforjanscoms/futbol-simulasyon-lab/releases/latest/download/BYBORA-Market-Desk.apk)

## Chart and indicator saving
- The local BYBORA screen is a symbol launcher. Selecting a symbol opens TradingView's actual chart page inside the app's WebView, rather than using the limited cross-origin embedded chart widget.
- Use a TradingView account and sign in inside the app.
- In the TradingView chart, open **Manage layouts / Düzenleri yönet** and enable **Autosave / Otomatik kaydet**. You can also save a layout manually. TradingView layouts include indicators, drawings and chart settings.
- TradingView account/cloud saves are the supported way to keep custom indicator inputs and chart layouts. The separate BYBORA symbol watchlist remains stored locally on the device.
- Android WebView cookies and chart history are flushed/restored to keep the TradingView session and in-progress page stable across activity recreation.

## Correct symbol examples
- Petkim: `BIST:PETKM`
- Gram Altın / TL: `ICE:XAUTRYG`
- BIST 100: `BIST:XU100`
- USD/TRY: `FX_IDC:USDTRY`
- Bitcoin / USDT: `BINANCE:BTCUSDT`

The symbol picker accepts short aliases such as `PETKM`, `Petkim`, `gram altın`, and `XAUTRYG`. For uncommon instruments, enter the full TradingView `EXCHANGE:SYMBOL` code.

## Build
The GitHub Actions workflow `.github/workflows/android-apk.yml` builds an installable debug-signed APK whenever the Android project or bundled terminal files change. It uploads the APK as an Actions artifact and attaches it to a GitHub Release.

## Install
Download the APK on Android, open it, and allow installation from the browser or file manager when prompted.

Minimum Android version: Android 7.0 (API 24). Keep Android System WebView or Chrome up to date. Chart data and TradingView sign-in require an internet connection.

## Data
Yahoo Finance is not used. Market charts, prices, indicators, drawings and saved layouts are supplied by TradingView. BIST prices may be delayed according to exchange-data licensing.
