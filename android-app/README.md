# BYBORA Market Desk — Android

BYBORA Market Desk is a native Android app with its own TradingView-style chart screen. It does **not** open TradingView or Investing.com chart pages. The in-app chart is drawn locally with TradingView Lightweight Charts™; all price data is fetched separately from the selected data source.

## Latest APK
[Download BYBORA-Market-Desk.apk](https://github.com/perforjanscoms/futbol-simulasyon-lab/releases/latest/download/BYBORA-Market-Desk.apk)

## In-app chart experience
- Candlestick and line charts.
- Timeframes: 1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w and 1M.
- Pan, zoom, crosshair, price scale and volume histogram.
- EMA 20/50, SMA 200, Bollinger Bands, VWAP, RSI, MACD and Stochastic.
- Horizontal price lines, trend lines and Fibonacci retracement.
- Per-symbol indicator selections and drawings saved on the device.
- Named chart layouts save symbol, interval, chart style, indicators and drawings.
- Watchlist and visible chart zoom are stored locally.
- Supported Binance spot pairs can be entered in full form, for example `BINANCE:ADAUSDT`; BIST symbols are searchable through the provider symbol directory when the API key is configured.

## Data sources and limitations

### Crypto
Binance public spot market-data endpoints provide OHLCV candles and 24-hour quote information without an API key. Data is shown inside the BYBORA chart; no Binance page is opened.

### Gram gold
The gram-equivalent chart uses Binance `PAXGTRY` candles divided by 31.1034768 grams per troy ounce. This is a **PAX Gold token / TRY market reference converted to grams**, not a physical jeweller's gram-gold quote and not a jewellery buy/sell spread. No exchange page is opened.

### BIST stocks (including PETKM and XU100)
BIST has no free, general-purpose, licensed public OHLCV API that we can safely use for every intraday timeframe. Borsa İstanbul distributes its market data through licensed data vendors. BYBORA therefore uses the istfin REST API as an optional BIST feed:
- 1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w and 1mo bars.
- Depending on the provider plan, quote/index data can be live or 15-minute delayed; the Basic plan is delayed.
- An istfin account, a data plan and an API key with `market:read` permission are required. This is not a Matriks subscription.
- Add the key in the in-app gear/settings panel. It is stored in this app's WebView local storage and sent only to `api.istfin.com` over HTTPS; it is not committed to GitHub.
- With no BIST API key, the app will show a clear setup message instead of inventing PETKM or XU100 prices.
- For access details and current pricing, see the [istfin API documentation](https://api.istfin.com/docs) and [OHLCV endpoint reference](https://api.istfin.com/docs/fiyat-barlari).

## Chart engine
The chart renderer is [TradingView Lightweight Charts™](https://tradingview.github.io/lightweight-charts/), an open-source charting library. The UI, feed adapters, indicator calculations, drawing tools and local layout persistence are implemented in BYBORA Market Desk. The library itself does not provide market data; BYBORA fetches it from the providers noted above.

## Build
The GitHub Actions workflow `.github/workflows/android-apk.yml` builds an installable debug-signed APK whenever the Android project or bundled terminal files change. It uploads the APK as an Actions artifact and attaches it to a GitHub Release. The workflow caches the debug signing key so future updates use the same signature.

## Install
Download the APK on Android, open it, and allow installation from the browser or file manager when prompted.

Minimum Android version: Android 7.0 (API 24). Keep Android System WebView or Chrome up to date. Internet is required to fetch the chart library and market data. No chart provider opens in an external app or browser.
