(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const BINANCE = "https://data-api.binance.vision/api/v3";
  const ISTFIN = "https://api.istfin.com/v1";
  const ISTFIN_KEY = "bybora_istfin_key_v1";
  const WATCH_KEY = "bybora_watchlist_v3";
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

  const intervals = ["1m","5m","15m","30m","1h","4h","1d","1w","1M"];
  const intervalIstfin = {"1m":"1m","5m":"5m","15m":"15m","30m":"30m","1h":"1h","4h":"4h","1d":"1d","1w":"1w","1M":"1mo"};
  const intervalBinance = {"1m":"1m","5m":"5m","15m":"15m","30m":"30m","1h":"1h","4h":"4h","1d":"1d","1w":"1w","1M":"1M"};
  const studies = [
    {id:"EMA20",label:"EMA 20",type:"overlay"},
    {id:"EMA50",label:"EMA 50",type:"overlay"},
    {id:"SMA200",label:"SMA 200",type:"overlay"},
    {id:"BB",label:"Bollinger Bands",type:"overlay"},
    {id:"VWAP",label:"VWAP",type:"overlay"},
    {id:"RSI14",label:"RSI 14",type:"lower"},
    {id:"MACD",label:"MACD",type:"lower"},
    {id:"STOCH",label:"Stochastic",type:"lower"}
  ];

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
  let bars = [];
  let drawingLines = [];
  let drawingSeriesRuntime = [];
  let drawingMode = null;
  let firstDrawPoint = null;
  let quoteTimer = null;
  let refreshTimer = null;
  let toastTimer = null;
  let activeFilter = "all";
  let isLoading = false;
  let pendingReload = false;
  let symbolSearchTimer = null;
  let searchRequestId = 0;

  function instrument(id = activeSymbol) {
    return symbols.find(s => s.id === id) || null;
  }

  function ensureInstrument(id, remote = null) {
    const existing = instrument(id);
    if (existing) return existing;

    if (id.startsWith("BINANCE:")) {
      const pair = id.slice("BINANCE:".length).toUpperCase();
      if (!/^[A-Z0-9]{4,24}$/.test(pair)) return null;
      const item = {id,ticker:pair,name:pair.replace(/(USDT|USDC|BTC|ETH|TRY)$/," / $1"),exchange:"BINANCE",type:"crypto",pair,currency:pair.endsWith("TRY")?"TRY":pair.endsWith("USDC")?"USDC":pair.endsWith("BTC")?"BTC":"USDT",decimals:pair.endsWith("TRY")?2:6};
      symbols.push(item);
      return item;
    }

    if (id.startsWith("BIST:")) {
      const ticker = id.slice("BIST:".length).toUpperCase();
      if (!/^[A-Z0-9]{3,8}$/.test(ticker)) return null;
      const item = {id,ticker,name:remote?.name||ticker,exchange:"BIST",type:"bist",pair:ticker,currency:"TRY",decimals:2};
      symbols.push(item);
      return item;
    }
    return null;
  }

  function loadWatchlist() {
    try {
      const v = JSON.parse(localStorage.getItem(WATCH_KEY) || "null");
      if (!Array.isArray(v)) return ["BINANCE:BTCUSDT","GOLD:GRAM_TRY","BIST:PETKM","BIST:XU100","BINANCE:ETHUSDT"];
      return [...new Set(v.filter(id => !!ensureInstrument(id)))].slice(0,30);
    } catch {
      return ["BINANCE:BTCUSDT","GOLD:GRAM_TRY","BIST:PETKM","BIST:XU100","BINANCE:ETHUSDT"];
    }
  }

  function saveWatchlist() {
    try { localStorage.setItem(WATCH_KEY, JSON.stringify(watchlist)); } catch {}
  }

  function loadStudies(symbol) {
    try {
      const v = JSON.parse(localStorage.getItem("bybora_studies_" + symbol) || "null");
      return Array.isArray(v) ? [...new Set(v.filter(id => studies.some(s => s.id === id)))] : ["EMA20","EMA50","RSI14"];
    } catch { return ["EMA20","EMA50","RSI14"]; }
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

  function resolveSymbol(query) {
    const q = String(query || "").trim().toLocaleLowerCase("tr-TR");
    const direct = symbols.find(s => s.id.toLocaleLowerCase("tr-TR") === q ||
      s.ticker.toLocaleLowerCase("tr-TR") === q ||
      s.name.toLocaleLowerCase("tr-TR") === q);
    if (direct) return direct.id;
    const aliases = {
      "petkim":"BIST:PETKM","petkm":"BIST:PETKM","gram altın":"GOLD:GRAM_TRY","gram altin":"GOLD:GRAM_TRY",
      "xautryg":"GOLD:GRAM_TRY","gau/try":"GOLD:GRAM_TRY","xu100":"BIST:XU100","bist100":"BIST:XU100",
      "bist 100":"BIST:XU100","bitcoin":"BINANCE:BTCUSDT","btc":"BINANCE:BTCUSDT","btc/usdt":"BINANCE:BTCUSDT",
      "ethereum":"BINANCE:ETHUSDT","eth":"BINANCE:ETHUSDT"
    };
    if (aliases[q]) return aliases[q];
    const compact = q.toUpperCase().replace(/\s+/g,"");
    if (/^BIST:[A-Z0-9]{3,8}$/.test(compact)) return compact;
    if (/^BINANCE:[A-Z0-9]{4,24}$/.test(compact)) return compact;
    if (/^[A-Z]{2,18}USDT$/.test(compact)) return "BINANCE:" + compact;
    if (/^[A-Z]{4,6}$/.test(compact)) return "BIST:" + compact;
    return null;
  }

  function createChartIfNeeded() {
    if (chart) return true;
    if (!window.LightweightCharts) return false;
    const L = window.LightweightCharts;
    const host = $("priceChart");
    chart = L.createChart(host, {
      autoSize: true,
      layout: {
        background: {type:L.ColorType.Solid,color:"#0a1220"},
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
      rightPriceScale:{borderColor:"rgba(145,170,199,.18)",autoScale:true,scaleMargins:{top:.08,bottom:.18}},
      timeScale:{
        borderColor:"rgba(145,170,199,.18)",timeVisible:true,secondsVisible:false,
        rightOffset:7,barSpacing:7,minBarSpacing:.5,fixLeftEdge:false
      },
      localization:{locale:"tr-TR"}
    });
    chart.timeScale().subscribeVisibleLogicalRangeChange(range => {
      if (!isLoading && range) saveVisibleRange(range);
    });
    chart.subscribeClick(onChartClick);
    $("chartOverlay").hidden = true;
    return true;
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

  async function fetchQuote(symbol) {
    const item = instrument(symbol);
    if (!item) return null;
    if (item.type === "bist") {
      const key = getIstfinKey();
      if (!key) return null;
      const url = new URL(ISTFIN + "/quotes");
      url.searchParams.set("symbols", item.pair);
      const response = await fetch(url.toString(),{cache:"no-store",headers:{Authorization:"Bearer "+key,Accept:"application/json"}});
      if (!response.ok) return null;
      const body = await response.json();
      return (body.data || []).find(x => x.symbol === item.pair) || null;
    }
    const url = new URL(BINANCE + "/ticker/24hr");
    url.searchParams.set("symbol",item.pair);
    const response = await fetch(url.toString(),{cache:"no-store"});
    if (!response.ok) return null;
    return await response.json();
  }

  async function getMarketData(item, interval) {
    if (item.type === "bist") {
      const [history, quote] = await Promise.all([
        fetchIstfinBars(item.pair, interval),
        fetchQuote(item.id).catch(()=>null)
      ]);
      return {bars:history,quote,source:"istfin · 15 dk gecikmeli",delay:"BIST lisanslı · 15 dk gecikmeli"};
    }
    const history = await fetchBinanceBars(item.pair,mapChartInterval(item,interval));
    const quote = await fetchQuote(item.id).catch(()=>null);
    if (item.type === "gold") {
      const factor = 1 / TROY_OUNCE_GRAMS;
      history.forEach(bar => {
        bar.open*=factor;bar.high*=factor;bar.low*=factor;bar.close*=factor;
      });
      if (quote) {
        quote.lastPrice = String(Number(quote.lastPrice)*factor);
        quote.highPrice = String(Number(quote.highPrice)*factor);
        quote.lowPrice = String(Number(quote.lowPrice)*factor);
      }
      return {bars:history,quote,source:"Binance PAXGTRY ÷ 31,1034768",delay:"Altın destekli token · TRY spot referansı"};
    }
    return {bars:history,quote,source:"Binance public market data",delay:"Kripto · gerçek zamanlı"};
  }

  function mapChartInterval(item, interval) {
    if (item.type === "gold") return interval;
    return interval;
  }

  function ensureMainSeries() {
    if (!chart) return;
    const L = window.LightweightCharts;
    if (candleSeries) { chart.removeSeries(candleSeries); candleSeries = null; }
    if (lineSeries) { chart.removeSeries(lineSeries); lineSeries = null; }
    if (volumeSeries) { chart.removeSeries(volumeSeries); volumeSeries = null; }
    if (chartType === "candles") {
      candleSeries = chart.addSeries(L.CandlestickSeries,{
        upColor:"#28cda0",downColor:"#f06479",
        borderUpColor:"#28cda0",borderDownColor:"#f06479",
        wickUpColor:"#28cda0",wickDownColor:"#f06479",
        priceLineVisible:true,lastValueVisible:true
      });
    } else {
      lineSeries = chart.addSeries(L.LineSeries,{
        color:"#55c9e8",lineWidth:2,priceLineVisible:true,lastValueVisible:true,
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
    let pv=0,v=0;const out=[];
    for(const row of values){
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

  function macd(values) {
    const e12=ema(values,12),e26=ema(values,26),signal=[];
    const line=e12.map((v,i)=>({time:v.time,value:v.value-e26[i].value}));
    const k=2/10;let s=null;const hist=[];
    line.forEach(v=>{s=s===null?v.value:v.value*k+s*(1-k);signal.push({time:v.time,value:s});hist.push({time:v.time,value:v.value-s});});
    return {line,signal,hist};
  }

  function stochastic(values,period=14) {
    const out=[];let smooth=[];
    for(let i=period-1;i<values.length;i++){
      const slice=values.slice(i-period+1,i+1);
      const hi=Math.max(...slice.map(x=>x.high)),lo=Math.min(...slice.map(x=>x.low));
      const value=hi===lo?50:((values[i].close-lo)/(hi-lo))*100;
      out.push({time:values[i].time,value});
    }
    return out;
  }

  function renderStudies() {
    if (!chart || !bars.length) return;
    clearOverlaySeries();
    const close = bars;
    if (activeStudies.includes("EMA20")) addOverlayLine(ema(close,20),"#f0bd62","EMA 20");
    if (activeStudies.includes("EMA50")) addOverlayLine(ema(close,50),"#6bb8ff","EMA 50");
    if (activeStudies.includes("SMA200")) addOverlayLine(sma(close,200),"#c58cff","SMA 200");
    if (activeStudies.includes("BB")) {
      const bb=bollinger(close,20,2);
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
    const lower = activeStudies.filter(id=>["RSI14","MACD","STOCH"].includes(id));
    lower.forEach(id=>{
      const wrap=document.createElement("div");
      wrap.className="lower-chart-wrap";
      const title=document.createElement("div");
      title.className="lower-chart-title";
      title.textContent=studies.find(s=>s.id===id).label;
      const mount=document.createElement("div");
      mount.className="lower-indicator-chart";
      wrap.append(title,mount);
      host.appendChild(wrap);
      const c=L.createChart(mount,{
        autoSize:true,
        layout:{background:{type:L.ColorType.Solid,color:"#0b1422"},textColor:"#7f93aa",fontFamily:"DM Sans,sans-serif",fontSize:9},
        grid:{vertLines:{color:"rgba(132,157,188,.035)"},horzLines:{color:"rgba(132,157,188,.06)"}},
        rightPriceScale:{borderColor:"rgba(145,170,199,.13)"},
        timeScale:{visible:false,borderColor:"rgba(145,170,199,.1)",rightOffset:7},
        crosshair:{mode:L.CrosshairMode.Normal}
      });
      lowerCharts.push(c);
      if (id==="RSI14") {
        const s=c.addSeries(L.LineSeries,{color:"#b48cff",lineWidth:2,priceLineVisible:false,lastValueVisible:true});
        s.setData(rsi(bars));
        s.createPriceLine({price:70,color:"rgba(255,113,134,.6)",lineStyle:L.LineStyle.Dashed,lineWidth:1,axisLabelVisible:false,title:"70"});
        s.createPriceLine({price:30,color:"rgba(69,214,195,.6)",lineStyle:L.LineStyle.Dashed,lineWidth:1,axisLabelVisible:false,title:"30"});
      } else if (id==="MACD") {
        const m=macd(bars);
        const h=c.addSeries(L.HistogramSeries,{priceLineVisible:false,lastValueVisible:false});
        h.setData(m.hist.map(x=>({time:x.time,value:x.value,color:x.value>=0?"rgba(53,214,160,.5)":"rgba(255,113,134,.5)"})));
        const s1=c.addSeries(L.LineSeries,{color:"#62a9ff",lineWidth:1,priceLineVisible:false,lastValueVisible:false});
        const s2=c.addSeries(L.LineSeries,{color:"#f0bd62",lineWidth:1,priceLineVisible:false,lastValueVisible:false});
        s1.setData(m.line);s2.setData(m.signal);
      } else {
        const s=c.addSeries(L.LineSeries,{color:"#e4b86b",lineWidth:2,priceLineVisible:false,lastValueVisible:true});
        s.setData(stochastic(bars));
        s.createPriceLine({price:80,color:"rgba(255,113,134,.55)",lineStyle:L.LineStyle.Dashed,lineWidth:1,axisLabelVisible:false});
        s.createPriceLine({price:20,color:"rgba(69,214,195,.55)",lineStyle:L.LineStyle.Dashed,lineWidth:1,axisLabelVisible:false});
      }
    });
  }

  function renderStudyChips() {
    document.querySelectorAll("[data-study]").forEach(button=>button.classList.toggle("active",activeStudies.includes(button.dataset.study)));
    const host=$("activeStudyList");host.innerHTML="";
    if (!activeStudies.length) {
      const span=document.createElement("span");span.className="subtle-copy";span.textContent="Henüz gösterge eklenmedi.";host.appendChild(span);return;
    }
    activeStudies.forEach(id=>{
      const item=studies.find(x=>x.id===id);if(!item)return;
      const pill=document.createElement("span");pill.className="active-study-pill";pill.append(document.createTextNode(item.label));
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

  function renderInstrumentHeader(item,quote,lastBar) {
    $("instrumentAvatar").textContent=item.ticker.slice(0,2);
    $("instrumentLabel").textContent=item.type==="bist"?"BORSA İSTANBUL · HİSSE":item.type==="gold"?"ALTIN · PAXG/TRY SPOT REFERANSI":"KRİPTO · SPOT";
    $("instrumentName").textContent=item.name;
    $("instrumentSymbol").textContent=item.id+" · "+item.currency;
    $("exchangeBadge").textContent=item.exchange;
    $("chartTicker").textContent=item.ticker;
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
    const vol = quote?.volume ?? quote?.volume24h ?? lastBar?.volume;
    $("dayHigh").textContent=Number.isFinite(Number(hi))?fmtPrice(Number(hi),item.decimals):"—";
    $("dayLow").textContent=Number.isFinite(Number(lo))?fmtPrice(Number(lo),item.decimals):"—";
    $("dayVolume").textContent=Number.isFinite(Number(vol))?fmtCompact(Number(vol)):"—";
    $("favoriteButton").classList.toggle("active",watchlist.includes(item.id));
    $("favoriteButton").textContent=watchlist.includes(item.id)?"★":"☆";
    document.title=item.ticker+" | BYBORA Market Desk";
  }

  function updateWatchlist() {
    const host=$("watchlist");host.innerHTML="";
    const visible=watchlist.map(id=>instrument(id)).filter(Boolean).filter(item=>activeFilter==="all"||
      (activeFilter==="bist"&&item.type==="bist")||(activeFilter==="crypto"&&item.type==="crypto")||(activeFilter==="gold"&&item.type==="gold"));
    visible.forEach(item=>{
      const row=document.createElement("button");row.className="watch-row"+(item.id===activeSymbol?" active":"");
      row.innerHTML='<span class="watch-symbol-icon"></span><span class="watch-meta"><strong></strong><small></small></span><i class="watch-state"></i>';
      row.querySelector(".watch-symbol-icon").textContent=item.ticker.slice(0,2);
      row.querySelector(".watch-meta strong").textContent=item.ticker;
      row.querySelector(".watch-meta small").textContent=item.name;
      row.querySelector(".watch-state").classList.toggle("ready",item.type!=="bist"||!!getIstfinKey());
      row.addEventListener("click",()=>selectSymbol(item.id));
      host.appendChild(row);
    });
    if (!visible.length) {
      const empty=document.createElement("div");empty.className="subtle-copy";empty.textContent="Bu kategoride izleme sembolü yok.";host.appendChild(empty);
    }
  }

  async function renderSearchResults(query) {
    const host=$("searchResults");
    host.innerHTML="";
    const q=query.toLocaleLowerCase("tr-TR").trim();
    if (!q) {host.hidden=true;return;}
    const matches=symbols.filter(s=>(s.ticker+" "+s.name+" "+s.id).toLocaleLowerCase("tr-TR").includes(q)).slice(0,8);
    const requestId=++searchRequestId;

    const appendItem=item=>{
      if ([...host.querySelectorAll(".search-result")].some(node=>node.dataset.symbol===item.id)) return;
      const b=document.createElement("button");b.type="button";b.className="search-result";b.dataset.symbol=item.id;
      b.innerHTML='<span><strong></strong><small></small></span><em></em>';
      b.querySelector("strong").textContent=item.ticker;
      b.querySelector("small").textContent=item.name;
      b.querySelector("em").textContent=item.exchange;
      b.addEventListener("click",()=>selectSymbol(item.id));
      host.appendChild(b);
    };

    matches.forEach(appendItem);

    // Search the provider's official symbol directory when the user has a BIST data key.
    if (getIstfinKey() && q.length>=2) {
      try {
        const url=new URL(ISTFIN+"/symbols");
        url.searchParams.set("search",query.trim().toUpperCase());
        const response=await fetch(url.toString(),{
          cache:"no-store",
          headers:{Authorization:"Bearer "+getIstfinKey(),Accept:"application/json"}
        });
        const body=await response.json().catch(()=>({}));
        if (response.ok && requestId===searchRequestId) {
          (body.data||[]).slice(0,12).forEach(row=>{
            if (!row.symbol) return;
            const id="BIST:"+row.symbol;
            const item=ensureInstrument(id,row);
            if (item) appendItem(item);
          });
        }
      } catch {}
    }

    if (!host.querySelector(".search-result")) {
      const hint=document.createElement("div");hint.className="subtle-copy";hint.style.padding="10px";
      hint.textContent=q.length>=4?"Enter ile sembolü dene. BIST için lisanslı veri anahtarı gerekir.":"En az 2 harf yaz.";
      host.appendChild(hint);
    }
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
    setMessage("Piyasa verisi getiriliyor",item.type==="bist"?"BIST mum verisi doğrulanıyor.":"Seçili sembol için mumlar yükleniyor.");
    setStatus("VERİ YÜKLENİYOR","warn");
    $("chartSource").textContent=item.type==="bist"?"istfin API":item.type==="gold"?"Binance PAXG/TRY":"Binance";
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
        try { chart.timeScale().setVisibleLogicalRange(rangeToRestore); }
        catch { chart.timeScale().fitContent(); }
      } else {
        chart.timeScale().fitContent();
      }
      renderInstrumentHeader(item,result.quote,bars[bars.length-1]);
      $("chartSource").textContent=result.source;
      $("dataDelay").textContent=result.delay;
      $("lastUpdate").textContent="Son güncelleme "+fmtTime();
      $("chartStatusText").textContent="GRAFİK AKTİF";
      $("chartLiveStatus").classList.add("ready");
      $("chartOverlay").hidden=true;
      setStatus(item.type==="bist"?"BIST · 15 DK GECİKMELİ":item.type==="gold"?"PAXG/TRY · SPOT REFERANSI":"KRİPTO · AKTİF","good");
      renderWatchlist();
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
      $("chartSource").textContent=item.type==="bist"?"istfin API · bağlantı gerekli":item.type==="gold"?"Binance PAXG/TRY":"Binance";
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
    refreshTimer=setTimeout(async()=>{
      if (!document.hidden) await loadChart(true);
    }, instrument()?.type==="bist"?60000:30000);
  }

  function selectInterval(interval) {
    if (!intervals.includes(interval)) return;
    activeInterval=interval;
    document.querySelectorAll("#timeframes button").forEach(b=>b.classList.toggle("active",b.dataset.interval===interval));
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
    $("symbolSearch").addEventListener("keydown",e=>{
      if(e.key==="Enter"){
        const id=resolveSymbol(e.target.value);
        if(id){selectSymbol(id);e.target.value="";$("searchResults").hidden=true;}
      }
      if(e.key==="Escape")$("searchResults").hidden=true;
    });
    document.addEventListener("click",e=>{if(!e.target.closest(".symbol-search"))$("searchResults").hidden=true;});
    document.addEventListener("keydown",e=>{if(e.key==="/"&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){e.preventDefault();$("symbolSearch").focus();}});
    $("watchlist").addEventListener("click",e=>{const row=e.target.closest(".watch-row");if(row){}});
    document.querySelectorAll("[data-watch-filter]").forEach(b=>b.addEventListener("click",()=>{
      activeFilter=b.dataset.watchFilter;document.querySelectorAll("[data-watch-filter]").forEach(x=>x.classList.toggle("active",x===b));updateWatchlist();
    }));
    $("favoriteButton").addEventListener("click",toggleFavorite);
    document.querySelectorAll("[data-study]").forEach(b=>b.addEventListener("click",()=>toggleStudy(b.dataset.study)));
    document.querySelectorAll("[data-deck]").forEach(b=>b.addEventListener("click",()=>{
      const deck=b.dataset.deck;
      document.querySelectorAll("[data-deck]").forEach(x=>x.classList.toggle("active",x===b));
      $("indicatorDeck").hidden=deck!=="indicators";$("drawingDeck").hidden=deck!=="drawings";$("layoutDeck").hidden=deck!=="layouts";
    }));
    document.querySelectorAll("[data-drawing]").forEach(b=>b.addEventListener("click",()=>beginDrawing(b.dataset.drawing)));
    $("candlesButton").addEventListener("click",()=>setChartType("candles"));
    $("lineButton").addEventListener("click",()=>setChartType("line"));
    $("drawButton").addEventListener("click",()=>document.querySelector('[data-deck="drawings"]').click());
    $("indicatorButton").addEventListener("click",()=>document.querySelector('[data-deck="indicators"]').click());
    $("layoutButton").addEventListener("click",()=>document.querySelector('[data-deck="layouts"]').click());
    $("refreshButton").addEventListener("click",()=>loadChart());
    $("saveLayout").addEventListener("click",saveLayout);
    $("saveState").addEventListener("click",()=>{saveStudies();saveDrawings();toast("Grafik ayarları otomatik kaydedildi.");});
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

  function updateClock() {
    $("clock").textContent=fmtTime();
  }

  function init() {
    bindEvents();
    updateWatchlist();
    renderLayouts();
    renderStudyChips();
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
    document.addEventListener("visibilitychange",()=>{if(!document.hidden)loadChart();});
  }

  document.addEventListener("DOMContentLoaded",init);
})();