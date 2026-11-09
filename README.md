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
Uygulama, depodaki `.github/workflows/pages.yml` iş akışıyla GitHub Pages'e dağıtılır. İlk yayın için GitHub deposunda **Settings → Pages → Build and deployment → Source** alanını **GitHub Actions** olarak seçin. Sonrasında `main` dalına gönderilen her güncelleme otomatik yayınlanır; isterseniz **Actions → Deploy static site to GitHub Pages → Run workflow** yoluyla elle de başlatabilirsiniz.

**Canlı adres:** https://perforjanscoms.github.io/futbol-simulasyon-lab/

## Dosyalar
- `index.html`: uygulama arayüzü
- `style.css`: masaüstü ve mobil tasarım
- `app.js`: takım arama, model ve simülasyon
- `teams.json`: 655 takımlık isim havuzu
- `.nojekyll`: GitHub Pages için statik yayın işareti


## Canlı maç verisi (API-Football)
Canlı skor ve günün fikstürü, API-Football v3 üzerinden alınabilir. Ayrıca seçili iki takımın son 5 tamamlanmış karşılaşması çekilerek form, moral, maç aralığına dayalı yorgunluk, gol farkı değişkenliğine dayalı istikrar ve son maç gollerinden türetilmiş hücum/savunma katsayıları profile işlenebilir.

1. [API-Football hesabı oluşturun](https://dashboard.api-football.com/register) ve ücretsiz API anahtarınızı alın.
2. Uygulamanın **Gerçek maç akışı** bölümüne anahtarı girip kaydedin.
3. **Canlı maçları getir** veya **Bugünün fikstürü** düğmesine basın. Canlı maç kartındaki **Eşleşmeye aktar** düğmesi takımları simülatör seçimine taşır.
4. İsterseniz otomatik yenilemeyi açın. Varsayılan aralık 30 dakikadır; ücretsiz plan kotasını korumak için otomatik yenileme kapalı gelir.

API-Football'ın ücretsiz planı günlük 100 istektir. Sağlayıcı fikstür uç noktasını canlı maçlarda yaklaşık 15 saniyede bir günceller; fakat bu uygulama ücretsiz kotayı korumak için 30 dakikalık otomatik yenileme sunar. İstek kotası API yanıtından okunabiliyorsa uygulamada gösterilir.

**Güvenlik ve kapsam:** API anahtarı GitHub dosyalarına yazılmaz; bu tarayıcının `localStorage` alanında tutulur ve API'ye doğrudan bu tarayıcıdan gönderilir. Anahtarı sohbet içinde paylaşmayın. API-Football panelinde mümkünse kullanım alanını uygulamanın alan adıyla sınırlandırın. Bu canlı mod şu anda gerçek skor/fikstür akışını gösterir ve eşleşmeyi simülatöre taşır; canlı maçın dakika/skor bilgisini tam maç gol modeline otomatik katmaz. Model tahminleri ayrı bir simülasyon hesabıdır, canlı skor kaynağının tahmini değildir.
