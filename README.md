# Futbol Simülasyon Laboratuvarı

Herkese açık takım havuzunda listelenen isimlerle hazırlanmış, bağımsız ve mobil uyumlu futbol karşılaştırma/simülasyon uygulaması. Kaynak sitenin kodu, markası veya kapalı algoritması kopyalanmamıştır.

## Kapsam
- 446 kulüp takımı ve 209 milli takım (toplam 655 kayıt).
- Takım adıyla arama, kulüp/milli takım filtreleri ve ev/deplasman eşleşmesi.
- Takım bazında düzenlenebilir rating, hücum, savunma, form, iç saha etkisi, yorgunluk, istikrar, moral ve motivasyon profilleri.
- Rating, saha etkisi, form, yorgunluk ve mental göstergelerle ayarlanan negatif binom gol modeli üzerinden 1-X-2, beklenen gol, 2.5 üstü ve en olası skor tahminleri. İstikrar seviyesi düşük takımlarda skor dağılımı daha değişken olur.
- 20.000 deterministik istatistik senaryosundan türetilen örnek maç istatistikleri.
- Takım profillerini tarayıcıda saklama; JSON/CSV içe ve JSON dışa aktarma.

## Önemli veri notu
Bu sürüm **canlı maç, sakatlık, kadro, güncel form veya bahis oranı verisi çekmez**. Takımlar başlangıçta eşit 1500 rating ve varsayılan katsayılarla gelir. Kullanıcı takım güçlerini elle düzenleyebilir. Sonuçlar istatistiksel simülasyon çıktısıdır; kesin skor veya bahis garantisi değildir.

## Yerelde çalıştırma
Tarayıcıda dosyaya çift tıklamak yerine klasörü bir statik web sunucusuyla açın. Örneğin Python kuruluysa:
```bash
python -m http.server 8000
```
Ardından `http://localhost:8000` adresini açın.

## GitHub Pages
Depoda `index.html`, `style.css`, `app.js` ve `teams.json` kök dizindedir. GitHub deposunda **Settings → Pages** bölümüne gidin. **Deploy from a branch** seçin, branch olarak `main`, klasör olarak `/(root)` seçip **Save** düğmesine basın. GitHub Pages dağıtımı tamamlandığında sayfa `https://KULLANICI.github.io/REPO/` biçiminde yayınlanır.

## Dosyalar
- `index.html`: uygulama arayüzü
- `style.css`: masaüstü ve mobil tasarım
- `app.js`: takım arama, model ve simülasyon
- `teams.json`: 655 takımlık isim havuzu
- `.nojekyll`: GitHub Pages için statik yayın işareti
