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
  layout.jsx           # Root layout + Metadata API (title, OG, Twitter, JSON-LD via children)
  page.jsx             # Landing (jedna stranica, sve sekcije + LocalBusiness/FAQ JSON-LD)
  globals.css          # Tailwind base
  sitemap.js           # /sitemap.xml
  robots.js            # /robots.txt
  api/                 # Next.js Route Handlers
    reservations/route.js          # POST (javno) + GET (admin)
    reservations/[id]/route.js     # PATCH/DELETE (admin)
    admin/login/route.js
    admin/logout/route.js
    admin/me/route.js
  admin/
    layout.jsx         # noindex
    page.jsx           # Dashboard (chranjeno)
    login/page.jsx
components/             # UI sekcije (Header, Hero, Booking, Trust, …)
data/                   # Statički sadržaj (gallery, reviews, faq)
lib/
  site.js               # Brand/SEO konstante
  auth.js               # HMAC sesija (server-only)
  db.js                 # JSON file DB (server-only)
public/
  favicon.svg
  site.webmanifest
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

| Varijabla                | Opis                                                         |
| ------------------------ | ------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`   | Apsolutni URL sajta (koristi se u meta/sitemap/JSON-LD).     |
| `ADMIN_PASSWORD`         | Lozinka za /admin login.                                     |
| `ADMIN_SESSION_SECRET`   | Tajni ključ (≥32 znaka u produkciji) za potpis sesijske kolačiće. |
| `RESERVATIONS_FILE`      | Putanja do JSON baze (default `./data/reservations.json`).   |

## SEO check-lista

- ✅ Jedan `<h1>` (Hero)
- ✅ Semantične H2/H3 hijerarhije
- ✅ `metadataBase` + dinamički title template
- ✅ Open Graph + Twitter Card meta
- ✅ Canonical URL (`/`)
- ✅ `<link rel="alternate" hreflang>` po potrebi (sajt je BS)
- ✅ JSON-LD `LocalBusiness` (sa `address`, `geo`, `offers`, `areaServed`)
- ✅ JSON-LD `FAQPage` (rich result eligible)
- ✅ JSON-LD `Product` + `AggregateRating` + `Review`
- ✅ `next/image` sa `priority` na hero, lazy loading na galeriji, AVIF/WebP
- ✅ `sitemap.xml` (auto-generisano)
- ✅ `robots.txt` (auto-generisano, blokira `/admin` i `/api`)
- ✅ `site.webmanifest` (PWA metadata)
- ✅ Admin sekcija `noindex/nofollow`
- ✅ Server-side rendering (sve sekcije se vide u "view source")

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
