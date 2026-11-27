(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const BINANCE = "https://data-api.binance.vision/api/v3";
  const BINANCE_FUTURES = "https://fapi.binance.com";
  const OKX = "https://www.okx.com";
  const STOCK_ANALYSIS = "https://stockanalysis.com/list/borsa-istanbul/";
  const YAHOO = "https://query1.finance.yahoo.com/v8/finance/chart";
  const ISTFIN = "https://api.istfin.com/v1";
  const ISTFIN_KEY = "bybora_istfin_key_v1";
  const MACD_KEY = "bybora_macd_params_v1";
  const MACD_MIGRATION_KEY = "bybora_macd175_migrated_symbols_v1";
  const STUDY_MIGRATION_KEY = "bybora_study_catalog_migrated_v2";
  const OVERLAY_STUDY_MIGRATION_KEY = "bybora_sma_bb_default_migrated_v1";
  const STOCH_RSI_KEY = "bybora_stochrsi_params_v1";
  const OVERLAY_PARAMS_KEY = "bybora_overlay_params_v1";
  const MARKET_CATALOG_KEY = "bybora_market_catalogs_v2";
  const MARKET_CATALOG_TTL = 12 * 60 * 60 * 1000;
  const ALERTS_KEY = "bybora_price_alerts_v1";
  const WATCH_KEY = "bybora_watchlist_v3";
  const WATCH_ORDER_KEY = "bybora_watchlist_order_controls_v1";
  const WORKSPACES_KEY = "bybora_chart_workspaces_v1";
  const LAYOUT_KEY = "bybora_layouts_v3";
  const TROY_OUNCE_GRAMS = 31.1034768;

  const symbols = [
    {id:"BINANCE:BTCUSDT", ticker:"BTCUSDT", name:"Bitcoin / Tether", exchange:"BINANCE", type:"crypto", pair:"BTCUSDT", currency:"USDT", decimals:2},
    {id:"BINANCE:ETHUSDT", ticker:"ETHUSDT", name:"Ethereum / Tether", exchange:"BINANCE", type:"crypto", pair:"ETHUSDT", currency:"USDT", decimals:2},
    {id:"BINANCE:SOLUSDT", ticker:"SOLUSDT", name:"Solana / Tether", exchange:"BINANCE", type:"crypto", pair:"SOLUSDT", currency:"USDT", decimals:3},
    {id:"BINANCE:XRPUSDT", ticker:"XRPUSDT", name:"XRP / Tether", exchange:"BINANCE", type:"crypto", pair:"XRPUSDT", currency:"USDT", decimals:4},
    {id:"BINANCE:BNBUSDT", ticker:"BNBUSDT", name:"BNB / Tether", exchange:"BINANCE", type:"crypto", pair:"BNBUSDT", currency:"USDT", decimals:2},
    {id:"BINANCE:DOGEUSDT", ticker:"DOGEUSDT", name:"Dogecoin / Tether", exchange:"BINANCE", type:"crypto", pair:"DOGEUSDT", currency:"USDT", decimals:5},
    {id:"GOLD:GRAM_TRY", ticker:"GRAM ALTIN", name:"Gram Altın · PAXG/TRY referansı", exchange:"BINANCE", type:"gold", pair:"PAXGTRY", currency:"TRY", decimals:2},
    {id:"BIST:PETKM", ticker:"PETKM", name:"Petkim Petrokimya Holding", exchange:"BIST", type:"bist", pair:"PETKM", currency:"TRY", decimals:2},
    {id:"BIST:XU100", ticker:"XU100", name:"BIST 100", exchange:"BIST", type:"bist", pair:"XU100", currency:"TRY", decimals:2},
    {id:"BIST:XU030", ticker:"XU030", name:"BIST 30", exchange:"BIST", type:"bist", pair:"XU030", currency:"TRY", decimals:2},
    {id:"BIST:THYAO", ticker:"THYAO", name:"Türk Hava Yolları", exchange:"BIST", type:"bist", pair:"THYAO", currency:"TRY", decimals:2},
    {id:"BIST:ASELS", ticker:"ASELS", name:"Aselsan", exchange:"BIST", type:"bist", pair:"ASELS", currency:"TRY", decimals:2},
    {id:"BIST:TUPRS", ticker:"TUPRS", name:"Tüpraş", exchange:"BIST", type:"bist", pair:"TUPRS", currency:"TRY", decimals:2},
    {id:"BIST:EREGL", ticker:"EREGL", name:"Ereğli Demir Çelik", exchange:"BIST", type:"bist", pair:"EREGL", currency:"TRY", decimals:2},
    {id:"BIST:AKBNK", ticker:"AKBNK", name:"Akbank", exchange:"BIST", type:"bist", pair:"AKBNK", currency:"TRY", decimals:2},
    {id:"BIST:SISE", ticker:"SISE", name:"Şişecam", exchange:"BIST", type:"bist", pair:"SISE", currency:"TRY", decimals:2}
  ];


  const yahooMarketSymbols = [
    ["EURUSD=X","EURUSD","Euro / ABD Doları","USD","forex",5],
    ["GBPUSD=X","GBPUSD","İngiliz Sterlini / ABD Doları","USD","forex",5],
    ["USDJPY=X","USDJPY","ABD Doları / Japon Yeni","JPY","forex",3],
    ["USDCHF=X","USDCHF","ABD Doları / İsviçre Frangı","CHF","forex",5],
    ["USDCAD=X","USDCAD","ABD Doları / Kanada Doları","CAD","forex",5],
    ["AUDUSD=X","AUDUSD","Avustralya Doları / ABD Doları","USD","forex",5],
    ["NZDUSD=X","NZDUSD","Yeni Zelanda Doları / ABD Doları","USD","forex",5],
    ["USDTRY=X","USDTRY","ABD Doları / Türk Lirası","TRY","forex",4],
    ["EURTRY=X","EURTRY","Euro / Türk Lirası","TRY","forex",4],
    ["GBPTRY=X","GBPTRY","Sterlin / Türk Lirası","TRY","forex",4],
    ["CHFTRY=X","CHFTRY","İsviçre Frangı / Türk Lirası","TRY","forex",4],
    ["JPYTRY=X","JPYTRY","Japon Yeni / Türk Lirası","TRY","forex",5],
    ["EURJPY=X","EURJPY","Euro / Japon Yeni","JPY","forex",3],
    ["GBPJPY=X","GBPJPY","Sterlin / Japon Yeni","JPY","forex",3],
    ["EURGBP=X","EURGBP","Euro / Sterlin","GBP","forex",5],
    ["EURCHF=X","EURCHF","Euro / İsviçre Frangı","CHF","forex",5],
    ["EURCAD=X","EURCAD","Euro / Kanada Doları","CAD","forex",5],
    ["EURAUD=X","EURAUD","Euro / Avustralya Doları","AUD","forex",5],
    ["EURNZD=X","EURNZD","Euro / Yeni Zelanda Doları","NZD","forex",5],
    ["GBPCHF=X","GBPCHF","Sterlin / İsviçre Frangı","CHF","forex",5],
    ["GBPCAD=X","GBPCAD","Sterlin / Kanada Doları","CAD","forex",5],
    ["GBPAUD=X","GBPAUD","Sterlin / Avustralya Doları","AUD","forex",5],
    ["GBPNZD=X","GBPNZD","Sterlin / Yeni Zelanda Doları","NZD","forex",5],
    ["AUDJPY=X","AUDJPY","Avustralya Doları / Japon Yeni","JPY","forex",3],
    ["AUDCAD=X","AUDCAD","Avustralya Doları / Kanada Doları","CAD","forex",5],
    ["AUDCHF=X","AUDCHF","Avustralya Doları / İsviçre Frangı","CHF","forex",5],
    ["AUDNZD=X","AUDNZD","Avustralya Doları / Yeni Zelanda Doları","NZD","forex",5],
    ["CADJPY=X","CADJPY","Kanada Doları / Japon Yeni","JPY","forex",3],
    ["CADCHF=X","CADCHF","Kanada Doları / İsviçre Frangı","CHF","forex",5],
    ["CHFJPY=X","CHFJPY","İsviçre Frangı / Japon Yeni","JPY","forex",3],
    ["NZDJPY=X","NZDJPY","Yeni Zelanda Doları / Japon Yeni","JPY","forex",3],
    ["NZDCAD=X","NZDCAD","Yeni Zelanda Doları / Kanada Doları","CAD","forex",5],
    ["NZDCHF=X","NZDCHF","Yeni Zelanda Doları / İsviçre Frangı","CHF","forex",5],
    ["USDMXN=X","USDMXN","ABD Doları / Meksika Pesosu","MXN","forex",4],
    ["USDCNY=X","USDCNY","ABD Doları / Çin Yuanı","CNY","forex",4],
    ["USDINR=X","USDINR","ABD Doları / Hindistan Rupisi","INR","forex",4],
    ["USDBRL=X","USDBRL","ABD Doları / Brezilya Reali","BRL","forex",4],
    ["USDZAR=X","USDZAR","ABD Doları / Güney Afrika Randı","ZAR","forex",4],
    ["USDSEK=X","USDSEK","ABD Doları / İsveç Kronu","SEK","forex",4],
    ["USDNOK=X","USDNOK","ABD Doları / Norveç Kronu","NOK","forex",4],
    ["USDSGD=X","USDSGD","ABD Doları / Singapur Doları","SGD","forex",4],
    ["USDHKD=X","USDHKD","ABD Doları / Hong Kong Doları","HKD","forex",4],
    ["USDKRW=X","USDKRW","ABD Doları / Güney Kore Wonu","KRW","forex",2],
    ["USDDKK=X","USDDKK","ABD Doları / Danimarka Kronu","DKK","forex",4],
    ["USDPLN=X","USDPLN","ABD Doları / Polonya Zlotisi","PLN","forex",4],
    ["USDRUB=X","USDRUB","ABD Doları / Rus Rublesi","RUB","forex",4],
    ["USDCNH=X","USDCNH","ABD Doları / Offshore Yuan","CNH","forex",4],
    ["BZ=F","BRENT","Brent Ham Petrol Vadeli","USD","commodity",2],
    ["CL=F","WTI","WTI Ham Petrol Vadeli","USD","commodity",2],
    ["NG=F","NATGAS","Doğal Gaz Vadeli","USD","commodity",3],
    ["GC=F","GOLD","COMEX Altın Vadeli","USD","commodity",2],
    ["SI=F","SILVER","COMEX Gümüş Vadeli","USD","commodity",3],
    ["HG=F","COPPER","COMEX Bakır Vadeli","USD","commodity",3],
    ["PL=F","PLATINUM","Platin Vadeli","USD","commodity",2],
    ["PA=F","PALLADIUM","Paladyum Vadeli","USD","commodity",2],
    ["ALI=F","ALUMINUM","Alüminyum Vadeli","USD","commodity",2],
    ["HO=F","HEATINGOIL","Kalorifer Yakıtı Vadeli","USD","commodity",3],
    ["RB=F","GASOLINE","RBOB Benzin Vadeli","USD","commodity",3],
    ["ZC=F","CORN","Mısır Vadeli","USD","commodity",2],
    ["ZW=F","WHEAT","Buğday Vadeli","USD","commodity",2],
    ["ZS=F","SOYBEAN","Soya Fasulyesi Vadeli","USD","commodity",2],
    ["KC=F","COFFEE","Kahve Vadeli","USD","commodity",2],
    ["CC=F","COCOA","Kakao Vadeli","USD","commodity",2],
    ["SB=F","SUGAR","Şeker Vadeli","USD","commodity",3],
    ["CT=F","COTTON","Pamuk Vadeli","USD","commodity",3],
    ["LE=F","LIVE CATTLE","Canlı Sığır Vadeli","USD","commodity",2],
    ["HE=F","LEAN HOGS","Yağsız Domuz Eti Vadeli","USD","commodity",2]
  ].map(([pair,ticker,name,currency,type,decimals]) => ({
    id:"YAHOO:"+pair,ticker,name,exchange:type==="forex"?"FOREX":"FUTURES",
    type,provider:"yahoo",pair,currency,decimals
  }));
  symbols.push(...yahooMarketSymbols);
  symbols.push({id:"YAHOO:BZF27.NYM",ticker:"BRENT-JAN27",name:"Brent Petrol · Ocak 2027 Vadeli (~94 USD referansı)",exchange:"NYMEX",type:"commodity",provider:"yahoo",pair:"BZF27.NYM",currency:"USD",decimals:2});
  const yahooIndexSymbols=[
    {id:"YAHOO:^IXIC",ticker:"NASDAQ",name:"NASDAQ Composite",exchange:"NASDAQ",type:"index",provider:"yahoo",pair:"^IXIC",currency:"USD",decimals:2},
    {id:"YAHOO:^GSPC",ticker:"SP500",name:"S&P 500",exchange:"S&P",type:"index",provider:"yahoo",pair:"^GSPC",currency:"USD",decimals:2},
    {id:"YAHOO:DX-Y.NYB",ticker:"DXY",name:"US Dollar Index (DXY)",exchange:"ICE",type:"index",provider:"yahoo",pair:"DX-Y.NYB",currency:"USD",decimals:2}
  ];
  symbols.push(...yahooIndexSymbols);

  const intervals = ["1m","5m","15m","30m","1h","4h","1d","1w","1M"];
  const intervalIstfin = {"1m":"1m","5m":"5m","15m":"15m","30m":"30m","1h":"1h","4h":"4h","1d":"1d","1w":"1w","1M":"1mo"};
  const intervalBinance = {"1m":"1m","5m":"5m","15m":"15m","30m":"30m","1h":"1h","4h":"4h","1d":"1d","1w":"1w","1M":"1M"};
  const studies = [
    {id:"EMA20",label:"EMA 20",type:"overlay"},
    {id:"EMA50",label:"EMA 50",type:"overlay"},
    {id:"SMA200",label:"SMA 200",type:"overlay"},
    {id:"BB",label:"Bollinger Bands",type:"overlay"},
    {id:"VWAP",label:"VWAP",type:"overlay"},
    {id:"STOCHRSI",label:"Stoch RSI",type:"lower"},
    {id:"MACD",label:"MACD 12 / 175 / 9",type:"lower"},
    {id:"STOCH",label:"Stochastic",type:"lower"}
  ];

  function loadMacdParams(){
    const defaults={fast:97,slow:74,signal:175};
    try{
      const value=JSON.parse(localStorage.getItem(MACD_KEY)||"null");
      const oldDefaults=!value||(Number(value.fast)===12&&Number(value.slow)===175&&Number(value.signal)===9);
      if(oldDefaults){localStorage.setItem(MACD_KEY,JSON.stringify(defaults));return defaults;}
      const bounded=(v,fallback)=>Math.max(1,Math.min(1000,Math.round(Number.isFinite(Number(v))?Number(v):fallback)));
      return {fast:bounded(value.fast,defaults.fast),slow:bounded(value.slow,defaults.slow),signal:bounded(value.signal,defaults.signal)};
    }catch{return defaults;}
  }
  let macdParams=loadMacdParams();

  function loadStochRsiParams(){
    const defaults={rsi:125,stoch:54,k:4,d:324};
    try{
      const value=JSON.parse(localStorage.getItem(STOCH_RSI_KEY)||"null");
      const oldDefaults=!value||(Number(value.rsi)===14&&Number(value.stoch)===14&&Number(value.k)===3&&Number(value.d)===3);
      if(oldDefaults){localStorage.setItem(STOCH_RSI_KEY,JSON.stringify(defaults));return defaults;}
      const bounded=(v,min,max,fallback)=>Math.max(min,Math.min(max,Math.round(Number.isFinite(Number(v))?Number(v):fallback)));
      return {rsi:bounded(value.rsi,2,500,defaults.rsi),stoch:bounded(value.stoch,2,500,defaults.stoch),k:bounded(value.k,1,200,defaults.k),d:bounded(value.d,1,500,defaults.d)};
    }catch{return defaults;}
  }
  let stochRsiParams=loadStochRsiParams();

  function loadOverlayParams(){
    const defaults={sma:200,bb:20,deviation:2};
    try{
      const value=JSON.parse(localStorage.getItem(OVERLAY_PARAMS_KEY)||"null");
      if(!value)return defaults;
      return {sma:Math.max(2,Math.min(2000,Math.round(Number(value.sma)||defaults.sma))),bb:Math.max(2,Math.min(1000,Math.round(Number(value.bb)||defaults.bb))),deviation:Math.max(.1,Math.min(10,Number(value.deviation)||defaults.deviation))};
    }catch{return defaults;}
  }
  let overlayParams=loadOverlayParams();

    let marketCatalogPromise=null,marketCatalogLoaded=false,watchQuoteBusy=false,watchQuoteTimer=null,candleCountdownTimer=null;

  let activeSymbol = "BINANCE:BTCUSDT";
  let activeInterval = "15m";
  let chartType = "candles";
  let activeStudies = loadStudies(activeSymbol);
  let watchlist = loadWatchlist();
  let layouts = loadLayouts();
  let chart = null;
  let candleSeries = null;
  let volumeSeries = null;
  let lineSeries = null;
  let overlaySeries = [];
  let lowerCharts = [];
  let syncingTimeScales = false;
  let bars = [];
  let drawingLines = [];
  let drawingSeriesRuntime = [];
  let drawingMode = null;
  let firstDrawPoint = null;
  let quoteTimer = null;
  let refreshTimer = null;
  let toastTimer = null;
  let activeFilter = "all";
  let priceAlerts = loadPriceAlerts();
  let alertPollBusy = false;
  let alertPollTimer = null;
  let isLoading = false;
  let pendingReload = false;
  let symbolSearchTimer = null;
  let searchRequestId = 0;
  const binanceLiveQuotes = new Map();
  let binanceMarketSocket = null;
  let binanceWantedStreams = new Set();
  let binanceActiveStreams = new Set();
  let binanceSocketReconnectTimer = null;
  let binanceSocketRotationTimer = null;
  let binanceSocketRetryDelay = 1000;
  let binanceSocketRequestId = 1;
  let binanceSocketLastMessageAt = 0;

  function instrument(id = activeSymbol) {
    return symbols.find(s => s.id === id) || null;
  }

  function ensureInstrument(id,remote=null){
    const existing=instrument(id);if(existing)return existing;
    if(id.startsWith("BINANCE-FUTURES:")){
      const pair=id.slice("BINANCE-FUTURES:".length).toUpperCase();if(!/^[A-Z0-9]{4,24}$/.test(pair))return null;
      const item={id,ticker:pair,name:remote?.name||pair.replace(/USDT$/," / USDT")+" Perpetual",exchange:"BINANCE PERP",type:"crypto",provider:"binanceFutures",pair,currency:"USDT",decimals:8};symbols.push(item);return item;
    }
    if(id.startsWith("OKX:")){
      const instId=id.slice(4).toUpperCase();if(!/^[A-Z0-9]+-[A-Z0-9]+(-SWAP)?$/.test(instId))return null;
      const parts=instId.split("-"),isSwap=instId.endsWith("-SWAP");
      const item={id,ticker:parts[0]+parts[1],name:remote?.name||parts[0]+"/"+parts[1]+(isSwap?" Perpetual":""),exchange:isSwap?"OKX PERP":"OKX SPOT",type:"crypto",provider:isSwap?"okxSwap":"okxSpot",pair:instId,currency:parts[1]||"USDT",decimals:8};symbols.push(item);return item;
    }
    if(id.startsWith("BINANCE:")){
      const pair=id.slice("BINANCE:".length).toUpperCase();if(!/^[A-Z0-9]{4,24}$/.test(pair))return null;
      const item={id,ticker:pair,name:remote?.name||pair.replace(/(USDT|USDC|BTC|ETH|TRY)$/," / $1"),exchange:"BINANCE SPOT",type:"crypto",provider:"binanceSpot",pair,currency:pair.endsWith("TRY")?"TRY":pair.endsWith("USDC")?"USDC":pair.endsWith("BTC")?"BTC":"USDT",decimals:remote?.pricePrecision||6};symbols.push(item);return item;
    }
    if(id.startsWith("YAHOO:")){
      const pair=id.slice("YAHOO:".length).toUpperCase();
      if(!/^[A-Z0-9.^_-]+(=X|=F|\.NYM)$/.test(pair))return null;
      const forex=pair.endsWith("=X"),raw=forex?pair.slice(0,-2):pair;
      const item={id,ticker:remote?.ticker||raw,name:remote?.name||(forex?raw.slice(0,3)+" / "+raw.slice(3):"Emtia · "+raw),exchange:forex?"FOREX":pair.endsWith(".NYM")?"NYMEX":"FUTURES",type:forex?"forex":"commodity",provider:"yahoo",pair,currency:forex?raw.slice(3):"USD",decimals:forex?(raw.endsWith("JPY")?3:4):2};
      symbols.push(item);return item;
    }
    if(id.startsWith("BIST:")){
      const ticker=id.slice("BIST:".length).toUpperCase();if(!/^[A-Z0-9]{3,8}$/.test(ticker))return null;
      const item={id,ticker,name:remote?.name||ticker,exchange:"BIST",type:"bist",provider:"yahoo",pair:ticker,currency:"TRY",decimals:2};symbols.push(item);return item;
    }
    return null;
  }
  function registerMarketSymbols(items){
    for(const item of items){if(!item?.id)continue;const i=symbols.findIndex(s=>s.id===item.id);if(i>=0)symbols[i]={...symbols[i],...item};else symbols.push(item);}
  }

    function loadWatchlist() {
    try {
      const v = JSON.parse(localStorage.getItem(WATCH_KEY) || "null");
      if (!Array.isArray(v)) return ["BINANCE:BTCUSDT","GOLD:GRAM_TRY","BIST:PETKM","BIST:XU100","BINANCE:ETHUSDT"];
      return [...new Set(v.filter(id => !!ensureInstrument(id)))];
    } catch {
      return ["BINANCE:BTCUSDT","GOLD:GRAM_TRY","BIST:PETKM","BIST:XU100","BINANCE:ETHUSDT"];
    }
  }

  function saveWatchlist() {
    try { localStorage.setItem(WATCH_KEY, JSON.stringify(watchlist)); } catch {}
  }

  function loadStudies(symbol){
    const defaults=["EMA20","EMA50","STOCHRSI","MACD","SMA200","BB"];
    try{
      const storageKey="bybora_studies_"+symbol;
      const value=JSON.parse(localStorage.getItem(storageKey)||"null");
      let selected=Array.isArray(value)?[...new Set(value.map(id=>id==="RSI14"?"STOCHRSI":id).filter(id=>studies.some(s=>s.id===id)))]:defaults.slice();
      let migrated=[];try{migrated=JSON.parse(localStorage.getItem(STUDY_MIGRATION_KEY)||"[]");}catch{}
      if(!Array.isArray(migrated))migrated=[];
      if(!migrated.includes(symbol)){
        if(!selected.includes("MACD"))selected.push("MACD");
        if(!selected.includes("STOCHRSI"))selected.push("STOCHRSI");
        localStorage.setItem(storageKey,JSON.stringify(selected));
        migrated.push(symbol);localStorage.setItem(STUDY_MIGRATION_KEY,JSON.stringify(migrated));
      }
      let overlayMigrated=[];try{overlayMigrated=JSON.parse(localStorage.getItem(OVERLAY_STUDY_MIGRATION_KEY)||"[]");}catch{}
      if(!Array.isArray(overlayMigrated))overlayMigrated=[];
      if(!overlayMigrated.includes(symbol)){
        if(!selected.includes("SMA200"))selected.push("SMA200");
        if(!selected.includes("BB"))selected.push("BB");
        localStorage.setItem(storageKey,JSON.stringify(selected));
        overlayMigrated.push(symbol);localStorage.setItem(OVERLAY_STUDY_MIGRATION_KEY,JSON.stringify(overlayMigrated));
      }
      return selected;
    }catch{return defaults.slice();}
  }

    function saveStudies() {
    try { localStorage.setItem("bybora_studies_" + activeSymbol, JSON.stringify(activeStudies)); } catch {}
  }

  function loadDrawings(symbol) {
    try {
      const v = JSON.parse(localStorage.getItem("bybora_drawings_" + symbol) || "[]");
      return Array.isArray(v) ? v : [];
    } catch { return []; }
  }

  function serializableDrawings() {
    return drawingLines.map(d => {
      const copy = {...d};
      delete copy._runtimeId;
      return copy;
    });
  }

  function saveDrawings() {
    try { localStorage.setItem("bybora_drawings_" + activeSymbol, JSON.stringify(serializableDrawings())); } catch {}
  }

  function activePriceSeries() {
    return candleSeries || lineSeries;
  }

  function clearDrawingRuntime() {
    for (const s of drawingSeriesRuntime) {
      try { if (chart) chart.removeSeries(s); } catch {}
    }
    drawingSeriesRuntime = [];
  }

  function loadLayouts() {
    try {
      const v = JSON.parse(localStorage.getItem(LAYOUT_KEY) || "[]");
      return Array.isArray(v) ? v.filter(x => x && x.name && x.symbol && Array.isArray(x.studies)).slice(0,40) : [];
    } catch { return []; }
  }

  function saveLayouts() {
    try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(layouts)); } catch {}
  }

  function rangeStorageKey(symbol = activeSymbol, interval = activeInterval) {
    return "bybora_visible_range_" + symbol + "_" + interval;
  }

  function readSavedRange(symbol = activeSymbol, interval = activeInterval) {
    try {
      const saved = JSON.parse(localStorage.getItem(rangeStorageKey(symbol, interval)) || "null");
      if (saved && Number.isFinite(saved.from) && Number.isFinite(saved.to) && saved.from < saved.to) return saved;
    } catch {}
    return null;
  }

  function saveVisibleRange(range) {
    if (!range || !Number.isFinite(range.from) || !Number.isFinite(range.to) || range.from >= range.to) return;
    try { localStorage.setItem(rangeStorageKey(), JSON.stringify(range)); } catch {}
  }

  function getIstfinKey() {
    try { return localStorage.getItem(ISTFIN_KEY) || ""; } catch { return ""; }
  }

  function setMessage(title, text, action = false) {
    $("chartMessageTitle").textContent = title;
    $("chartMessageText").textContent = text;
    $("chartMessageAction").hidden = !action;
    $("chartOverlay").classList.remove("transparent");
    $("chartOverlay").hidden = false;
  }

  function hideMessage() {
    $("chartOverlay").hidden = true;
  }

  function setStatus(text, level = "idle") {
    $("connectionText").textContent = text.toLocaleUpperCase("tr-TR");
    $("connectionLamp").className = "connection-lamp" + (level === "good" ? " good" : level === "warn" ? " warn" : "");
    $("chartStatusText").textContent = text.toLocaleUpperCase("tr-TR");
    $("chartLiveStatus").classList.toggle("ready", level === "good");
  }

  function toast(message) {
    const node = $("toast");
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove("show"), 2600);
  }

  function fmtPrice(value, decimals = 2) {
    if (!Number.isFinite(value)) return "—";
    return new Intl.NumberFormat("tr-TR", {minimumFractionDigits:decimals,maximumFractionDigits:decimals}).format(value);
  }

  function fmtCompact(value) {
    if (!Number.isFinite(value)) return "—";
    return new Intl.NumberFormat("tr-TR", {notation:"compact",maximumFractionDigits:2}).format(value);
  }

  function fmtTime(date = new Date()) {
    return new Intl.DateTimeFormat("tr-TR",{timeZone:"Europe/Istanbul",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(date) + " TRT";
  }

  function resolveSymbol(query){
    const q=String(query||"").trim().toLocaleLowerCase("tr-TR"),compact=q.toUpperCase().replace(/\s+/g,"");
    const direct=symbols.find(s=>s.id.toLocaleLowerCase("tr-TR")===q||s.ticker.toLocaleLowerCase("tr-TR")===q||s.name.toLocaleLowerCase("tr-TR")===q||s.pair?.toLocaleLowerCase("tr-TR")===q);
    if(direct)return direct.id;
    const aliases={"petkim":"BIST:PETKM","petkm":"BIST:PETKM","gram altın":"GOLD:GRAM_TRY","gram altin":"GOLD:GRAM_TRY","xautryg":"GOLD:GRAM_TRY","paxgtry":"GOLD:GRAM_TRY","paxg/try":"GOLD:GRAM_TRY","gau/try":"GOLD:GRAM_TRY","xu100":"BIST:XU100","bist100":"BIST:XU100","bist 100":"BIST:XU100","bitcoin":"BINANCE:BTCUSDT","btc":"BINANCE:BTCUSDT","btc/usdt":"BINANCE:BTCUSDT","ethereum":"BINANCE:ETHUSDT","eth":"BINANCE:ETHUSDT"};
    const yahooAliases={
      "nasdaq":"YAHOO:^IXIC","nasdaq composite":"YAHOO:^IXIC","^ixic":"YAHOO:^IXIC",
      "sp500":"YAHOO:^GSPC","s&p 500":"YAHOO:^GSPC","s p 500":"YAHOO:^GSPC","^gspc":"YAHOO:^GSPC",
      "dxy":"YAHOO:DX-Y.NYB","dollar index":"YAHOO:DX-Y.NYB","us dollar index":"YAHOO:DX-Y.NYB",
      "brent":"YAHOO:BZ=F","brent petrol":"YAHOO:BZ=F","uk oil":"YAHOO:BZ=F","ukoil":"YAHOO:BZ=F",
      "wti":"YAHOO:CL=F","crude oil":"YAHOO:CL=F","us oil":"YAHOO:CL=F","usoil":"YAHOO:CL=F",
      "silver":"YAHOO:SI=F","gümüş":"YAHOO:SI=F","gumus":"YAHOO:SI=F","xagusd":"YAHOO:SI=F",
      "xauusd":"YAHOO:GC=F","ons altın":"YAHOO:GC=F","gold":"YAHOO:GC=F",
      "copper":"YAHOO:HG=F","bakır":"YAHOO:HG=F","bakir":"YAHOO:HG=F","xcuusd":"YAHOO:HG=F",
      "gold futures":"YAHOO:GC=F","ons altın":"YAHOO:GC=F","platinum":"YAHOO:PL=F","platin":"YAHOO:PL=F",
      "palladium":"YAHOO:PA=F","paladyum":"YAHOO:PA=F","natural gas":"YAHOO:NG=F","doğal gaz":"YAHOO:NG=F","dogal gaz":"YAHOO:NG=F",
      "usdtry":"YAHOO:USDTRY=X","usd/try":"YAHOO:USDTRY=X","eurtry":"YAHOO:EURTRY=X","eur/try":"YAHOO:EURTRY=X",
      "gbptry":"YAHOO:GBPTRY=X","gbp/try":"YAHOO:GBPTRY=X","eurusd":"YAHOO:EURUSD=X","eur/usd":"YAHOO:EURUSD=X"
    };
    yahooAliases["brent jan27"]="YAHOO:BZF27.NYM";yahooAliases["brent 94"]="YAHOO:BZF27.NYM";yahooAliases["brent petrol 94"]="YAHOO:BZF27.NYM";
    if(yahooAliases[q])return yahooAliases[q];
    const match=symbols.find(s=>s.ticker.toUpperCase()===compact||s.pair?.toUpperCase()===compact);
    if(match)return match.id;
    if(/^BIST:[A-Z0-9]{3,8}$/.test(compact)||/^BINANCE:[A-Z0-9]{4,24}$/.test(compact)||/^BINANCE-FUTURES:[A-Z0-9]{4,24}$/.test(compact)||/^OKX:[A-Z0-9]+-[A-Z0-9]+(-SWAP)?$/.test(compact))return compact;
    if(/^[A-Z0-9.^_-]+(=X|=F)$/.test(compact)){const id="YAHOO:"+compact;return ensureInstrument(id)?id:null;}
    if(/^[A-Z]{6}$/.test(compact)){
      const currencies=new Set(["USD","EUR","GBP","JPY","CHF","CAD","AUD","NZD","TRY","CNY","CNH","HKD","SGD","SEK","NOK","DKK","PLN","MXN","ZAR","INR","KRW","BRL","RUB","THB"]);
      if(currencies.has(compact.slice(0,3))&&currencies.has(compact.slice(3))){const id="YAHOO:"+compact+"=X";return ensureInstrument(id)?id:null;}
    }
    if(/^[A-Z0-9]{2,18}USDT$/.test(compact))return "BINANCE:"+compact;
    if(/^[A-Z0-9]{3,8}$/.test(compact))return "BIST:"+compact;
    return null;
  }

  async function fetchBinanceSpotCatalog(){
    const response=await fetch(BINANCE+"/exchangeInfo?permissions=SPOT",{cache:"no-store"});if(!response.ok)throw new Error("Binance spot sembol kataloğu alınamadı.");
    const body=await response.json();
    return (body.symbols||[]).filter(s=>s.status==="TRADING"&&s.symbol).map(s=>({id:"BINANCE:"+s.symbol,ticker:s.symbol,name:(s.baseAsset||"")+"/"+(s.quoteAsset||"")+" · Spot",exchange:"BINANCE SPOT",type:"crypto",provider:"binanceSpot",pair:s.symbol,currency:s.quoteAsset||"USDT",decimals:Number(s.quotePrecision)||8,baseAsset:s.baseAsset,quoteAsset:s.quoteAsset}));
  }
  async function fetchBinanceFuturesCatalog(){
    const response=await fetch(BINANCE_FUTURES+"/fapi/v1/exchangeInfo",{cache:"no-store"});if(!response.ok)throw new Error("Binance vadeli sembol kataloğu alınamadı.");
    const body=await response.json();
    return (body.symbols||[]).filter(s=>s.status==="TRADING"&&s.contractType==="PERPETUAL"&&s.symbol).map(s=>({id:"BINANCE-FUTURES:"+s.symbol,ticker:s.symbol,name:(s.baseAsset||"")+"/"+(s.quoteAsset||"USDT")+" · Perpetual",exchange:"BINANCE PERP",type:"crypto",provider:"binanceFutures",pair:s.symbol,currency:s.quoteAsset||"USDT",decimals:Number(s.pricePrecision)||8,baseAsset:s.baseAsset,quoteAsset:s.quoteAsset}));
  }
  async function fetchOkxCatalog(instType){
    const url=new URL(OKX+"/api/v5/public/instruments");url.searchParams.set("instType",instType);
    const response=await fetch(url.toString(),{cache:"no-store"});if(!response.ok)throw new Error("OKX "+instType+" kataloğu alınamadı.");
    const body=await response.json();if(body.code!=="0")throw new Error(body.msg||"OKX sembol listesi alınamadı.");
    return (body.data||[]).filter(s=>s.state==="live"&&s.instId).map(s=>{
      const swap=instType==="SWAP",quote=s.quoteCcy||s.settleCcy||"",base=s.baseCcy||s.instId.split("-")[0];
      return {id:"OKX:"+s.instId,ticker:base+quote,name:base+"/"+quote+(swap?" · Perpetual":" · Spot"),exchange:swap?"OKX PERP":"OKX SPOT",type:"crypto",provider:swap?"okxSwap":"okxSpot",pair:s.instId,currency:quote,decimals:8,baseAsset:base,quoteAsset:quote};
    });
  }
  async function fetchBistCatalog(){
    const response=await fetch(STOCK_ANALYSIS,{cache:"no-store",headers:{Accept:"text/html,application/xhtml+xml"}});
    if(!response.ok)throw new Error("BIST sembol kataloğu alınamadı.");
    const markup=await response.text(),doc=new DOMParser().parseFromString(markup,"text/html"),found=new Map();
    for(const row of Array.from(doc.querySelectorAll("table tbody tr"))){
      const cells=Array.from(row.querySelectorAll("td")),links=Array.from(row.querySelectorAll("a"));
      const symbolLink=links.find(a=>/^[A-Z0-9]{3,8}$/.test((a.textContent||"").trim().toUpperCase()));
      const ticker=(symbolLink?.textContent||cells[1]?.textContent||"").trim().toUpperCase();
      if(!/^[A-Z0-9]{3,8}$/.test(ticker))continue;
      found.set(ticker,{id:"BIST:"+ticker,ticker,name:(cells[2]?.textContent||ticker).trim(),exchange:"BIST",type:"bist",provider:"yahoo",pair:ticker,currency:"TRY",decimals:2});
    }
    if(!found.size)throw new Error("BIST sembol tablosu çözümlenemedi.");return [...found.values()];
  }
  function cacheCatalogs(items){
    try{localStorage.setItem(MARKET_CATALOG_KEY,JSON.stringify({updatedAt:Date.now(),items:items.map(s=>({id:s.id,ticker:s.ticker,name:s.name,exchange:s.exchange,type:s.type,provider:s.provider,pair:s.pair,currency:s.currency,decimals:s.decimals,baseAsset:s.baseAsset,quoteAsset:s.quoteAsset}))}));}catch{}
  }
  async function loadMarketCatalogs(){
    if(marketCatalogLoaded)return;if(marketCatalogPromise)return marketCatalogPromise;
    marketCatalogPromise=(async()=>{
      let cache=null;try{cache=JSON.parse(localStorage.getItem(MARKET_CATALOG_KEY)||"null");}catch{}
      if(Array.isArray(cache?.items)&&cache.items.length)registerMarketSymbols(cache.items);
      if(cache?.updatedAt&&Date.now()-cache.updatedAt<MARKET_CATALOG_TTL){marketCatalogLoaded=true;return;}
      const results=await Promise.allSettled([fetchBinanceSpotCatalog(),fetchBinanceFuturesCatalog(),fetchOkxCatalog("SPOT"),fetchOkxCatalog("SWAP"),fetchBistCatalog()]);
      const items=[];results.forEach(r=>{if(r.status==="fulfilled")items.push(...r.value);});
      if(items.length){registerMarketSymbols(items);cacheCatalogs(symbols.filter(s=>s.provider||s.type==="bist"));}
      marketCatalogLoaded=true;
    })().finally(()=>{marketCatalogPromise=null;});return marketCatalogPromise;
  }
  function symbolMatches(s,q){return (s.ticker+" "+s.name+" "+s.id+" "+(s.pair||"")).toLocaleLowerCase("tr-TR").includes(q);}
  

    function createChartIfNeeded() {
    if (chart) return true;
    if (!window.LightweightCharts) return false;
    const L = window.LightweightCharts;
    const host = $("priceChart");
    chart = L.createChart(host, {
      autoSize: true,
      layout: {
        background: {type:L.ColorType.Solid,color:"#070a0f"},
        textColor:"#91a3ba",
        fontFamily:"DM Sans, sans-serif",
        fontSize:10
      },
      grid: {
        vertLines:{color:"rgba(132,157,188,.065)"},
        horzLines:{color:"rgba(132,157,188,.085)"}
      },
      crosshair: {
        mode:L.CrosshairMode.Normal,
        vertLine:{color:"rgba(113,177,221,.38)",width:1,style:L.LineStyle.Dashed,labelBackgroundColor:"#25435f"},
        horzLine:{color:"rgba(113,177,221,.38)",width:1,style:L.LineStyle.Dashed,labelBackgroundColor:"#25435f"}
      },
      rightPriceScale:{borderColor:"rgba(145,170,199,.18)",autoScale:true,minimumWidth:104,scaleMargins:{top:.08,bottom:.18}},
      timeScale:{
        borderColor:"rgba(145,170,199,.18)",timeVisible:true,secondsVisible:false,
        rightOffset:0,barSpacing:7,minBarSpacing:.5,fixLeftEdge:false
      },
      localization:{locale:"tr-TR"}
    });
    chart.timeScale().subscribeVisibleLogicalRangeChange(range => {
      if (!range) return;
      syncRawChartRanges(chart,range);
      if (!isLoading) saveVisibleRange(range);
      updateMarketRangeLevels();
    });
    chart.subscribeClick(onChartClick);
    $("chartOverlay").hidden = true;
    return true;
  }

  // All lower studies share the exact candle timestamps of the main chart.
  // No synthetic lead-in candles or logical-index offsets: this prevents
  // MACD/Stoch RSI from starting a few candles to the left or right.
  function syncRawChartRanges(source,range){
    if(!range||syncingTimeScales)return;
    syncingTimeScales=true;
    try{
      [chart,...lowerCharts].filter(target=>target&&target!==source).forEach(target=>{
        try{target.timeScale().setVisibleLogicalRange({from:range.from,to:range.to});}catch{}
      });
    }finally{syncingTimeScales=false;}
  }
  function alignStudyToMainCandles(points,fallback=50){
    if(!bars.length)return [];
    const byTime=new Map((Array.isArray(points)?points:[]).map(point=>[Number(point.time),point]));
    const fallbackPoint=typeof fallback==="object"&&fallback!==null?fallback:{value:fallback};
    return bars.map(bar=>{
      const point=byTime.get(Number(bar.time));
      if(point&&Number.isFinite(Number(point.value)))return {...point,time:bar.time,value:Number(point.value)};
      return {...fallbackPoint,time:bar.time};
    });
  }

  function mapBinanceInterval(interval) {
    return intervalBinance[interval] || "15m";
  }

  function mapIstfinInterval(interval) {
    return intervalIstfin[interval] || "15m";
  }

  async function fetchBinanceBars(pair, interval) {
    const url = new URL(BINANCE + "/klines");
    url.searchParams.set("symbol", pair);
    url.searchParams.set("interval", mapBinanceInterval(interval));
    url.searchParams.set("limit", "1000");
    const response = await fetch(url.toString(), {cache:"no-store"});
    if (!response.ok) throw new Error("Binance mum verisi alınamadı (" + response.status + ").");
    const raw = await response.json();
    if (!Array.isArray(raw) || !raw.length) throw new Error("Bu Binance paritesi için mum verisi bulunamadı.");
    return raw.map(row => ({
      time:Math.floor(Number(row[0])/1000),
      open:Number(row[1]),high:Number(row[2]),low:Number(row[3]),close:Number(row[4]),
      volume:Number(row[5])||0
    }));
  }

  async function fetchBinanceFuturesBars(pair,interval){
    const url=new URL(BINANCE_FUTURES+"/fapi/v1/klines");url.searchParams.set("symbol",pair);url.searchParams.set("interval",mapBinanceInterval(interval));url.searchParams.set("limit","1000");
    const response=await fetch(url.toString(),{cache:"no-store"});if(!response.ok)throw new Error("Binance vadeli mum verisi alınamadı ("+response.status+").");
    const raw=await response.json();if(!Array.isArray(raw)||!raw.length)throw new Error(pair+" vadeli kontratı için mum bulunamadı.");
    return raw.map(row=>({time:Math.floor(Number(row[0])/1000),open:Number(row[1]),high:Number(row[2]),low:Number(row[3]),close:Number(row[4]),volume:Number(row[5])||0}));
  }
  function mapOkxInterval(interval){return {"1m":"1m","5m":"5m","15m":"15m","30m":"30m","1h":"1H","4h":"4H","1d":"1D","1w":"1W","1M":"1M"}[interval]||"15m";}
  async function fetchOkxBars(instId,interval){
    const url=new URL(OKX+"/api/v5/market/candles");url.searchParams.set("instId",instId);url.searchParams.set("bar",mapOkxInterval(interval));url.searchParams.set("limit","300");
    const response=await fetch(url.toString(),{cache:"no-store"});if(!response.ok)throw new Error("OKX mum verisi alınamadı ("+response.status+").");
    const body=await response.json();if(body.code!=="0")throw new Error(body.msg||"OKX mum verisi bulunamadı.");
    const rows=(body.data||[]).map(row=>({time:Math.floor(Number(row[0])/1000),open:Number(row[1]),high:Number(row[2]),low:Number(row[3]),close:Number(row[4]),volume:Number(row[5])||0})).filter(x=>Number.isFinite(x.time)&&Number.isFinite(x.close)).sort((a,b)=>a.time-b.time);
    if(!rows.length)throw new Error(instId+" için OKX mum verisi bulunamadı.");return rows;
  }

  async function fetchIstfinBars(symbol, interval) {
    const key = getIstfinKey();
    if (!key) {
      const error = new Error("BIST_API_KEY_REQUIRED");
      error.code = "BIST_API_KEY_REQUIRED";
      throw error;
    }
    const url = new URL(ISTFIN + "/bars/" + encodeURIComponent(symbol));
    url.searchParams.set("interval", mapIstfinInterval(interval));
    url.searchParams.set("limit", "1500");
    const response = await fetch(url.toString(), {
      cache:"no-store",
      headers:{Authorization:"Bearer " + key,Accept:"application/json"}
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = body?.error?.message || body?.message || "BIST veri sağlayıcısı yanıt vermedi (" + response.status + ").";
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }
    const data = body.data || [];
    if (!Array.isArray(data) || !data.length) throw new Error("Bu BIST sembolü için seçili zaman diliminde mum bulunamadı.");
    return data.map(row => ({
      time:Number(row.t),
      open:Number(row.o),high:Number(row.h),low:Number(row.l),close:Number(row.c),
      volume:Number(row.v)||0
    })).filter(x => Number.isFinite(x.time) && Number.isFinite(x.close)).sort((a,b)=>a.time-b.time);
  }


  function yahooRequestConfig(interval) {
    const config={
      "1m":{source:"1m",range:"5d"},"5m":{source:"5m",range:"30d"},
      "15m":{source:"15m",range:"60d"},"30m":{source:"15m",range:"60d",bucket:1800},
      "1h":{source:"60m",range:"730d"},"4h":{source:"60m",range:"730d",bucket:14400},
      "1d":{source:"1d",range:"5y"},"1w":{source:"1wk",range:"10y"},"1M":{source:"1mo",range:"max"}
    };
    return config[interval]||config["15m"];
  }
  function aggregateYahooBars(rows,seconds){
    const groups=new Map();
    for(const row of rows){
      const shifted=row.time+3*3600;
      const start=Math.floor(shifted/seconds)*seconds-3*3600;
      const existing=groups.get(start);
      if(!existing)groups.set(start,{...row,time:start});
      else{existing.high=Math.max(existing.high,row.high);existing.low=Math.min(existing.low,row.low);existing.close=row.close;existing.volume+=row.volume||0;}
    }
    return [...groups.values()].sort((a,b)=>a.time-b.time);
  }
  async function fetchYahooBars(ticker,interval){
    const config=yahooRequestConfig(interval);
    const url=new URL(YAHOO+"/"+encodeURIComponent(ticker));
    url.searchParams.set("range",config.range);url.searchParams.set("interval",config.source);url.searchParams.set("events","history");
    const response=await fetch(url.toString(),{cache:"no-store",headers:{Accept:"application/json"}});
    const body=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(body?.chart?.error?.description||"Yahoo Finance yanıt vermedi ("+response.status+").");
    const result=body?.chart?.result?.[0];
    if(!result||!Array.isArray(result.timestamp))throw new Error(body?.chart?.error?.description||ticker+" için Yahoo Finance mum verisi bulunamadı.");
    const q=result.indicators?.quote?.[0]||{},safe=n=>n==null?NaN:Number(n);
    const rows=result.timestamp.map((timestamp,i)=>{
      const close=safe(q.close?.[i]),open=safe(q.open?.[i]),high=safe(q.high?.[i]),low=safe(q.low?.[i]);
      if(!Number.isFinite(timestamp)||!Number.isFinite(close))return null;
      return {time:Number(timestamp),open:Number.isFinite(open)?open:close,high:Number.isFinite(high)?high:close,low:Number.isFinite(low)?low:close,close,volume:safe(q.volume?.[i])||0};
    }).filter(Boolean).sort((a,b)=>a.time-b.time);
    const bars=config.bucket?aggregateYahooBars(rows,config.bucket):rows;
    if(!bars.length)throw new Error(ticker+" için kullanılabilir mum bulunamadı.");
    const meta=result.meta||{},last=bars[bars.length-1],previous=bars.length>1?bars[bars.length-2].close:null;
    const price=safe(meta.regularMarketPrice),prior=safe(meta.chartPreviousClose??meta.previousClose);
    const dayHigh=safe(meta.regularMarketDayHigh),dayLow=safe(meta.regularMarketDayLow),vol=safe(meta.regularMarketVolume);
    const quote={
      lastPrice:String(Number.isFinite(price)?price:last.close),
      highPrice:Number.isFinite(dayHigh)?dayHigh:last.high,lowPrice:Number.isFinite(dayLow)?dayLow:last.low,
      volume:Number.isFinite(vol)?vol:last.volume,
      priceChangePercent:Number.isFinite(price)&&Number.isFinite(prior)&&prior!==0?((price/prior)-1)*100:(previous?((last.close/previous)-1)*100:0)
    };
    return {bars,quote,meta};
  }
  async function fetchYahooGoldBars(interval){
    const [gold,fx]=await Promise.all([fetchYahooBars("GC=F",interval),fetchYahooBars("USDTRY=X",interval)]);
    let fxIndex=0,lastFx=null;const grams=[];
    for(const b of gold.bars){
      while(fxIndex<fx.bars.length&&fx.bars[fxIndex].time<=b.time)lastFx=fx.bars[fxIndex++];
      const f=lastFx||fx.bars[0];if(!f||Math.abs(b.time-f.time)>3*86400)continue;
      grams.push({time:b.time,open:b.open*f.open/TROY_OUNCE_GRAMS,high:b.high*f.high/TROY_OUNCE_GRAMS,low:b.low*f.low/TROY_OUNCE_GRAMS,close:b.close*f.close/TROY_OUNCE_GRAMS,volume:b.volume||0});
    }
    if(!grams.length)throw new Error("Ons altın ve USD/TRY verileri eşleştirilemedi.");
    const last=grams[grams.length-1],prior=grams.length>1?grams[grams.length-2].close:null;
    return {bars:grams,quote:{lastPrice:String(last.close),highPrice:last.high,lowPrice:last.low,volume:last.volume,priceChangePercent:prior?((last.close/prior)-1)*100:0},source:"Yahoo Finance · GC=F × USDTRY=X ÷ 31,1034768",delay:"Hesaplanan gram altın referansı · kuyumcu alış/satış fiyatı değildir"};
  }

  async function fetchQuote(symbol){
    const item=instrument(symbol);if(!item)return null;
    if(item.type==="bist"){
      try{return (await fetchYahooBars(item.ticker+".IS","15m")).quote;}
      catch(yahooError){
        const key=getIstfinKey();if(!key)return null;
        const url=new URL(ISTFIN+"/quotes");url.searchParams.set("symbols",item.pair);
        const response=await fetch(url.toString(),{cache:"no-store",headers:{Authorization:"Bearer "+key,Accept:"application/json"}});
        if(!response.ok)return null;const row=(await response.json()).data?.find(x=>x.symbol===item.pair);if(!row)return null;
        return {lastPrice:String(row.price??row.last??""),highPrice:row.high,lowPrice:row.low,volume:row.volume,priceChangePercent:Number(row.changePercent)||0};
      }
    }
    if(item.type==="gold")return (await fetchYahooGoldBars("15m")).quote;
    if(item.type==="forex"||item.type==="commodity"||item.type==="index")return (await fetchYahooBars(item.pair,"15m")).quote;
    if(item.provider==="okxSpot"||item.provider==="okxSwap"){
      const url=new URL(OKX+"/api/v5/market/ticker");url.searchParams.set("instId",item.pair);
      const response=await fetch(url.toString(),{cache:"no-store"});if(!response.ok)return null;
      const row=(await response.json()).data?.[0];if(!row)return null;
      const last=Number(row.last),open=Number(row.open24h);
      const quoteVolume=Number(row.volCcy24h??row.vol24h);
      return {lastPrice:String(last),highPrice:Number(row.high24h),lowPrice:Number(row.low24h),volume:quoteVolume,quoteVolume,volumeCurrency:item.currency||"",priceChangePercent:open?((last/open)-1)*100:0};
    }
    const base=item.provider==="binanceFutures"?BINANCE_FUTURES+"/fapi/v1/ticker/24hr":BINANCE+"/ticker/24hr";
    const url=new URL(base);url.searchParams.set("symbol",item.pair);
    const response=await fetch(url.toString(),{cache:"no-store"});if(!response.ok)return null;
    const row=await response.json();
    const quoteVolume=Number(row.quoteVolume),baseVolume=Number(row.volume);
    return {lastPrice:row.lastPrice,highPrice:row.highPrice,lowPrice:row.lowPrice,volume:Number.isFinite(quoteVolume)?quoteVolume:baseVolume,quoteVolume:Number.isFinite(quoteVolume)?quoteVolume:null,baseVolume,volumeCurrency:item.currency||"",priceChangePercent:Number(row.priceChangePercent)||0};
  }

  async function getMarketData(item,interval){
    if(item.type==="bist"){
      try{
        const r=await fetchYahooBars(item.ticker+".IS",interval);
        return {bars:r.bars,quote:r.quote,source:"Yahoo Finance · "+item.ticker+".IS",delay:"BIST · Yahoo Finance gecikmeli veri (resmî olmayan endpoint)"};
      }catch(yahooError){
        if(getIstfinKey()){
          const [history,quote]=await Promise.all([fetchIstfinBars(item.pair,interval),fetchQuote(item.id).catch(()=>null)]);
          return {bars:history,quote,source:"istfin API · yedek bağlantı",delay:"BIST · istfin abonelik planına bağlı"};
        }
        throw new Error("Yahoo Finance "+item.ticker+".IS verisini alamadı. "+(yahooError.message||"Bağlantıyı kontrol edip yeniden dene.")+" Yahoo verisi geçici olarak engellenmiş veya limitlenmiş olabilir.");
      }
    }
    if(item.type==="gold")return await fetchYahooGoldBars(interval);
    if(item.type==="index"){
      const r=await fetchYahooBars(item.pair,interval);
      return {bars:r.bars,quote:r.quote,source:"Yahoo Finance · "+item.pair,delay:item.ticker==="NASDAQ"?"NASDAQ Composite · Yahoo GIDS gecikmeli referans veri":"Endeks referans verisi · Yahoo Finance"};
    }
    if(item.type==="forex"||item.type==="commodity"){
      const r=await fetchYahooBars(item.pair,interval);
      return {bars:r.bars,quote:r.quote,source:"Yahoo Finance · "+item.pair,delay:item.type==="forex"?"Forex · Yahoo Finance referans verisi":"Emtia vadeli kontratı · Yahoo Finance referans verisi"};
    }
    const quotePromise=fetchQuote(item.id).catch(()=>null);
    if(item.provider==="binanceFutures"){
      const [history,quote]=await Promise.all([fetchBinanceFuturesBars(item.pair,interval),quotePromise]);
      return {bars:history,quote,source:"Binance USDⓈ-M Perpetual",delay:"Kripto vadeli · gerçek zamanlı"};
    }
    if(item.provider==="okxSpot"||item.provider==="okxSwap"){
      const [history,quote]=await Promise.all([fetchOkxBars(item.pair,interval),quotePromise]);
      return {bars:history,quote,source:item.provider==="okxSwap"?"OKX Perpetual":"OKX Spot",delay:"OKX · gerçek zamanlı"};
    }
    const [history,quote]=await Promise.all([fetchBinanceBars(item.pair,mapChartInterval(item,interval)),quotePromise]);
    return {bars:history,quote,source:"Binance public market data",delay:"Binance spot · gerçek zamanlı"};
  }

    function mapChartInterval(item, interval) {
    if (item.type === "gold") return interval;
    return interval;
  }

  function chartPriceDecimals(item,price){
    if(item?.type==="crypto"&&Number.isFinite(Number(price))&&Number(price)>0&&Number(price)<1)return Math.min(8,Math.max(5,Math.ceil(-Math.log10(Number(price)))+3));
    return Math.max(0,Math.min(8,Math.round(Number(item?.decimals)||2)));
  }

  function ensureMainSeries() {
    if (!chart) return;
    const L = window.LightweightCharts;
    const precision=chartPriceDecimals(instrument(),bars[bars.length-1]?.close);
    const chartPriceFormat={type:"price",precision,minMove:Math.pow(10,-precision)};
    if (candleSeries) { chart.removeSeries(candleSeries); candleSeries = null; }
    if (lineSeries) { chart.removeSeries(lineSeries); lineSeries = null; }
    if (volumeSeries) { chart.removeSeries(volumeSeries); volumeSeries = null; }
    if (chartType === "candles") {
      candleSeries = chart.addSeries(L.CandlestickSeries,{
        upColor:"#28cda0",downColor:"#f06479",
        borderUpColor:"#28cda0",borderDownColor:"#f06479",
        wickUpColor:"#28cda0",wickDownColor:"#f06479",
        priceFormat:chartPriceFormat,priceLineVisible:true,lastValueVisible:true
      });
    } else {
      lineSeries = chart.addSeries(L.LineSeries,{
        color:"#55c9e8",lineWidth:2,priceFormat:chartPriceFormat,priceLineVisible:true,lastValueVisible:true,
        crosshairMarkerVisible:true
      });
    }
    volumeSeries = chart.addSeries(L.HistogramSeries,{
      priceFormat:{type:"volume"},priceScaleId:"volume",lastValueVisible:false,priceLineVisible:false
    });
    volumeSeries.priceScale().applyOptions({scaleMargins:{top:.82,bottom:0},visible:false});
  }

  function clearOverlaySeries() {
    if (!chart) return;
    for (const series of overlaySeries) {
      try { chart.removeSeries(series); } catch {}
    }
    overlaySeries = [];
  }

  function addOverlayLine(data,color,title,width=2,style) {
    if (!chart || !data.length) return null;
    const s = chart.addSeries(window.LightweightCharts.LineSeries,{
      color,lineWidth:width,title,priceLineVisible:false,lastValueVisible:false,
      crosshairMarkerVisible:false,lineStyle:style
    });
    s._byboraTitle=title;
    s.setData(data.filter(p=>Number.isFinite(p.value)));
    overlaySeries.push(s);
    return s;
  }

  function sma(values,period) {
    const out=[];let sum=0;
    for(let i=0;i<values.length;i++){
      sum+=values[i].close;
      if(i>=period)sum-=values[i-period].close;
      if(i>=period-1)out.push({time:values[i].time,value:sum/period});
    }
    return out;
  }

  function ema(values,period) {
    const out=[];const k=2/(period+1);let prev=null;
    for(const row of values){
      prev=prev===null?row.close:row.close*k+prev*(1-k);
      out.push({time:row.time,value:prev});
    }
    return out;
  }

  function bollinger(values,period=20,mult=2) {
    const mid=sma(values,period);const upper=[],lower=[];
    for(let i=period-1;i<values.length;i++){
      const slice=values.slice(i-period+1,i+1);
      const mean=mid[i-period+1].value;
      const variance=slice.reduce((acc,x)=>acc+Math.pow(x.close-mean,2),0)/period;
      const sd=Math.sqrt(variance);
      upper.push({time:values[i].time,value:mean+mult*sd});
      lower.push({time:values[i].time,value:mean-mult*sd});
    }
    return {mid,upper,lower};
  }

  function vwap(values) {
    let pv=0,v=0,session=null;const out=[];
    for(const row of values){
      const key=new Date(row.time*1000).toISOString().slice(0,10);
      if(key!==session){session=key;pv=0;v=0;}
      const volume=row.volume||0;const typical=(row.high+row.low+row.close)/3;
      pv+=typical*volume;v+=volume;
      if(v>0)out.push({time:row.time,value:pv/v});
    }
    return out;
  }

  function rsi(values,period=14) {
    const out=[];let avgGain=0,avgLoss=0;
    for(let i=1;i<values.length;i++){
      const diff=values[i].close-values[i-1].close;
      const gain=Math.max(0,diff),loss=Math.max(0,-diff);
      if(i<=period){avgGain+=gain/period;avgLoss+=loss/period;}
      else {avgGain=(avgGain*(period-1)+gain)/period;avgLoss=(avgLoss*(period-1)+loss)/period;}
      if(i>=period){
        const rs=avgLoss===0?100:avgGain/avgLoss;
        const val=avgLoss===0?100:100-(100/(1+rs));
        out.push({time:values[i].time,value:val});
      }
    }
    return out;
  }

  function macd(values,fast=macdParams.fast,slow=macdParams.slow,signalPeriod=macdParams.signal){
    const fastEma=ema(values,fast),slowEma=ema(values,slow),signal=[];
    const line=fastEma.map((v,i)=>({time:v.time,value:v.value-slowEma[i].value}));
    const k=2/(signalPeriod+1);let s=null;const hist=[];
    line.forEach(v=>{s=s===null?v.value:v.value*k+s*(1-k);signal.push({time:v.time,value:s});hist.push({time:v.time,value:v.value-s});});
    return {line,signal,hist};
  }
  function studyTitle(id){
    if(id==="MACD")return "MACD ("+macdParams.fast+","+macdParams.slow+","+macdParams.signal+")";
    if(id==="STOCHRSI")return "Stoch RSI ("+stochRsiParams.rsi+","+stochRsiParams.stoch+","+stochRsiParams.k+","+stochRsiParams.d+")";
    if(id==="SMA200")return "SMA ("+overlayParams.sma+")";
    if(id==="BB")return "BB ("+overlayParams.bb+", "+overlayParams.deviation+")";
    return studies.find(s=>s.id===id)?.label||id;
  }
  function simpleAverage(points,period){const out=[];for(let i=period-1;i<points.length;i++){let sum=0;for(let j=i-period+1;j<=i;j++)sum+=points[j].value;out.push({time:points[i].time,value:sum/period});}return out;}
  function stochRsi(values,rsiLength=stochRsiParams.rsi,stochLength=stochRsiParams.stoch,smoothK=stochRsiParams.k,smoothD=stochRsiParams.d){
    const rsiPoints=rsi(values,rsiLength),raw=[];
    for(let i=stochLength-1;i<rsiPoints.length;i++){
      const window=rsiPoints.slice(i-stochLength+1,i+1),min=Math.min(...window.map(x=>x.value)),max=Math.max(...window.map(x=>x.value)),current=rsiPoints[i].value;
      raw.push({time:rsiPoints[i].time,value:max===min?50:((current-min)/(max-min))*100});
    }
    const kActual=simpleAverage(raw,smoothK),dActual=simpleAverage(kActual,smoothD);
    const kByTime=new Map(kActual.map(point=>[point.time,point.value]));
    const dByTime=new Map(dActual.map(point=>[point.time,point.value]));
    // Keep both lines aligned with MACD from candle one; 50 is the neutral warm-up value.
    const k=values.map(bar=>({time:bar.time,value:kByTime.has(bar.time)?kByTime.get(bar.time):50}));
    const d=values.map(bar=>({time:bar.time,value:dByTime.has(bar.time)?dByTime.get(bar.time):50}));
    return {k,d};
  }
  function applyStochRsiParams(){
    const rsiPeriod=Math.round(Number($("stochRsiLength").value)),stochPeriod=Math.round(Number($("stochRsiWindow").value)),smoothK=Math.round(Number($("stochRsiK").value)),smoothD=Math.round(Number($("stochRsiD").value));
    if(![rsiPeriod,stochPeriod,smoothK,smoothD].every(Number.isInteger)||rsiPeriod<2||rsiPeriod>500||stochPeriod<2||stochPeriod>500||smoothK<1||smoothK>200||smoothD<1||smoothD>500){toast("Stoch RSI periyotları geçersiz. RSI/Stoch 2–500, K 1–200, D 1–500 olmalı.");return;}
    stochRsiParams={rsi:rsiPeriod,stoch:stochPeriod,k:smoothK,d:smoothD};try{localStorage.setItem(STOCH_RSI_KEY,JSON.stringify(stochRsiParams));}catch{}
    if(!activeStudies.includes("STOCHRSI")){activeStudies.push("STOCHRSI");saveStudies();}
    renderStudies();toast("Stoch RSI ayarları kaydedildi: "+rsiPeriod+"/"+stochPeriod+"/"+smoothK+"/"+smoothD);
  }
  function applyOverlayParams(){
    const smaPeriod=Math.round(Number($("smaPeriod").value)),bbPeriod=Math.round(Number($("bbPeriod").value)),deviation=Number($("bbDeviation").value);
    if(!Number.isInteger(smaPeriod)||smaPeriod<2||smaPeriod>2000||!Number.isInteger(bbPeriod)||bbPeriod<2||bbPeriod>1000||!Number.isFinite(deviation)||deviation<.1||deviation>10){toast("SMA 2–2000, BB periyodu 2–1000 ve sapma 0,1–10 aralığında olmalı.");return;}
    overlayParams={sma:smaPeriod,bb:bbPeriod,deviation};try{localStorage.setItem(OVERLAY_PARAMS_KEY,JSON.stringify(overlayParams));}catch{}
    if(!activeStudies.includes("SMA200"))activeStudies.push("SMA200");
    if(!activeStudies.includes("BB"))activeStudies.push("BB");
    saveStudies();renderStudies();toast("SMA "+smaPeriod+" · Bollinger "+bbPeriod+"/"+deviation+" ayarları kaydedildi.");
  }
  function applyMacdParams(){
    const fast=Math.round(Number($("macdFast").value)),slow=Math.round(Number($("macdSlow").value)),signal=Math.round(Number($("macdSignal").value));
    if(!Number.isInteger(fast)||!Number.isInteger(slow)||!Number.isInteger(signal)||fast<1||fast>1000||slow<1||slow>1000||signal<1||signal>1000){toast("MACD periyotları 1–1000 arasında olmalı.");return;}
    macdParams={fast,slow,signal};try{localStorage.setItem(MACD_KEY,JSON.stringify(macdParams));}catch{}
    if(!activeStudies.includes("MACD")){activeStudies.push("MACD");saveStudies();}
    renderStudies();toast("MACD ayarları kaydedildi: "+fast+"/"+slow+"/"+signal);
  }

  function stochastic(values,period=14) {
    const actual=new Map();
    for(let i=period-1;i<values.length;i++){
      const slice=values.slice(i-period+1,i+1);
      const hi=Math.max(...slice.map(x=>x.high)),lo=Math.min(...slice.map(x=>x.low));
      const value=hi===lo?50:((values[i].close-lo)/(hi-lo))*100;
      actual.set(values[i].time,value);
    }
    return values.map(bar=>({time:bar.time,value:actual.has(bar.time)?actual.get(bar.time):50}));
  }

  function renderStudies() {
    if (!chart || !bars.length) return;
    clearOverlaySeries();
    const close = bars;
    if (activeStudies.includes("EMA20")) addOverlayLine(ema(close,20),"#f0bd62","EMA 20");
    if (activeStudies.includes("EMA50")) addOverlayLine(ema(close,50),"#6bb8ff","EMA 50");
    if (activeStudies.includes("SMA200")) addOverlayLine(sma(close,overlayParams.sma),"#c58cff","SMA "+overlayParams.sma);
    if (activeStudies.includes("BB")) {
      const bb=bollinger(close,overlayParams.bb,overlayParams.deviation);
      addOverlayLine(bb.upper,"rgba(132,157,190,.8)","BB Upper",1);
      addOverlayLine(bb.mid,"rgba(132,157,190,.55)","BB Mid",1);
      addOverlayLine(bb.lower,"rgba(132,157,190,.8)","BB Lower",1);
    }
    if (activeStudies.includes("VWAP")) addOverlayLine(vwap(close),"#e9a66a","VWAP",2);
    renderLowerStudies();
    renderStudyChips();
  }

  function renderLowerStudies() {
    const host=$("lowerIndicatorCharts");
    host.innerHTML="";
    lowerCharts.forEach(c=>{try{c.remove()}catch{}});
    lowerCharts=[];
    if (!bars.length || !window.LightweightCharts) return;
    const L=window.LightweightCharts;
    const lower = activeStudies.filter(id=>["STOCHRSI","MACD","STOCH"].includes(id));
    lower.forEach(id=>{
      const wrap=document.createElement("div");
      wrap.className="lower-chart-wrap"+(id==="STOCHRSI"?" stoch-rsi-chart-wrap":id==="MACD"?" macd-chart-wrap":"");
      const title=document.createElement("div");
      title.className="lower-chart-title";
      title.textContent=studyTitle(id);
      const mount=document.createElement("div");
      mount.className="lower-indicator-chart";
      wrap.append(title,mount);
      host.appendChild(wrap);
      const c=L.createChart(mount,{
        autoSize:true,
        layout:{background:{type:L.ColorType.Solid,color:"#070a0f"},textColor:"#7f93aa",fontFamily:"DM Sans,sans-serif",fontSize:10},
        grid:{vertLines:{color:"rgba(132,157,188,.035)"},horzLines:{color:"rgba(132,157,188,.06)"}},
        rightPriceScale:{borderColor:"rgba(145,170,199,.13)",autoScale:true,minimumWidth:104,scaleMargins:id==="STOCHRSI"?{top:.20,bottom:.12}:{top:.08,bottom:.18}},
        timeScale:{visible:false,borderColor:"rgba(145,170,199,.1)",rightOffset:0,barSpacing:7,minBarSpacing:.5,fixLeftEdge:false},
        crosshair:{mode:L.CrosshairMode.Normal}
      });
      lowerCharts.push(c);
      if (id==="STOCHRSI") {
        const values=stochRsi(bars);
        const k=c.addSeries(L.LineSeries,{color:"#b48cff",lineWidth:2,priceLineVisible:false,lastValueVisible:true,title:"%K"});
        const d=c.addSeries(L.LineSeries,{color:"#e9b968",lineWidth:1,priceLineVisible:false,lastValueVisible:true,title:"%D"});
        k.setData(alignStudyToMainCandles(values.k,50));d.setData(alignStudyToMainCandles(values.d,50));
        c._byboraLiveSeries={id,k,d};
        k.createPriceLine({price:80,color:"rgba(255,113,134,.55)",lineStyle:L.LineStyle.Dashed,lineWidth:1,axisLabelVisible:false,title:"80"});
        k.createPriceLine({price:20,color:"rgba(69,214,195,.55)",lineStyle:L.LineStyle.Dashed,lineWidth:1,axisLabelVisible:false,title:"20"});
      } else if (id==="MACD") {
        const m=macd(bars);
        const h=c.addSeries(L.HistogramSeries,{priceLineVisible:false,lastValueVisible:false});
        const histogram=m.hist.map(x=>({time:x.time,value:x.value,color:x.value>=0?"rgba(53,214,160,.5)":"rgba(255,113,134,.5)"}));
        h.setData(alignStudyToMainCandles(histogram,{value:0,color:"rgba(132,157,188,.12)"}));
        const s1=c.addSeries(L.LineSeries,{color:"#62a9ff",lineWidth:1,priceLineVisible:false,lastValueVisible:false});
        const s2=c.addSeries(L.LineSeries,{color:"#f0bd62",lineWidth:1,priceLineVisible:false,lastValueVisible:false});
        s1.setData(alignStudyToMainCandles(m.line,0));s2.setData(alignStudyToMainCandles(m.signal,0));
        c._byboraLiveSeries={id,h,s1,s2};
      } else {
        const s=c.addSeries(L.LineSeries,{color:"#e4b86b",lineWidth:2,priceLineVisible:false,lastValueVisible:true});
        s.setData(alignStudyToMainCandles(stochastic(bars),50));
        c._byboraLiveSeries={id,s};
        s.createPriceLine({price:80,color:"rgba(255,113,134,.55)",lineStyle:L.LineStyle.Dashed,lineWidth:1,axisLabelVisible:false});
        s.createPriceLine({price:20,color:"rgba(69,214,195,.55)",lineStyle:L.LineStyle.Dashed,lineWidth:1,axisLabelVisible:false});
      }
      c.timeScale().subscribeVisibleLogicalRangeChange(range=>syncRawChartRanges(c,range));
      const mainRange=chart.timeScale().getVisibleLogicalRange();
      if(mainRange){try{c.timeScale().setVisibleLogicalRange({from:mainRange.from,to:mainRange.to});}catch{}}
    });
  }

  function renderStudyChips() {
    document.querySelectorAll("[data-study]").forEach(button=>button.classList.toggle("active",activeStudies.includes(button.dataset.study)));
    const smaChip=document.querySelector('[data-study="SMA200"] span');if(smaChip)smaChip.textContent=String(overlayParams.sma);
    const bbChip=document.querySelector('[data-study="BB"] span');if(bbChip)bbChip.textContent=overlayParams.bb+"/"+overlayParams.deviation;
    const macdChip=document.querySelector('[data-study="MACD"] span');if(macdChip)macdChip.textContent=macdParams.fast+"/"+macdParams.slow+"/"+macdParams.signal;
    const stochChip=document.querySelector('[data-study="STOCHRSI"] span');if(stochChip)stochChip.textContent=stochRsiParams.rsi+"/"+stochRsiParams.stoch+"/"+stochRsiParams.k+"/"+stochRsiParams.d;
    const host=$("activeStudyList");host.innerHTML="";
    if (!activeStudies.length) {
      const span=document.createElement("span");span.className="subtle-copy";span.textContent="Henüz gösterge eklenmedi.";host.appendChild(span);return;
    }
    activeStudies.forEach(id=>{
      const item=studies.find(x=>x.id===id);if(!item)return;
      const pill=document.createElement("span");pill.className="active-study-pill";pill.append(document.createTextNode(studyTitle(id)));
      const remove=document.createElement("button");remove.type="button";remove.textContent="×";remove.addEventListener("click",()=>toggleStudy(id));
      pill.appendChild(remove);host.appendChild(pill);
    });
  }

  function toggleStudy(id) {
    activeStudies=activeStudies.includes(id)?activeStudies.filter(x=>x!==id):[...activeStudies,id];
    saveStudies();
    renderStudies();
    $("saveState").innerHTML="<i></i> Gösterge seti kaydedildi";
  }

  function restoreDrawingLines() {
    const priceSeries=activePriceSeries();
    if (!chart || !priceSeries) return;
    drawingLines.forEach(d=>{
      if (d.type==="horizontal") {
        d._runtimeId = priceSeries.createPriceLine({price:d.price,color:d.color||"#e8bd68",lineWidth:1,lineStyle:window.LightweightCharts.LineStyle.Dashed,axisLabelVisible:true,title:d.title||"Seviye"});
      } else if (d.type==="trend" && d.points?.length===2) {
        const s=chart.addSeries(window.LightweightCharts.LineSeries,{color:d.color||"#e8bd68",lineWidth:2,priceLineVisible:false,lastValueVisible:false});
        s.setData(d.points);
        d._runtimeId=s;
        drawingSeriesRuntime.push(s);
      } else if (d.type==="fib" && Array.isArray(d.levels)) {
        d._runtimeId=[];
        d.levels.forEach(level=>{
          d._runtimeId.push(priceSeries.createPriceLine({price:level.price,color:"#e8bd68",lineWidth:1,lineStyle:window.LightweightCharts.LineStyle.Dashed,axisLabelVisible:true,title:level.label}));
        });
      }
    });
  }

  function clearDrawings() {
    const priceSeries=activePriceSeries();
    if (priceSeries) {
      drawingLines.forEach(d=>{
        try {
          if (d.type==="horizontal" && d._runtimeId) priceSeries.removePriceLine(d._runtimeId);
          if (d.type==="fib") d._runtimeId?.forEach(l=>priceSeries.removePriceLine(l));
        } catch {}
      });
    }
    clearDrawingRuntime();
    drawingLines=[];
    saveDrawings();
    renderDrawingList();
  }

  function renderDrawingList() {
    const host=$("activeDrawings");host.innerHTML="";
    drawingLines.forEach((d,i)=>{
      const label=d.type==="horizontal"?"Yatay çizgi":d.type==="trend"?"Trend çizgisi":"Fibonacci";
      const item=document.createElement("span");item.className="active-study-pill";
      const text=document.createElement("span");text.textContent=label+(d.price?" · "+fmtPrice(d.price,instrument()?.decimals||2):"");
      const btn=document.createElement("button");btn.textContent="×";btn.addEventListener("click",()=>{
        const priceSeries=activePriceSeries();
        if (d.type==="horizontal" && d._runtimeId && priceSeries) priceSeries.removePriceLine(d._runtimeId);
        if (d.type==="fib" && priceSeries) d._runtimeId?.forEach(x=>priceSeries.removePriceLine(x));
        if (d.type==="trend" && d._runtimeId) {
          try { chart?.removeSeries(d._runtimeId); } catch {}
          drawingSeriesRuntime=drawingSeriesRuntime.filter(x=>x!==d._runtimeId);
        }
        drawingLines.splice(i,1);saveDrawings();renderDrawingList();
      });
      item.append(text,btn);host.appendChild(item);
    });
  }

  function beginDrawing(mode) {
    drawingMode=mode;firstDrawPoint=null;
    document.querySelectorAll("[data-drawing]").forEach(b=>b.classList.toggle("active",b.dataset.drawing===mode));
    $("drawingHint").textContent=mode==="horizontal"?"Yatay çizgi yerleştirmek için grafikte bir fiyata dokun.":
      mode==="trend"?"Trend çizgisi için önce başlangıç, sonra bitiş noktasına dokun.":
      "Fibonacci için önce dip, sonra tepe (veya tersi) noktasına dokun.";
    if (mode==="clear") { clearDrawings();drawingMode=null;document.querySelectorAll("[data-drawing]").forEach(b=>b.classList.remove("active"));toast("Çizimler temizlendi.");}
  }

  function onChartClick(param) {
    const priceSeries=activePriceSeries();
    if (!drawingMode || !param?.point || !param.time || !priceSeries) return;
    const price=priceSeries.coordinateToPrice(param.point.y);
    if (!Number.isFinite(price)) return;
    const point={time:param.time,price};
    if (drawingMode==="horizontal") {
      const item={type:"horizontal",price,color:"#e8bd68",title:"Seviye"};
      item._runtimeId=priceSeries.createPriceLine({price,color:item.color,lineWidth:1,lineStyle:window.LightweightCharts.LineStyle.Dashed,axisLabelVisible:true,title:"Seviye"});
      drawingLines.push(item);
      drawingMode=null;
    } else if (!firstDrawPoint) {
      firstDrawPoint=point;
      $("drawingHint").textContent="İlk nokta seçildi. Şimdi ikinci noktaya dokun.";
      return;
    } else if (drawingMode==="trend") {
      const points=[firstDrawPoint,point].sort((a,b)=>a.time-b.time);
      const series=chart.addSeries(window.LightweightCharts.LineSeries,{color:"#e8bd68",lineWidth:2,priceLineVisible:false,lastValueVisible:false});
      series.setData(points.map(x=>({time:x.time,value:x.price})));
      drawingLines.push({type:"trend",points:points.map(x=>({time:x.time,value:x.price})),_runtimeId:series});
      drawingMode=null;firstDrawPoint=null;
    } else if (drawingMode==="fib") {
      const high=Math.max(firstDrawPoint.price,point.price),low=Math.min(firstDrawPoint.price,point.price);
      const levels=[0,.236,.382,.5,.618,.786,1].map(r=>{
        const price=high-(high-low)*r;
        const item={price,label:(r*100).toFixed(1)+"%"};
        item.runtime=priceSeries.createPriceLine({price,color:"#e8bd68",lineWidth:1,lineStyle:window.LightweightCharts.LineStyle.Dashed,axisLabelVisible:true,title:item.label});
        return item;
      });
      drawingLines.push({type:"fib",levels:levels.map(x=>({price:x.price,label:x.label})),_runtimeId:levels.map(x=>x.runtime)});
      drawingMode=null;firstDrawPoint=null;
    }
    saveDrawings();renderDrawingList();
    $("drawingHint").textContent="Çizim telefona kaydedildi. Yeni araç seçebilir veya grafiği kullanabilirsin.";
    document.querySelectorAll("[data-drawing]").forEach(b=>b.classList.remove("active"));
  }

  function isBinanceSpotInstrument(item){
    return !!item&&item.type==="crypto"&&!item.provider?.startsWith("binanceFutures")&&!item.provider?.startsWith("okx")&&
      (String(item.id||"").startsWith("BINANCE:")||item.provider==="binanceSpot"||item.exchange==="BINANCE");
  }
  function binanceSpotItems(){
    const ids=[activeSymbol,...watchlist],unique=[...new Set(ids)];
    return unique.map(id=>instrument(id)).filter(isBinanceSpotInstrument);
  }
  function desiredBinanceStreams(){
    const streams=new Set();
    for(const item of binanceSpotItems()){
      const symbol=String(item.pair||"").toLowerCase();
      if(!symbol)continue;
      streams.add(symbol+"@ticker");
      if(item.id===activeSymbol){
        const interval=intervalBinance[activeInterval]||activeInterval;
        streams.add(symbol+"@kline_"+interval);
      }
    }
    return streams;
  }
  function sendBinanceSubscription(method,streams){
    const socket=binanceMarketSocket;
    if(!socket||socket.readyState!==window.WebSocket.OPEN||!streams.length)return false;
    try{socket.send(JSON.stringify({method,params:streams,id:binanceSocketRequestId++}));return true;}
    catch{return false;}
  }
  function scheduleBinanceReconnect(){
    if(binanceSocketReconnectTimer||!binanceWantedStreams.size)return;
    const delay=binanceSocketRetryDelay;
    binanceSocketRetryDelay=Math.min(30000,binanceSocketRetryDelay*2);
    binanceSocketReconnectTimer=setTimeout(()=>{
      binanceSocketReconnectTimer=null;
      if(binanceWantedStreams.size&&navigator.onLine!==false)connectBinanceMarketSocket();
    },delay);
  }
  function connectBinanceMarketSocket(){
    if(!binanceWantedStreams.size||binanceMarketSocket||!window.WebSocket)return;
    let socket;
    try{socket=new WebSocket("wss://stream.binance.com:443/ws");}
    catch{scheduleBinanceReconnect();return;}
    binanceMarketSocket=socket;binanceActiveStreams.clear();
    socket.onopen=()=>{
      if(binanceMarketSocket!==socket)return;
      binanceSocketRetryDelay=1000;
      const streams=[...binanceWantedStreams];
      if(sendBinanceSubscription("SUBSCRIBE",streams))streams.forEach(stream=>binanceActiveStreams.add(stream));
      clearTimeout(binanceSocketRotationTimer);
      // Binance Spot stream connections have a 24-hour lifetime; rotate before the server closes them.
      binanceSocketRotationTimer=setTimeout(()=>{if(binanceMarketSocket===socket)socket.close(1000,"scheduled stream rotation");},23*60*60*1000+30*60*1000);
      if(isBinanceSpotInstrument(instrument()))setStatus("BINANCE · BAĞLANDI","good");
    };
    socket.onmessage=event=>{
      if(binanceMarketSocket!==socket)return;
      binanceSocketLastMessageAt=Date.now();
      let message;
      try{message=JSON.parse(event.data);}catch{return;}
      const payload=message?.data??message;
      if(Array.isArray(payload)){payload.forEach(processBinanceStreamMessage);return;}
      processBinanceStreamMessage(payload);
    };
    socket.onerror=()=>{try{socket.close();}catch{}};
    socket.onclose=()=>{
      if(binanceMarketSocket!==socket)return;
      binanceMarketSocket=null;binanceActiveStreams.clear();
      clearTimeout(binanceSocketRotationTimer);binanceSocketRotationTimer=null;
      if(isBinanceSpotInstrument(instrument()))setStatus("BINANCE · YENİDEN BAĞLANIYOR","warn");
      scheduleBinanceReconnect();
    };
  }
  function syncBinanceLiveSubscriptions(){
    binanceWantedStreams=desiredBinanceStreams();
    if(!binanceWantedStreams.size){
      clearTimeout(binanceSocketReconnectTimer);binanceSocketReconnectTimer=null;
      const socket=binanceMarketSocket;binanceMarketSocket=null;binanceActiveStreams.clear();
      clearTimeout(binanceSocketRotationTimer);binanceSocketRotationTimer=null;
      if(socket){socket.onclose=null;try{socket.close(1000,"no Binance symbols in view");}catch{}}
      return;
    }
    clearTimeout(binanceSocketReconnectTimer);binanceSocketReconnectTimer=null;
    if(!binanceMarketSocket||binanceMarketSocket.readyState===window.WebSocket.CLOSED){connectBinanceMarketSocket();return;}
    if(binanceMarketSocket.readyState!==window.WebSocket.OPEN)return;
    const add=[...binanceWantedStreams].filter(stream=>!binanceActiveStreams.has(stream));
    const remove=[...binanceActiveStreams].filter(stream=>!binanceWantedStreams.has(stream));
    if(add.length&&sendBinanceSubscription("SUBSCRIBE",add))add.forEach(stream=>binanceActiveStreams.add(stream));
    if(remove.length&&sendBinanceSubscription("UNSUBSCRIBE",remove))remove.forEach(stream=>binanceActiveStreams.delete(stream));
  }
  function findBinanceSpotByPair(pair){
    const upper=String(pair||"").toUpperCase();
    return symbols.find(item=>isBinanceSpotInstrument(item)&&String(item.pair||"").toUpperCase()===upper)||null;
  }
  function updateWatchlistQuoteRow(item,quote){
    const row=Array.from($("watchlist").querySelectorAll(".watch-row")).find(el=>el.dataset.symbol===item.id);
    if(!row||!quote)return;
    const value=Number(quote.lastPrice??quote.price??quote.close);
    const change=Number(quote.priceChangePercent??quote.changePercent??0);
    row.querySelector("[data-quote-price]").textContent=Number.isFinite(value)?fmtPrice(value,item.decimals):"—";
    const label=row.querySelector("[data-quote-change]");
    label.textContent=Number.isFinite(change)?(change>=0?"+":"")+change.toFixed(2)+"%":"—";
    label.className=change>0?"up":change<0?"down":"";
  }
  function processBinanceTicker(data){
    if(!data?.s||data.e!=="24hrTicker")return;
    const item=findBinanceSpotByPair(data.s);
    if(!item)return;
    const last=Number(data.c),open=Number(data.o);
    if(!Number.isFinite(last)||!Number.isFinite(open))return;
    const quote={
      lastPrice:String(last),highPrice:Number(data.h),lowPrice:Number(data.l),
      quoteVolume:Number(data.q),volume:Number(data.q),baseVolume:Number(data.v),
      volumeCurrency:item.currency||"",priceChangePercent:Number.isFinite(Number(data.P))?Number(data.P):(open?((last/open)-1)*100:0),
      receivedAt:Date.now()
    };
    binanceLiveQuotes.set(String(data.s).toUpperCase(),quote);
    updateWatchlistQuoteRow(item,quote);
    const active=instrument();
    if(isBinanceSpotInstrument(active)&&active.pair===item.pair){
      renderInstrumentHeader(active,quote,bars[bars.length-1]);
      $("lastUpdate").textContent="Canlı veri "+fmtTime();
      setStatus("BINANCE · CANLI","good");
    }
  }
  function updateLiveOverlayAndStudies(){
    if(!bars.length)return;
    const last=bars[bars.length-1];
    const updateOverlay=(title,points)=>{
      const point=points[points.length-1],series=overlaySeries.find(item=>item._byboraTitle===title);
      if(point&&series){try{series.update(point);}catch{}}
    };
    if(activeStudies.includes("EMA20"))updateOverlay("EMA 20",ema(bars,20));
    if(activeStudies.includes("EMA50"))updateOverlay("EMA 50",ema(bars,50));
    if(activeStudies.includes("SMA200"))updateOverlay("SMA "+overlayParams.sma,sma(bars,overlayParams.sma));
    if(activeStudies.includes("BB")){
      const bb=bollinger(bars,overlayParams.bb,overlayParams.deviation);
      updateOverlay("BB Upper",bb.upper);updateOverlay("BB Mid",bb.mid);updateOverlay("BB Lower",bb.lower);
    }
    if(activeStudies.includes("VWAP"))updateOverlay("VWAP",vwap(bars));
    lowerCharts.forEach(chartPanel=>{
      const live=chartPanel._byboraLiveSeries;if(!live)return;
      try{
        if(live.id==="STOCHRSI"){
          const values=stochRsi(bars);
          live.k.update(values.k[values.k.length-1]);live.d.update(values.d[values.d.length-1]);
        }else if(live.id==="MACD"){
          const values=macd(bars),hist=values.hist[values.hist.length-1];
          live.h.update({...hist,color:hist.value>=0?"rgba(53,214,160,.5)":"rgba(255,113,134,.5)"});
          live.s1.update(values.line[values.line.length-1]);live.s2.update(values.signal[values.signal.length-1]);
        }else if(live.id==="STOCH"){
          const values=stochastic(bars);live.s.update(values[values.length-1]);
        }
      }catch{}
    });
    if(last)updateMarketRangeLevels();
  }
  function processBinanceKline(data){
    const active=instrument();
    if(!data?.s||data.e!=="kline"||!data.k||!isBinanceSpotInstrument(active)||String(active.pair).toUpperCase()!==String(data.s).toUpperCase())return;
    const k=data.k,time=Math.floor(Number(k.t)/1000);
    if(!Number.isFinite(time))return;
    const bar={time,open:Number(k.o),high:Number(k.h),low:Number(k.l),close:Number(k.c),volume:Number(k.v)||0};
    if(![bar.open,bar.high,bar.low,bar.close].every(Number.isFinite))return;
    const previous=bars[bars.length-1];
    const logical=chart?.timeScale().getVisibleLogicalRange();
    const follow=!logical||logical.to>=bars.length-5;
    if(previous&&time<previous.time)return;
    if(previous&&time===previous.time)bars[bars.length-1]=bar;
    else{
      bars.push(bar);
      if(bars.length>2000)bars.shift();
    }
    if(chartType==="candles"&&candleSeries)candleSeries.update({time,open:bar.open,high:bar.high,low:bar.low,close:bar.close});
    else if(lineSeries)lineSeries.update({time,value:bar.close});
    if(volumeSeries)volumeSeries.update({time,value:bar.volume,color:bar.close>=bar.open?"rgba(53,214,160,.28)":"rgba(255,113,134,.28)"});
    updateLiveOverlayAndStudies();
    if(follow&&time>Number(previous?.time||0))chart?.timeScale().scrollToRealTime();
    const quote=binanceLiveQuotes.get(String(data.s).toUpperCase());
    if(quote)renderInstrumentHeader(active,quote,bar);
  }
  function processBinanceStreamMessage(data){
    if(!data||typeof data!=="object")return;
    if(data.e==="24hrTicker")processBinanceTicker(data);
    else if(data.e==="kline")processBinanceKline(data);
    else if(data.e==="serverShutdown"){try{binanceMarketSocket?.close();}catch{}}
  }

  function marketProviderLabel(item){
    if(item.provider?.startsWith("binance")||item.exchange==="BINANCE"||item.exchange==="BINANCE PERP")return "Binance";
    if(item.provider?.startsWith("okx"))return "OKX";
    if(item.provider==="yahoo"||["bist","gold","forex","commodity","index"].includes(item.type))return "Yahoo Finance";
    return item.exchange||"";
  }
  function marketDisplayTicker(item){
    if(item.type!=="crypto"||!item.pair)return item.ticker;
    const pair=String(item.pair).replace(/-SWAP$/,"").replace(/-/g,"");
    const currency=item.currency||"";
    return currency&&pair.endsWith(currency)&&pair.length>currency.length
      ?pair.slice(0,-currency.length)+"/"+currency:item.ticker;
  }
  function renderInstrumentHeader(item,quote,lastBar) {
    $("instrumentAvatar").textContent=item.ticker.slice(0,2);
    $("instrumentLabel").textContent=item.type==="bist"?"BORSA İSTANBUL · HİSSE":item.type==="gold"?"ALTIN · HESAPLANAN GRAM/TL REFERANSI":item.type==="forex"?"FOREX · DÖVİZ PARİTESİ":item.type==="commodity"?"EMTİA · VADELİ KONTRAT":item.type==="index"?"ABD ENDEKSLERİ":"KRİPTO · "+marketProviderLabel(item).toLocaleUpperCase("tr-TR");
    $("instrumentName").textContent=item.name;
    $("exchangeBadge").textContent=item.exchange;
    $("chartTicker").textContent=marketDisplayTicker(item);
    $("chartSource").textContent=marketProviderLabel(item);
    const price = item.type==="bist" && quote?.price!=null ? Number(quote.price) :
      quote?.lastPrice!=null ? Number(quote.lastPrice) : lastBar?.close;
    $("lastPrice").textContent=Number.isFinite(price)?fmtPrice(price,item.decimals):"—";
    const change = item.type==="bist" && quote?.changePercent!=null ? Number(quote.changePercent) :
      quote?.priceChangePercent!=null ? Number(quote.priceChangePercent) :
      (bars.length>1?((bars[bars.length-1].close/bars[bars.length-2].close)-1)*100:null);
    $("priceChange").textContent=Number.isFinite(change)?(change>=0?"+":"")+change.toFixed(2)+"%":"—";
    $("priceChange").className="quote-change"+(change>0?" up":change<0?" down":"");
    const hi = quote?.dayHigh ?? quote?.highPrice ?? quote?.high ?? lastBar?.high;
    const lo = quote?.dayLow ?? quote?.lowPrice ?? quote?.low ?? lastBar?.low;
    const vol = quote?.quoteVolume ?? quote?.volume24h ?? quote?.volume;
    $("dayHigh").textContent=Number.isFinite(Number(hi))?fmtPrice(Number(hi),item.decimals):"—";
    $("dayLow").textContent=Number.isFinite(Number(lo))?fmtPrice(Number(lo),item.decimals):"—";
    $("dayVolume").textContent=Number.isFinite(Number(vol))?fmtCompact(Number(vol)):"—";
    $("volumeCurrency").textContent=quote?.volumeCurrency||(item.type==="crypto"?item.currency||"":"");
    $("favoriteButton").classList.toggle("active",watchlist.includes(item.id));
    $("favoriteButton").textContent=watchlist.includes(item.id)?"★":"☆";
    document.title=item.ticker+" | BYBORA Market Desk";
  }

  function filteredWatchlistIds(){
    return watchlist.filter(id=>{
      const item=instrument(id);if(!item)return false;
      return activeFilter==="all"||(activeFilter==="bist"&&item.type==="bist")||(activeFilter==="crypto"&&item.type==="crypto")||(activeFilter==="gold"&&item.type==="gold")||(activeFilter==="forex"&&item.type==="forex")||(activeFilter==="commodity"&&item.type==="commodity")||(activeFilter==="index"&&item.type==="index");
    });
  }
  function moveWatchlistItem(id,delta){
    const visible=filteredWatchlistIds(),from=visible.indexOf(id),to=from+delta;
    if(from<0||to<0||to>=visible.length)return;
    const next=visible.slice(),[moved]=next.splice(from,1);next.splice(to,0,moved);
    const visibleSet=new Set(visible);let index=0;
    watchlist=watchlist.map(current=>visibleSet.has(current)?next[index++]:current);
    saveWatchlist();updateWatchlist();toast("İzleme listesi sırası kaydedildi.");
  }
  function exportWatchlistBackup(){
    const payload={format:"bybora-watchlist",version:1,exportedAt:new Date().toISOString(),items:watchlist.map(id=>instrument(id)).filter(Boolean).map(item=>({id:item.id,ticker:item.ticker,name:item.name,exchange:item.exchange,type:item.type,provider:item.provider,pair:item.pair,currency:item.currency,decimals:item.decimals,baseAsset:item.baseAsset,quoteAsset:item.quoteAsset}))};
    if(!window.ByboraNative?.saveWatchlistFile){toast("Android dosya kaydetme desteği bulunamadı.");return;}
    window.ByboraNative.saveWatchlistFile(JSON.stringify(payload,null,2));
  }
  function importWatchlistBackup(){
    if(!window.ByboraNative?.openWatchlistFile){toast("Android dosya açma desteği bulunamadı.");return;}
    window.ByboraNative.openWatchlistFile();
  }
  function handleWatchlistImport(jsonText){
    try{
      const payload=JSON.parse(String(jsonText||""));
      const items=Array.isArray(payload)?payload:(Array.isArray(payload?.items)?payload.items:null);
      if(!items||!items.length)throw new Error("Dosyada izleme listesi bulunamadı.");
      const ids=[];
      for(const entry of items){
        const id=typeof entry==="string"?entry:entry?.id;
        if(!id||typeof id!=="string")continue;
        if(typeof entry==="object")registerMarketSymbols([{...entry,id}]);
        if(ensureInstrument(id,typeof entry==="object"?entry:null))ids.push(id);
      }
      const next=[...new Set(ids)];
      if(!next.length)throw new Error("Dosyadaki semboller tanınmadı.");
      watchlist=next;saveWatchlist();activeFilter="all";
      document.querySelectorAll("[data-watch-filter]").forEach(b=>b.classList.toggle("active",b.dataset.watchFilter==="all"));
      updateWatchlist();toast(next.length+" sembol içe aktarıldı.");
    }catch(error){toast(error.message||"İzleme listesi dosyası okunamadı.");}
  }

  function loadWorkspaces(){
    try{
      const stored=JSON.parse(localStorage.getItem(WORKSPACES_KEY)||"{}");
      if(!stored||typeof stored!=="object"||Array.isArray(stored))return {};
      let changed=false;
      for(const [symbol,list] of Object.entries(stored)){
        if(!Array.isArray(list)){delete stored[symbol];changed=true;continue;}
        const clean=[],seenIds=new Set();
        list.forEach((workspace,index)=>{
          if(!workspace||typeof workspace!=="object"||typeof workspace.id!=="string"||!workspace.id||seenIds.has(workspace.id)){
            changed=true;return;
          }
          seenIds.add(workspace.id);
          const oldName=String(workspace.name||"");
          const match=oldName.match(/Çalışma Alan(?:ım|ı)\s*\((\d+)\)/i);
          const parsed=Number(match?.[1]);
          const number=Number.isSafeInteger(Number(workspace.number))&&Number(workspace.number)>0
            ?Number(workspace.number):(Number.isSafeInteger(parsed)&&parsed>0?parsed:index+1);
          if(workspace.number!==number){workspace.number=number;changed=true;}
          if(!oldName||/^Çalışma Alanım\s*\(/i.test(oldName)){
            workspace.name="Çalışma Alanı ("+number+")";changed=true;
          }
          clean.push(workspace);
        });
        if(clean.length!==list.length)changed=true;
        stored[symbol]=clean;
      }
      if(changed)localStorage.setItem(WORKSPACES_KEY,JSON.stringify(stored));
      return stored;
    }catch{return {};}
  }
  let workspacesBySymbol=loadWorkspaces();
  let activeWorkspaceId=null,workspaceChart=null,workspacePriceSeries=null,workspaceVolumeSeries=null;
  let workspaceChartType="candles",workspaceBars=[],workspaceDrawingMode=null,workspaceFirstPoint=null,workspaceDrawings=[],workspaceRuntime=[];
  let workspaceInterval="15m",workspaceLoadBusy=false,workspaceLoadGeneration=0,workspaceLoadedInterval=null,workspaceLoadedWorkspaceId=null;
  let workspaceDraftPoints=[],workspaceDrag=null,workspaceCreateGesture=null,workspaceDraftDrawing=null,workspaceSelectedDrawingIndex=-1,workspaceOverlayResizeObserver=null;
  function saveWorkspaceIndex(){try{localStorage.setItem(WORKSPACES_KEY,JSON.stringify(workspacesBySymbol));}catch{}}
  function symbolWorkspaces(symbol=activeSymbol){return Array.isArray(workspacesBySymbol[symbol])?workspacesBySymbol[symbol]:[];}
  function activeWorkspace(){return symbolWorkspaces().find(w=>w.id===activeWorkspaceId)||null;}
  function workspaceDisplayName(workspace,index=0){
    const name=String(workspace?.name||"").trim();
    return name||"Çalışma Alanı ("+(Number(workspace?.number)||index+1)+")";
  }
  function nextWorkspaceNumber(list){
    return list.reduce((max,workspace,index)=>{
      const match=String(workspace?.name||"").match(/Çalışma Alan(?:ım|ı)\s*\((\d+)\)/i);
      const number=Number(workspace?.number)||Number(match?.[1])||index+1;
      return Math.max(max,number);
    },0)+1;
  }
  function renderWorkspaceNav(){
    const host=$("workspaceTabs");if(!host)return;host.innerHTML="";
    const list=symbolWorkspaces();
    list.forEach((workspace,index)=>{
      const label=workspaceDisplayName(workspace,index);
      if(workspace.name!==label)workspace.name=label;
      const button=document.createElement("button");button.type="button";button.className="chart-mode-tab"+(workspace.id===activeWorkspaceId?" active":"");
      button.textContent=label;button.title=label;
      button.addEventListener("click",()=>openWorkspace(workspace.id));host.appendChild(button);
    });
    $("rawChartMode").classList.toggle("active",!activeWorkspaceId);
    const createButton=$("createWorkspaceButton");
    createButton.textContent="Çalışma Alanı Oluştur";
    createButton.hidden=false;
    if(activeWorkspaceId){
      const ws=activeWorkspace(),index=list.findIndex(item=>item.id===activeWorkspaceId);
      $("workspaceTitle").textContent=ws?workspaceDisplayName(ws,index):"Çalışma Alanı";
    }
  }
  function openWorkspaceRename(){
    const workspace=activeWorkspace();if(!workspace)return;
    $("workspaceNameInput").value=workspace.name||workspaceDisplayName(workspace);
    $("workspaceTitleEdit").hidden=true;
    $("workspaceRenameForm").hidden=false;
    $("workspaceNameInput").focus();$("workspaceNameInput").select();
  }
  function closeWorkspaceRename(){
    $("workspaceRenameForm").hidden=true;
    $("workspaceTitleEdit").hidden=false;
  }
  function commitWorkspaceRename(event){
    event.preventDefault();
    const workspace=activeWorkspace();if(!workspace)return;
    const name=$("workspaceNameInput").value.trim().slice(0,36);
    if(!name){toast("Çalışma alanı adı boş bırakılamaz.");$("workspaceNameInput").focus();return;}
    workspace.name=name;workspace.updatedAt=Date.now();
    saveWorkspaceIndex();closeWorkspaceRename();renderWorkspaceNav();
    toast("Çalışma alanı adı güncellendi.");
  }
  function createWorkspace(){
    const list=symbolWorkspaces();
    const id="ws-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,7);
    const number=nextWorkspaceNumber(list);
    const workspace={id,number,name:"Çalışma Alanı ("+number+")",symbol:activeSymbol,interval:activeInterval,chartType:"candles",drawings:[],createdAt:Date.now(),updatedAt:Date.now()};
    workspaceDraftPoints=[];workspaceSelectedDrawingIndex=-1;workspaceDrag=null;
    workspacesBySymbol[activeSymbol]=[...list,workspace];saveWorkspaceIndex();renderWorkspaceNav();openWorkspace(id);
  }
  function showRawChart(){
    workspaceLoadGeneration++;
    if(activeWorkspaceId)saveActiveWorkspace();
    closeWorkspaceRename();
    activeWorkspaceId=null;workspaceDrawingMode=null;workspaceFirstPoint=null;workspaceDraftPoints=[];workspaceDraftDrawing=null;workspaceCreateGesture=null;
    const drawingOverlay=$("workspaceDrawingOverlay");if(drawingOverlay)drawingOverlay.classList.remove("drawing-enabled");
    $("workspacePanel").hidden=true;$("rawChartView").hidden=false;
    renderWorkspaceNav();
    if(chart){const host=$("priceChart");setTimeout(()=>{try{chart.resize(host.clientWidth,host.clientHeight);}catch{}},80);}
  }
  async function openWorkspace(id){
    const workspace=symbolWorkspaces().find(w=>w.id===id);if(!workspace)return;
    if(activeWorkspaceId&&activeWorkspaceId!==id)saveActiveWorkspace();
    closeWorkspaceRename();
    activeWorkspaceId=id;workspaceInterval=workspace.interval||activeInterval;workspaceChartType=workspace.chartType||"candles";
    workspaceDrawings=Array.isArray(workspace.drawings)?workspace.drawings.map(x=>({...x})):[];workspaceDrawingMode=null;workspaceFirstPoint=null;workspaceDraftPoints=[];workspaceDraftDrawing=null;workspaceCreateGesture=null;workspaceSelectedDrawingIndex=-1;workspaceDrag=null;
    const overlay=$("workspaceDrawingOverlay");if(overlay)overlay.classList.remove("drawing-enabled");
    $("rawChartView").hidden=true;$("workspacePanel").hidden=false;
    $("workspaceTitle").textContent=workspace.name;
    document.querySelectorAll("[data-workspace-interval]").forEach(b=>b.classList.toggle("active",b.dataset.workspaceInterval===workspaceInterval));
    document.querySelectorAll("[data-workspace-chart-type]").forEach(b=>b.classList.toggle("active",b.dataset.workspaceChartType===workspaceChartType));
    renderWorkspaceNav();renderWorkspaceDrawingList();
    await loadWorkspaceChart();
  }
  function saveActiveWorkspace(){
    const workspace=activeWorkspace();if(!workspace)return;
    workspace.interval=workspaceInterval;workspace.chartType=workspaceChartType;
    workspace.drawings=workspaceDrawings.map(d=>JSON.parse(JSON.stringify(d)));
    workspace.updatedAt=Date.now();saveWorkspaceIndex();renderWorkspaceNav();
  }
  function closeActiveWorkspace(){
    saveActiveWorkspace();showRawChart();toast("Ham grafik görünümüne dönüldü.");
  }
  function deleteActiveWorkspace(){
    const workspace=activeWorkspace();if(!workspace)return;
    workspaceLoadGeneration++;
    const accepted=window.confirm('"'+workspace.name+'" çalışma alanı ve içindeki çizimler kalıcı olarak silinsin mi?');
    if(!accepted)return;
    workspacesBySymbol[activeSymbol]=symbolWorkspaces().filter(item=>item.id!==workspace.id);
    saveWorkspaceIndex();activeWorkspaceId=null;workspaceDraftPoints=[];workspaceDrag=null;workspaceSelectedDrawingIndex=-1;workspaceDrawingMode=null;
    destroyWorkspaceDrawingRuntime();$("workspacePanel").hidden=true;$("rawChartView").hidden=false;renderWorkspaceNav();
    if(chart){const host=$("priceChart");setTimeout(()=>{try{chart.resize(host.clientWidth,host.clientHeight);}catch{}},80);}
    toast(workspace.name+" silindi.");
  }
  function destroyWorkspaceDrawingRuntime(){
    workspaceRuntime=[];
    const overlay=$("workspaceDrawingOverlay");if(overlay)overlay.innerHTML="";
  }
  function ensureWorkspaceChart(){
    if(workspaceChart)return;
    if(!window.LightweightCharts)throw new Error("Grafik kütüphanesi yüklenemedi.");
    const L=window.LightweightCharts,host=$("workspacePriceChart"),overlay=$("workspaceDrawingOverlay");
    workspaceChart=L.createChart(host,{
      autoSize:true,
      layout:{background:{type:L.ColorType.Solid,color:"#070a0f"},textColor:"#91a3ba",fontFamily:"DM Sans,sans-serif",fontSize:10},
      grid:{vertLines:{color:"rgba(132,157,188,.065)"},horzLines:{color:"rgba(132,157,188,.085)"}},
      crosshair:{mode:L.CrosshairMode.Normal,vertLine:{color:"rgba(113,177,221,.38)",width:1,style:L.LineStyle.Dashed,labelBackgroundColor:"#25435f"},horzLine:{color:"rgba(113,177,221,.38)",width:1,style:L.LineStyle.Dashed,labelBackgroundColor:"#25435f"}},
      rightPriceScale:{borderColor:"rgba(145,170,199,.18)",autoScale:true,minimumWidth:76,scaleMargins:{top:.08,bottom:.18}},
      timeScale:{borderColor:"rgba(145,170,199,.18)",timeVisible:true,secondsVisible:false,rightOffset:7,barSpacing:7,minBarSpacing:.5},
      localization:{locale:"tr-TR"}
    });
    workspaceChart.timeScale().subscribeVisibleLogicalRangeChange(()=>{refreshWorkspacePriceScale();renderWorkspaceDrawingOverlay();});
    if(overlay){
      overlay.addEventListener("pointerdown",startWorkspaceDrawingPointer);
      overlay.addEventListener("pointermove",moveWorkspaceDrawingPointer);
      overlay.addEventListener("pointerup",finishWorkspaceDrawingPointer);
      overlay.addEventListener("pointercancel",finishWorkspaceDrawingPointer);
    }
    const container=$("workspaceChartContainer");
    if(container){
      container.addEventListener("dblclick",event=>{
        const rect=container.getBoundingClientRect();
        if(event.clientX>=rect.right-88)refreshWorkspacePriceScale();
      });
    }
    if(container&&window.ResizeObserver){
      workspaceOverlayResizeObserver=new ResizeObserver(()=>renderWorkspaceDrawingOverlay());
      workspaceOverlayResizeObserver.observe(container);
    }
  }
  function createWorkspacePriceSeries(){
    const L=window.LightweightCharts,item=instrument(activeWorkspace()?.symbol||activeSymbol),last=workspaceBars[workspaceBars.length-1]?.close;
    const precision=chartPriceDecimals(item,last),priceFormat={type:"price",precision,minMove:Math.pow(10,-precision)};
    if(workspacePriceSeries){workspaceChart.removeSeries(workspacePriceSeries);workspacePriceSeries=null;}
    if(workspaceVolumeSeries){workspaceChart.removeSeries(workspaceVolumeSeries);workspaceVolumeSeries=null;}
    const drawingAwareAutoscale=original=>{
      const base=original(),drawingBounds=workspaceVisibleDrawingPriceBounds();
      if(!drawingBounds)return base;
      const baseMin=base?.priceRange?.minValue,baseMax=base?.priceRange?.maxValue;
      const min=Math.min(Number.isFinite(baseMin)?baseMin:drawingBounds.min,drawingBounds.min);
      const max=Math.max(Number.isFinite(baseMax)?baseMax:drawingBounds.max,drawingBounds.max);
      const padding=(max-min)*.012||Math.max(Math.abs(max)*.0005,1e-8);
      return {priceRange:{minValue:min-padding,maxValue:max+padding},...(base?.margins?{margins:base.margins}:{})};
    };
    workspacePriceSeries=workspaceChart.addSeries(workspaceChartType==="candles"?L.CandlestickSeries:L.LineSeries,
      workspaceChartType==="candles"
      ?{upColor:"#28cda0",downColor:"#f06479",borderUpColor:"#28cda0",borderDownColor:"#f06479",wickUpColor:"#28cda0",wickDownColor:"#f06479",priceFormat,priceLineVisible:true,lastValueVisible:true,autoscaleInfoProvider:drawingAwareAutoscale}
      :{color:"#55c9e8",lineWidth:2,priceFormat,priceLineVisible:true,lastValueVisible:true,crosshairMarkerVisible:true,autoscaleInfoProvider:drawingAwareAutoscale});
    if(workspaceChartType==="candles")workspacePriceSeries.setData(workspaceBars);
    else workspacePriceSeries.setData(workspaceBars.map(b=>({time:b.time,value:b.close})));
    workspaceVolumeSeries=workspaceChart.addSeries(L.HistogramSeries,{priceFormat:{type:"volume"},priceScaleId:"volume",lastValueVisible:false,priceLineVisible:false});
    workspaceVolumeSeries.priceScale().applyOptions({scaleMargins:{top:.82,bottom:0},visible:false});
    workspaceVolumeSeries.setData(workspaceBars.map(b=>({time:b.time,value:b.volume||0,color:b.close>=b.open?"rgba(53,214,160,.28)":"rgba(255,113,134,.28)"})));
    refreshWorkspacePriceScale();
  }
  function workspaceVisibleDrawingPriceBounds(){
    if(!workspaceChart||!workspaceBars.length||!workspaceDrawings.length)return null;
    const logical=workspaceChart.timeScale().getVisibleLogicalRange();
    const fromIndex=Math.max(0,Math.min(workspaceBars.length-1,Math.floor(logical?.from??0)));
    const toIndex=Math.max(fromIndex,Math.min(workspaceBars.length-1,Math.ceil(logical?.to??(workspaceBars.length-1))));
    const visibleStart=workspaceTimeNumber(workspaceBars[fromIndex].time);
    const visibleEnd=workspaceTimeNumber(workspaceBars[toIndex].time);
    if(!Number.isFinite(visibleStart)||!Number.isFinite(visibleEnd))return null;
    let min=Infinity,max=-Infinity;
    const add=value=>{const price=Number(value);if(Number.isFinite(price)){min=Math.min(min,price);max=Math.max(max,price);}};
    const addSegment=(first,second)=>{
      if(!first||!second)return;
      const t1=workspaceTimeNumber(first.time),t2=workspaceTimeNumber(second.time),v1=Number(first.value),v2=Number(second.value);
      if(![t1,t2,v1,v2].every(Number.isFinite))return;
      if(t1===t2){if(t1>=visibleStart&&t1<=visibleEnd){add(v1);add(v2);}return;}
      const start=Math.max(Math.min(t1,t2),visibleStart),end=Math.min(Math.max(t1,t2),visibleEnd);
      if(start>end)return;
      const valueAt=time=>v1+(v2-v1)*((time-t1)/(t2-t1));
      add(valueAt(start));add(valueAt(end));
    };
    workspaceDrawings.forEach(drawing=>{
      const points=Array.isArray(drawing.points)?drawing.points:[];
      if(drawing.type==="horizontal"){add(drawing.price);return;}
      if(drawing.type==="fib"){(workspaceFibLevels(drawing)||[]).forEach(level=>add(level.price));return;}
      if(drawing.type==="trend"&&points.length>=2){addSegment(points[0],points[1]);return;}
      if(drawing.type==="trendChannel"&&points.length>=3){
        const [a,b,c]=points;
        addSegment(a,b);
        addSegment(c,{time:workspaceTimeNumber(c.time)+(workspaceTimeNumber(b.time)-workspaceTimeNumber(a.time)),value:Number(c.value)+(Number(b.value)-Number(a.value))});
        return;
      }
      if(["percent","rect","roundRect","circle","ellipse"].includes(drawing.type)&&points.length>=2){
        const times=points.map(point=>workspaceTimeNumber(point.time)).filter(Number.isFinite);
        if(times.length&&Math.max(...times)>=visibleStart&&Math.min(...times)<=visibleEnd)points.forEach(point=>add(point.value));
        return;
      }
      points.forEach(point=>{const time=workspaceTimeNumber(point.time);if(time>=visibleStart&&time<=visibleEnd)add(point.value);});
    });
    return Number.isFinite(min)&&Number.isFinite(max)?{min,max}:null;
  }
  function refreshWorkspacePriceScale(){
    if(!workspacePriceSeries)return;
    try{workspacePriceSeries.priceScale().applyOptions({autoScale:true});}catch{}
  }
  function updateWorkspaceDrawingScaleSeries(){refreshWorkspacePriceScale();}
  function workspaceTimeNumber(time){
    if(typeof time==="number")return time;
    if(time&&typeof time==="object"&&Number.isFinite(Number(time.year)))return Math.floor(Date.UTC(Number(time.year),Number(time.month)-1,Number(time.day))/1000);
    const parsed=Number(time);return Number.isFinite(parsed)?parsed:NaN;
  }
  function workspaceNominalBarInterval(source=workspaceBars){
    const intervals=[];
    for(let index=1;index<source.length;index++){
      const previous=workspaceTimeNumber(source[index-1]?.time),current=workspaceTimeNumber(source[index]?.time);
      const delta=current-previous;
      if(Number.isFinite(delta)&&delta>0)intervals.push(delta);
    }
    if(intervals.length){
      intervals.sort((a,b)=>a-b);
      const middle=Math.floor(intervals.length/2);
      return intervals.length%2?intervals[middle]:(intervals[middle-1]+intervals[middle])/2;
    }
    const raw=String(workspaceInterval||"15m");
    if(raw==="1M")return 30*86400;
    const match=raw.match(/^(\d+)(m|h|d|w)$/i);
    if(!match)return 86400;
    const amount=Number(match[1]),unit=match[2].toLowerCase();
    const seconds=unit==="m"?60:unit==="h"?3600:unit==="d"?86400:604800;
    return amount*seconds;
  }
  function workspaceLogicalIndexForTime(time,source=workspaceBars){
    const target=workspaceTimeNumber(time);
    if(!Number.isFinite(target)||!Array.isArray(source)||!source.length)return NaN;
    let low=0,high=source.length-1;
    while(low<=high){
      const middle=(low+high)>>1,stamp=workspaceTimeNumber(source[middle].time);
      if(stamp===target)return middle;
      if(stamp<target)low=middle+1;else high=middle-1;
    }
    const interval=workspaceNominalBarInterval(source);
    if(!Number.isFinite(interval)||interval<=0)return NaN;
    if(high<0){
      const first=workspaceTimeNumber(source[0].time);
      return (target-first)/interval;
    }
    if(low>=source.length){
      const lastIndex=source.length-1,last=workspaceTimeNumber(source[lastIndex].time);
      return lastIndex+(target-last)/interval;
    }
    const first=workspaceTimeNumber(source[high].time),second=workspaceTimeNumber(source[low].time);
    if(!Number.isFinite(first)||!Number.isFinite(second)||second<=first)return NaN;
    return high+(target-first)/(second-first);
  }
  function workspaceTimeForLogicalIndex(logicalIndex,source=workspaceBars){
    if(!Number.isFinite(logicalIndex)||!Array.isArray(source)||!source.length)return NaN;
    const lastIndex=source.length-1,interval=workspaceNominalBarInterval(source);
    const firstTime=workspaceTimeNumber(source[0].time),lastTime=workspaceTimeNumber(source[lastIndex].time);
    if(!Number.isFinite(firstTime)||!Number.isFinite(lastTime))return NaN;
    if(logicalIndex<0)return firstTime+logicalIndex*interval;
    if(logicalIndex>lastIndex)return lastTime+(logicalIndex-lastIndex)*interval;
    if(logicalIndex>=lastIndex)return lastTime;
    const left=Math.floor(logicalIndex),fraction=logicalIndex-left;
    const t1=workspaceTimeNumber(source[left].time),t2=workspaceTimeNumber(source[left+1].time);
    return Number.isFinite(t1)&&Number.isFinite(t2)?t1+(t2-t1)*fraction:NaN;
  }
  function workspaceTimeFromCoordinate(x){
    const scale=workspaceChart?.timeScale(),source=workspaceBars;
    if(!scale||!Array.isArray(source)||!source.length)return NaN;
    if(typeof scale.coordinateToLogical==="function"){
      const logicalIndex=scale.coordinateToLogical(x);
      if(Number.isFinite(logicalIndex)){
        const time=workspaceTimeForLogicalIndex(logicalIndex,source);
        if(Number.isFinite(time))return time;
      }
    }
    return workspaceTimeNumber(scale.coordinateToTime(x));
  }
  function workspaceDrawingTimeCoordinate(time){
    const target=workspaceTimeNumber(time),scale=workspaceChart?.timeScale(),source=workspaceBars;
    if(!Number.isFinite(target)||!scale||!Array.isArray(source)||source.length<2)return NaN;
    // Resolve a drawing timestamp against the actual candle timestamps first.
    // Interpolate between adjacent candle centres in pixel space. This avoids
    // logicalToCoordinate collapsing out-of-range/fractional anchors at an edge.
    let low=0,high=source.length-1;
    while(low<=high){
      const middle=(low+high)>>1,stamp=workspaceTimeNumber(source[middle].time);
      if(stamp===target){
        const exactX=scale.timeToCoordinate(source[middle].time);
        return Number.isFinite(exactX)?exactX:scale.logicalToCoordinate(middle);
      }
      if(stamp<target)low=middle+1;else high=middle-1;
    }
    let left,right;
    if(high<0){left=0;right=1;}
    else if(low>=source.length){left=source.length-2;right=source.length-1;}
    else{left=high;right=low;}
    const t1=workspaceTimeNumber(source[left].time),t2=workspaceTimeNumber(source[right].time);
    if(!Number.isFinite(t1)||!Number.isFinite(t2)||t2<=t1)return NaN;
    const x1=scale.timeToCoordinate(source[left].time),x2=scale.timeToCoordinate(source[right].time);
    if(!Number.isFinite(x1)||!Number.isFinite(x2))return NaN;
    const ratio=(target-t1)/(t2-t1);
    return x1+(x2-x1)*ratio;
  }

  function workspaceDrawingLogicalBounds(source=workspaceBars){
    if(!Array.isArray(source)||source.length<2||!workspaceDrawings.length)return null;
    let from=Infinity,to=-Infinity;
    workspaceDrawings.forEach(drawing=>{
      const points=Array.isArray(drawing.points)?drawing.points:[];
      points.forEach(point=>{
        const index=workspaceLogicalIndexForTime(point?.time,source);
        if(Number.isFinite(index)){from=Math.min(from,index);to=Math.max(to,index);}
      });
    });
    return Number.isFinite(from)&&Number.isFinite(to)?{from,to}:null;
  }

  function workspaceIncludeDrawingsInVisibleRange(){
    if(!workspaceChart||!workspaceBars.length)return;
    const drawings=workspaceDrawingLogicalBounds(workspaceBars);
    const visible=workspaceChart.timeScale().getVisibleLogicalRange();
    if(!drawings||!visible)return;
    const padding=2;
    const from=Math.min(visible.from,drawings.from-padding);
    const to=Math.max(visible.to,drawings.to+padding);
    if(from<visible.from-0.5||to>visible.to+0.5){
      try{workspaceChart.timeScale().setVisibleLogicalRange({from,to});}catch{}
    }
  }
  function workspaceDrawingPoint(point){
    if(!point||!workspaceChart||!workspacePriceSeries)return null;
    const x=workspaceDrawingTimeCoordinate(point.time);
    const y=workspacePriceSeries.priceToCoordinate(Number(point.value));
    return Number.isFinite(x)&&Number.isFinite(y)?{x,y}:null;
  }
  function workspaceFibLevels(drawing){
    if(Array.isArray(drawing.points)&&drawing.points.length>=2){
      const first=Number(drawing.points[0].value),second=Number(drawing.points[1].value);
      const high=Math.max(first,second),low=Math.min(first,second),ratios=[0,.236,.382,.5,.618,.786,1];
      return ratios.map(ratio=>({price:high-(high-low)*ratio,label:(ratio*100).toFixed(1)+"%"}));
    }
    return Array.isArray(drawing.levels)?drawing.levels:[];
  }
  function workspaceDrawingTitle(drawing){
    const names={horizontal:"Yatay seviye",trend:"Trend çizgisi",fib:"Fibonacci",trendChannel:"Trend kanalı",percent:"Yükseliş / düşüş ölçümü",rect:"Dikdörtgen",roundRect:"Yuvarlatılmış dikdörtgen",circle:"Daire",ellipse:"Elips"};
    return names[drawing.type]||"Çizim";
  }
  function workspaceSvg(tag,attributes,index,handle=null){
    const node=document.createElementNS("http://www.w3.org/2000/svg",tag);
    Object.entries(attributes||{}).forEach(([key,value])=>node.setAttribute(key,String(value)));
    if(index!==undefined&&index!==null)node.dataset.drawingIndex=String(index);
    if(handle!==null)node.dataset.drawingHandle=String(handle);
    $("workspaceDrawingOverlay").appendChild(node);return node;
  }
  function workspaceAddLine(x1,y1,x2,y2,index,handle="body",color="#e8bd68",width=2){
    workspaceSvg("line",{x1,y1,x2,y2,stroke:color,"stroke-width":Math.max(12,width+10),"stroke-linecap":"round",opacity:.012,"vector-effect":"non-scaling-stroke","pointer-events":"stroke"},index,handle);
    workspaceSvg("line",{x1,y1,x2,y2,stroke:color,"stroke-width":Math.min(1.25,width),"stroke-linecap":"round","vector-effect":"non-scaling-stroke","pointer-events":"none"},null);
  }
  function workspaceAddHandle(x,y,index,handle){
    workspaceSvg("circle",{cx:x,cy:y,r:10,fill:"#ffffff",opacity:.012,stroke:"none","pointer-events":"all"},index,handle);
    workspaceSvg("circle",{cx:x,cy:y,r:3.5,fill:"#13253a",stroke:"#f3c976","stroke-width":1.2,"vector-effect":"non-scaling-stroke","pointer-events":"none"},null);
  }
  function renderWorkspaceDrawingOverlay(){
    const svg=$("workspaceDrawingOverlay"),container=$("workspaceChartContainer");
    if(!svg||!container||!workspaceChart||!workspacePriceSeries)return;
    const width=container.clientWidth,height=container.clientHeight;if(!width||!height)return;
    svg.setAttribute("viewBox","0 0 "+width+" "+height);svg.setAttribute("width",String(width));svg.setAttribute("height",String(height));svg.innerHTML="";
    const renderList=workspaceDraftDrawing?[...workspaceDrawings,workspaceDraftDrawing]:workspaceDrawings;
    renderList.forEach((drawing,index)=>{
      const draft=index>=workspaceDrawings.length,drawIndex=draft?null:index;
      const color=drawing.color||"#e8bd68",points=Array.isArray(drawing.points)?drawing.points:[],coords=points.map(workspaceDrawingPoint);
      if(drawing.type==="horizontal"){
        const y=workspacePriceSeries.priceToCoordinate(Number(drawing.price));if(!Number.isFinite(y))return;
        workspaceAddLine(0,y,width,y,drawIndex,"body",color,1.1);
        if(!draft)workspaceAddHandle(width*.5,y,index,"body");
        return;
      }
      if(drawing.type==="fib"){
        const levels=workspaceFibLevels(drawing),hasAnchors=coords.length>=2&&coords[0]&&coords[1];
        let x1=0;
        if(hasAnchors)x1=Math.min(coords[0].x,coords[1].x);
        const x2=Math.max(x1+18,width-78),labelX=x2+3,labelWidth=Math.max(35,width-labelX-3);
        const precision=instrument()?.decimals||2;
        levels.forEach(level=>{
          const y=workspacePriceSeries.priceToCoordinate(Number(level.price));if(!Number.isFinite(y))return;
          workspaceAddLine(x1,y,x2,y,drawIndex,"body",color,.95);
          workspaceSvg("rect",{x:labelX,y:y-6,width:labelWidth,height:12,rx:2,fill:"#070a0f",opacity:.94,"pointer-events":"none"},null);
          const label=workspaceSvg("text",{x:labelX+3,y:y+2.5,fill:color,"font-size":7.5,"font-family":"DM Sans,monospace","pointer-events":"none"},null);
          label.textContent=(level.label||"Fib")+"  "+fmtPrice(Number(level.price),precision);
        });
        if(hasAnchors&&!draft){workspaceAddHandle(coords[0].x,coords[0].y,index,0);workspaceAddHandle(coords[1].x,coords[1].y,index,1);}
        return;
      }
      if(coords.some(point=>!point))return;
      if(drawing.type==="trend"&&coords.length>=2){
        workspaceAddLine(coords[0].x,coords[0].y,coords[1].x,coords[1].y,drawIndex,"body",color,1.1);
      }else if(drawing.type==="trendChannel"&&coords.length>=3){
        const [first,second,third]=points;
        const firstTime=workspaceTimeNumber(first.time),secondTime=workspaceTimeNumber(second.time),thirdTime=workspaceTimeNumber(third.time);
        const firstValue=Number(first.value),secondValue=Number(second.value),thirdValue=Number(third.value);
        const offsetTime=thirdTime-firstTime,offsetValue=thirdValue-firstValue;
        const farPoint={time:secondTime+offsetTime,value:secondValue+offsetValue};
        const farCoord=workspaceDrawingPoint(farPoint);
        if(!farCoord)return;
        const a=coords[0],b=coords[1],c=coords[2],d=farCoord;
        workspaceSvg("polygon",{points:[a.x+","+a.y,b.x+","+b.y,d.x+","+d.y,c.x+","+c.y].join(" "),fill:"rgba(232,189,104,.055)",stroke:"none","pointer-events":"all"},drawIndex,"body");
        for(let level=0;level<4;level++){
          const ratio=level/3;
          const start=workspaceDrawingPoint({time:firstTime+offsetTime*ratio,value:firstValue+offsetValue*ratio});
          const end=workspaceDrawingPoint({time:secondTime+offsetTime*ratio,value:secondValue+offsetValue*ratio});
          if(start&&end)workspaceAddLine(start.x,start.y,end.x,end.y,drawIndex,"body",color,level===0||level===3?1.15:.85);
        }
      }else if(["rect","roundRect","circle","ellipse"].includes(drawing.type)&&coords.length>=2){
        const a=coords[0],b=coords[1],x=Math.min(a.x,b.x),y=Math.min(a.y,b.y),w=Math.abs(a.x-b.x),h=Math.abs(a.y-b.y);
        if(drawing.type==="circle"){
          const r=Math.min(w,h)/2;workspaceSvg("circle",{cx:(a.x+b.x)/2,cy:(a.y+b.y)/2,r,fill:"rgba(232,189,104,.045)",stroke:color,"stroke-width":1.1,"vector-effect":"non-scaling-stroke","pointer-events":"all"},drawIndex,"body");
        }else if(drawing.type==="ellipse"){
          workspaceSvg("ellipse",{cx:(a.x+b.x)/2,cy:(a.y+b.y)/2,rx:w/2,ry:h/2,fill:"rgba(232,189,104,.045)",stroke:color,"stroke-width":1.1,"vector-effect":"non-scaling-stroke","pointer-events":"all"},drawIndex,"body");
        }else{
          workspaceSvg("rect",{x,y,width:w,height:h,rx:drawing.type==="roundRect"?8:0,ry:drawing.type==="roundRect"?8:0,fill:"rgba(232,189,104,.045)",stroke:color,"stroke-width":1.1,"vector-effect":"non-scaling-stroke","pointer-events":"all"},drawIndex,"body");
        }
      }else if(drawing.type==="percent"&&coords.length>=2){
        const a=coords[0],b=coords[1],delta=Number(points[1].value)-Number(points[0].value),pct=Number(points[0].value)?delta/Number(points[0].value)*100:0;
        workspaceAddLine(a.x,a.y,b.x,b.y,drawIndex,"body",color,1.1);
        const label=workspaceSvg("text",{x:(a.x+b.x)/2+7,y:(a.y+b.y)/2-9,fill:color,"font-size":9,"font-weight":650,"font-family":"DM Sans,monospace","pointer-events":"all"},drawIndex,"body");
        label.textContent=(pct>=0?"+":"")+pct.toFixed(2)+"% · "+(delta>=0?"+":"")+fmtPrice(delta,instrument()?.decimals||2);
      }
      if(!draft&&workspaceSelectedDrawingIndex===index){
        points.forEach((point,pointIndex)=>{if(coords[pointIndex])workspaceAddHandle(coords[pointIndex].x,coords[pointIndex].y,index,pointIndex);});
      }
    });
  }
  function restoreWorkspaceDrawings(syncPriceScale=true){
    if(syncPriceScale)updateWorkspaceDrawingScaleSeries();
    renderWorkspaceDrawingOverlay();
  }
  async function loadWorkspaceChart(){
    const workspace=activeWorkspace();if(!workspace)return;
    const requestId=++workspaceLoadGeneration,requestWorkspaceId=workspace.id,requestInterval=workspaceInterval;
    // Capture the visible date window before replacing the bars. Re-fitting all
    // history on every timeframe switch zoomed the chart out by years and made
    // recent drawings collapse against the far-right edge.
    let previousTimeRange=null;
    if(workspaceChart&&workspaceBars.length&&workspaceLoadedWorkspaceId===requestWorkspaceId){
      try{
        const visible=workspaceChart.timeScale().getVisibleLogicalRange();
        if(visible){
          const from=workspaceTimeForLogicalIndex(visible.from,workspaceBars);
          const to=workspaceTimeForLogicalIndex(visible.to,workspaceBars);
          if(Number.isFinite(from)&&Number.isFinite(to)&&to>from)previousTimeRange={from,to};
        }
      }catch{}
    }
    workspaceLoadBusy=true;$("workspaceChartStatus").textContent="VERİ YÜKLENİYOR";
    try{
      ensureWorkspaceChart();
      const item=instrument(workspace.symbol);if(!item)throw new Error("Bu çalışma alanının sembolü bulunamadı.");
      const result=await getMarketData(item,requestInterval);
      if(requestId!==workspaceLoadGeneration||activeWorkspaceId!==requestWorkspaceId||workspaceInterval!==requestInterval)return;
      workspaceBars=result.bars;if(!workspaceBars.length)throw new Error("Seçili zaman diliminde mum verisi bulunamadı.");
      createWorkspacePriceSeries();
      let viewportRestored=false;
      if(previousTimeRange){
        const from=workspaceLogicalIndexForTime(previousTimeRange.from,workspaceBars);
        const to=workspaceLogicalIndexForTime(previousTimeRange.to,workspaceBars);
        const visibleFrom=Math.max(0,from),lastIndex=workspaceBars.length-1;
        // When moving to a shorter-history interval (for example 1m/5m),
        // clip only the unavailable left side while retaining right-side padding.
        if(Number.isFinite(visibleFrom)&&Number.isFinite(to)&&from<=lastIndex&&to>visibleFrom){
          try{workspaceChart.timeScale().setVisibleLogicalRange({from:visibleFrom,to});viewportRestored=true;}catch{}
        }
      }
      if(!viewportRestored)workspaceChart.timeScale().fitContent();
      // Keep every saved drawing anchor in the chart's visible time window.
      // Without this, a line crossing the viewport edge can appear as a tiny
      // fragment detached from its real endpoints on coarser intervals.
      workspaceIncludeDrawingsInVisibleRange();
      workspaceLoadedInterval=requestInterval;workspaceLoadedWorkspaceId=requestWorkspaceId;
      updateWorkspaceDrawingScaleSeries();restoreWorkspaceDrawings();
      $("workspaceChartTicker").textContent=item.ticker+" · "+requestInterval;
      $("workspaceChartSource").textContent=result.source+" · "+result.delay;
      $("workspaceChartStatus").textContent="ÇALIŞMA ALANI AKTİF";
      $("workspaceLastUpdate").textContent="Son güncelleme "+fmtTime();
      renderWorkspaceDrawingList();saveActiveWorkspace();
      setTimeout(()=>{
        if(requestId!==workspaceLoadGeneration||activeWorkspaceId!==requestWorkspaceId)return;
        try{workspaceChart.resize($("workspacePriceChart").clientWidth,$("workspacePriceChart").clientHeight);renderWorkspaceDrawingOverlay();}catch{}
      },80);
    }catch(error){
      if(requestId===workspaceLoadGeneration){$("workspaceChartStatus").textContent="VERİ HATASI";toast(error.message||"Çalışma alanı grafiği açılamadı.");}
    }finally{
      if(requestId===workspaceLoadGeneration)workspaceLoadBusy=false;
    }
  }
  function workspacePointFromPointer(event){
    const svg=$("workspaceDrawingOverlay"),rect=svg.getBoundingClientRect();
    const x=Math.max(0,Math.min(rect.width,event.clientX-rect.left)),y=Math.max(0,Math.min(rect.height,event.clientY-rect.top));
    const time=workspaceTimeFromCoordinate(x);
    const value=workspacePriceSeries.coordinateToPrice(y);
    return Number.isFinite(time)&&Number.isFinite(value)?{time,value,x,y}:null;
  }
  function workspaceNewDrawingId(){return "draw-"+Date.now()+"-"+Math.random().toString(36).slice(2,6);}
  function workspaceFinishDrawing(drawing){
    if(!drawing)return;
    drawing.id=workspaceNewDrawingId();drawing.color=drawing.color||"#e8bd68";
    if(drawing.type==="fib")drawing.levels=workspaceFibLevels(drawing);
    workspaceDrawings.push(drawing);workspaceSelectedDrawingIndex=workspaceDrawings.length-1;
    workspaceDraftPoints=[];workspaceDraftDrawing=null;workspaceCreateGesture=null;workspaceDrawingMode=null;
    $("workspaceDrawingOverlay").classList.remove("drawing-enabled");
    saveActiveWorkspace();restoreWorkspaceDrawings();renderWorkspaceDrawingList();
    $("workspaceDrawHint").textContent="Çizim kaydedildi. Görünen çizgiyi veya tutamaçlarını sürükleyerek konumunu düzeltebilirsin.";
    document.querySelectorAll("[data-workspace-drawing]").forEach(b=>b.classList.remove("active"));
  }
  function startWorkspaceDrawingPointer(event){
    if(workspaceDrawingMode){
      if(event.pointerType==="mouse"&&event.button!==0)return;
      const point=workspacePointFromPointer(event);if(!point)return;
      event.preventDefault();event.stopPropagation();
      if(workspaceDrawingMode==="horizontal"){
        workspaceFinishDrawing({type:"horizontal",price:point.value,title:"Seviye"});return;
      }
      const mode=workspaceDrawingMode;
      if(mode==="trendChannel"&&workspaceDraftPoints.length>=2){
        workspaceCreateGesture={mode,stage:"boundary",start:point,current:point};
        workspaceDraftDrawing={type:"trendChannel",points:[...workspaceDraftPoints.map(p=>({...p})),{time:point.time,value:point.value}]};
      }else{
        workspaceCreateGesture={mode,stage:"shape",start:point,current:point};
        workspaceDraftDrawing={type:mode,points:[{time:point.time,value:point.value},{time:point.time,value:point.value}]};
      }
      try{$("workspaceDrawingOverlay").setPointerCapture(event.pointerId);}catch{}
      renderWorkspaceDrawingOverlay();return;
    }
    startWorkspaceDrawingDrag(event);
  }
  function moveWorkspaceDrawingPointer(event){
    if(workspaceCreateGesture){
      event.preventDefault();event.stopPropagation();
      const point=workspacePointFromPointer(event);if(!point)return;
      workspaceCreateGesture.current=point;
      if(workspaceCreateGesture.stage==="boundary"){
        workspaceDraftDrawing.points[2]={time:point.time,value:point.value};
      }else workspaceDraftDrawing.points[1]={time:point.time,value:point.value};
      renderWorkspaceDrawingOverlay();return;
    }
    moveWorkspaceDrawingDrag(event);
  }
  function finishWorkspaceDrawingPointer(event){
    if(workspaceCreateGesture){
      event.preventDefault?.();event.stopPropagation?.();
      const gesture=workspaceCreateGesture,point=workspacePointFromPointer(event)||gesture.current;
      if(!point)return;
      const moved=Math.hypot((point.x??0)-(gesture.start.x??0),(point.y??0)-(gesture.start.y??0));
      if(gesture.mode==="trendChannel"&&gesture.stage==="shape"){
        if(moved<4){workspaceCreateGesture=null;workspaceDraftDrawing=null;restoreWorkspaceDrawings();$("workspaceDrawHint").textContent="Ana trend çizgisini grafikte basılı tutup sürükle. Sonra karşı tepe/dip noktasını seç.";return;}
        workspaceDraftPoints=[{time:gesture.start.time,value:gesture.start.value},{time:point.time,value:point.value}];
        workspaceDraftDrawing={type:"trend",points:workspaceDraftPoints.map(p=>({...p}))};workspaceCreateGesture=null;
        renderWorkspaceDrawingOverlay();
        $("workspaceDrawHint").textContent="Ana çizgi hazır. Kanalın karşı sınırını belirleyen tepe/dip noktasına dokunup sürükle.";return;
      }
      if(gesture.mode==="trendChannel"&&gesture.stage==="boundary"){
        const anchor=workspaceDraftPoints[0],end=workspaceDraftPoints[1];
        const third={time:point.time,value:point.value};
        if(Math.abs(third.time-anchor.time)<1&&Math.abs(third.value-anchor.value)<1e-12){workspaceCreateGesture=null;return;}
        workspaceFinishDrawing({type:"trendChannel",points:[{...anchor},{...end},third]});return;
      }
      if(moved<4){workspaceCreateGesture=null;workspaceDraftDrawing=null;restoreWorkspaceDrawings();$("workspaceDrawHint").textContent="Tek bir çizim için grafikte basılı tutup sürükle.";return;}
      workspaceFinishDrawing({type:gesture.mode,points:[{time:gesture.start.time,value:gesture.start.value},{time:point.time,value:point.value}]});return;
    }
    finishWorkspaceDrawingDrag(event);
  }
  function chooseWorkspaceDrawing(mode){
    workspaceDrawingMode=mode;workspaceFirstPoint=null;workspaceDraftPoints=[];workspaceDraftDrawing=null;workspaceCreateGesture=null;
    const overlay=$("workspaceDrawingOverlay");if(overlay)overlay.classList.toggle("drawing-enabled",mode!=="clear"&&!!mode);
    document.querySelectorAll("[data-workspace-drawing]").forEach(b=>b.classList.toggle("active",b.dataset.workspaceDrawing===mode));
    if(mode==="clear"){
      workspaceDrawings=[];workspaceSelectedDrawingIndex=-1;restoreWorkspaceDrawings();saveActiveWorkspace();renderWorkspaceDrawingList();workspaceDrawingMode=null;
      if(overlay)overlay.classList.remove("drawing-enabled");
      document.querySelectorAll("[data-workspace-drawing]").forEach(b=>b.classList.remove("active"));
      $("workspaceDrawHint").textContent="Bu çalışma alanındaki çizimler temizlendi.";return;
    }
    const hints={
      horizontal:"Yatay seviye için grafikte fiyat konumuna bir kez dokun.",
      trend:"Trend çizgisini tek harekette basılı tutup sürükleyerek çiz.",
      fib:"Fibonacci için dipten tepeye (veya tepeden dibe) basılı tutup sürükle.",
      trendChannel:"Önce ana trend çizgisini sürükle; sonra karşı tepe/dip noktasına sürükleyerek dört paralel kanal seviyesini tamamla.",
      percent:"Yükseliş/düşüş yüzdesini başlangıçtan bitişe sürükleyerek ölç.",
      rect:"Dikdörtgeni bir köşeden karşı köşeye sürükleyerek çiz.",
      roundRect:"Yuvarlatılmış dikdörtgeni bir köşeden karşı köşeye sürükleyerek çiz.",
      circle:"Dairenin çapını sürükleyerek belirle.",
      ellipse:"Elipsi bir köşeden karşı köşeye sürükleyerek çiz."
    };
    $("workspaceDrawHint").textContent=hints[mode]||"Çizim için grafikte basılı tutup sürükle.";
  }
  function startWorkspaceDrawingDrag(event){
    const svg=$("workspaceDrawingOverlay"),target=event.target.closest?.("[data-drawing-index]");
    if(!target||workspaceDrawingMode)return;
    const index=Number(target.dataset.drawingIndex);if(!Number.isInteger(index)||!workspaceDrawings[index])return;
    event.preventDefault();event.stopPropagation();
    const rect=svg.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;
    const startTime=workspaceTimeFromCoordinate(x);
    const startPrice=workspacePriceSeries.coordinateToPrice(y);
    workspaceSelectedDrawingIndex=index;
    workspaceDrag={index,handle:target.dataset.drawingHandle??"body",startX:x,startY:y,startTime,startPrice,original:JSON.parse(JSON.stringify(workspaceDrawings[index]))};
    try{svg.setPointerCapture(event.pointerId);}catch{}
    renderWorkspaceDrawingOverlay();
  }
  function moveWorkspaceDrawingDrag(event){
    if(!workspaceDrag)return;
    event.preventDefault();event.stopPropagation();
    const rect=$("workspaceDrawingOverlay").getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;
    const time=workspaceTimeFromCoordinate(x),price=workspacePriceSeries.coordinateToPrice(y);
    if(!Number.isFinite(time)||!Number.isFinite(price))return;
    const drag=workspaceDrag,drawing=JSON.parse(JSON.stringify(drag.original)),handle=drag.handle;
    if(drawing.type==="horizontal")drawing.price=price;
    else if(drawing.type==="fib"&&(!Array.isArray(drawing.points)||drawing.points.length<2)){
      const delta=price-drag.startPrice;
      drawing.levels=(drawing.levels||[]).map(level=>({...level,price:Number(level.price)+delta}));
    }else if(handle!=="body"&&Array.isArray(drawing.points)){
      const pointIndex=Number(handle);
      if(Number.isInteger(pointIndex)&&drawing.points[pointIndex])drawing.points[pointIndex]={time,value:price};
      if(drawing.type==="fib")drawing.levels=workspaceFibLevels(drawing);
    }else if(Array.isArray(drawing.points)){
      const deltaTime=time-drag.startTime,deltaPrice=price-drag.startPrice;
      drawing.points=drawing.points.map(point=>({time:Number(point.time)+deltaTime,value:Number(point.value)+deltaPrice}));
      if(drawing.type==="fib")drawing.levels=workspaceFibLevels(drawing);
    }
    workspaceDrawings[drag.index]=drawing;restoreWorkspaceDrawings(false);
  }
  function finishWorkspaceDrawingDrag(event){
    if(!workspaceDrag)return;
    event.preventDefault?.();event.stopPropagation?.();
    workspaceDrag=null;saveActiveWorkspace();renderWorkspaceDrawingList();renderWorkspaceDrawingOverlay();
  }
  function renderWorkspaceDrawingList(){
    const host=$("workspaceDrawingList");if(!host)return;host.innerHTML="";
    if(!workspaceDrawings.length){const e=document.createElement("span");e.className="subtle-copy";e.textContent="Henüz çalışma alanı çizimi yok.";host.appendChild(e);return;}
    workspaceDrawings.forEach((drawing,index)=>{
      const row=document.createElement("span");row.className="active-study-pill workspace-drawing-pill";
      const title=document.createElement("span");title.textContent=workspaceDrawingTitle(drawing)+(drawing.type==="horizontal"?" · "+fmtPrice(Number(drawing.price),instrument()?.decimals||2):drawing.type==="fib"?" · "+(workspaceFibLevels(drawing).length||0)+" seviye":"");
      const select=document.createElement("button");select.type="button";select.textContent="↔";select.title="Grafikte seç ve taşı";select.addEventListener("click",()=>{workspaceSelectedDrawingIndex=index;renderWorkspaceDrawingOverlay();$("workspaceDrawHint").textContent="Grafikte seçili çizgiyi veya görünen uç noktalarını sürükleyerek taşı."});
      const remove=document.createElement("button");remove.type="button";remove.textContent="×";remove.title="Çizimi sil";
      remove.addEventListener("click",()=>{workspaceDrawings.splice(index,1);if(workspaceSelectedDrawingIndex===index)workspaceSelectedDrawingIndex=-1;else if(workspaceSelectedDrawingIndex>index)workspaceSelectedDrawingIndex--;saveActiveWorkspace();restoreWorkspaceDrawings();renderWorkspaceDrawingList();});
      row.append(title,select,remove);host.appendChild(row);
    });
  }

    let watchOrderControlsVisible = false;
  try { watchOrderControlsVisible = localStorage.getItem(WATCH_ORDER_KEY) === "1"; } catch {}
  function renderWatchOrderToggle(){
    const button=$("toggleWatchOrderControls");if(!button)return;
    button.textContent=watchOrderControlsVisible?"Taşıma düğmelerini gizle":"Taşıma düğmelerini göster";
    button.setAttribute("aria-expanded",String(watchOrderControlsVisible));
    button.setAttribute("aria-pressed",String(watchOrderControlsVisible));
  }
  function toggleWatchOrderControls(){
    watchOrderControlsVisible=!watchOrderControlsVisible;
    try{localStorage.setItem(WATCH_ORDER_KEY,watchOrderControlsVisible?"1":"0");}catch{}
    document.querySelectorAll(".watch-order-controls").forEach(node=>{node.hidden=!watchOrderControlsVisible;});
    renderWatchOrderToggle();
  }

  function updateWatchlist(){
    const host=$("watchlist");host.innerHTML="";
    const visible=filteredWatchlistIds().map(id=>instrument(id)).filter(Boolean);
    visible.forEach(item=>{
      const row=document.createElement("div");row.className="watch-row"+(item.id===activeSymbol?" active":"");row.dataset.symbol=item.id;row.setAttribute("role","button");row.tabIndex=0;
      row.innerHTML='<span class="watch-symbol-icon"></span><span class="watch-meta"><strong></strong><small></small></span><span class="watch-quote"><strong data-quote-price>—</strong><small data-quote-change>—</small></span><span class="watch-order-controls"'+(watchOrderControlsVisible?"":" hidden")+'><button type="button" class="watch-order-btn" data-move="-1" aria-label="Yukarı taşı">▲</button><button type="button" class="watch-order-btn" data-move="1" aria-label="Aşağı taşı">▼</button></span>';
      row.querySelector(".watch-symbol-icon").textContent=item.ticker.slice(0,2);row.querySelector(".watch-meta strong").textContent=item.ticker;row.querySelector(".watch-meta small").textContent=item.name;
      const visibleIndex=visible.findIndex(v=>v.id===item.id),controls=row.querySelectorAll(".watch-order-btn");
      controls[0].disabled=visibleIndex===0;controls[1].disabled=visibleIndex===visible.length-1;
      row.addEventListener("click",e=>{if(e.target.closest(".watch-order-controls"))return;selectSymbol(item.id);});
      row.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&!e.target.closest(".watch-order-controls")){e.preventDefault();selectSymbol(item.id);}});
      controls.forEach(btn=>btn.addEventListener("click",e=>{e.stopPropagation();moveWatchlistItem(item.id,Number(btn.dataset.move));}));host.appendChild(row);
    });
    if(!visible.length){const empty=document.createElement("div");empty.className="subtle-copy";empty.textContent="Bu kategoride izleme sembolü yok.";host.appendChild(empty);}
    refreshWatchlistQuotes();renderWorkspaceNav();renderWatchOrderToggle();syncBinanceLiveSubscriptions();
  }
  async function refreshWatchlistQuotes(){
    if(watchQuoteBusy)return;watchQuoteBusy=true;
    try{
      const items=watchlist.map(id=>instrument(id)).filter(Boolean);
      for(let i=0;i<items.length;i+=5){
        const quotes=await Promise.all(items.slice(i,i+5).map(async item=>{
          if(isBinanceSpotInstrument(item)){
            const live=binanceLiveQuotes.get(String(item.pair).toUpperCase());
            if(live&&Date.now()-live.receivedAt<15000)return {item,quote:live};
          }
          return {item,quote:await fetchQuote(item.id).catch(()=>null)};
        }));
        for(const result of quotes)if(result.quote)updateWatchlistQuoteRow(result.item,result.quote);
      }
    }finally{watchQuoteBusy=false;}
  }

  

    async function renderSearchResults(query){
    const host=$("searchResults");host.innerHTML="";
    const q=String(query||"").toLocaleLowerCase("tr-TR").trim();if(!q){host.hidden=true;return;}
    const requestId=++searchRequestId;
    const appendItem=item=>{
      if([...host.querySelectorAll(".search-result")].some(node=>node.dataset.symbol===item.id))return;
      const b=document.createElement("button");b.type="button";b.className="search-result";b.dataset.symbol=item.id;b.innerHTML='<span><strong></strong><small></small></span><em></em>';
      b.querySelector("strong").textContent=item.ticker;b.querySelector("small").textContent=item.name;b.querySelector("em").textContent=item.exchange;
      b.addEventListener("click",()=>{selectSymbol(item.id);$("symbolSearch").value="";host.hidden=true;});host.appendChild(b);
    };
    symbols.filter(s=>symbolMatches(s,q)).slice(0,15).forEach(appendItem);
    if(q.length>=2){
      try{await loadMarketCatalogs();}catch{}
      if(requestId!==searchRequestId)return;
      symbols.filter(s=>symbolMatches(s,q)).slice(0,20).forEach(appendItem);
      const upper=q.toUpperCase().replace(/\s+/g,"");
      const currencies=new Set(["USD","EUR","GBP","JPY","CHF","CAD","AUD","NZD","TRY","CNY","CNH","HKD","SGD","SEK","NOK","DKK","PLN","MXN","ZAR","INR","KRW","BRL","RUB","THB"]);
      const isForex=/^[A-Z]{6}$/.test(upper)&&currencies.has(upper.slice(0,3))&&currencies.has(upper.slice(3));
      if(isForex){const item=ensureInstrument("YAHOO:"+upper+"=X");if(item)appendItem(item);}
      else if(/^[A-Z0-9]{3,8}$/.test(upper)&&!symbols.some(s=>s.id==="BIST:"+upper)){const item=ensureInstrument("BIST:"+upper);if(item)appendItem(item);}
      if(/^[A-Z0-9.^_-]+(=X|=F)$/.test(upper)){const item=ensureInstrument("YAHOO:"+upper);if(item)appendItem(item);}
      if(/^[A-Z0-9]{2,18}USDT$/.test(upper)&&!symbols.some(s=>s.ticker===upper)){const item=ensureInstrument("BINANCE-FUTURES:"+upper);if(item)appendItem(item);}
    }
    if(!host.querySelector(".search-result")){const hint=document.createElement("div");hint.className="subtle-copy";hint.style.padding="10px";hint.textContent=q.length>=2?"Sembol bulunamadı. Tam kodu veya borsa önekini deneyebilirsin.":"En az 2 karakter yaz.";host.appendChild(hint);}
    host.hidden=false;
  }

    function renderLayouts() {
    const host=$("savedLayouts");host.innerHTML="";
    if (!layouts.length) {const e=document.createElement("span");e.className="subtle-copy";e.textContent="Henüz kayıtlı düzen yok.";host.appendChild(e);return;}
    layouts.forEach((layout,index)=>{
      const item=document.createElement("div");item.className="saved-layout";
      const label=document.createElement("span");label.textContent=layout.name;
      const load=document.createElement("button");load.textContent="Yükle";load.addEventListener("click",()=>loadLayout(index));
      const del=document.createElement("button");del.className="delete";del.textContent="Sil";del.addEventListener("click",()=>deleteLayout(index));
      item.append(label,load,del);host.appendChild(item);
    });
  }

  function saveLayout() {
    const name=$("layoutName").value.trim();
    if (!name) {toast("Önce düzenine bir isim ver.");return;}
    const layout={name,symbol:activeSymbol,interval:activeInterval,chartType,studies:[...activeStudies],drawings:drawingLines.map(d=>JSON.parse(JSON.stringify(({...d,_runtimeId:undefined})) ))};
    const index=layouts.findIndex(x=>x.name.toLocaleLowerCase("tr-TR")===name.toLocaleLowerCase("tr-TR"));
    if (index>=0) layouts[index]=layout;else layouts.unshift(layout);
    layouts=layouts.slice(0,40);saveLayouts();renderLayouts();toast("Grafik düzeni kaydedildi.");
  }

  function loadLayout(index) {
    const layout=layouts[index];if(!layout)return;
    if (!ensureInstrument(layout.symbol)) { toast("Kayıtlı sembol bu sürümde tanınmıyor."); return; }
    clearDrawingRuntime();
    activeSymbol=layout.symbol;
    activeInterval=layout.interval;
    chartType=layout.chartType;
    activeStudies=[...layout.studies];
    drawingLines=Array.isArray(layout.drawings)?layout.drawings:[];
    saveStudies();saveDrawings();
    document.querySelectorAll("#timeframes button").forEach(b=>b.classList.toggle("active",b.dataset.interval===activeInterval));
    $("candlesButton").classList.toggle("active",chartType==="candles");
    $("lineButton").classList.toggle("active",chartType==="line");
    updateWatchlist();
    loadChart();
    toast(layout.name+" yüklendi.");
  }

  function deleteLayout(index) {
    layouts.splice(index,1);saveLayouts();renderLayouts();toast("Düzen silindi.");
  }

  async function selectSymbol(id,keepSettings=false) {
    if(activeWorkspaceId)showRawChart();
    if (!ensureInstrument(id)) return;
    clearDrawingRuntime();
    activeSymbol=id;
    activeStudies=keepSettings?activeStudies:loadStudies(id);
    drawingLines=keepSettings?drawingLines:loadDrawings(id);
    document.querySelectorAll(".timeframe-group button").forEach(b=>b.classList.toggle("active",b.dataset.interval===activeInterval));
    updateWatchlist();
    await loadChart();
  }

  async function loadChart(preserveView = false) {
    if (isLoading) {
      pendingReload = true;
      return;
    }
    const item=instrument();
    const savedRange = preserveView && chart ? chart.timeScale().getVisibleLogicalRange() : readSavedRange();
    if (!item) return;
    if (!createChartIfNeeded()) {
      setMessage("Grafik motoru yüklenemedi","Grafik kitaplığı internetten alınamadı. İnternet bağlantısını kontrol edip yeniden dene.");
      setStatus("GRAFİK MOTORU YOK","warn");return;
    }
    isLoading=true;
    if(isBinanceSpotInstrument(item)){
      $("chartOverlay").hidden=true;
      setStatus(binanceMarketSocket?.readyState===window.WebSocket.OPEN?"BINANCE · CANLI":"BINANCE · BAĞLANIYOR",binanceMarketSocket?.readyState===window.WebSocket.OPEN?"good":"warn");
    }else{
      setMessage("Piyasa verisi getiriliyor",item.type==="bist"?"BIST mum verisi doğrulanıyor.":"Seçili sembol için mumlar yükleniyor.");
      setStatus("VERİ YÜKLENİYOR","warn");
    }
    $("chartSource").textContent=marketProviderLabel(item);
    $("chartTicker").textContent=item.ticker;
    try {
      const result=await getMarketData(item,activeInterval);
      bars=result.bars;
      if (!bars.length) throw new Error("Seçili sembol ve zaman aralığı için mum verisi bulunamadı.");
      clearDrawingRuntime();
      ensureMainSeries();
      if (chartType==="candles") candleSeries.setData(bars);
      else lineSeries.setData(bars.map(b=>({time:b.time,value:b.close})));
      volumeSeries.setData(bars.map(b=>({time:b.time,value:b.volume||0,color:b.close>=b.open?"rgba(53,214,160,.28)":"rgba(255,113,134,.28)"})));
      renderStudies();
      drawingLines=loadDrawings(activeSymbol);
      restoreDrawingLines();renderDrawingList();
      const rangeToRestore = savedRange || (!preserveView ? readSavedRange() : null);
      if (rangeToRestore) {
        // Older saved views include the former seven-bar right offset. Shift
        // that unused tail out of the viewport while preserving candle spacing.
        const lastCandleIndex=bars.length-1;
        const trailingEmptySpace=Math.max(0,rangeToRestore.to-lastCandleIndex);
        const normalizedRange=trailingEmptySpace>0
          ? {from:rangeToRestore.from-trailingEmptySpace,to:lastCandleIndex}
          : rangeToRestore;
        try { chart.timeScale().setVisibleLogicalRange(normalizedRange); }
        catch { chart.timeScale().fitContent(); }
      } else {
        chart.timeScale().fitContent();
      }
      const alignedRange=chart.timeScale().getVisibleLogicalRange();
      if(alignedRange)syncRawChartRanges(chart,alignedRange);
      updateMarketRangeLevels();
      const liveQuote=isBinanceSpotInstrument(item)?binanceLiveQuotes.get(String(item.pair).toUpperCase()):null;
      renderInstrumentHeader(item,liveQuote||result.quote,bars[bars.length-1]);
      $("chartSource").textContent=marketProviderLabel(item);
      $("dataDelay").textContent=result.delay;
      $("lastUpdate").textContent="Son güncelleme "+fmtTime();
      $("chartStatusText").textContent="GRAFİK AKTİF";
      $("chartLiveStatus").classList.add("ready");
      $("chartOverlay").hidden=true;
      setStatus(isBinanceSpotInstrument(item)?(binanceMarketSocket?.readyState===window.WebSocket.OPEN?"BINANCE · CANLI":"BINANCE · AKTİF"):item.type==="bist"?"BIST · YAHOO GECİKMELİ":item.type==="gold"?"GRAM ALTIN · HESAPLANAN REFERANS":item.type==="forex"?"FOREX · YAHOO":item.type==="commodity"?"EMTİA · YAHOO":item.type==="index"?"ENDEKS · YAHOO":item.provider==="binanceFutures"?"KRİPTO VADELİ · AKTİF":item.provider?.startsWith("okx")?"OKX · AKTİF":"KRİPTO · AKTİF","good");
      updateWatchlist();
      scheduleRefresh();
    } catch(error) {
      const keyMissing=error.code==="BIST_API_KEY_REQUIRED";
      if (keyMissing) {
        setMessage("BIST veri bağlantısı gerekli","PETKM ve BIST endeksleri için uygulama içinde kendi mum motorumuzu kullanıyoruz. Lisanslı 15 dk gecikmeli istfin API anahtarını ekle; Investing ve TradingView sayfasına yönlendirme yapılmaz.",true);
        setStatus("BIST VERİ ANAHTARI GEREKLİ","warn");
      } else {
        setMessage("Grafik verisi alınamadı",error.message||"Veri sağlayıcıya ulaşılamadı. Daha sonra tekrar dene.");
        setStatus("VERİ HATASI","warn");
      }
      $("chartSource").textContent=item.provider==="yahoo"?"Yahoo Finance · bağlantı hatası":item.provider?.startsWith("okx")?"OKX · bağlantı hatası":"Binance · bağlantı hatası";
      $("dataDelay").textContent="Veri doğrulanamadı";
    } finally {
      isLoading=false;
      if (pendingReload) {
        pendingReload=false;
        setTimeout(() => loadChart(), 0);
      }
    }
  }

  function scheduleRefresh() {
    clearTimeout(refreshTimer);
    const item=instrument();
    if(isBinanceSpotInstrument(item)){
      refreshTimer=setTimeout(async()=>{
        if(document.hidden){scheduleRefresh();return;}
        const live=binanceLiveQuotes.get(String(item.pair).toUpperCase());
        if(!live||Date.now()-live.receivedAt>12000){
          const quote=await fetchQuote(item.id).catch(()=>null);
          if(quote&&activeSymbol===item.id)renderInstrumentHeader(item,quote,bars[bars.length-1]);
          await loadChart(true);
        }else scheduleRefresh();
      },30000);
      return;
    }
    refreshTimer=setTimeout(async()=>{
      if (!document.hidden) await loadChart(true);
      else scheduleRefresh();
    },item?.type==="bist"?60000:30000);
  }

  function selectInterval(interval) {
    if (!intervals.includes(interval)) return;
    activeInterval=interval;
    document.querySelectorAll("#timeframes button").forEach(b=>b.classList.toggle("active",b.dataset.interval===interval));
    renderWorkspaceNav();syncBinanceLiveSubscriptions();
    loadChart();
  }

  function setChartType(type) {
    if (type===chartType) return;
    chartType=type;
    $("candlesButton").classList.toggle("active",type==="candles");
    $("lineButton").classList.toggle("active",type==="line");
    if (bars.length) {
      clearDrawingRuntime();
      ensureMainSeries();
      if (type==="candles") candleSeries.setData(bars);
      else lineSeries.setData(bars.map(b=>({time:b.time,value:b.close})));
      volumeSeries.setData(bars.map(b=>({time:b.time,value:b.volume||0,color:b.close>=b.open?"rgba(53,214,160,.28)":"rgba(255,113,134,.28)"})));
      renderStudies();
      drawingLines=loadDrawings(activeSymbol);
      restoreDrawingLines();
      updateMarketRangeLevels();
    }
  }

  function toggleFavorite() {
    if (watchlist.includes(activeSymbol)) watchlist=watchlist.filter(x=>x!==activeSymbol);
    else watchlist.unshift(activeSymbol);
    watchlist=watchlist.slice(0,30);saveWatchlist();updateWatchlist();
    $("favoriteButton").classList.toggle("active",watchlist.includes(activeSymbol));
    $("favoriteButton").textContent=watchlist.includes(activeSymbol)?"★":"☆";
  }

  async function verifyIstfinKey(key) {
    const response=await fetch(ISTFIN+"/bars/PETKM?interval=15m&limit=3",{
      cache:"no-store",headers:{Authorization:"Bearer "+key,Accept:"application/json"}
    });
    const body=await response.json().catch(()=>({}));
    if (!response.ok) throw new Error(body?.error?.message||"API anahtarı doğrulanamadı ("+response.status+").");
    if (!Array.isArray(body.data)||!body.data.length) throw new Error("Anahtar çalışıyor ancak PETKM için mum verisi bulunamadı.");
    return true;
  }

  async function saveApiKey() {
    const key=$("istfinApiKey").value.trim();
    if (!key) {setSettingsMessage("API anahtarı boş bırakılamaz.",true);return;}
    $("saveApiKey").disabled=true;$("saveApiKey").textContent="Kontrol ediliyor…";
    try {
      await verifyIstfinKey(key);
      localStorage.setItem(ISTFIN_KEY,key);
      $("istfinState").textContent="BAĞLANDI";$("istfinState").classList.add("ready");
      setSettingsMessage("Bağlantı doğrulandı. Anahtar bu telefona kaydedildi.");
      toast("BIST veri bağlantısı hazır.");
      if (instrument()?.type==="bist") await loadChart();
      updateWatchlist();
    } catch(error) {
      setSettingsMessage(error.message,true);
    } finally {
      $("saveApiKey").disabled=false;$("saveApiKey").textContent="Bağlantıyı doğrula ve kaydet";
    }
  }

  function setSettingsMessage(message,error=false) {
    $("settingsMessage").textContent=message;
    $("settingsMessage").classList.toggle("error",error);
  }

  function openSettings() {
    $("settingsBackdrop").hidden=false;
    $("istfinApiKey").value=getIstfinKey();
    $("istfinState").textContent=getIstfinKey()?"KAYITLI":"AYARLANMADI";
    $("istfinState").classList.toggle("ready",!!getIstfinKey());
  }

  function closeSettings() { $("settingsBackdrop").hidden=true; }

  function bindEvents() {
    $("timeframes").addEventListener("click",e=>{
      const b=e.target.closest("[data-interval]");if(b)selectInterval(b.dataset.interval);
    });
    $("symbolSearch").addEventListener("input",e=>{
      clearTimeout(symbolSearchTimer);
      const value=e.target.value;
      symbolSearchTimer=setTimeout(()=>renderSearchResults(value),220);
    });
    $("symbolSearch").addEventListener("keydown",async e=>{
      if(e.key==="Enter"){
        const query=e.target.value;try{await loadMarketCatalogs();}catch{}
        const id=resolveSymbol(query);
        if(id){selectSymbol(id);e.target.value="";$("searchResults").hidden=true;}
        else toast("Sembol bulunamadı. Borsa kodunu ve işlem türünü kontrol et.");
      }
      if(e.key==="Escape")$("searchResults").hidden=true;
    });
    document.addEventListener("click",e=>{if(!e.target.closest(".symbol-search"))$("searchResults").hidden=true;});
    document.addEventListener("keydown",e=>{if(e.key==="/"&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){e.preventDefault();$("symbolSearch").focus();}});
    $("exportWatchlist").addEventListener("click",exportWatchlistBackup);
    $("importWatchlist").addEventListener("click",importWatchlistBackup);
    $("toggleWatchOrderControls").addEventListener("click",toggleWatchOrderControls);
    document.querySelectorAll("[data-watch-filter]").forEach(b=>b.addEventListener("click",()=>{
      activeFilter=b.dataset.watchFilter;document.querySelectorAll("[data-watch-filter]").forEach(x=>x.classList.toggle("active",x===b));updateWatchlist();
    }));
    $("favoriteButton").addEventListener("click",toggleFavorite);
    $("rawChartMode").addEventListener("click",showRawChart);
    $("createWorkspaceButton").addEventListener("click",createWorkspace);
    $("workspaceBackButton").addEventListener("click",closeActiveWorkspace);
    $("workspaceSaveButton").addEventListener("click",()=>{saveActiveWorkspace();toast("Çalışma alanı kaydedildi.");});
    $("renameWorkspaceButton").addEventListener("click",openWorkspaceRename);
    $("workspaceRenameForm").addEventListener("submit",commitWorkspaceRename);
    $("cancelWorkspaceRename").addEventListener("click",closeWorkspaceRename);
    $("workspaceDeleteButton").addEventListener("click",deleteActiveWorkspace);
    $("workspaceRefreshButton").addEventListener("click",loadWorkspaceChart);
    $("workspaceTimeframes").addEventListener("click",e=>{const button=e.target.closest("[data-workspace-interval]");if(!button)return;workspaceInterval=button.dataset.workspaceInterval;document.querySelectorAll("[data-workspace-interval]").forEach(b=>b.classList.toggle("active",b===button));saveActiveWorkspace();renderWorkspaceNav();loadWorkspaceChart();});
    document.querySelectorAll("[data-workspace-chart-type]").forEach(b=>b.addEventListener("click",()=>{workspaceChartType=b.dataset.workspaceChartType;document.querySelectorAll("[data-workspace-chart-type]").forEach(x=>x.classList.toggle("active",x===b));saveActiveWorkspace();loadWorkspaceChart();}));
    document.querySelectorAll("[data-workspace-drawing]").forEach(b=>b.addEventListener("click",()=>chooseWorkspaceDrawing(b.dataset.workspaceDrawing)));
    $("openPriceAlerts").addEventListener("click",openPriceAlerts);
    $("closePriceAlerts").addEventListener("click",closePriceAlerts);
    $("priceAlertBackdrop").addEventListener("click",e=>{if(e.target===$("priceAlertBackdrop"))closePriceAlerts();});
    $("createPriceAlert").addEventListener("click",createPriceAlert);
    $("enableAlertNotifications").addEventListener("click",requestAlertNotifications);
    document.querySelectorAll("[data-study]").forEach(b=>b.addEventListener("click",()=>toggleStudy(b.dataset.study)));
    document.querySelectorAll("[data-deck]").forEach(b=>b.addEventListener("click",()=>{
      const deck=b.dataset.deck;
      document.querySelectorAll("[data-deck]").forEach(x=>x.classList.toggle("active",x===b));
      $("indicatorDeck").hidden=deck!=="indicators";$("drawingDeck").hidden=deck!=="drawings";$("layoutDeck").hidden=deck!=="layouts";
      $("indicatorButton").classList.toggle("active",deck==="indicators");
    }));
    document.querySelectorAll("[data-drawing]").forEach(b=>b.addEventListener("click",()=>beginDrawing(b.dataset.drawing)));
    $("candlesButton").addEventListener("click",()=>setChartType("candles"));
    $("lineButton").addEventListener("click",()=>setChartType("line"));
    $("drawButton").addEventListener("click",()=>{
      const workspaces=symbolWorkspaces();
      if(workspaces.length)openWorkspace(workspaces[workspaces.length-1].id);
      else createWorkspace();
    });
    $("indicatorButton").addEventListener("click",()=>{
      const panel=$("indicatorDeck"),opening=panel.hidden;
      panel.hidden=!opening;
      if(opening){$("drawingDeck").hidden=true;$("layoutDeck").hidden=true;}
      document.querySelectorAll("[data-deck]").forEach(button=>button.classList.toggle("active",opening&&button.dataset.deck==="indicators"));
      $("indicatorButton").classList.toggle("active",opening);
    });
    $("layoutButton").addEventListener("click",()=>document.querySelector('[data-deck="layouts"]').click());
    $("refreshButton").addEventListener("click",()=>loadChart());
    $("saveLayout").addEventListener("click",saveLayout);
    $("saveState").addEventListener("click",()=>{saveStudies();saveDrawings();toast("Grafik ayarları otomatik kaydedildi.");});
    $("applyMacdParams").addEventListener("click",applyMacdParams);
    $("applyStochRsiParams").addEventListener("click",applyStochRsiParams);
    $("applyOverlayParams").addEventListener("click",applyOverlayParams);
    $("applyStochRsiParams").addEventListener("click",applyStochRsiParams);
    $("openSettings").addEventListener("click",openSettings);
    $("closeSettings").addEventListener("click",closeSettings);
    $("settingsBackdrop").addEventListener("click",e=>{if(e.target===$("settingsBackdrop"))closeSettings();});
    $("saveApiKey").addEventListener("click",saveApiKey);
    $("clearApiKey").addEventListener("click",()=>{
      localStorage.removeItem(ISTFIN_KEY);$("istfinApiKey").value="";
      $("istfinState").textContent="AYARLANMADI";$("istfinState").classList.remove("ready");
      setSettingsMessage("API anahtarı bu cihazdan silindi.");updateWatchlist();
    });
    $("toggleKeyVisibility").addEventListener("click",()=>{
      $("istfinApiKey").type=$("istfinApiKey").type==="password"?"text":"password";
    });
    $("chartMessageAction").addEventListener("click",openSettings);
    $("mobileNav").addEventListener("click",()=>document.body.classList.add("sidebar-open"));
    $("closeSidebar").addEventListener("click",()=>document.body.classList.remove("sidebar-open"));
    $("sidebarScrim").addEventListener("click",()=>document.body.classList.remove("sidebar-open"));
    $("fullscreenButton").addEventListener("click",()=>{
      $("chartWorkspace").classList.toggle("expanded");
      $("chartContainer").style.height=$("chartWorkspace").classList.contains("expanded")?"72vh":"";
      if(chart){setTimeout(()=>chart.timeScale().fitContent(),100);}
    });
    $("chartContainer").addEventListener("click",()=>{});
  }



  function updateMarketRangeLevels(){
    const tags=[
      {id:"marketHighTag",valueId:"marketHighValue",kind:"high"},
      {id:"marketAverageTag",valueId:"marketAverageValue",kind:"average"},
      {id:"marketLowTag",valueId:"marketLowValue",kind:"low"}
    ];
    if(!bars.length||!chart){tags.forEach(t=>{const el=$(t.id);if(el)el.hidden=true;});return;}
    const logical=chart.timeScale().getVisibleLogicalRange();
    const start=logical?Math.max(0,Math.floor(logical.from)):0;
    const end=logical?Math.min(bars.length-1,Math.ceil(logical.to)):bars.length-1;
    const slice=bars.slice(start,end+1);
    if(!slice.length)return;
    let high=-Infinity,low=Infinity,sum=0;
    for(const bar of slice){high=Math.max(high,bar.high);low=Math.min(low,bar.low);sum+=(bar.high+bar.low+bar.close)/3;}
    const average=sum/slice.length;
    const values={high,average,low};
    const item=instrument(),series=chartType==="candles"?candleSeries:lineSeries,host=$("chartContainer"),height=host.clientHeight;
    const placements=tags.map(t=>{
      const value=values[t.kind],el=$(t.id),valueEl=$(t.valueId);
      valueEl.textContent=fmtPrice(value,item?.decimals||2);
      let y=series?.priceToCoordinate(value);
      if(!Number.isFinite(y)){
        const span=high-low||1;
        y=10+(high-value)/span*Math.max(20,height-20);
      }
      return {el,y};
    }).sort((a,b)=>a.y-b.y);
    let previous=-100;
    for(const itemPlacement of placements){
      let y=Math.max(13,Math.min(height-13,itemPlacement.y));
      if(y<previous+23)y=previous+23;
      y=Math.min(height-13,y);
      itemPlacement.el.style.top=y+"px";itemPlacement.el.hidden=false;previous=y;
    }
  }

  function zonedParts(date,timeZone){
    const parts=new Intl.DateTimeFormat("en-GB",{timeZone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).formatToParts(date),result={};
    for(const p of parts)if(p.type!=="literal")result[p.type]=Number(p.value);return result;
  }
  function countdownText(milliseconds){
    const total=Math.max(0,Math.ceil(milliseconds/1000)),h=Math.floor(total/3600),m=Math.floor((total%3600)/60),s=total%60;
    return [h,m,s].map(n=>String(n).padStart(2,"0")).join(":");
  }
  function updateCandleCountdown(){
    const node=$("candleCountdownValue");if(!node)return;
    const item=instrument(),interval=activeInterval,now=new Date();let remaining=null;
    if(item?.type==="bist"){
      const p=zonedParts(now,"Europe/Istanbul"),weekday=new Date(Date.UTC(p.year,p.month-1,p.day)).getUTCDay(),minute=p.hour*60+p.minute;
      if(weekday===0||weekday===6||minute<600||minute>=1080){node.textContent="KAPALI";return;}
      if(["1m","5m","15m","30m","1h","4h"].includes(interval)){
        const span={"1m":1,"5m":5,"15m":15,"30m":30,"1h":60,"4h":240}[interval],elapsed=minute-600,close=Math.min(1080,600+(Math.floor(elapsed/span)+1)*span);
        remaining=(close-minute)*60000-p.second*1000;
      }else if(interval==="1d")remaining=(1080-minute)*60000-p.second*1000;
      else{
        const pseudo=Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second);
        if(interval==="1w"){
          const current=weekday===0?7:weekday,days=(5-current+7)%7;
          remaining=days===0?(1080-minute)*60000-p.second*1000:((days*1440)+(1080-minute))*60000-p.second*1000;
        }else{
          const lastDay=new Date(Date.UTC(p.year,p.month,0)).getUTCDate(),dow=new Date(Date.UTC(p.year,p.month-1,lastDay)).getUTCDay(),lastBusiness=lastDay-(dow===6?1:dow===0?2:0);
          remaining=Date.UTC(p.year,p.month-1,lastBusiness,18,0,0)-pseudo;
        }
      }
    }else{
      const fixed={"1m":60000,"5m":300000,"15m":900000,"30m":1800000,"1h":3600000,"4h":14400000,"1d":86400000};
      if(fixed[interval]){const size=fixed[interval],current=Date.now();remaining=(Math.floor(current/size)+1)*size-current;}
      else if(interval==="1w"){const d=new Date(),day=(d.getUTCDay()+6)%7;remaining=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()-day+7)-Date.now();}
      else if(interval==="1M"){const d=new Date();remaining=Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,1)-Date.now();}
    }
    node.textContent=remaining==null?"—":countdownText(remaining);
  }


  function loadPriceAlerts(){try{const v=JSON.parse(localStorage.getItem(ALERTS_KEY)||"[]");return Array.isArray(v)?v.filter(a=>a&&a.id&&a.symbol&&Number.isFinite(Number(a.target))&&ensureInstrument(a.symbol)):[];}catch{return [];}}
  function savePriceAlerts(){try{localStorage.setItem(ALERTS_KEY,JSON.stringify(priceAlerts));}catch{}}
  function updateAlertCount(){const n=$("alertCount");if(n)n.textContent=String(priceAlerts.filter(a=>a.active).length);}
  function alertPriceText(a){return fmtPrice(Number(a.target),instrument(a.symbol)?.decimals||2);}
  function formatAlarmDateTime(timestamp){
    if(!Number.isFinite(Number(timestamp)))return "";
    return new Intl.DateTimeFormat("tr-TR",{timeZone:"Europe/Istanbul",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).format(new Date(Number(timestamp)));
  }
  function renderPriceAlerts(){
    const host=$("priceAlertList");if(!host)return;host.innerHTML="";
    if(!priceAlerts.length){const empty=document.createElement("div");empty.className="alert-empty";empty.textContent="Henüz fiyat alarmı kurmadın.";host.appendChild(empty);}
    priceAlerts.slice().sort((a,b)=>Number(b.createdAt||0)-Number(a.createdAt||0)).forEach(a=>{
      const item=instrument(a.symbol),row=document.createElement("div");row.className="price-alert-row";
      const copy=document.createElement("div");copy.className="price-alert-copy";
      const title=document.createElement("strong");title.textContent=(a.ticker||item?.ticker||a.symbol)+" · "+(a.direction==="above"?"ÜZERİNE ÇIKARSA":"ALTINA DÜŞERSE");
      const detail=document.createElement("small");
      const state=a.triggered?"TETİKLENDİ":a.active?"AKTİF":"DURAKLATILDI";
      const checked=a.lastCheckedAt?" · Son kontrol "+formatAlarmDateTime(a.lastCheckedAt)+(Number.isFinite(Number(a.lastPrice))?" · "+fmtPrice(Number(a.lastPrice),item?.decimals||2):""):"";
      const triggered=a.triggeredAt?" · Tetiklenme "+formatAlarmDateTime(a.triggeredAt)+(Number.isFinite(Number(a.triggeredPrice))?" · Fiyat "+fmtPrice(Number(a.triggeredPrice),item?.decimals||2):""):"";
      detail.textContent=alertPriceText(a)+" · "+state+triggered+(!a.triggered?checked:"")+(a.lastError&&!a.triggered?" · Son veri hatası":"");copy.append(title,detail);
      const actions=document.createElement("div");actions.className="price-alert-actions";
      if(a.triggered||!a.active){const rearm=document.createElement("button");rearm.type="button";rearm.textContent="Yeniden kur";rearm.addEventListener("click",()=>{a.active=true;a.triggered=false;a.triggeredAt=null;a.triggeredPrice=null;a.lastError=null;savePriceAlerts();renderPriceAlerts();toast("Alarm yeniden kuruldu.");});actions.appendChild(rearm);}
      const remove=document.createElement("button");remove.type="button";remove.className="alert-delete";remove.textContent="Sil";remove.addEventListener("click",()=>{priceAlerts=priceAlerts.filter(x=>x.id!==a.id);savePriceAlerts();renderPriceAlerts();});actions.appendChild(remove);
      row.append(copy,actions);host.appendChild(row);
    });
    const summary=$("alertCountSummary");if(summary)summary.textContent=priceAlerts.filter(a=>a.active).length+" aktif";updateAlertCount();
  }
  function updateAlertPermissionStatus(){const n=$("alertPermissionStatus");if(!n)return;if(!window.ByboraNative){n.textContent="Android bildirim bileşeni bulunamadı.";return;}n.textContent=window.ByboraNative.hasNotificationPermission()?"Android bildirim izni açık. Tetiklenen alarmlar bildirim gönderebilir.":"Bildirim izni kapalı. Alarm tetiklenir ancak Android bildirimi gönderilemez.";}
  function openPriceAlerts(){ $("priceAlertBackdrop").hidden=false;const item=instrument();$("alertSelectedSymbol").textContent=item?item.ticker+" · "+item.name:"Sembol seçilmedi";$("alertPrice").value="";renderPriceAlerts();updateAlertPermissionStatus();}
  function closePriceAlerts(){$("priceAlertBackdrop").hidden=true;}
  function requestAlertNotifications(){if(!window.ByboraNative){toast("Android bildirim desteği bulunamadı.");return;}window.ByboraNative.requestNotificationPermission();setTimeout(updateAlertPermissionStatus,500);setTimeout(updateAlertPermissionStatus,1400);}
  function createPriceAlert(){
    const item=instrument(),target=Number(String($("alertPrice").value).replace(",",".")),direction=$("alertDirection").value;
    if(!item){toast("Önce alarm kuracağın sembolü aç.");return;}if(!Number.isFinite(target)||target<=0){toast("Geçerli bir fiyat seviyesi gir.");return;}
    priceAlerts.unshift({id:Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8),symbol:item.id,ticker:item.ticker,name:item.name,direction,target,active:true,triggered:false,createdAt:Date.now()});
    savePriceAlerts();renderPriceAlerts();$("alertPrice").value="";toast(item.ticker+" için fiyat alarmı kuruldu.");
  }
  async function fetchAlarmQuoteWithRetry(symbol){
    let errorText="Fiyat verisi alınamadı.";
    for(let attempt=0;attempt<3;attempt++){
      try{
        const quote=await fetchQuote(symbol),price=Number(quote?.lastPrice??quote?.price??quote?.close);
        if(Number.isFinite(price))return {quote,price,error:null};
        errorText="Veri sağlayıcı geçerli son fiyat döndürmedi.";
      }catch(error){errorText=error?.message||errorText;}
      if(attempt<2)await new Promise(resolve=>setTimeout(resolve,350*(attempt+1)));
    }
    return {quote:null,price:null,error:errorText};
  }
  async function checkPriceAlerts(){
    if(alertPollBusy||document.hidden)return;
    const active=priceAlerts.filter(a=>a.active&&!a.triggered&&ensureInstrument(a.symbol));if(!active.length)return;
    alertPollBusy=true;
    try{
      const unique=[...new Set(active.map(a=>a.symbol))],results=new Map();let cursor=0;
      const worker=async()=>{
        while(cursor<unique.length){
          const symbol=unique[cursor++],result=await fetchAlarmQuoteWithRetry(symbol);
          results.set(symbol,result);
        }
      };
      await Promise.all(Array.from({length:Math.min(3,unique.length)},()=>worker()));
      const checkedAt=Date.now();let changed=false,triggeredCount=0;
      for(const alert of active){
        const result=results.get(alert.symbol);alert.lastCheckedAt=checkedAt;
        if(!result||!Number.isFinite(result.price)){alert.lastError=result?.error||"Fiyat verisi alınamadı.";changed=true;continue;}
        const price=result.price;alert.lastPrice=price;alert.lastError=null;changed=true;
        const hit=alert.direction==="above"?price>=Number(alert.target):price<=Number(alert.target);
        if(!hit)continue;
        alert.active=false;alert.triggered=true;alert.triggeredAt=checkedAt;alert.triggeredPrice=price;triggeredCount++;
        const item=instrument(alert.symbol),message=(alert.ticker||item?.ticker||alert.symbol)+" "+(alert.direction==="above"?"üstüne çıktı":"altına düştü")+" · Alarm: "+alertPriceText(alert)+" · Son fiyat: "+fmtPrice(price,item?.decimals||2)+" · "+formatAlarmDateTime(checkedAt);
        try{if(window.ByboraNative&&window.ByboraNative.hasNotificationPermission())window.ByboraNative.showPriceAlertNotification(alert.ticker||item?.ticker||alert.symbol,message);}catch{}
      }
      if(changed){savePriceAlerts();renderPriceAlerts();}
      if(triggeredCount)toast(triggeredCount+" fiyat alarmı tetiklendi.");
    }finally{alertPollBusy=false;}
  }
  function startPriceAlertPolling(){if(alertPollTimer)clearInterval(alertPollTimer);checkPriceAlerts().catch(()=>{});alertPollTimer=setInterval(()=>checkPriceAlerts().catch(()=>{}),15000);}

  function updateClock() {
    $("clock").textContent=fmtTime();
  }

  function init() {
    bindEvents();
    window.byBoraAlertPermissionChanged=updateAlertPermissionStatus;
    window.handleWatchlistImport=handleWatchlistImport;
    updateWatchlist();
    renderLayouts();
    renderStudyChips();
    $("macdFast").value=macdParams.fast;
    $("macdSlow").value=macdParams.slow;
    $("macdSignal").value=macdParams.signal;
    $("stochRsiLength").value=stochRsiParams.rsi;
    $("stochRsiWindow").value=stochRsiParams.stoch;
    $("stochRsiK").value=stochRsiParams.k;
    $("stochRsiD").value=stochRsiParams.d;
    $("smaPeriod").value=overlayParams.sma;
    $("bbPeriod").value=overlayParams.bb;
    $("bbDeviation").value=overlayParams.deviation;
    const key=getIstfinKey();
    $("istfinApiKey").value=key;
    $("istfinState").textContent=key?"KAYITLI":"AYARLANMADI";
    $("istfinState").classList.toggle("ready",!!key);
    const item=instrument();
    renderInstrumentHeader(item,null,null);
    if (window.LightweightCharts) loadChart();
    else {
      setStatus("GRAFİK MOTORU YÜKLENİYOR","warn");
      let tries=0;
      const timer=setInterval(()=>{
        tries++;
        if(window.LightweightCharts){clearInterval(timer);loadChart();}
        else if(tries>30){clearInterval(timer);setMessage("Grafik motoru yüklenemedi","İnternet bağlantını kontrol et. Grafik kitaplığı CDN üzerinden yüklenemedi.");setStatus("GRAFİK MOTORU YOK","warn");}
      },300);
    }
    updateClock();setInterval(updateClock,1000);
    renderPriceAlerts();renderWorkspaceNav();startPriceAlertPolling();
    document.addEventListener("visibilitychange",()=>{if(!document.hidden)checkPriceAlerts().catch(()=>{});});
    updateCandleCountdown();candleCountdownTimer=setInterval(updateCandleCountdown,1000);
    loadMarketCatalogs().catch(()=>{});
    refreshWatchlistQuotes().catch(()=>{});
    watchQuoteTimer=setInterval(()=>refreshWatchlistQuotes().catch(()=>{}),30000);
    document.addEventListener("visibilitychange",()=>{if(!document.hidden){syncBinanceLiveSubscriptions();loadChart();refreshWatchlistQuotes();}});
    window.addEventListener("online",()=>{binanceSocketRetryDelay=1000;syncBinanceLiveSubscriptions();});
    window.addEventListener("pagehide",()=>{clearTimeout(binanceSocketReconnectTimer);clearTimeout(binanceSocketRotationTimer);const socket=binanceMarketSocket;binanceMarketSocket=null;if(socket){socket.onclose=null;try{socket.close(1000,"page hidden");}catch{}}});
  }

  document.addEventListener("DOMContentLoaded",init);
})();