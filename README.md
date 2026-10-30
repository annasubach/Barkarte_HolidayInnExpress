# Speisekarte · Express Café & Bar

Digitale Speise- und Getränkekarte der Bar im Holiday Inn Express Düsseldorf
Airport, erreichbar über einen QR-Code am Tisch.

Die Seite läuft ohne Server, ohne Datenbank und ohne Verbindung zu fremden
Anbietern. Es werden keine Schriften, Skripte oder Bilder von außen nachgeladen –
dadurch funktioniert sie auch hinter einem Captive Portal, und es werden keine
Gästedaten an Dritte übertragen.

## Was drin ist

```
index.html   Gerüst, Gestaltung und Ablauflogik
menu.js      Die Karte: alle Artikel und Preise  ← hier wird gepflegt
i18n.js      Überschriften, Einheiten, Öffnungszeiten und Hinweise in 8 Sprachen
qr.js        QR-Code-Generator (selbst geschrieben, ohne Fremdbibliothek)
logo.png     Logo
```

Sprachen: Deutsch, Englisch, Französisch, Spanisch, Italienisch, Türkisch,
Chinesisch, Arabisch. Die Sprache wird automatisch anhand der Einstellung des
Gäste-Smartphones vorausgewählt und kann oben rechts umgeschaltet werden.
Produktnamen bleiben in allen Sprachen wie auf der gedruckten Karte, übersetzt
werden Überschriften, Beschreibungen und Einheiten.

## Auf GitHub Pages veröffentlichen

1. Neues Repository anlegen, zum Beispiel `Barkarte`. **Public** auswählen.
2. Auf **uploading an existing file** klicken, oder bei einem bereits gefüllten
   Repository oben auf **Add file** → **Upload files**.
3. Alle Dateien aus diesem Ordner hineinziehen. Sie liegen bewusst alle auf einer
   Ebene, damit beim Hochladen nichts verloren gehen kann.
4. Unten auf **Commit changes** klicken.
5. Oben auf **Settings** → links auf **Pages**. Unter *Branch* `main` und
   `/ (root)` auswählen, dann **Save**.
6. Ein bis zwei Minuten warten. Oben erscheint die Adresse, etwa
   `https://benutzername.github.io/Barkarte/`.

Der QR-Code auf der Seite verweist automatisch auf genau diese Adresse. Einmal
auf dem Handy öffnen, Code abfotografieren – fertig für den Tischaufsteller.

## Preise und Artikel ändern

Alles steht in `menu.js`. Ein Artikel sieht so aus:

```js
{ n: "Margherita", p: "10,50", tag: "v", d: {
  de: "mit würziger Tomatensoße und feinem Mozzarella-Käse",
  en: "with spicy tomato sauce and fine mozzarella cheese", ... } },
```

`n` ist der Name, `p` der Preis, `tag` kennzeichnet vegetarisch (`v`) oder
vegan (`ve`), `d` sind die Beschreibungen je Sprache. Artikel mit mehreren
Größen nutzen statt `p` die Liste `v`:

```js
{ n: "Riesling", v: [{ l: "0,2 l", p: "7,90" }, { l: "@bottle", p: "24,00" }] },
```

Ein `@` vor einer Bezeichnung heißt: Das Wort wird übersetzt. Die Übersetzungen
stehen in `i18n.js` unter `units`.

Öffnungszeiten, Hinweistexte und Kategorienamen stehen ebenfalls in `i18n.js`.

Ändern geht direkt auf GitHub: Datei anklicken, auf den Stift klicken, ändern,
unten auf **Commit changes**. Nach etwa einer Minute ist die Änderung live.

## Später: Bestellung und Bezahlung am Tisch

Diese Karte zeigt Artikel an, sie nimmt bewusst keine Bestellungen entgegen. Das
ist keine Lücke, sondern eine Entscheidung: In Deutschland müssen Bestellungen,
die zu einem Verkauf werden, über die Kasse mit zertifizierter technischer
Sicherheitseinrichtung laufen (Kassensicherungsverordnung). Ein eigenes
Bestellsystem neben der Kasse wäre also nicht zulässig.

Der saubere Weg führt deshalb über das Kassensystem der Bar: Viele Systeme bieten
ein eigenes Modul für Tischbestellung per QR-Code, oder sie lassen sich an einen
spezialisierten Anbieter anbinden. Die Bezahlung übernimmt in beiden Fällen ein
lizenzierter Zahlungsdienstleister über dessen eigene Bezahlseite – Kartendaten
dürfen niemals über eine selbst gebaute Seite laufen.

Sobald feststeht, welches Kassensystem im Einsatz ist, lässt sich klären, welche
der beiden Varianten in Frage kommt und wie der QR-Code dann aussehen muss.

## Vor dem echten Live-Gang noch offen

- Übersetzungen von Muttersprachlern gegenlesen lassen, besonders Chinesisch,
  Arabisch und Türkisch
- Impressum und Datenschutzerklärung ergänzen
- Hinweisleiste „Entwurf zur Abstimmung" am Seitenanfang entfernen: in
  `index.html` die Zeile mit `class="demo"` löschen
- Prüfen, ob die Allergenangaben verlinkt werden sollen (auf der gedruckten
  Karte führt dazu ein eigener QR-Code)
