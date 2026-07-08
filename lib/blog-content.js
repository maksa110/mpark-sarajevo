import { SEO_PILLARS, SEO_SLUGS } from "@/lib/seo-routes";

const PAGE_LABELS = {
  en: {
    prices: "Sarajevo airport parking prices",
    howItWorks: "How airport parking works in Sarajevo",
    location: "Parking near Sarajevo Airport",
    safety: "Secure Sarajevo airport parking",
    booking: "Book airport parking",
  },
  bs: {
    prices: "Cijene parkinga kod Aerodroma Sarajevo",
    howItWorks: "Kako funkcionise parking kod Aerodroma Sarajevo",
    location: "Parking blizu Aerodroma Sarajevo",
    safety: "Siguran parking kod Aerodroma Sarajevo",
    booking: "Rezervacija parkinga",
  },
  de: {
    prices: "Preise fuer Parkplatz am Flughafen Sarajevo",
    howItWorks: "So funktioniert Flughafenparken in Sarajevo",
    location: "Parkplatz nahe Flughafen Sarajevo",
    safety: "Sicherer Parkplatz am Flughafen Sarajevo",
    booking: "Flughafenparkplatz buchen",
  },
};

const LEGACY_ARTICLE_LABELS = {
  parkingVsTaxi: {
    en: "Parking vs taxi to Sarajevo Airport",
    bs: "Parking ili taksi do Aerodroma Sarajevo",
    de: "Parkplatz oder Taxi zum Flughafen Sarajevo",
  },
};

const UI_TEXT = {
  en: {
    readMore: "Read article",
    faqSectionTitle: "Frequently asked questions",
    relatedLinksTitle: "Related resources",
    ctaButton: "Book airport parking",
    headings: {
      why: "Why this matters before the trip",
      prep: "How to prepare before leaving home",
      airport: "What this means at Sarajevo Airport",
      parking: "How airport parking supports the plan",
      final: "Final practical advice",
    },
    faq: {
      q1: "When should I think about this topic?",
      a1: (d) =>
        `You should think about ${d.topic} before the travel day becomes busy, because early preparation gives you more control over timing and airport decisions.`,
      q2: "What is the most common mistake?",
      a2: (d) =>
        `The most common mistake is ${d.risk}. Travellers usually notice the problem too late, when there is less time to correct it calmly.`,
      q3: "How does airport parking help here?",
      a3: (d) =>
        `Airport parking helps because ${d.parking}. It keeps the ground part of the journey structured while you focus on documents, luggage, and check-in.`,
      q4: "What should I check before leaving home?",
      a4: (d) =>
        `Before leaving home, confirm ${d.prep}. That single review usually prevents the avoidable stress linked to ${d.topic}.`,
      q5: "What related guide should I read next?",
      a5: "Use the related links below to continue with the most relevant planning topic for your trip.",
    },
    pillarTeaserPrefix: "For the practical parking process, see our",
  },
  bs: {
    readMore: "Procitaj clanak",
    faqSectionTitle: "Cesta pitanja",
    relatedLinksTitle: "Povezani sadrzaji",
    ctaButton: "Rezervisi parking",
    headings: {
      why: "Zasto je ovo vazno prije puta",
      prep: "Kako se pripremiti prije polaska",
      airport: "Sta ovo znaci na Aerodromu Sarajevo",
      parking: "Kako aerodromski parking pomaze planu",
      final: "Zavrsni prakticni savjet",
    },
    faq: {
      q1: "Kada treba razmisljati o ovoj temi?",
      a1: (d) =>
        `O ${d.topic} treba razmisljati prije nego sto dan putovanja postane uzurban, jer rana priprema daje vise kontrole nad vremenom i odlukama na aerodromu.`,
      q2: "Koja je najcesca greska?",
      a2: (d) =>
        `Najcesca greska je ${d.risk}. Putnici problem obicno primijete prekasno, kada vise nema dovoljno prostora za mirnu korekciju plana.`,
      q3: "Kako parking pomaze u ovoj situaciji?",
      a3: (d) =>
        `Parking pomaze zato sto ${d.parking}. Tako kopneni dio puta ostaje uredjen dok se vi bavite dokumentima, prtljagom i check-in procesom.`,
      q4: "Sta treba provjeriti prije izlaska iz kuce?",
      a4: (d) =>
        `Prije izlaska iz kuce provjerite ${d.prep}. Jedna takva provjera cesto uklanja nepotreban stres vezan za ${d.topic}.`,
      q5: "Koji povezani vodic vrijedi procitati poslije?",
      a5: "Pogledajte povezane linkove ispod i nastavite sa temom koja je najvaznija za vas konkretan put.",
    },
    pillarTeaserPrefix: "Za prakticni proces parkinga pogledajte nas",
  },
  de: {
    readMore: "Artikel lesen",
    faqSectionTitle: "Haeufige Fragen",
    relatedLinksTitle: "Verwandte Inhalte",
    ctaButton: "Parkplatz buchen",
    headings: {
      why: "Warum das vor der Reise wichtig ist",
      prep: "Wie Sie sich vor dem Verlassen des Hauses vorbereiten",
      airport: "Was das am Flughafen Sarajevo bedeutet",
      parking: "Wie Flughafenparken den Plan unterstuetzt",
      final: "Abschliessender praktischer Hinweis",
    },
    faq: {
      q1: "Wann sollte ich mich mit diesem Thema befassen?",
      a1: (d) =>
        `Sie sollten sich mit ${d.topic} befassen, bevor der Reisetag hektisch wird, denn fruehe Vorbereitung schafft mehr Kontrolle ueber Zeit und Flughafenentscheidungen.`,
      q2: "Was ist der haeufigste Fehler?",
      a2: (d) =>
        `Der haeufigste Fehler ist ${d.risk}. Reisende merken das Problem oft erst spaet, wenn wenig Raum fuer eine ruhige Korrektur bleibt.`,
      q3: "Wie hilft Flughafenparken dabei?",
      a3: (d) =>
        `Flughafenparken hilft, weil ${d.parking}. So bleibt der Weg bis zum Terminal geordnet, waehrend Sie sich auf Dokumente, Gepaeck und Check-in konzentrieren.`,
      q4: "Was sollte ich vor dem Losfahren pruefen?",
      a4: (d) =>
        `Pruefen Sie vor dem Losfahren ${d.prep}. Diese kurze Kontrolle verhindert oft genau den vermeidbaren Stress rund um ${d.topic}.`,
      q5: "Welchen passenden Ratgeber sollte ich danach lesen?",
      a5: "Nutzen Sie die verlinkten Inhalte unten und gehen Sie mit dem Thema weiter, das fuer Ihre Reise am wichtigsten ist.",
    },
    pillarTeaserPrefix: "Fuer den praktischen Ablauf des Flughafenparkens lesen Sie unseren",
  },
};

function pageLink(locale, hrefKey, labelKey) {
  return {
    type: "page",
    hrefKey,
    label: PAGE_LABELS[locale][labelKey],
  };
}

function articleLink(articleId, label) {
  return { type: "article", articleId, label };
}

function standardLinks(locale, relatedArticleIds, titlesByLocale) {
  return [
    pageLink(locale, SEO_PILLARS.parkingPrices, "prices"),
    pageLink(locale, SEO_PILLARS.howParkingWorks, "howItWorks"),
    pageLink(locale, SEO_PILLARS.parkingNear, "location"),
    pageLink(locale, SEO_PILLARS.secureParking, "safety"),
    pageLink(locale, SEO_SLUGS.reservation, "booking"),
    ...relatedArticleIds.map((id) =>
      articleLink(id, titlesByLocale[id]?.[locale] || LEGACY_ARTICLE_LABELS[id]?.[locale] || id)
    ),
  ];
}

function sectionParagraphs(locale, headingKey, data) {
  if (locale === "bs") {
    if (headingKey === "why") {
      return [
        `${data.topic} je vazna tema zato sto direktno utice na tempo putovanja, broj odluka koje morate donijeti i ukupni nivo stresa prije ulaska u terminal. Kada putnici ovu temu zanemare, cesto pokusavaju sve rijesiti u zadnjih sat vremena, a tada i mala greska izgleda veca nego sto objektivno jeste.`,
        `Kod putovanja iz Sarajeva problem obicno nije samo u letu nego u cijelom lancu: polazak od kuce, dolazak do aerodroma, dokumenti, prtljag i kratke odluke koje se nizu jedna za drugom. Ako je ${data.topic} unaprijed razjasnjena, ostatak dana postaje pregledniji i laksi za kontrolu.`,
        `Putnici najcesce upadnu u problem kada ${data.risk}. To ne izgleda dramaticno dok su jos kod kuce, ali kasnije se pretvara u nepotrebno jurjenje, promjenu plana ili dodatnu nervozu u autu i pred check-in salterom.`,
        `Zbog toga je korisno da ovu temu tretirate kao dio osnovne pripreme, a ne kao usputno pitanje. Kad postoji jasan okvir prije polaska, cijeli odlazak prema Aerodromu Sarajevo djeluje mirnije i profesionalnije.`,
      ];
    }
    if (headingKey === "prep") {
      return [
        `Najvise koristi dobijate ako prije polaska provjerite ${data.prep}. Takva priprema uklanja neizvjesnost i daje vam osjecaj da vecinu vaznih odluka ne morate donositi pod pritiskom dok sat vec radi protiv vas.`,
        `Dobro je da ovu provjeru uradite vece prije puta, a zatim jos jednom kratko prije izlaska iz kuce. Time smanjujete sansu da nesto ostane zaboravljeno u autu, u stanu ili u digitalnom haosu emailova, aplikacija i screenshotova.`,
        `Priprema kod kuce ne treba biti duga ni komplikovana. Poenta je da sve kljucne stavke budu lako dostupne i logicki poredane tako da vas sljedeci korak vodi prema aerodromu, a ne nazad u stan ili nazad do gepeka.`,
        `Kada je kucna priprema cista, lakse je i voznju prema parkingu pretvoriti u obican logisticki korak umjesto u zadnju sansu da se ispravljaju greske. Upravo tu mnogi putnici osjete koliko rana organizacija zaista vrijedi.`,
      ];
    }
    if (headingKey === "airport") {
      return [
        `Na Aerodromu Sarajevo se ${data.airport}. Zato nije dovoljno osloniti se samo na opsti osjecaj da "ima vremena". Vrijeme se brzo trosi kada se sabere ulazak u terminal, check-in, prtljag, sigurnosna kontrola i trazenje odgovarajuceg izlaza.`,
        `Ako ste temu unaprijed postavili kako treba, na aerodromu ne trosite mentalnu energiju na osnovna pitanja. Umjesto toga pratite redoslijed procesa i lakse reagujete na eventualne male promjene rasporeda, reda ili protoka putnika.`,
        `Mnogi putnici pogrijese jer tek na aerodromu pocnu razmisljati o stvarima koje su morale biti zavrsene ranije. Tada se i jednostavne radnje poput otvaranja maila, trazenja papira ili preslagivanja torbe pretvaraju u nervozu.`,
        `Dobra priprema ne garantuje da ce dan biti savrsen, ali znacajno povecava sansu da se i u guzvi ili manjim zastojima krecete smireno. To je stvarna vrijednost ove teme sa stanovista putnika.`,
      ];
    }
    if (headingKey === "parking") {
      return [
        `Aerodromski parking ovdje pomaze zato sto ${data.parking}. Kada je mjesto za auto unaprijed odredjeno, smanjuje se broj improvizacija prije terminala i putnik lakse cuva fokus za stvari koje zaista traze paznju.`,
        `To je posebno korisno kada putujete sa vise prtljaga, djecom, rano ujutro ili u periodu kada postoji veca sansa za kasnjenja i dodatne provjere. U takvim uslovima je svaka logisticka nepoznanica skuplja nego sto izgleda na papiru.`,
        `Rezervisan parking ne rjesava temu leta umjesto vas, ali cini kopneni dio puta stabilnijim. Upravo ta stabilnost pravi razliku izmedju odlaska koji djeluje kontrolisano i odlaska koji je sastavljen od niza hitnih odluka.`,
        `Kad unaprijed znate gdje dolazite i koji je sljedeci korak, put prema aerodromu postaje jednostavniji. To je razlog zasto je parking prirodan dio sireg plana, a ne odvojena tehnicka sitnica.`,
      ];
    }
    return [
      `Najkorisniji zavrsni savjet je da ${data.final}. Time ne jurite savrsenstvo nego pravite dovoljno dobar sistem koji vas stiti od najcescih gresaka prije leta.`,
      `Putnici cesto podcijene koliko mala pravila i kratke provjere cuvaju energiju tokom citavog dana. Kada je osnovni plan jasan, lakse je ostati miran i onda kada aerodromski dan nije potpuno linearan.`,
      `Ako ovu temu povezete sa dokumentima, prtljagom, vremenom dolaska i parking rutinom, dobijate cjelinu koja radi zajedno. Tada svaka pojedinacna odluka sluzi istom cilju: manje stresa i vise kontrole prije puta.`,
      `Najbolje pripremljeni putnici nisu oni koji sve rade savrseno, nego oni koji rano smanje broj nepoznanica. Upravo to je i najrealniji standard za putovanje iz Sarajeva prije odlaska na aerodrom.`,
    ];
  }

  if (locale === "de") {
    if (headingKey === "why") {
      return [
        `${data.topic} ist wichtig, weil dieses Thema direkt beeinflusst, wie ruhig oder hektisch der Weg zum Flughafen verlaeuft. Wenn Reisende es ignorieren, versuchen sie spaeter mehrere Dinge gleichzeitig zu loesen, und genau dort steigt der Druck unnoetig an.`,
        `Bei Abfluegen ab Sarajevo besteht das Problem selten nur im Flug selbst. Es geht fast immer um die ganze Kette davor: Haus verlassen, zum Flughafenbereich fahren, Dokumente im Griff behalten, Gepaeck organisieren und kleine Entscheidungen rechtzeitig treffen.`,
        `Typisch wird es kritisch, wenn ${data.risk}. Das wirkt zuhause oft noch klein, fuehlt sich spaeter im Auto oder vor dem Check-in aber deutlich groesser an, weil die Zeit dann knapper ist und jede Unsicherheit direkt den naechsten Schritt bremst.`,
        `Darum sollte dieses Thema nicht als Nebensache behandelt werden. Wer es vorab sauber klaert, schafft einen ruhigeren Rahmen fuer den gesamten Abflugtag und muss am Flughafen weniger improvisieren.`,
      ];
    }
    if (headingKey === "prep") {
      return [
        `Vor der Abfahrt hilft es am meisten, ${data.prep} klar zu pruefen. Diese Vorbereitung schafft Ordnung, bevor Hektik entsteht, und sie macht es wahrscheinlicher, dass der Weg Richtung Flughafen logisch und ohne Umwege verlaeuft.`,
        `Am besten pruefen Sie diese Punkte am Abend vor der Reise und danach noch einmal kurz vor dem Losfahren. So reduzieren Sie die Gefahr, dass etwas Wichtiges im Auto, in der Wohnung oder in einem ungeordneten digitalen Ablauf liegen bleibt.`,
        `Die Vorbereitung zuhause muss nicht kompliziert sein. Entscheidend ist, dass die wichtigsten Dinge schnell greifbar und sinnvoll geordnet sind, damit Sie am Reisetag nicht erst unter Zeitdruck neu sortieren muessen.`,
        `Wenn dieser Schritt sauber gemacht ist, wird auch die Fahrt zum Parkplatz zu einem normalen Logistikteil der Reise und nicht zur letzten Chance, Fehler hektisch zu reparieren.`,
      ];
    }
    if (headingKey === "airport") {
      return [
        `Am Flughafen Sarajevo gilt, dass ${data.airport}. Deshalb reicht ein vages Gefuehl von "das wird schon passen" selten aus. Zeit verschwindet schnell, wenn Terminaleingang, Check-in, Gepaeck und Sicherheitskontrolle zusammenkommen.`,
        `Wer das Thema vorher gut vorbereitet hat, spart am Flughafen mentale Energie. Statt ueber Grundfragen nachzudenken, folgen Sie dem Ablauf klarer und koennen auf kleine Aenderungen oder Wartezeiten sachlicher reagieren.`,
        `Viele Fehler entstehen, weil Reisende erst im Terminal ueber Dinge nachdenken, die eigentlich schon zuhause abgeschlossen sein sollten. Dann wird selbst eine einfache Suche nach einem Dokument oder einer Datei ploetzlich unangenehm stressig.`,
        `Eine gute Vorbereitung garantiert keinen perfekten Reisetag. Sie sorgt aber dafuer, dass Stoerungen kleiner bleiben und der Ablauf insgesamt professioneller und ruhiger wirkt.`,
      ];
    }
    if (headingKey === "parking") {
      return [
        `Flughafenparken hilft hier, weil ${data.parking}. Wenn der Stellplatz vorab geklaert ist, sinkt die Zahl der Improvisationen vor dem Terminal, und die Aufmerksamkeit bleibt fuer Dokumente, Gepaeck und Check-in frei.`,
        `Besonders wertvoll ist das bei fruehen Fluegen, Familienreisen, viel Gepaeck oder Tagen mit hoeherer Unsicherheit. In solchen Situationen kostet jede zusaetzliche logistische Unklarheit mehr Kraft, als sie auf den ersten Blick vermuten laesst.`,
        `Ein reservierter Parkplatz loest nicht jedes Flugproblem, aber er macht den Bodenteil der Reise stabiler. Genau diese Stabilitaet entscheidet oft darueber, ob sich der Abflugtag kontrolliert oder zerrissen anfuehlt.`,
        `Wenn Sie wissen, wohin Sie fahren und was danach passiert, wird der Weg zum Flughafen einfacher. Darum ist Parken keine isolierte Einzelentscheidung, sondern ein sinnvoller Baustein im gesamten Reiseplan.`,
      ];
    }
    return [
      `Der nuetzlichste Abschlusshinweis lautet: ${data.final}. Das ist kein Versuch, alles perfekt zu machen, sondern ein realistischer Weg, die haeufigsten Fehler vor dem Flug deutlich zu verkleinern.`,
      `Reisende unterschaetzen oft, wie stark kleine Regeln und kurze Kontrollen die Energie fuer den ganzen Tag schuetzen. Wenn der Grundplan stimmt, bleibt auch bei kleineren Stoerungen mehr Ruhe erhalten.`,
      `Wer dieses Thema mit Dokumenten, Gepaeck, Ankunftszeit und Parkplatzroutine zusammendenkt, baut ein System statt einzelner Notloesungen. Genau das bringt vor dem Flug mehr Sicherheit und weniger Druck.`,
      `Gut vorbereitete Reisende sind nicht diejenigen, die nie Fehler machen. Es sind diejenigen, die frueh genug die Zahl der offenen Fragen reduzieren. Das ist der praktischste Standard fuer Abfluege ab Sarajevo.`,
    ];
  }

  if (headingKey === "why") {
    return [
      `${data.topic} matters because it directly changes how calm or rushed the trip to the airport feels. When travellers ignore this topic, they often leave several decisions for the last possible moment, and that is where unnecessary stress starts to build.`,
      `For departures from Sarajevo, the issue is rarely only the flight itself. It usually affects the full chain before boarding: leaving home, reaching the airport area, managing documents, handling luggage, and keeping the day structured enough that small delays do not break the plan.`,
      `The situation becomes harder when ${data.risk}. At home that may seem like a small weakness in the plan, but later it turns into pressure in the car, at the parking arrival point, or in front of the check-in counter when time feels more expensive.`,
      `That is why this topic should be treated as part of the core departure routine rather than as an optional extra. A cleaner decision before leaving home usually creates a calmer airport day from start to finish.`,
    ];
  }
  if (headingKey === "prep") {
    return [
      `Before leaving home, the most useful step is to confirm ${data.prep}. That single review removes uncertainty early and makes it much easier to move through the rest of the trip without constant second-guessing.`,
      `Ideally, this preparation happens the evening before and then once more in a shorter form just before departure. That pattern catches forgotten details without turning the whole morning into a long checklist session.`,
      `Preparation at home does not need to be dramatic or complex. What matters is that the important items are easy to reach, clearly organized, and logically connected to the next step of the trip instead of scattered across bags, pockets, screenshots, or memory.`,
      `When this part is done well, the drive toward airport parking becomes a straightforward logistics move rather than a final opportunity to correct earlier mistakes under time pressure.`,
    ];
  }
  if (headingKey === "airport") {
    return [
      `At Sarajevo Airport, ${data.airport}. That is why a vague feeling that there should be enough time is rarely a strong enough plan by itself. Time is consumed by several small steps, and each one matters more when the departure routine is already tight.`,
      `Travellers who prepare this topic in advance spend less mental energy on basic questions once they arrive. Instead of rethinking documents, luggage order, or what happens next, they can follow the airport process with clearer attention.`,
      `A common problem is that people start solving at the airport what should have been solved at home. Even small tasks like opening the right booking message or rearranging one bag become more stressful when they happen in a public queue rather than in a quiet room.`,
      `Good preparation does not promise a perfect airport day. It does, however, make the day more resilient, which is often the difference between a manageable departure and a chaotic one.`,
    ];
  }
  if (headingKey === "parking") {
    return [
      `Airport parking helps here because ${data.parking}. When the place for the car and the next step after arrival are already known, the ground part of the trip becomes much easier to control.`,
      `That support matters even more during early departures, family travel, busy seasons, and any trip where documents or luggage already create enough complexity on their own. In those situations, every removed uncertainty has real value.`,
      `Reserved parking does not solve the flight issue for you, but it stabilizes the part of the day that happens before terminal processing begins. That stability helps travellers keep better focus for the checks that genuinely require attention.`,
      `Knowing where you are going and what follows next reduces decision fatigue. That is why parking is not only a transport detail; it is a practical part of the wider departure strategy.`,
    ];
  }
  return [
    `The most useful closing principle is simple: ${data.final}. That approach is not about perfection. It is about building a system that protects the trip from the most common avoidable mistakes.`,
    `Travellers often underestimate how much calm comes from small rules and short reviews. When the basic structure is clear, even a day with minor interruptions feels more manageable and less emotional.`,
    `If you connect this topic with documents, luggage, arrival timing, and a clear parking routine, the whole departure day starts to work as one system instead of several rushed decisions competing with one another.`,
    `Well-prepared travellers are not the ones who never face friction. They are the ones who reduce the number of open questions early enough that the airport day remains under control even when something small changes.`,
  ];
}

function extraSectionParagraph(locale, headingKey, data) {
  if (locale === "bs") {
    if (headingKey === "why") {
      return `Kada se ova tema razjasni dovoljno rano, putnik ne dobija samo bolji plan nego i vise prostora da normalno reaguje ako se desi manja promjena. Ta dodatna rezerva je posebno vazna kod polazaka iz Sarajeva, gdje nekoliko sitnih koraka brzo odredi da li ce dan djelovati sabrano ili rasuto.`;
    }
    if (headingKey === "prep") {
      return `Koristan pristup je da ono sto morate pokazati, nositi ili provjeriti rasporedite po redoslijedu u kojem ce vam trebati. Tako priprema kod kuce ne ostaje apstraktna lista, nego postaje praktican tok koji vam sutradan stedi vrijeme, korake i mentalno prebacivanje sa jedne stvari na drugu.`;
    }
    if (headingKey === "airport") {
      return `Na samom aerodromu najvise pomaze kada ne trazite savrsenstvo nego predvidivost. Ako unaprijed znate koje odluke su vec donesene, lakse prihvatate redove, promjene toka putnika i sitna cekanja bez osjecaja da vam cijeli plan klizi iz ruku.`;
    }
    if (headingKey === "parking") {
      return `Vrijednost parking plana najjace se osjeti kada ostatak dana vec ima dovoljno promjenjivih elemenata. Sto je vise prtljaga, putnika, sezonskih uslova ili vremenskog pritiska, to vise vrijedi da barem dolazak autom i sljedeci korak prema terminalu budu unaprijed jasni.`;
    }
    return `Najbolji rezultat ne dolazi iz jedne velike taktike nego iz nekoliko malih odluka koje rade zajedno. Kada ovu temu povezete sa realnim vremenom polaska, logikom prtljaga i smirenim dolaskom na parking, dobijate rutinu koja je dovoljno jaka i onda kada dan ne ide potpuno idealno.`;
  }

  if (locale === "de") {
    if (headingKey === "why") {
      return `Wenn dieses Thema frueh genug geklaert ist, entsteht nicht nur ein besserer Plan, sondern auch mehr Spielraum fuer kleine Veraenderungen. Genau dieser Puffer ist bei Abfluegen ab Sarajevo wertvoll, weil mehrere unscheinbare Schritte schnell darueber entscheiden, ob der Tag geordnet oder zerrissen wirkt.`;
    }
    if (headingKey === "prep") {
      return `Hilfreich ist es, alles nach der Reihenfolge zu ordnen, in der Sie es spaeter brauchen werden. Dadurch bleibt die Vorbereitung zuhause nicht bei einer abstrakten Liste stehen, sondern wird zu einem praktischen Ablauf, der am Reisetag Zeit, Wege und staendiges Umdenken spart.`;
    }
    if (headingKey === "airport") {
      return `Am Flughafen selbst hilft weniger Perfektion als Vorhersehbarkeit. Wenn die wichtigsten Entscheidungen bereits vorher getroffen wurden, lassen sich Warteschlangen, Wege und kleine Ablaufwechsel viel ruhiger akzeptieren, ohne dass sofort das Gefuehl entsteht, der ganze Plan gerate aus der Hand.`;
    }
    if (headingKey === "parking") {
      return `Der Wert eines Parkplatzplans zeigt sich besonders dann, wenn der Rest des Tages schon genug Variablen mitbringt. Je mehr Gepaeck, Mitreisende, Saisonfaktoren oder Zeitdruck im Spiel sind, desto sinnvoller ist ein Ankunftspunkt, der vorab klar und verlaesslich bleibt.`;
    }
    return `Das beste Ergebnis entsteht selten aus einem grossen Trick, sondern aus mehreren kleinen Entscheidungen, die sauber zusammenarbeiten. Wenn dieses Thema mit realistischem Timing, klarer Gepaecklogik und ruhiger Parkplatzankunft verbunden ist, entsteht eine Routine, die auch an nicht perfekten Reisetagen stabil bleibt.`;
  }

  if (headingKey === "why") {
    return `When this topic is clarified early enough, travellers gain more than a cleaner plan. They also gain room to absorb small changes without feeling that the whole day is collapsing. That extra margin matters on Sarajevo departures because several ordinary steps can quickly decide whether the trip feels controlled or fragmented.`;
  }
  if (headingKey === "prep") {
    return `A useful method is to organize what you need in the same order you will actually use it. That turns preparation at home from an abstract checklist into a practical sequence that saves time, movement, and mental switching once the airport day has started.`;
  }
  if (headingKey === "airport") {
    return `At the airport itself, predictability is usually more valuable than perfection. When the key decisions have already been made, queues, short waits, and flow changes feel easier to handle because they no longer compete with unresolved basics that should have been settled earlier.`;
  }
  if (headingKey === "parking") {
    return `The value of a parking plan becomes clearer when the rest of the day already contains enough moving parts. The more luggage, passengers, seasonal pressure, or timing sensitivity a trip carries, the more useful it is to keep the arrival point and the next step toward the terminal fixed in advance.`;
  }
  return `The strongest travel routine usually comes from several small decisions working together rather than from one dramatic fix. When this topic is connected with honest timing, sensible luggage handling, and a calmer parking arrival, the departure day becomes more resilient even when conditions are not perfect.`;
}

function additionalIntro(locale, data) {
  if (locale === "de") {
    return `Fuer Reisende ab Sarajevo ist dabei weniger Theorie wichtig als ein Ablauf, der sich im echten Tagesrhythmus umsetzen laesst. Genau deshalb ist ${data.topic} nicht nur ein Informationsthema, sondern ein praktischer Teil der Abflugvorbereitung, der Zeit, Aufmerksamkeit und Stressniveau direkt beeinflusst. Wer diesen Punkt frueh ordnet, trifft spaeter unterwegs weniger hektische Entscheidungen und bleibt am Flughafen deutlich handlungsfaehiger.`;
  }

  return null;
}

function buildArticle(locale, articleDef, data, titlesByLocale) {
  const ui = UI_TEXT[locale];
  const sections = [
    { h2: ui.headings.why, paragraphs: [...sectionParagraphs(locale, "why", data), extraSectionParagraph(locale, "why", data)] },
    { h2: ui.headings.prep, paragraphs: [...sectionParagraphs(locale, "prep", data), extraSectionParagraph(locale, "prep", data)] },
    { h2: ui.headings.airport, paragraphs: [...sectionParagraphs(locale, "airport", data), extraSectionParagraph(locale, "airport", data)] },
    { h2: ui.headings.parking, paragraphs: [...sectionParagraphs(locale, "parking", data), extraSectionParagraph(locale, "parking", data)] },
    { h2: ui.headings.final, paragraphs: [...sectionParagraphs(locale, "final", data), extraSectionParagraph(locale, "final", data)] },
  ];

  return {
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    readMore: ui.readMore,
    kicker: data.kicker,
    h1: data.h1,
    intro: [data.introA, data.introB, additionalIntro(locale, data)].filter(Boolean),
    sections,
    faqSectionTitle: ui.faqSectionTitle,
    faqStructured: [
      { question: ui.faq.q1, answer: ui.faq.a1(data) },
      { question: ui.faq.q2, answer: ui.faq.a2(data) },
      { question: ui.faq.q3, answer: ui.faq.a3(data) },
      { question: ui.faq.q4, answer: ui.faq.a4(data) },
      { question: ui.faq.q5, answer: ui.faq.a5 },
    ],
    relatedLinksTitle: ui.relatedLinksTitle,
    relatedLinks: standardLinks(locale, articleDef.relatedArticles, titlesByLocale),
    pillarTeaser: `${ui.pillarTeaserPrefix} `,
    pillarLinkLabel: PAGE_LABELS[locale][articleDef.pillarLabelKey],
    ctaTitle: data.ctaTitle,
    ctaLead: data.ctaLead,
    ctaButton: ui.ctaButton,
  };
}

const ARTICLE_DEFS = {
  flightDelaySarajevo: {
    relatedArticles: ["howEarlyArriveSarajevo", "firstTimeFlyingSarajevoGuide"],
    pillarLabelKey: "howItWorks",
    locales: {
      en: {
        metaTitle: "What to do if your flight from Sarajevo is delayed",
        metaDescription: "A practical guide to flight delays from Sarajevo Airport, including timing, documents, parking, and communication decisions.",
        kicker: "Long-tail - flight delay planning",
        h1: "What to do if your flight from Sarajevo is delayed",
        topic: "a delayed flight from Sarajevo",
        risk: "travellers react to every update without protecting the rest of the departure plan",
        prep: "the latest airline update, your document set, device battery, and the route to the parking location",
        airport: "check-in rules, queue timing, and gate-side decisions still need structure even if departure moves later",
        parking: "it gives you a fixed arrival point and removes one major uncertainty before terminal processing begins",
        final: "keep the airline update in focus while protecting the road, parking, and check-in parts of the trip from last-minute improvisation",
        introA: "A delayed flight changes more than the departure time on the screen. It also changes how travellers think about when to leave home, how much time they still need for check-in, and whether the airport part of the day should speed up or slow down.",
        introB: "For departures from Sarajevo Airport, the smartest response is usually not panic and not overconfidence. It is a calmer decision order that keeps documents, parking, transfer timing, and the airline update aligned with each other.",
        ctaTitle: "Keep delay days easier to control",
        ctaLead: "Reserve airport parking before the travel day so a flight delay does not also become a transport problem.",
      },
      bs: {
        metaTitle: "Sta uraditi ako let iz Sarajeva kasni",
        metaDescription: "Praktican vodic za kasnjenje leta sa Aerodroma Sarajevo: vrijeme polaska, dokumenti, parking i komunikacija.",
        kicker: "Long-tail - planiranje kasnjenja leta",
        h1: "Sta uraditi ako let iz Sarajeva kasni",
        topic: "kasnjenje leta iz Sarajeva",
        risk: "putnici reaguju na svaku novu informaciju bez zastite ostatka plana polaska",
        prep: "zadnju informaciju aviokompanije, dokumente, napunjen telefon i rutu do parking lokacije",
        airport: "check-in pravila, redovi i odluke pred izlazom i dalje traze red i jasnu strukturu cak i kada se vrijeme polaska pomjeri",
        parking: "daje vam fiksnu tacku dolaska i uklanja jednu veliku nepoznanicu prije ulaska u terminalski proces",
        final: "drzite fokus na informacijama aviokompanije, ali zastitite voznju, parking i check-in od improvizacije u zadnji cas",
        introA: "Kasnjenje leta mijenja vise od samog vremena na ekranu. Mijenja i nacin na koji putnik razmislja o polasku od kuce, rezervi vremena za check-in i tome da li cijeli aerodromski dio dana treba ubrzati ili usporiti.",
        introB: "Za polaske sa Aerodroma Sarajevo najpametniji odgovor obicno nije ni panika ni opustanje bez pokrica. Najbolji odgovor je mirniji redoslijed odluka koji drzi dokumente, parking, transfer i informaciju o letu u istoj logici.",
        ctaTitle: "Ucinite dane sa kasnjenjem laksim za kontrolu",
        ctaLead: "Rezervisite parking prije puta kako kasnjenje leta ne bi postalo i problem prevoza do aerodroma.",
      },
      de: {
        metaTitle: "Was tun, wenn sich Ihr Flug ab Sarajevo verspaetet",
        metaDescription: "Praktischer Ratgeber fuer Flugverspaetungen ab Sarajevo: Abfahrtszeit, Dokumente, Parkplatz und Kommunikation.",
        kicker: "Long-tail - Planung bei Flugverspaetung",
        h1: "Was tun, wenn sich Ihr Flug ab Sarajevo verspaetet",
        topic: "eine Flugverspaetung ab Sarajevo",
        risk: "Reisende auf jede neue Meldung reagieren, ohne den restlichen Abflugplan zu schuetzen",
        prep: "die aktuelle Airline-Information, Ihre Dokumente, den Akkustand des Telefons und die Route zum Parkplatz",
        airport: "Check-in-Regeln, Wartezeiten und Entscheidungen am Gate trotz spaeterem Abflug weiter Struktur brauchen",
        parking: "es einen festen Ankunftspunkt schafft und eine grosse Unsicherheit vor dem Terminalprozess entfernt",
        final: "die Airline-Information ernst zu nehmen und gleichzeitig Strasse, Parkplatz und Check-in vor hektischer Improvisation zu schuetzen",
        introA: "Eine Verspaetung veraendert mehr als nur die Uhrzeit auf der Anzeige. Sie veraendert auch, wann Reisende losfahren sollten, wie sie den Check-in einschaetzen und ob der gesamte Flughafenteil des Tages schneller oder ruhiger geplant werden muss.",
        introB: "Bei Abfluegen ab Sarajevo ist die beste Reaktion meist weder Panik noch falsche Laessigkeit. Sinnvoller ist eine ruhigere Reihenfolge von Entscheidungen, in der Dokumente, Parkplatz, Transfer und Flugstatus zusammenpassen.",
        ctaTitle: "Machen Sie Verspaetungstage leichter beherrschbar",
        ctaLead: "Buchen Sie den Parkplatz vor dem Reisetag, damit eine Flugverspaetung nicht auch noch zum Transportproblem wird.",
      },
    },
  },
  howEarlyArriveSarajevo: {
    relatedArticles: ["flightDelaySarajevo", "firstTimeFlyingSarajevoGuide"],
    pillarLabelKey: "howItWorks",
    locales: {
      en: {
        metaTitle: "How early should you arrive at Sarajevo Airport?",
        metaDescription: "A practical Sarajevo Airport arrival-time guide for families, business travellers, checked bags, and airport parking users.",
        kicker: "Long-tail - airport arrival timing",
        h1: "How early should you arrive at Sarajevo Airport?",
        topic: "arrival timing at Sarajevo Airport",
        risk: "travellers use one generic time rule even when luggage, family travel, or parking logistics clearly require more buffer",
        prep: "the flight type, luggage plan, travel group, traffic assumptions, and the time needed after you reach the parking location",
        airport: "the ground process still consumes time even before you ever see the gate area",
        parking: "it lets you calculate the trip in real steps instead of guessing only around the terminal door",
        final: "build timing backward from the airport process and add buffer based on your real travel complexity, not on an optimistic best case",
        introA: "Travellers often ask for one magic number that works for every departure, but airport timing is rarely that simple. A solo passenger with one backpack needs a different rhythm from a family carrying checked bags on a winter morning.",
        introB: "The most useful way to think about Sarajevo Airport timing is to treat the day as a sequence: leaving home, reaching the parking area, transfer, check-in, security, and boarding flow. Once you plan those parts honestly, the answer becomes much clearer.",
        ctaTitle: "Give your airport timing a safer structure",
        ctaLead: "Book airport parking early so your departure schedule includes a known arrival point instead of a last-minute guess.",
      },
      bs: {
        metaTitle: "Koliko ranije treba doci na Aerodrom Sarajevo",
        metaDescription: "Praktican vodic za vrijeme dolaska na Aerodrom Sarajevo za porodice, poslovne putnike, predati prtljag i korisnike parkinga.",
        kicker: "Long-tail - vrijeme dolaska na aerodrom",
        h1: "Koliko ranije treba doci na Aerodrom Sarajevo",
        topic: "vrijeme dolaska na Aerodrom Sarajevo",
        risk: "putnici koriste jedno opste pravilo iako prtljag, porodicno putovanje ili parking logistika traze vecu rezervu",
        prep: "vrstu leta, plan prtljaga, sastav putne grupe, saobracajne pretpostavke i vrijeme potrebno nakon dolaska na parking",
        airport: "kopneni dio procesa i dalje trosi vrijeme i prije nego sto uopste vidite izlaz za let",
        parking: "omogucava da put racunate kroz stvarne korake umjesto da pogadjate samo prema vratima terminala",
        final: "planirajte vrijeme unazad od aerodromskog procesa i dodajte rezervu prema stvarnoj slozenosti putovanja, a ne prema optimistickom scenariju",
        introA: "Putnici cesto traze jednu magicnu brojku koja radi za svaki polazak, ali vrijeme dolaska na aerodrom rijetko je tako jednostavno. Solo putnik sa jednim rancem ima drugaciji ritam od porodice sa predatim prtljagom i zimskim polaskom.",
        introB: "Najkorisnije je da dan gledate kao niz koraka: polazak od kuce, dolazak na parking, transfer, check-in, sigurnosna kontrola i ukrcavanje. Kada te dijelove planirate realno, odgovor postaje mnogo jasniji.",
        ctaTitle: "Dajte vremenu dolaska sigurniju strukturu",
        ctaLead: "Rezervisite parking ranije kako raspored polaska ne bi zavisio od improvizacije u zadnji cas.",
      },
      de: {
        metaTitle: "Wie frueh sollten Sie am Flughafen Sarajevo sein",
        metaDescription: "Praktischer Leitfaden zur Ankunftszeit am Flughafen Sarajevo fuer Familien, Geschaeftsreisen, Aufgabegepaeck und Parkplatznutzer.",
        kicker: "Long-tail - Ankunftszeit am Flughafen",
        h1: "Wie frueh sollten Sie am Flughafen Sarajevo sein",
        topic: "die Ankunftszeit am Flughafen Sarajevo",
        risk: "Reisende eine pauschale Zeitregel nutzen, obwohl Gepaeck, Familienreise oder Parkplatzlogistik klar mehr Puffer verlangen",
        prep: "Flugart, Gepaeckplan, Reisegruppe, Verkehrsannahmen und die Zeit nach Ankunft am Parkplatz",
        airport: "der Bodenteil des Ablaufs weiterhin Zeit braucht, noch bevor das Gate ueberhaupt in Sicht ist",
        parking: "es hilft, die Reise in echten Schritten zu rechnen statt nur die Terminaltuer als Bezugspunkt zu nehmen",
        final: "die Zeit rueckwaerts vom Flughafenprozess zu planen und den Puffer an die reale Reisekomplexitaet statt an einen Wunschfall anzupassen",
        introA: "Viele Reisende suchen eine einzige Zahl, die fuer jeden Abflug funktioniert. In der Praxis ist Ankunftszeit aber fast nie so einfach. Ein Alleinreisender mit Rucksack bewegt sich anders als eine Familie mit Aufgabegepaeck an einem Wintermorgen.",
        introB: "Am hilfreichsten ist es, den Tag als Kette von Schritten zu sehen: Haus verlassen, Parkplatz erreichen, Transfer, Check-in, Sicherheitskontrolle und Boardingablauf. Wenn diese Teile realistisch geplant sind, wird die passende Ankunftszeit deutlich klarer.",
        ctaTitle: "Geben Sie Ihrer Ankunftszeit eine sichere Struktur",
        ctaLead: "Buchen Sie den Parkplatz fruehzeitig, damit Ihr Abflugplan nicht von letzter-Minute-Improvisation abhaengt.",
      },
    },
  },
  prepareCarBeforeAirportParking: {
    relatedArticles: ["parkingSafe", "airportParkingSavesTimeSarajevo"],
    pillarLabelKey: "safety",
    locales: {
      en: {
        metaTitle: "How to prepare your car before leaving it at airport parking",
        metaDescription: "Practical advice for preparing your car before airport parking near Sarajevo, including valuables, fuel, return-day readiness, and seasonal checks.",
        kicker: "Long-tail - vehicle preparation for parking",
        h1: "How to prepare your car before leaving it at airport parking",
        topic: "preparing your car for airport parking",
        risk: "travellers focus only on the flight and forget that the vehicle itself should be ready for both the stay and the return drive",
        prep: "visible valuables, fuel level, weather-related items, what you need after landing, and the final grab-check before locking the vehicle",
        airport: "car-related mistakes become inconvenient exactly when your attention should already be on check-in and departure",
        parking: "a structured parking handover works better when the vehicle is already clean, simple, and ready for the stay",
        final: "prepare the car for the return as well as for the departure so the trip finishes smoothly on both ends",
        introA: "Travellers usually think about flights, luggage, and documents first. The vehicle is often an afterthought until the last few minutes, when someone realizes there are valuables in sight, the fuel level is awkward, or one essential item is still in the trunk.",
        introB: "Preparing the car before airport parking is a small task with a large payoff. It protects the departure routine and makes the return drive after landing much easier too.",
        ctaTitle: "Bring a prepared car to a prepared parking plan",
        ctaLead: "Book airport parking early and use the final vehicle check to make both departure and return less stressful.",
      },
      bs: {
        metaTitle: "Kako pripremiti auto prije ostavljanja na aerodromskom parkingu",
        metaDescription: "Prakticni savjeti za pripremu auta prije parkinga kod Aerodroma Sarajevo: vrijednosti, gorivo, povratak i sezonske provjere.",
        kicker: "Long-tail - priprema vozila za parking",
        h1: "Kako pripremiti auto prije ostavljanja na aerodromskom parkingu",
        topic: "pripremu auta za aerodromski parking",
        risk: "putnici razmisljaju samo o letu i zaborave da vozilo treba biti spremno i za boravak i za povratnu voznju",
        prep: "vidljive vrijednosti, nivo goriva, sezonske stvari, ono sto vam treba nakon slijetanja i zavrsnu provjeru prije zakljucavanja auta",
        airport: "greske vezane za auto postanu nezgodne upravo kada bi fokus vec trebao biti na check-inu i polasku",
        parking: "urednija predaja parkingu radi bolje kada je vozilo vec jednostavno, pregledno i spremno za boravak",
        final: "pripremite vozilo i za povratak, a ne samo za odlazak, kako bi put glatko zavrsio na obje strane",
        introA: "Putnici obicno prvo razmisljaju o letu, prtljagu i dokumentima. Auto cesto ostane sporedna tema do zadnjih minuta, kada neko primijeti da su vrijedne stvari vidljive, da je gorivo na nezgodnom nivou ili da je jedna vazna sitnica ostala u gepeku.",
        introB: "Priprema auta prije aerodromskog parkinga je mali zadatak sa velikim efektom. Stiti rutinu polaska i olaksava povratnu voznju nakon slijetanja.",
        ctaTitle: "Dovezite pripremljen auto na pripremljen parking plan",
        ctaLead: "Rezervisite parking ranije i iskoristite zavrsnu provjeru vozila da polazak i povratak budu jednostavniji.",
      },
      de: {
        metaTitle: "Wie Sie Ihr Auto vor dem Flughafenparken vorbereiten",
        metaDescription: "Praktische Hinweise zur Fahrzeugvorbereitung vor dem Parken nahe Sarajevo: Wertsachen, Kraftstoff, Rueckfahrt und Saisoncheck.",
        kicker: "Long-tail - Fahrzeugvorbereitung fuer Parkplatz",
        h1: "Wie Sie Ihr Auto vor dem Flughafenparken vorbereiten",
        topic: "die Vorbereitung Ihres Autos fuer Flughafenparken",
        risk: "Reisende nur an den Flug denken und vergessen, dass das Fahrzeug fuer Standzeit und Rueckfahrt vorbereitet sein sollte",
        prep: "sichtbare Wertsachen, Tankstand, saisonale Gegenstaende, Dinge fuer nach der Landung und die letzte Griffkontrolle vor dem Abschliessen",
        airport: "autobezogene Fehler genau dann stoeren, wenn die Aufmerksamkeit eigentlich schon beim Check-in und Abflug liegen sollte",
        parking: "ein geordneter Parkplatzablauf besser funktioniert, wenn das Fahrzeug bereits uebersichtlich und fuer die Standzeit vorbereitet ist",
        final: "das Fahrzeug auch fuer die Rueckkehr vorzubereiten, damit die Reise an beiden Enden sauber endet",
        introA: "Reisende denken zuerst an Flug, Gepaeck und Unterlagen. Das Auto wird oft erst in den letzten Minuten beachtet, wenn ploetzlich auffaellt, dass Wertsachen sichtbar liegen, der Tankstand unpraktisch ist oder ein wichtiger Gegenstand noch im Kofferraum steckt.",
        introB: "Die Fahrzeugvorbereitung vor dem Flughafenparken ist ein kleiner Schritt mit grossem Nutzen. Sie schuetzt den Abflugablauf und macht die Rueckfahrt nach der Landung deutlich einfacher.",
        ctaTitle: "Bringen Sie ein vorbereitetes Auto zu einem vorbereiteten Parkplatzplan",
        ctaLead: "Buchen Sie den Parkplatz frueh und nutzen Sie die letzte Fahrzeugkontrolle, um Abreise und Rueckkehr einfacher zu machen.",
      },
    },
  },
  airportParkingSavesTimeSarajevo: {
    relatedArticles: ["parkingVsTaxi", "howEarlyArriveSarajevo"],
    pillarLabelKey: "prices",
    locales: {
      en: {
        metaTitle: "How airport parking saves time before your flight",
        metaDescription: "See how airport parking near Sarajevo can save time before departure by simplifying transport, timing, and terminal access.",
        kicker: "Long-tail - airport parking time savings",
        h1: "How airport parking saves time before your flight",
        topic: "the time-saving value of airport parking",
        risk: "travellers compare only price and ignore how much time and decision pressure weak transport plans consume",
        prep: "your departure timing, transport assumptions, luggage handling needs, and how many airport-day decisions are still unresolved",
        airport: "the best time savings often happen before terminal entry rather than inside the terminal itself",
        parking: "it replaces improvisation with a known arrival point, a clear next step, and less wasted movement before check-in",
        final: "treat time as part of the value equation and not only the money line on the travel-day spreadsheet",
        introA: "Travellers often compare airport parking only by daily rate. Time is just as important, especially on days when the road to the airport is already competing with documents, luggage, and departure pressure.",
        introB: "What parking often saves is not magical speed. It saves wasted movement, repeated decisions, and the mental cost of making transport choices too late.",
        ctaTitle: "Save time where it actually matters",
        ctaLead: "Reserve airport parking before the trip so the road-to-terminal part of the day is already organized.",
      },
      bs: {
        metaTitle: "Kako aerodromski parking stedi vrijeme prije leta",
        metaDescription: "Pogledajte kako parking kod Aerodroma Sarajevo stedi vrijeme prije leta kroz jednostavniji prevoz i dolazak do terminala.",
        kicker: "Long-tail - usteda vremena kroz parking",
        h1: "Kako aerodromski parking stedi vrijeme prije leta",
        topic: "vrijednost ustede vremena kroz aerodromski parking",
        risk: "putnici porede samo cijenu i zanemare koliko slab plan prevoza trosi vrijeme i odluke",
        prep: "vrijeme polaska, pretpostavke o prevozu, potrebe rukovanja prtljagom i broj otvorenih odluka na dan puta",
        airport: "najveca usteda vremena cesto nastaje prije terminala, a ne tek unutar samog aerodroma",
        parking: "mijenja improvizaciju poznatom tackom dolaska, jasnim sljedecim korakom i manjim gubitkom kretanja prije check-ina",
        final: "vrijeme gledajte kao dio ukupne vrijednosti, a ne samo kao stavku pored novca u troskovniku puta",
        introA: "Putnici cesto porede aerodromski parking samo po dnevnoj cijeni. Vrijeme je jednako vazno, posebno onih dana kada se put do aerodroma takmici sa dokumentima, prtljagom i pritiskom polaska.",
        introB: "Ono sto parking cesto stedi nije neka magicna brzina. Stedi nepotrebno kretanje, ponovljene odluke i mentalni trosak kasnog biranja prevoza.",
        ctaTitle: "Stedite vrijeme tamo gdje zaista vrijedi",
        ctaLead: "Rezervisite parking prije puta kako bi dio od ceste do terminala vec bio organizovan.",
      },
      de: {
        metaTitle: "Wie Flughafenparken vor dem Flug Zeit spart",
        metaDescription: "So kann Parkplatznahe Sarajevo vor dem Flug Zeit sparen: einfacherer Transport, besseres Timing und klarerer Weg zum Terminal.",
        kicker: "Long-tail - Zeitgewinn durch Flughafenparken",
        h1: "Wie Flughafenparken vor dem Flug Zeit spart",
        topic: "der Zeitwert von Flughafenparken",
        risk: "Reisende nur den Preis vergleichen und uebersehen, wie viel Zeit und Entscheidungsdruck schwache Transportplaene kosten",
        prep: "Abfahrtszeit, Transportannahmen, Gepaeckhandling und wie viele Reisetagsentscheidungen noch offen sind",
        airport: "die groessten Zeitgewinne oft vor dem Terminal und nicht erst im Terminal selbst entstehen",
        parking: "Improvisation durch einen bekannten Ankunftspunkt, einen klaren naechsten Schritt und weniger ueberfluessige Bewegung ersetzt",
        final: "Zeit als Teil des Gesamtwerts zu betrachten und nicht nur die Geldspalte auf dem Reisetagsblatt",
        introA: "Reisende vergleichen Flughafenparken oft nur nach dem Tagessatz. Zeit ist aber genauso wichtig, besonders an Tagen, an denen der Weg zum Flughafen mit Dokumenten, Gepaeck und Abflugdruck konkurriert.",
        introB: "Was Parken oft spart, ist keine magische Geschwindigkeit. Es spart unnoetige Wege, wiederholte Entscheidungen und den mentalen Preis spaeter Transportwahl.",
        ctaTitle: "Sparen Sie Zeit dort, wo sie wirklich zaehlt",
        ctaLead: "Buchen Sie den Parkplatz vor der Reise, damit der Weg von der Strasse zum Terminal bereits organisiert ist.",
      },
    },
  },
  firstTimeFlyingSarajevoGuide: {
    relatedArticles: ["howEarlyArriveSarajevo", "flightDelaySarajevo"],
    pillarLabelKey: "howItWorks",
    locales: {
      en: {
        metaTitle: "First time flying from Sarajevo? Beginner guide",
        metaDescription: "A beginner-friendly guide to first-time flights from Sarajevo Airport, covering documents, timing, luggage, parking, and airport flow.",
        kicker: "Long-tail - first-time flyer guide",
        h1: "First time flying from Sarajevo? Beginner guide",
        topic: "a first flight from Sarajevo",
        risk: "new travellers face too many unfamiliar steps at once because nobody turned the day into a simple sequence",
        prep: "basic documents, baggage rules, route timing, who is travelling with you, and a clear plan for reaching the airport area",
        airport: "almost every step feels larger when you have not yet built confidence in the order of the process",
        parking: "it removes one uncertainty before the terminal and helps the first-time flyer focus on the airport steps themselves",
        final: "give yourself more clarity and more time than you think you need, because confidence grows from structure and not from pretending to know everything",
        introA: "First-time flyers do not need airport jargon or complicated strategy. They need a clear sequence, realistic expectations, and enough time to move through unfamiliar steps without feeling embarrassed or rushed.",
        introB: "For a first flight from Sarajevo, simplicity matters. If the route, timing, documents, and parking plan are already clear, the airport process becomes much less intimidating.",
        ctaTitle: "Make the first airport trip easier to understand",
        ctaLead: "Reserve airport parking in advance so one part of the first-flight experience already has a clear and predictable process.",
      },
      bs: {
        metaTitle: "Prvi let iz Sarajeva? Vodic za pocetnike",
        metaDescription: "Pocetnicki vodic za prvi let sa Aerodroma Sarajevo: dokumenti, vrijeme, prtljag, parking i tok aerodroma.",
        kicker: "Long-tail - vodic za prvi let",
        h1: "Prvi let iz Sarajeva? Vodic za pocetnike",
        topic: "prvi let iz Sarajeva",
        risk: "novi putnici odjednom dobiju previse nepoznatih koraka jer niko nije pretvorio dan u jednostavan redoslijed",
        prep: "osnovne dokumente, pravila prtljaga, vrijeme rute, ko putuje s vama i jasan plan dolaska do aerodroma",
        airport: "gotovo svaki korak djeluje veci kada jos nemate povjerenje u redoslijed procesa",
        parking: "uklanja jednu nepoznanicu prije terminala i pomaze putniku da se fokusira na same aerodromske korake",
        final: "dajte sebi vise jasnoce i vise vremena nego sto mislite da vam treba, jer samopouzdanje raste iz strukture, a ne iz glume da sve znate",
        introA: "Putnicima koji prvi put lete ne treba aerodromski zargon ni komplikovana taktika. Treba im jasan redoslijed, realna ocekivanja i dovoljno vremena da kroz nepoznate korake prodju bez srama i bez jurnjave.",
        introB: "Za prvi let iz Sarajeva jednostavnost je kljucna. Ako su ruta, vrijeme, dokumenti i parking plan vec jasni, cijeli aerodromski proces djeluje mnogo manje zastrasujuce.",
        ctaTitle: "Ucinite prvi aerodromski put laksim za razumjeti",
        ctaLead: "Rezervisite parking unaprijed kako bi jedan dio prvog iskustva leta vec imao jasan i predvidiv proces.",
      },
      de: {
        metaTitle: "Zum ersten Mal fliegen ab Sarajevo? Einsteiger-Guide",
        metaDescription: "Ein anfaengerfreundlicher Leitfaden fuer den ersten Flug ab Sarajevo mit Dokumenten, Timing, Gepaeck, Parkplatz und Flughafenablauf.",
        kicker: "Long-tail - Guide fuer Erstflieger",
        h1: "Zum ersten Mal fliegen ab Sarajevo? Einsteiger-Guide",
        topic: "einen ersten Flug ab Sarajevo",
        risk: "neue Reisende zu viele unbekannte Schritte gleichzeitig erleben, weil der Tag nie in eine einfache Reihenfolge uebersetzt wurde",
        prep: "Grunddokumente, Gepaeckregeln, Routenzeit, Mitreisende und einen klaren Plan fuer den Weg zum Flughafenbereich",
        airport: "fast jeder Schritt groesser wirkt, solange noch kein Vertrauen in die Reihenfolge des Ablaufs besteht",
        parking: "eine Unsicherheit vor dem Terminal entfernt und den Erstfliegern hilft, sich auf die eigentlichen Flughafenstufen zu konzentrieren",
        final: "sich mehr Klarheit und mehr Zeit zu geben als gefuehlt noetig, weil Sicherheit aus Struktur und nicht aus gespielter Routine entsteht",
        introA: "Erstflieger brauchen keinen Flughafenjargon und keine komplizierte Strategie. Sie brauchen eine klare Reihenfolge, realistische Erwartungen und genug Zeit, um unbekannte Schritte ohne Hetze und ohne Scham zu verstehen.",
        introB: "Fuer den ersten Flug ab Sarajevo ist Einfachheit entscheidend. Wenn Route, Timing, Dokumente und Parkplatzplan bereits klar sind, wirkt der ganze Flughafenprozess deutlich weniger einschuechternd.",
        ctaTitle: "Machen Sie den ersten Flughafentag leichter verstaendlich",
        ctaLead: "Buchen Sie den Parkplatz im Voraus, damit ein Teil des ersten Flugerlebnisses schon einen klaren und vorhersehbaren Ablauf hat.",
      },
    },
  },
};

const ARTICLE_IDS = Object.keys(ARTICLE_DEFS);

const TITLES_BY_LOCALE = Object.fromEntries(
  ARTICLE_IDS.map((id) => [
    id,
    {
      en: ARTICLE_DEFS[id].locales.en.h1,
      bs: ARTICLE_DEFS[id].locales.bs.h1,
      de: ARTICLE_DEFS[id].locales.de.h1,
    },
  ])
);

export const BLOG_INLINE_CONTENT = Object.fromEntries(
  ARTICLE_IDS.map((id) => [
    id,
    {
      published: true,
      en: buildArticle("en", ARTICLE_DEFS[id], ARTICLE_DEFS[id].locales.en, TITLES_BY_LOCALE),
      bs: buildArticle("bs", ARTICLE_DEFS[id], ARTICLE_DEFS[id].locales.bs, TITLES_BY_LOCALE),
      de: buildArticle("de", ARTICLE_DEFS[id], ARTICLE_DEFS[id].locales.de, TITLES_BY_LOCALE),
    },
  ])
);

export function getBlogArticleContent(article, locale) {
  if (article?.content?.[locale]) return article.content[locale];
  const fallbackLocale = article?.contentLocale || "en";
  if (article?.content?.[fallbackLocale]) return article.content[fallbackLocale];
  return null;
}

export const BLOG_LINKS = {
  prices: {
    type: "page",
    hrefKey: SEO_PILLARS.parkingPrices,
    label: PAGE_LABELS.en.prices,
  },
  howItWorks: {
    type: "page",
    hrefKey: SEO_PILLARS.howParkingWorks,
    label: PAGE_LABELS.en.howItWorks,
  },
  location: {
    type: "page",
    hrefKey: SEO_PILLARS.parkingNear,
    label: PAGE_LABELS.en.location,
  },
  safety: {
    type: "page",
    hrefKey: SEO_PILLARS.secureParking,
    label: PAGE_LABELS.en.safety,
  },
  booking: {
    type: "page",
    hrefKey: SEO_SLUGS.reservation,
    label: PAGE_LABELS.en.booking,
  },
};



