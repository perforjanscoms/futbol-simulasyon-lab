(() => {
  "use strict";

  const TV_CHART_SCRIPT = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
  const TV_TICKER_SCRIPT = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
  const STORAGE_KEY = "bybora-market-desk-watchlist-v1";

  const catalog = [
    {symbol:"BIST:XU100",name:"BIST 100",short:"XU100",category:"indices",venue:"BIST",description:"Borsa İstanbul · Ana endeks",aliases:["xu100","bist100","bist 100","bist 100 endeksi"]},
    {symbol:"BIST:XU030",name:"BIST 30",short:"XU030",category:"indices",venue:"BIST",description:"Borsa İstanbul · 30 büyük şirket",aliases:["xu030","bist30","bist 30"]},
    {symbol:"BIST:PETKM",name:"Petkim Petrokimya Holding A.Ş.",short:"PETKM",category:"bist",venue:"BIST",description:"Petkim · Borsa İstanbul",aliases:["petkm","petkim"]},
    {symbol:"BIST:THYAO",name:"Türk Hava Yolları A.O.",short:"THYAO",category:"bist",venue:"BIST",description:"Türk Hava Yolları · BIST",aliases:["thy","thy a.o.","thy hissesi"]},
    {symbol:"BIST:ASELS",name:"Aselsan Elektronik Sanayi",short:"ASELS",category:"bist",venue:"BIST",description:"Aselsan · Borsa İstanbul",aliases:["asels","aselsan"]},
    {symbol:"BIST:SISE",name:"Türkiye Şişe ve Cam Fabrikaları",short:"SISE",category:"bist",venue:"BIST",description:"Şişecam · Borsa İstanbul",aliases:["sise","şişecam","sisecam"]},
    {symbol:"BIST:EREGL",name:"Ereğli Demir ve Çelik",short:"EREGL",category:"bist",venue:"BIST",description:"Ereğli Demir Çelik · BIST",aliases:["eregl","eregli","erdemir"]},
    {symbol:"BIST:TUPRS",name:"Tüpraş",short:"TUPRS",category:"bist",venue:"BIST",description:"Tüpraş · Borsa İstanbul",aliases:["tuprs","tüpraş","tupras"]},
    {symbol:"BIST:AKBNK",name:"Akbank T.A.Ş.",short:"AKBNK",category:"bist",venue:"BIST",description:"Akbank · Borsa İstanbul",aliases:["akbnk","akbank"]},
    {symbol:"BIST:ISCTR",name:"Türkiye İş Bankası C",short:"ISCTR",category:"bist",venue:"BIST",description:"İş Bankası · Borsa İstanbul",aliases:["isctr","iş bankası","is bankasi"]},
    {symbol:"BIST:KCHOL",name:"Koç Holding",short:"KCHOL",category:"bist",venue:"BIST",description:"Koç Holding · Borsa İstanbul",aliases:["kchol","koç holding","koc holding"]},
    {symbol:"BIST:SAHOL",name:"Hacı Ömer Sabancı Holding",short:"SAHOL",category:"bist",venue:"BIST",description:"Sabancı Holding · Borsa İstanbul",aliases:["sahol","sabanci holding","sabancı holding"]},
    {symbol:"BINANCE:BTCUSDT",name:"Bitcoin / Tether",short:"BTCUSDT",category:"crypto",venue:"BINANCE",description:"Bitcoin · Binance Spot",aliases:["btc","bitcoin","btc usdt","btc/usdt"]},
    {symbol:"BINANCE:ETHUSDT",name:"Ethereum / Tether",short:"ETHUSDT",category:"crypto",venue:"BINANCE",description:"Ethereum · Binance Spot",aliases:["eth","ethereum","eth usdt","eth/usdt"]},
    {symbol:"BINANCE:SOLUSDT",name:"Solana / Tether",short:"SOLUSDT",category:"crypto",venue:"BINANCE",description:"Solana · Binance Spot",aliases:["sol","solana","sol usdt","sol/usdt"]},
    {symbol:"BINANCE:XRPUSDT",name:"XRP / Tether",short:"XRPUSDT",category:"crypto",venue:"BINANCE",description:"XRP · Binance Spot",aliases:["xrp","ripple","xrp usdt"]},
    {symbol:"BINANCE:BNBUSDT",name:"BNB / Tether",short:"BNBUSDT",category:"crypto",venue:"BINANCE",description:"BNB · Binance Spot",aliases:["bnb","bnb usdt"]},
    {symbol:"BINANCE:DOGEUSDT",name:"Dogecoin / Tether",short:"DOGEUSDT",category:"crypto",venue:"BINANCE",description:"Dogecoin · Binance Spot",aliases:["doge","dogecoin","doge usdt"]},
    {symbol:"FX_IDC:USDTRY",name:"ABD Doları / Türk Lirası",short:"USDTRY",category:"forex",venue:"FX_IDC",description:"Dolar / TL · Döviz",aliases:["usdtry","dolar tl","dolar/tl","usd try"]},
    {symbol:"FX_IDC:EURTRY",name:"Euro / Türk Lirası",short:"EURTRY",category:"forex",venue:"FX_IDC",description:"Euro / TL · Döviz",aliases:["eurtry","euro tl","euro/tl","eur try"]},
    {symbol:"FX_IDC:EURUSD",name:"Euro / ABD Doları",short:"EURUSD",category:"forex",venue:"FX_IDC",description:"EUR/USD · Forex",aliases:["eurusd","eur/usd","euro dolar"]},
    {symbol:"FX_IDC:GBPUSD",name:"İngiliz Sterlini / ABD Doları",short:"GBPUSD",category:"forex",venue:"FX_IDC",description:"GBP/USD · Forex",aliases:["gbpusd","gbp/usd","sterlin dolar"]},
    {symbol:"FX_IDC:XAUTRYG",name:"Gram Altın / Türk Lirası",short:"XAUTRYG",category:"metals",venue:"FX_IDC",description:"Gram altın · TRY",aliases:["gram altın","gram altin","xautryg","altin tl","altın tl","gram"]},
    {symbol:"OANDA:XAUUSD",name:"Altın / ABD Doları",short:"XAUUSD",category:"metals",venue:"OANDA",description:"Ons altın · XAU/USD",aliases:["xauusd","ons altın","ons altin","altın ons","gold","gold usd"]},
    {symbol:"OANDA:XAGUSD",name:"Gümüş / ABD Doları",short:"XAGUSD",category:"metals",venue:"OANDA",description:"Ons gümüş · XAG/USD",aliases:["xagusd","ons gümüş","ons gumus","silver"]},
    {symbol:"TVC:USOIL",name:"WTI Ham Petrol",short:"USOIL",category:"metals",venue:"TVC",description:"Ham petrol · WTI",aliases:["usoil","petrol","wti","ham petrol"]},
    {symbol:"NASDAQ:AAPL",name:"Apple Inc.",short:"AAPL",category:"global",venue:"NASDAQ",description:"Apple · NASDAQ",aliases:["aapl","apple"]},
    {symbol:"NASDAQ:NVDA",name:"NVIDIA Corporation",short:"NVDA",category:"global",venue:"NASDAQ",description:"NVIDIA · NASDAQ",aliases:["nvda","nvidia"]},
    {symbol:"NASDAQ:TSLA",name:"Tesla, Inc.",short:"TSLA",category:"global",venue:"NASDAQ",description:"Tesla · NASDAQ",aliases:["tsla","tesla"]}
  ];

  const categoryLabels = {
    all:"Tüm piyasalar",bist:"Borsa İstanbul",crypto:"Kripto",forex:"Döviz",metals:"Altın & emtia",indices:"Endeksler",global:"Global hisseler"
  };
  const defaultWatchlist = ["BIST:XU100","BIST:PETKM","FX_IDC:XAUTRYG","BINANCE:BTCUSDT","FX_IDC:USDTRY"];
  let watchlist = loadWatchlist();
  let activeSymbol = "BIST:PETKM";
  let activeInterval = "15";
  let activeCategory = "all";
  let suggestionIndex = -1;

  const $ = (id) => document.getElementById(id);
  const normalise = (value) => String(value || "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .trim();

  function loadWatchlist() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return Array.isArray(stored) && stored.length ? [...new Set(stored)].slice(0, 40) : [...defaultWatchlist];
    } catch {
      return [...defaultWatchlist];
    }
  }

  function saveWatchlist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist)); }
    catch { /* Private browsing can block local storage; the terminal remains usable. */ }
  }

  function lookupSymbol(query) {
    const key = normalise(query);
    return catalog.find(item =>
      normalise(item.symbol) === key ||
      normalise(item.short) === key ||
      normalise(item.name) === key ||
      item.aliases.some(alias => normalise(alias) === key)
    ) || null;
  }

  function resolveSymbol(query) {
    const cleaned = String(query || "").trim().replace(/\s+/g, "");
    if (!cleaned) return null;
    if (cleaned.includes(":")) return cleaned.toUpperCase();
    const known = lookupSymbol(query);
    if (known) return known.symbol;

    const token = cleaned.toUpperCase().replace("/", "");
    if (/^[A-Z]{6}$/.test(token) && /^(USD|EUR|GBP|JPY|CHF|CAD|AUD|NZD|TRY|SEK|NOK|CNY|CNH)/.test(token)) return "FX_IDC:" + token;
    if (/^[A-Z0-9]{2,24}(USDT|USDC|BUSD|FDUSD|TRY)$/.test(token)) return "BINANCE:" + token;
    if (/^(BTC|ETH|SOL|XRP|DOGE|ADA)USD$/.test(token)) return "COINBASE:" + token;
    if (/^[A-Z0-9._!-]{2,18}$/.test(token)) return "BIST:" + token;
    return cleaned.toUpperCase();
  }

  function metadata(symbol) {
    const known = catalog.find(item => item.symbol === symbol);
    if (known) return known;
    const [venue, ticker] = symbol.includes(":") ? symbol.split(":", 2) : ["", symbol];
    let category = "global";
    if (venue === "BIST") category = "bist";
    else if (venue === "BINANCE" || venue === "BYBIT" || venue === "COINBASE" || venue === "OKX") category = "crypto";
    else if (venue === "FX_IDC" || venue === "OANDA" || venue === "FOREXCOM") category = "forex";
    else if (venue === "TVC" || venue.includes("COMEX") || venue.includes("NYMEX")) category = "metals";
    else if (ticker === "XU100" || ticker.startsWith("XU")) category = "indices";
    return {
      symbol,
      name: ticker || symbol,
      short: ticker || symbol,
      category,
      venue: venue || "TRADINGVIEW",
      description: symbol + " · TradingView sembolü",
      aliases: []
    };
  }

  function renderWidgetScript(container, src, options) {
    const widgetRoot = document.createElement("div");
    widgetRoot.className = "tradingview-widget-container__widget";
    widgetRoot.style.width = "100%";
    widgetRoot.style.height = src === TV_CHART_SCRIPT ? "calc(100% - 32px)" : "100%";
    container.appendChild(widgetRoot);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.async = true;
    script.textContent = JSON.stringify(options);
    container.appendChild(script);
    script.addEventListener("error", () => {
      if (src !== TV_CHART_SCRIPT) return;
      const errorBox = document.createElement("div");
      errorBox.className = "chart-load-error";
      const title = document.createElement("strong");
      title.textContent = "TradingView grafiği yüklenemedi";
      const detail = document.createElement("span");
      detail.textContent = "Bağlantıyı kontrol et veya grafiğin sol üstündeki arama alanından farklı bir TradingView sembolü dene.";
      errorBox.append(title, detail);
      widgetRoot.replaceChildren(errorBox);
    });
  }

  function renderTickerTape() {
    const mount = $("tickerTape");
    if (!mount) return;
    mount.innerHTML = "";
    const container = document.createElement("div");
    container.className = "tradingview-widget-container";
    container.style.width = "100%";
    container.style.height = "100%";
    mount.appendChild(container);
    renderWidgetScript(container, TV_TICKER_SCRIPT, {
      symbols: [
        {proName:"BIST:XU100",title:"BIST 100"},
        {proName:"BIST:PETKM",title:"PETKM"},
        {proName:"FX_IDC:XAUTRYG",title:"Gram Altın"},
        {proName:"BINANCE:BTCUSDT",title:"Bitcoin"},
        {proName:"FX_IDC:USDTRY",title:"USD/TRY"},
        {proName:"OANDA:XAUUSD",title:"Ons Altın"}
      ],
      showSymbolLogo: false,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "tr"
    });
  }

  function renderChart() {
    const host = $("chartMount");
    if (!host) return;
    host.innerHTML = "";
    const container = document.createElement("div");
    container.className = "tradingview-widget-container";
    container.style.width = "100%";
    container.style.height = "100%";
    host.appendChild(container);

    renderWidgetScript(container, TV_CHART_SCRIPT, {
      autosize: true,
      symbol: activeSymbol,
      interval: activeInterval,
      timezone: "Europe/Istanbul",
      theme: "dark",
      style: "1",
      locale: "tr",
      enable_publishing: false,
      allow_symbol_change: true,
      withdateranges: true,
      hide_side_toolbar: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: true,
      details: true,
      calendar: false,
      hotlist: false,
      support_host: "https://www.tradingview.com"
    });
  }

  function renderInstrument() {
    const item = metadata(activeSymbol);
    $("instrumentLabel").textContent = (categoryLabels[item.category] || "PİYASA") + " · " + item.category.toLocaleUpperCase("tr-TR");
    $("instrumentName").textContent = item.name;
    $("instrumentSymbol").innerHTML = "";
    const symbolText = document.createTextNode(item.symbol);
    const dot = document.createElement("span");
    dot.textContent = "·";
    const currency = document.createTextNode(item.category === "crypto" ? "Kripto parite" : item.category === "bist" || item.category === "indices" ? "Türk Lirası" : item.description);
    $("instrumentSymbol").append(symbolText, dot, currency);
    $("exchangeTag").textContent = item.venue;
    $("instrumentLogo").textContent = (item.short || item.name || "?").slice(0, 2).toUpperCase();
    $("instrumentLogo").dataset.category = item.category;
    $("openTradingView").href = "https://www.tradingview.com/chart/?symbol=" + encodeURIComponent(activeSymbol);
    $("favoriteCurrent").classList.toggle("is-active", watchlist.includes(activeSymbol));
    $("favoriteCurrent").textContent = watchlist.includes(activeSymbol) ? "★" : "☆";
    $("favoriteCurrent").setAttribute("aria-label", watchlist.includes(activeSymbol) ? "Favorilerden çıkar" : "Favorilere ekle");
    document.title = item.short + " | BYBORA Market Desk";
  }

  function renderWatchlist() {
    const mount = $("watchlist");
    if (!mount) return;
    mount.innerHTML = "";
    const visible = watchlist
      .map(symbol => metadata(symbol))
      .filter(item => activeCategory === "all" || item.category === activeCategory);
    if (!visible.length) {
      const empty = document.createElement("div");
      empty.className = "watch-empty";
      empty.textContent = "Bu kategoride kayıtlı sembol yok. Arama alanından ekleyebilirsin.";
      mount.appendChild(empty);
      return;
    }
    visible.forEach(item => {
      const row = document.createElement("div");
      row.className = "watch-item" + (item.symbol === activeSymbol ? " active" : "");
      const select = document.createElement("button");
      select.className = "watch-select";
      select.type = "button";
      select.setAttribute("aria-label", item.short + " grafiğini aç");
      const icon = document.createElement("span");
      icon.className = "watch-icon";
      icon.textContent = (item.short || "?").slice(0, 2).toUpperCase();
      const info = document.createElement("span");
      info.className = "watch-info";
      const strong = document.createElement("strong");
      strong.textContent = item.short;
      const small = document.createElement("small");
      small.textContent = item.name;
      info.append(strong, small);
      select.append(icon, info);
      select.addEventListener("click", () => setActiveSymbol(item.symbol));
      const remove = document.createElement("button");
      remove.className = "watch-remove";
      remove.type = "button";
      remove.textContent = "×";
      remove.title = "İzleme listesinden çıkar";
      remove.setAttribute("aria-label", item.short + " listesinden çıkar");
      remove.addEventListener("click", event => {
        event.stopPropagation();
        watchlist = watchlist.filter(symbol => symbol !== item.symbol);
        saveWatchlist();
        renderWatchlist();
        renderInstrument();
      });
      row.append(select, remove);
      mount.appendChild(row);
    });
  }

  function setActiveSymbol(symbol) {
    const resolved = resolveSymbol(symbol);
    if (!resolved) return;
    activeSymbol = resolved;
    renderInstrument();
    renderWatchlist();
    renderChart();
    $("symbolSearch").value = "";
    $("searchSuggestions").hidden = true;
    closeMobileMenu();
  }

  function addCurrentToWatchlist() {
    if (!watchlist.includes(activeSymbol)) {
      watchlist.unshift(activeSymbol);
      watchlist = watchlist.slice(0, 40);
      saveWatchlist();
    } else {
      watchlist = watchlist.filter(symbol => symbol !== activeSymbol);
    }
    renderInstrument();
    renderWatchlist();
  }

  function showSuggestions(query) {
    const mount = $("searchSuggestions");
    const q = normalise(query);
    if (!q) {
      mount.hidden = true;
      return;
    }
    const results = catalog.filter(item =>
      normalise(item.name).includes(q) ||
      normalise(item.short).includes(q) ||
      normalise(item.symbol).includes(q) ||
      item.aliases.some(alias => normalise(alias).includes(q))
    ).slice(0, 7);
    mount.innerHTML = "";
    if (!results.length) {
      const hint = document.createElement("div");
      hint.className = "suggestion-hint";
      hint.textContent = "Enter ile sembolü TradingView'de aç: " + (query.includes(":") ? query.toUpperCase() : resolveSymbol(query));
      mount.appendChild(hint);
      mount.hidden = false;
      return;
    }
    results.forEach(item => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "suggestion";
      const left = document.createElement("span");
      const title = document.createElement("strong");
      title.textContent = item.short;
      const desc = document.createElement("small");
      desc.textContent = item.name;
      left.append(title, desc);
      const code = document.createElement("span");
      code.className = "suggestion-code";
      code.textContent = item.venue;
      button.append(left, code);
      button.addEventListener("click", () => setActiveSymbol(item.symbol));
      mount.appendChild(button);
    });
    mount.hidden = false;
  }

  function chooseInterval(button) {
    activeInterval = button.dataset.interval;
    document.querySelectorAll("#timeframes button").forEach(el => el.classList.toggle("active", el === button));
    renderChart();
  }

  function closeMobileMenu() {
    document.body.classList.remove("sidebar-open");
  }

  function openMobileMenu() {
    document.body.classList.add("sidebar-open");
  }

  function updateClock() {
    const value = new Intl.DateTimeFormat("tr-TR", {
      timeZone: "Europe/Istanbul",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(new Date());
    $("turkeyClock").textContent = value + " TRT";
  }

  function bindEvents() {
    const search = $("symbolSearch");
    $("symbolSearchForm").addEventListener("submit", event => {
      event.preventDefault();
      const value = search.value.trim();
      if (!value) return;
      setActiveSymbol(value);
    });
    search.addEventListener("input", () => showSuggestions(search.value));
    search.addEventListener("focus", () => {
      if (search.value.trim()) showSuggestions(search.value);
    });
    document.addEventListener("click", event => {
      if (!event.target.closest(".search-box")) $("searchSuggestions").hidden = true;
    });
    search.addEventListener("keydown", event => {
      if (event.key === "Escape") $("searchSuggestions").hidden = true;
      if (event.key === "ArrowDown") {
        const options = [...$("searchSuggestions").querySelectorAll(".suggestion")];
        if (options.length) {
          event.preventDefault();
          suggestionIndex = (suggestionIndex + 1) % options.length;
          options.forEach((option, i) => option.classList.toggle("keyboard-active", i === suggestionIndex));
        }
      }
      if (event.key === "Enter" && suggestionIndex >= 0) {
        const option = $("searchSuggestions").querySelectorAll(".suggestion")[suggestionIndex];
        if (option) { event.preventDefault(); option.click(); }
      }
    });
    document.addEventListener("keydown", event => {
      if (event.key === "/" && !["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) {
        event.preventDefault();
        search.focus();
      }
    });
    $("marketCategories").addEventListener("click", event => {
      const button = event.target.closest("[data-category]");
      if (!button) return;
      activeCategory = button.dataset.category;
      document.querySelectorAll(".category-button").forEach(el => el.classList.toggle("active", el === button));
      renderWatchlist();
    });
    $("timeframes").addEventListener("click", event => {
      const button = event.target.closest("[data-interval]");
      if (button) chooseInterval(button);
    });
    $("addCurrentToWatch").addEventListener("click", addCurrentToWatchlist);
    $("favoriteCurrent").addEventListener("click", addCurrentToWatchlist);
    $("copySymbol").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(activeSymbol);
        $("copySymbol").innerHTML = "✓ <span>Kopyalandı</span>";
        setTimeout(() => { $("copySymbol").innerHTML = "⧉ <span>Kodu kopyala</span>"; }, 1300);
      } catch {
        window.prompt("Sembolü kopyala:", activeSymbol);
      }
    });
    document.querySelectorAll("[data-symbol]").forEach(button => {
      button.addEventListener("click", () => setActiveSymbol(button.dataset.symbol));
    });
    $("menuToggle").addEventListener("click", openMobileMenu);
    $("menuClose").addEventListener("click", closeMobileMenu);
    $("mobileScrim").addEventListener("click", closeMobileMenu);
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMobileMenu();
    });
  }

  function init() {
    bindEvents();
    renderInstrument();
    renderWatchlist();
    renderTickerTape();
    renderChart();
    updateClock();
    window.setInterval(updateClock, 1000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();