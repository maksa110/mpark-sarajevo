# M Park Sarajevo — Next.js

Privatni parking blizu Aerodroma Sarajevo (M Park). Server-rendered Next.js (App Router) sajt sa optimizovanim SEO-om, JSON-LD strukturiranim podacima, sitemap.xml, robots.txt i admin panelom za upravljanje rezervacijama.

## Tech stack

- **Next.js 15** (App Router, RSC, Metadata API)
- **React 19**
- **Tailwind CSS 3**
- **lucide-react** (ikone)
- **Node.js** runtime za API rute
- **JSON file storage** (`data/reservations.json`) — jednostavno za dev/produkciju na jednom serveru. Za serverless (Vercel) zamijenite pravom bazom (Postgres/Firestore).

## Struktura

```
app/
  [locale]/           # Lokalizovane stranice (bs, en, de)
    page.jsx          # Landing + LocalBusiness/ParkingFacility + FAQ JSON-LD
    rezervacija/      # SEO landing + Booking forma
    parking-aerodrom-sarajevo-cijene/
    transfer-aerodrom-sarajevo/
    privatni-vs-javni-parking-sarajevo/
    layout.jsx        # Metadata API (locale)
  sitemap.js          # Home + SEO podstranice (hreflang alternates)
  robots.js
messages/
  bs.json             # Glavni prijevodi (+ SEO članci)
  en.json / de.json   # Ostali jezici
  en.seo.json / de.seo.json  # SEO članci (merge u i18n/request.js)
data/
  local-citations.json # Ručna lista direktorija/partnera (NAP / off-page)
```

## Pokretanje

```bash
# 1) Instaliraj deps
npm install

# 2) Kopiraj .env.example u .env.local i podesi vrijednosti
cp .env.example .env.local

# 3) Razvojni server (http://localhost:3000)
npm run dev

# 4) Produkcijski build i pokretanje
npm run build
npm start
```

## Environment varijable

Kopirajte `.env.example` u `.env.local`:

| Varijabla                      | Opis                                                                 |
| ------------------------------ | -------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`         | Kanonski URL (preporuka: `https://www.mpark-sarajevo.com`).           |
| `NEXT_PUBLIC_GOOGLE_REVIEW_URL`| Direktan link za Google recenziju (email + WhatsApp CTA nakon rezervacije). |
| `GOOGLE_BUSINESS_REVIEW_URL`   | Alternativa samo na serveru (ako URL ne želite u `NEXT_PUBLIC_*`).   |
| `ADMIN_PASSWORD`               | Lozinka za `/admin` login.                                           |
| `ADMIN_SESSION_SECRET`         | Tajni ključ (≥32 znaka u produkciji) za sesiju.                      |
| `GMAIL_USER` / `GMAIL_PASS`    | SMTP za obavijesti o rezervacijama (App Password).                   |
| `ADMIN_EMAIL`                | Primatelj admin obavijesti (opcionalno).                             |
| `GOOGLE_PLACES_API_KEY` / `GOOGLE_PLACE_ID` | Žive recenzije na sajtu (opcionalno).                    |
| `NEXT_PUBLIC_GOOGLE_PROFILE_URL` | Javni link ka GBP kad Places nije podešen.                       |
| `RESERVATIONS_FILE`           | Lokalna JSON baza (default `./data/reservations.json`).              |

## SEO check-lista

- ✅ Višejezične SEO podstranice (`/bs/...`, `/en/...`, `/de/...`) sa dugim sadržajem i internim linkovima.
- ✅ Kanonski URL + `hreflang` alternates u `generateMetadata` (SEO članci + početna).
- ✅ `sitemap.xml` uključuje početnu i sve SEO rute.
- ✅ JSON-LD na početnoj: `LocalBusiness` + `ParkingFacility`, ponuda, `FAQPage`, `AggregateRating`/`Review` kad postoje Google podaci.
- ✅ JSON-LD na člancima: `ParkingFacility` (+ opcioni `aggregateRating`), `WebPage`, `BreadcrumbList`.
- ✅ ISR na početnoj i člancima (`revalidate`; efektivni interval može biti ograničen `fetch(..., revalidate)` iz Places API-a ~6h).
- ✅ Potvrda rezervacije e-poštom: brend **M Park Sarajevo** + poziv na Google recenziju ako je postavljen `NEXT_PUBLIC_GOOGLE_REVIEW_URL`.
- ✅ Nakon uspješne rezervacije na sajtu: CTA za Google recenziju + WhatsApp poruka (isti link ako je konfigurisan).
- ✅ Navigacija i footer rade ispravno sa podstranica (hash linkovi ka početnoj i `/rezervacija#book`).
- ✅ `data/local-citations.json` — checklist za ručne lokalne listinge / partnere (NAP).
- ✅ Redirect `*.vercel.app` → `www.mpark-sarajevo.com` (`middleware.js` + `vercel.json`).

### Ručni koraci (vlasnik biznisa)

1. **Google Search Console** — dodati `www` property, verifikacija, poslati `sitemap.xml`.
2. **Google Business Profile** — kategorije, fotografije, isti NAP kao na sajtu.
3. Postaviti **`NEXT_PUBLIC_GOOGLE_REVIEW_URL`** (link „napiši recenziju“ iz GBP).
4. **`NEXT_PUBLIC_GOOGLE_PROFILE_URL`** — koristiti **konkretan** Maps/Place URL (`/maps/place/...` ili `cid=`) da JSON-LD polje **`sameAs`** bude ispunjeno (generička pretraga se izostavlja).

### Finalna validacija (ručno nakon deploya)

Ovo **ne može** Cursor/agent automatski potpisati kao „prošlo“ bez pristupa tvom Google nalogu:

| Korak | Alat | Šta provjeriti |
|-------|------|----------------|
| Indeksacija | Search Console → Pages | Nema kritičnih „Not indexed“ bez uzroka; riješiti Coverage |
| Rich Results | [Rich Results Test](https://search.google.com/test/rich-results) | `/bs` i jedna SEO podstranica — nema grešaka u JSON-LD |
| Brzina | [PageSpeed Insights](https://pagespeed.web.dev/) | Mobilno: LCP, CLS, INP (realni Field data kad dostupni) |
| Live tehničko | `curl -I` / pregled | `sitemap.xml` → **200**, `robots.txt` → **200**, canonical na www |

**Šema `openingHoursSpecification`** (`lib/site.js` → `SCHEMA_OPENING_HOURS_SPEC`) mora **odgovarati radnom vremenu na Google Business Profile** — uredi vrijeme ako se razlikuje.

### UX / SEO u kodu (zadnji prolaz)

- Vidljivi **breadcrumb** na SEO stranicama (`components/SeoBreadcrumbs.jsx`).
- **Brzi vodiči** ispod headera na marketing stranicama (`components/SeoTopicNav.jsx`).
- JSON-LD: **`openingHoursSpecification`**, **`sameAs`** (kad je Place URL), **`ratingCount`** uz **`reviewCount`** gdje ima ocjene.
- Uklonjen tehnički žargon iz SEO tekstova (EN HTTP 201; BS „serverska potvrda“).
- **Booking**: `startTransition` nakon uspješnog slanja (lagano smanjenje blokiranja glavnog thread-a pri batch state updateu).

## Konverzija fokusa

- **Mobilni sticky CTA** "Rezerviši parking" (prelijepljen za dno).
- **Header CTA** vidljiv na desktopu.
- **Hero CTA** koji skroluje na rezervacionu formu.
- **Cjenovnik** sa CTA na svaki paket.
- **WhatsApp** dugme u Kontakt sekciji isključivo za podršku (rezervacije idu kroz formu).

## Admin panel

- URL: `/admin/login` (prijava), `/admin` (dashboard).
- Sesijska kolačića: HMAC-potpisana, `HttpOnly`, `SameSite=Lax`, `Secure` u produkciji.
- Default dev lozinka: `admin` (promijenite preko `ADMIN_PASSWORD` u `.env.local`).
- Iz dashboarda možete potvrditi/završiti/obrisati rezervaciju i filtrirati po statusu / pretrazi.

## Deployment

### Vercel / Netlify (preporučeno)

> Napomena: file-based JSON DB neće raditi pouzdano u serverless okruženju. Zamijenite `lib/db.js` integracijom sa pravom bazom (Postgres/Neon, Firestore, Supabase…).

1. Postavite `NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` (najmanje 32 znaka).
2. Push u Git → connect repo na Vercel → deploy.

### Self-hosted (VPS, Docker)

Build pa pokrenite `npm start`. JSON DB radi savršeno na single-instance serveru. Konfigurišite reverse proxy (Nginx) za HTTPS.

## Performanse

- Server komponente za sve statičke sekcije.
- "use client" samo za booking formu i FAQ akordeon.
- `next/image` za sve slike (Unsplash u `images.remotePatterns`).
- HTTP gzip kompresija (`compress: true`).
- Preconnect / preload nije potreban — Next.js automatski optimizuje fontove i resurse.
- Build report (`npm run build`) pokazuje malo First-Load JS (≈111 kB na home page).
