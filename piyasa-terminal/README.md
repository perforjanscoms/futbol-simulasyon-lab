# BYBORA Market Desk

Yahoo Finance kullanmayan, TradingView'in resmî gömülü grafik widget'larını kullanan statik piyasa takip arayüzü.

## Canlı uygulama
https://perforjanscoms.github.io/futbol-simulasyon-lab/piyasa-terminal/

## Kapsam
- TradingView Advanced Chart widget: mum grafik, gösterge/çizim araçları ve grafiğin kendi sembol araması.
- TradingView Ticker Tape: XU100, PETKM, gram altın, Bitcoin, USD/TRY ve ons altın akışı.
- BIST, kripto, forex, metal/emtia ve endeks kategorileri.
- Kendi izleme listesi; tarayıcının localStorage alanında saklanır.
- Sembol kısa yolları: `PETKM`, `XU100`, `gram altın`, `BTCUSDT`, `USDTRY` veya doğrudan `BINANCE:ETHUSDT` gibi `BORSA:SEMBOL` biçimi.
- 1 dk, 5 dk, 15 dk, 30 dk, 1 saat, 4 saat, günlük, haftalık ve aylık grafik zaman dilimleri.
- Masaüstü ve mobil ekranlara uyumlu görünüm.

## Sembol örnekleri
- Petkim: `BIST:PETKM`
- BIST 100: `BIST:XU100`
- Gram altın: `FX_IDC:XAUTRYG`
- Dolar/TL: `FX_IDC:USDTRY`
- Bitcoin: `BINANCE:BTCUSDT`
- Ons altın: `OANDA:XAUUSD`

Grafiğin sol üstündeki TradingView sembol araması, TradingView'in desteklediği diğer pazarları ve enstrümanları bulmak için kullanılabilir. Uygulamadaki arama alanı sık kullanılan semboller için kısayol/eşleştirme sunar; tam borsa kodu yazıldığında `EXCHANGE:SYMBOL` biçimini korur.

## Veri ve kısıtlar
- Bu projede Yahoo Finance kullanılmaz.
- Grafik, fiyat ve piyasa göstergeleri TradingView tarafından yüklenen widget içinde gösterilir; uygulama TradingView'in fiyat verisini dışarı çıkarmaz veya ayrı bir fiyat API'si gibi kullanmaz.
- TradingView widget'larında hisse verileri ilgili borsanın lisans koşullarına göre gecikmeli olabilir. TradingView'in açıklamasına göre widget'larda forex ve kripto verileri gerçek zamanlıdır; hisse verileri için gerçek zamanlı akış isteniyorsa borsayla ayrı veri lisansı gerekir.
- Bazı enstrümanlar TradingView widget'larında desteklenmeyebilir veya "yalnızca TradingView'de mevcut" mesajı gösterebilir. Hiçbir üçüncü taraf ekranından her sembolün kesin açılacağı garanti edilemez.
- TradingView Advanced Charts'ın lisanslı kütüphanesi kişisel/hobi kullanımı için sunulmadığından, bu sürüm resmî ücretsiz gömülü grafik widget'ını kullanır. Widget, TradingView.com hesabındaki Pine Script, alarm, strateji test edici ve diğer bütün platform işlevlerini birebir sunmaz.

## Yerelde çalıştırma
```bash
python -m http.server 8000
```
Ardından `http://localhost:8000/piyasa-terminal/` adresini açın.

## Kaynaklar
- [TradingView Advanced Chart widget](https://www.tradingview.com/widget-docs/widgets/charts/advanced-chart/)
- [TradingView widget veri koşulları](https://www.tradingview.com/widget-docs/faq/data/)
- [TradingView widget sembol değiştirme](https://www.tradingview.com/widget-docs/tutorials/iframe/build-page/dynamic-symbols/)
- [Borsa İstanbul veri dağıtımı](https://www.borsaistanbul.com/en/data/data-dissemination)
