# Yayına alma

Site statik dosyalara derleniyor, yani sunucu gerekmiyor. GitHub Pages, Netlify,
ya da firmanın kendi hosting'i — hepsi çalışır.

---

## A. Kodu yeni bir GitHub hesabına koymak

`gh` komutu şu an **Ery2992** hesabına bağlı. Başka bir hesap kullanacaksan
önce o hesabı eklemen gerekiyor. İlk kez yapıyorsan sırayla:

### 1. Yeni hesabı `gh`'ye ekle

```bash
gh auth login
```

Sorulara şöyle cevap ver:

| Soru | Cevap |
|---|---|
| What account do you want to log into? | **GitHub.com** |
| What is your preferred protocol? | **HTTPS** |
| Authenticate Git with your GitHub credentials? | **Yes** |
| How would you like to authenticate? | **Login with a web browser** |

Ekranda 8 haneli bir kod çıkar (örn. `ABCD-1234`), `Enter`'a basınca tarayıcı
açılır — kodu oraya yapıştırıp **yeni hesabınla** giriş yap.

Artık iki hesap kayıtlı. Hangisinin aktif olduğunu görmek ve değiştirmek için:

```bash
gh auth status          # ikisini de listeler, aktif olanı gösterir
gh auth switch          # hesaplar arasında geçiş yapar
```

> Bu adımı ben senin yerine yapamam — tarayıcıdan kendi şifrenle giriş
> gerektiriyor. Onun için depoyu da ben oluşturmadım.

### 2. Depoyu oluştur ve gönder

Aktif hesabın yeni hesap olduğundan emin ol (`gh auth status`), sonra proje
klasöründe:

```bash
cd ~/Developer/cihan-textile

git add -A
git commit -m "Cihan Textile web sitesi"

# Depoyu oluşturur, remote'u bağlar ve gönderir — tek komut
gh repo create cihan-textile --public --source=. --remote=origin --push
```

Depo **private** olsun istiyorsan `--public` yerine `--private` yaz. (Pages'in
private depoda çalışması GitHub Pro gerektirir.)

Elle yapmayı tercih edersen: github.com'da boş bir depo aç, sonra

```bash
git remote add origin https://github.com/<HESAP>/cihan-textile.git
git branch -M main
git push -u origin main
```

### 3. Pages'i aç

1. Depoda **Settings → Pages**
2. **Source** → **GitHub Actions** seç (「Deploy from a branch」 değil)

Bu kadar. `.github/workflows/deploy.yml` zaten hazır: her `main` push'unda
lint'i çalıştırıp siteyi derliyor ve yayınlıyor. İlk deploy ~2 dakika.

Adres: `https://<HESAP>.github.io/cihan-textile/`

**Actions** sekmesinden ilerleyişi izleyebilirsin. Kırmızı olursa loglara bak;
`npm run lint` ya da derleme hatası olur genelde.

---

## B. Kendi domain'inize taşımak

1. Depoda **Settings → Pages → Custom domain**'e alan adını yaz (örn.
   `www.cihantextile.com`), kaydet.
2. Alan adı sağlayıcınızda DNS kaydı ekleyin:
   - `www` için: **CNAME** → `<HESAP>.github.io`
   - Kök alan adı (`cihantextile.com`) için: **A** kayıtları →
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. **Enforce HTTPS**'i işaretleyin (sertifika birkaç dakikada gelir).

`PAGES_BASE_PATH` ile uğraşmanız gerekmiyor: workflow bunu GitHub'dan otomatik
alıyor ve custom domain bağlandığında kendiliğinden boşalıyor.

> Mevcut `www.cihantextile.com` eski sitede duruyor. Yeni siteyi önce
> `deneme.cihantextile.com` gibi bir alt alan adında yayına alıp içiniz rahat
> ettikten sonra ana adrese geçmek en güvenlisi.

---

## C. Hosting'e FTP ile (GitHub kullanmadan)

```bash
npm run build:static
cd out && zip -r ../cihan-tekstil-site.zip .
```

Paketi hosting firmasına verin. İçinde `OKUBENI.txt` var; ne yükleyeceklerini,
sunucudan ne beklendiğini ve sorun çıkarsa nereye bakacaklarını anlatıyor.

### "Dosyaları .html uzantılı yapın" isteği

Dosyalar **zaten** .html — sadece `tr/index.html` biçiminde, klasör içinde.
Sunucuda hiçbir şey kurulu olması gerekmiyor; PHP, Node, GitHub, hiçbiri.

Düz `tr.html` / `tr/about.html` yapısı denendi ve **çalışmıyor**, sebebi yapısal:

- `/tr` aynı anda hem bir sayfa hem de bir klasör olmak zorunda (altında
  `catalog`, `about`, `contact` var).
- Apache böyle bir istekte `mod_dir` ile klasöre yönlendirir ve `tr.html`
  dosyasına hiç bakmaz. `.htaccess` kuralı da kurtaramaz: alışılmış
  `RewriteCond !-d` koşulu tam olarak bu durumu dışarıda bırakır.
- Linkleri `/tr/about.html` biçimine çevirip denedik — tıklayarak gezinme
  çalışıyor ama Next istemci yönlendiricisi adresi `/tr/about` olarak yazıyor.
  Ziyaretçi **sayfayı yenilediğinde, linki paylaştığında ya da Google o adresi
  taradığında 404** alıyor. Ölçüldü: `/tr`, `/tr/about`, `/tr/catalog`,
  `/tr/contact` hepsi 404.

Klasör yapısı bu sorunların hiçbirini yaşamıyor ve ek sunucu ayarı istemiyor.
Bu yüzden düz mod build script'inden kaldırıldı.

### Teslim öncesi doğrulama

Paketi gerçekten açıp, akıllı yönlendirme yapmayan düz bir dosya sunucusunda
denemek en güvenilir kontrol:

```bash
unzip -q cihan-tekstil-site.zip -d /tmp/site-test
node scripts/serve-static.mjs 4321 /tmp/site-test
node scripts/audit-intro.mjs && node scripts/audit-responsive.mjs
```

## D. Eski notlar

```bash
npm run build:static
```

`out/` klasörünün **içindekileri** hosting'in kök dizinine (`public_html`)
yükleyin. Sunucu tarafında hiçbir şey kurulu olması gerekmiyor.

Sadece bir şart var: **sunucu HTTP Range isteklerine `206` dönmeli.** Giriş
animasyonu videoyu scroll ile tararken bunu kullanıyor. Kontrol:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  -H "Range: bytes=0-1023" https://ALAN-ADINIZ/video/intro.mp4
```

`206` gelmeli. `200` gelirse giriş animasyonu takılmaz ama scroll ile
taranmaz — video baştan sona kendi oynar (kod bunu kendi algılayıp öyle
davranıyor). GitHub Pages, Netlify, Vercel, nginx ve Apache'nin hepsi `206`
döner; sorun genelde basit Python/Node dosya sunucularında olur.

---

## Yayına çıkmadan önce

- `npm run build:static` hatasız bitiyor mu
- `node scripts/serve-static.mjs 4321 out` ile `out/`'u aç, `http://localhost:4321`
  adresini gez (bu sunucu Range destekler, gerçek hosting gibi davranır)
- Denetimleri çalıştır: `audit-intro`, `audit-responsive`, `audit-interaction`
  (bkz. README)
- Telefondan da bak: `node scripts/serve-static.mjs 4321 out` çalışırken
  `http://<bilgisayarın-yerel-IP>:4321`

## Bilinmesi gerekenler

- `proxy.ts` (dil yönlendirmesi) statik export'ta çalışmaz. `build-static.mjs`
  onun yerine kökte bir `index.html` yazıyor; aynı Accept-Language seçimini
  tarayıcıda yapıyor, JavaScript kapalıysa da TR/EN linkleri kalıyor.
- `.nojekyll` şart. Olmazsa Pages `_next/` klasörünü gizler ve site
  stilsiz/çalışmaz açılır. `build-static.mjs` bunu otomatik yazıyor.
- Görsel optimizasyonu statik export'ta kapalı; fotoğraflar olduğu gibi
  sunuluyor. Toplam ~14 MB, çoğu giriş videosu (4.1 MB) ve depo videosu (2.4 MB).
