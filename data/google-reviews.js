/**
 * STVARNE Google recenzije — manuelni fallback.
 *
 * VAŽNO:
 *  - Ovaj fajl mora sadržavati ISKLJUČIVO realne recenzije sa Google profila
 *    biznisa "M Park Sarajevo" (https://www.google.com/maps/place/?q=place_id:<PLACE_ID>).
 *  - NE mijenjati tekst recenzije, ime korisnika, ocjenu ili datum.
 *  - Ako su ispravno postavljene env varijable GOOGLE_PLACES_API_KEY i
 *    GOOGLE_PLACE_ID, recenzije se automatski povlače sa Google Places API-ja
 *    i ovaj fajl se ignoriše.
 *
 * Kako popuniti (samo ako ne koristite Places API):
 *  1) Otvoriti Google Business Profile / Google Maps stranicu biznisa.
 *  2) Za svaku recenziju koju želite prikazati doslovno prepisati (copy/paste):
 *       - authorName       — ime kako stoji na Google-u
 *       - authorUrl        — link na Google profil korisnika (opcionalno)
 *       - profilePhotoUrl  — URL profilne fotografije (opcionalno)
 *       - rating           — broj zvjezdica 1–5 (kao na Google-u)
 *       - text             — originalni tekst recenzije, BEZ IZMJENA
 *       - relativeTime     — npr. "prije 2 mjeseca" (opcionalno)
 *       - time             — Unix timestamp u sekundama (opcionalno)
 *       - language         — npr. "bs" / "en" (opcionalno)
 *  3) Ažurirati `aggregateRating` i `userRatingsTotal` tako da odgovaraju
 *     stvarnim brojkama na Google profilu (NE izmišljati).
 *
 * Ako nema stvarnih recenzija, ostavite `reviews: []` — sekcija će prikazati
 * čisto "uskoro" stanje umjesto lažnog sadržaja.
 */
export const GOOGLE_REVIEWS_MANUAL = {
  // Ukupna ocjena na Google profilu (npr. 4.8). Postavite na null ako još nije poznata.
  aggregateRating: null,
  // Ukupan broj recenzija na Google profilu. Postavite na null ako još nije poznato.
  userRatingsTotal: null,
  // Stvarne recenzije, doslovno prepisane sa Google-a.
  reviews: [
    // Primjer strukture (ZAKOMENTARISAN — ne aktivirati dok nije stvarna recenzija):
    // {
    //   authorName: "Ime Prezime",
    //   authorUrl: "https://www.google.com/maps/contrib/123...",
    //   profilePhotoUrl: "https://lh3.googleusercontent.com/a/...",
    //   rating: 5,
    //   text: "Originalni tekst recenzije bez izmjena.",
    //   relativeTime: "prije 2 mjeseca",
    //   time: 1714060800,
    //   language: "bs",
    // },
  ],
};
