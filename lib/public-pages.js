export const PUBLIC_PAGE_PATHS = {
  about: "/about",
  contact: "/contact",
};

export const PUBLIC_PAGE_COPY = {
  bs: {
    about: {
      title: "O nama | M Park Sarajevo",
      description:
        "Upoznajte M Park Sarajevo, privatni parking uz Aerodrom Sarajevo sa transferom putnika i jasnim informacijama za rezervaciju.",
      h1: "O M Park Sarajevo parkingu",
      intro:
        "M Park Sarajevo pruža privatni parking na adresi Kasindolskih Žrtava 18 za putnike koji polaze sa Aerodroma Sarajevo.",
      sections: [
        {
          h2: "Parking i transfer do aerodroma",
          text: "Usluga povezuje čuvanje vozila sa transferom do i od Aerodroma Sarajevo. Parking radi 24 sata dnevno, sedam dana u sedmici, a rezervacija se obavlja putem web stranice.",
        },
        {
          h2: "Jasne informacije za putnike",
          text: "Na stranici su objavljene cijene parkiranja, koraci rezervacije, kontakt podaci, lokacija i odgovori na česta pitanja kako bi putnik mogao provjeriti uslugu prije dolaska.",
        },
        {
          h2: "Povjerenje i kontakt",
          text: "Posjetioci mogu provjeriti Google recenzije prikazane na stranici, otvoriti Google Maps lokaciju te kontaktirati M Park Sarajevo telefonom, e-mailom ili WhatsAppom.",
        },
      ],
    },
    contact: {
      title: "Kontakt | M Park Sarajevo",
      description:
        "Kontaktirajte M Park Sarajevo i pronađite privatni parking na adresi Kasindolskih Žrtava 18 u Sarajevu.",
      h1: "Kontakt i lokacija M Park Sarajevo",
      intro:
        "Ovdje su objedinjeni službeni kontakt podaci i tačna lokacija ulaza u parking.",
    },
  },
  en: {
    about: {
      title: "About M Park Sarajevo | Airport Parking",
      description:
        "Learn about M Park Sarajevo, private parking near Sarajevo Airport with passenger transfer and clear online booking information.",
      h1: "About M Park Sarajevo",
      intro:
        "M Park Sarajevo provides private parking at Kasindolskih Žrtava 18 for passengers travelling from Sarajevo Airport.",
      sections: [
        {
          h2: "Parking and airport transfer",
          text: "The service combines vehicle parking with transfer to and from Sarajevo Airport. The parking operates 24 hours a day, seven days a week, and reservations are made through the website.",
        },
        {
          h2: "Clear information for travellers",
          text: "The website publishes parking prices, reservation steps, contact details, location information and frequently asked questions so travellers can check the service before arrival.",
        },
        {
          h2: "Trust and contact",
          text: "Visitors can check the Google reviews shown on the website, open the Google Maps location, and contact M Park Sarajevo by phone, email or WhatsApp.",
        },
      ],
    },
    contact: {
      title: "Contact M Park Sarajevo | Airport Parking",
      description:
        "Contact M Park Sarajevo and find the private parking entrance at Kasindolskih Žrtava 18 in Sarajevo.",
      h1: "Contact and location",
      intro:
        "Find the official contact details and the exact parking entrance location in one place.",
    },
  },
  de: {
    about: {
      title: "Über M Park Sarajevo | Flughafenparkplatz",
      description:
        "Erfahren Sie mehr über M Park Sarajevo, einen privaten Parkplatz nahe dem Flughafen Sarajevo mit Transfer und Online-Reservierung.",
      h1: "Über M Park Sarajevo",
      intro:
        "M Park Sarajevo bietet Privatparkplätze in der Kasindolskih Žrtava 18 für Reisende ab dem Flughafen Sarajevo.",
      sections: [
        {
          h2: "Parkplatz und Flughafentransfer",
          text: "Der Service verbindet das Abstellen des Fahrzeugs mit dem Transfer zum und vom Flughafen Sarajevo. Der Parkplatz ist rund um die Uhr, sieben Tage die Woche geöffnet; Reservierungen erfolgen über die Website.",
        },
        {
          h2: "Klare Informationen für Reisende",
          text: "Die Website veröffentlicht Parkpreise, Reservierungsschritte, Kontaktdaten, Standortinformationen und häufige Fragen, damit Reisende den Service vor der Anreise prüfen können.",
        },
        {
          h2: "Vertrauen und Kontakt",
          text: "Besucher können die auf der Website angezeigten Google-Bewertungen prüfen, den Standort in Google Maps öffnen und M Park Sarajevo per Telefon, E-Mail oder WhatsApp kontaktieren.",
        },
      ],
    },
    contact: {
      title: "Kontakt M Park Sarajevo | Flughafenparkplatz",
      description:
        "Kontaktieren Sie M Park Sarajevo und finden Sie die Einfahrt zum Privatparkplatz in der Kasindolskih Žrtava 18 in Sarajevo.",
      h1: "Kontakt und Standort",
      intro:
        "Hier finden Sie die offiziellen Kontaktdaten und den genauen Standort der Parkplatzeinfahrt.",
    },
  },
};

export function getPublicPageCopy(locale, page) {
  return (PUBLIC_PAGE_COPY[locale] || PUBLIC_PAGE_COPY.bs)[page];
}
