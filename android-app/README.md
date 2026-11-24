# BYBORA Market Desk — Android 1.6.0

BYBORA Market Desk is a native Android app with its own TradingView-style chart screen. It does **not** open TradingView or Investing.com chart pages. The in-app chart is drawn locally with TradingView Lightweight Charts™; all price data is fetched separately from the selected data source.

## Latest APK
[Download BYBORA-Market-Desk.apk](https://github.com/perforjanscoms/futbol-simulasyon-lab/releases/latest/download/BYBORA-Market-Desk.apk)

## In-app chart experience
- Candlestick and line charts.
- Timeframes: 1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w and 1M.
- Pan, zoom, crosshair, price scale and volume histogram.
- EMA 20/50, SMA 200, Bollinger Bands, VWAP, RSI, configurable MACD (default 12/175/9) and configurable Stoch RSI (default 14/14/3/3).
- Horizontal price lines, trend lines and Fibonacci retracement.
- Per-symbol indicator selections and drawings saved on the device; MACD parameters are configurable and saved locally.
- Named chart layouts save symbol, interval, chart style, indicators and drawings.
- Watchlist and visible chart zoom are stored locally.
- Searchable symbol catalogs load from Binance Spot, Binance USDⓈ-M perpetuals, OKX Spot/Swap and a daily-updated Borsa Istanbul active-stock list.
- The watchlist displays last price and 24-hour change; BIST values may be delayed because Yahoo Finance's chart endpoint is unofficial.
- A compact candle-close countdown is shown at the right edge of the main chart.
- Supported Binance spot pairs can be entered in full form, for example `BINANCE:ADAUSDT`; BIST symbols are searchable through the provider symbol directory when the API key is configured.

## Data sources and limitations

### Crypto
Binance public spot market-data endpoints provide OHLCV candles and 24-hour quote information without an API key. Data is shown inside the BYBORA chart; no Binance page is opened.

### Gram gold
The gram-equivalent chart uses Binance `PAXGTRY` candles divided by 31.1034768 grams per troy ounce. This is a **PAX Gold token / TRY market reference converted to grams**, not a physical jeweller's gram-gold quote and not a jewellery buy/sell spread. No exchange page is opened.

### BIST stocks and indices (including PETKM and XU100)
The default BIST feed uses Yahoo Finance's publicly reachable chart endpoint inside the app WebView proxy. Examples: `PETKM.IS` and `XU100.IS`. Yahoo data is commonly delayed for BIST symbols. It covers 1m, 5m, 15m, 30m, 1h, 4h (aggregated from hourly bars), daily, weekly and monthly intervals when Yahoo provides them.

**Important limitation:** this is an unofficial, undocumented Yahoo Finance endpoint, not a guaranteed public API. Yahoo may rate-limit, block, change or remove access; intraday history is limited (especially 1m/5m) and symbol coverage is not universal. The BIST symbol catalogue uses StockAnalysis' daily-updated active Borsa Istanbul list; it is a market-discovery list, not an official Borsa Istanbul data feed. If Yahoo returns no data, the app shows the provider error rather than generating fake candles. An optional istfin API key can be configured as a fallback in Settings; it requires its own subscription and is not a Matriks subscription.

### Gram gold
The gram-gold chart is calculated from Yahoo Finance `GC=F` (COMEX gold futures, USD per troy ounce) and `USDTRY=X` (USD/TRY), using `(gold ounce × USD/TRY) ÷ 31.1034768`. This is a derived reference, not a physical jeweller/bank buy-sell quote; local premiums, spreads and costs are excluded.

## Chart engine
The chart renderer is [TradingView Lightweight Charts™](https://tradingview.github.io/lightweight-charts/), an open-source charting library. Its pinned standalone bundle is downloaded during APK build and packaged into the app's local assets, so the chart engine itself is not fetched at launch. The UI, feed adapters, indicator calculations, drawing tools and local layout persistence are implemented in BYBORA Market Desk. The library itself does not provide market data; BYBORA fetches it from the providers noted above.

## Build
The GitHub Actions workflow `.github/workflows/android-apk.yml` builds an installable debug-signed APK whenever the Android project or bundled terminal files change. It uploads the APK as an Actions artifact and attaches it to a GitHub Release. The workflow caches the debug signing key so future updates use the same signature.

## Install
Download the APK on Android, open it, and allow installation from the browser or file manager when prompted.

Minimum Android version: Android 7.0 (API 24). Keep Android System WebView or Chrome up to date. Internet is required for market data. The chart engine is bundled in the APK. No chart provider opens in an external app or browser.


### Forex and commodities
The app includes Yahoo Finance FX symbols such as `USDTRY=X`, `EURTRY=X`, `EURUSD=X`, and `GBPUSD=X`, plus continuous commodity futures such as Brent `BZ=F`, WTI `CL=F`, gold `GC=F`, silver `SI=F`, copper `HG=F`, platinum `PL=F`, palladium `PA=F`, and natural gas `NG=F`. These are Yahoo Finance reference feeds; futures are not physical spot/dealer quotes and availability/intraday history can vary by symbol.

### Chart range levels
The main chart shows the highest high, lowest low and average typical price of the currently visible candle range. The average is the mean of each candle's `(high + low + close) / 3`. These recalculate when symbol, timeframe, or visible chart range changes. Watchlist quote typography uses a lighter font weight.


### Market indices
Nasdaq Composite (`^IXIC`), S&P 500 (`^GSPC`) and ICE US Dollar Index / DXY (`DX-Y.NYB`) are included through Yahoo Finance chart data. Yahoo's Nasdaq Composite reference is delayed; other index availability and delay can vary by feed.

### Price alerts and Android notifications
One-shot above/below price alerts can be created for the currently selected instrument. Alerts are stored locally, checked about every 20 seconds while the app is in the foreground, and use the native Android notification channel after notification permission is granted. The app does not include a persistent background monitoring service, so alerts are not guaranteed while the app is backgrounded or closed.
