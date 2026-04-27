export const SITE = {
  brand: "M Park Sarajevo",
  legalName: "M Park Sarajevo",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://mpark-sarajevo.com",
  tagline:
    "Privatni parking na adresi Kasindolskih Žrtava 18, blizu Aerodroma Sarajevo za putnike.",
  phoneDisplay: "+387 61 512 152",
  phoneTel: "+38761512152",
  email: "mparksarajevo.info@gmail.com",
  whatsapp: "38761512152",
  address: "Kasindolskih Žrtava 18, Sarajevo, Bosna i Hercegovina",
  addressShort: "Kasindolskih Žrtava 18, Sarajevo",
  addressNote: "Blizu Aerodroma Sarajevo",
  locationLine: "Parking blizu Aerodroma Sarajevo – Kasindolskih Žrtava 18",
  seoLine:
    "Privatni parking na adresi Kasindolskih Žrtava 18, blizu Aerodroma Sarajevo.",
  geo: {
    latitude: 43.8246,
    longitude: 18.3314,
  },
  googleProfileUrl:
    process.env.NEXT_PUBLIC_GOOGLE_PROFILE_URL ||
    "https://www.google.com/maps/search/?api=1&query=M+Park+Sarajevo",
  seoKeywords: [
    "parking aerodrom sarajevo",
    "privatni parking sarajevo",
    "parking za putnike",
    "parking kasindolskih žrtava 18",
    "parking blizu aerodroma sarajevo",
    "9 km po danu parking",
  ],
};

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1920&q=82&auto=format&fit=crop";

// OG/Twitter share image is generated dynamically per locale via
// app/[locale]/opengraph-image.jsx (branded with logo + tagline + price).
