# Meta Képek Lekérdezése Külső Oldalakról: Megvalósíthatósági Vizsgálat és Javasolt Megközelítés

Ez a dokumentum a CreativeHub alkalmazásban megjelenő, külső oldalakra mutató eszközökhöz tartozó előnézeti képek (meta képek, pl. Open Graph `og:image`) automatikus lekérdezésének megvalósíthatóságát vizsgálja. A cél, hogy az eszközök kártyáin relevánsabb képek jelenjenek meg, javítva az oldal átláthatóságát.

## A Kihívás

A felhasználói visszajelzés alapján szükség van arra, hogy az eszközök kártyáin a céloldalakról származó előnézeti képek jelenjenek meg. Ez egyértelműbbé tenné, hogy a link hova vezet. A fő technikai akadályok:

*   **CORS (Cross-Origin Resource Sharing):** A böngésző biztonsági okokból tiltja, hogy kliensoldali JavaScript közvetlenül lekérdezzen és feldolgozzon tartalmat más domainekről.
*   **Erőforrásigény:** Szerveroldali megoldás esetén a külső oldalak lekérdezése, feldolgozása és a képek esetleges tárolása erőforrás-igényes lehet.

## Vizsgált Megközelítések

### 1. Kliensoldali Lekérdezés
*   **Működés:** JavaScript a böngészőben közvetlenül próbálná letölteni a külső oldal HTML tartalmát és kinyerni a meta tageket.
*   **Értékelés:** **Nem megvalósítható.** A CORS korlátozások miatt a böngészők blokkolnák ezeket a kéréseket.

### 2. Backend Proxy / Szerver nélküli Függvény
*   **Működés:** Egy saját backend szolgáltatás (proxy) vagy szerver nélküli függvény (pl. AWS Lambda, Google Cloud Functions) végezné a külső oldalak lekérdezését. Ez a szolgáltatás nem ütközne CORS problémákba. A HTML-ből kinyerhetné a meta kép URL-jét, és csak ezt az URL-t küldené vissza a kliensnek, vagy akár magát a képet is proxyzhatná/gyorsítótárazhatná.
*   **Értékelés:** Technikailag ez a legrobosztusabb megoldás futásidejű lekérdezéshez. Lehetővé teszi a központi hibakezelést, gyorsítótárazást. Azonban a jelenlegi fejlesztési ciklusban egy ilyen backend szolgáltatás telepítése és karbantartása kívül esik a közvetlen lehetőségeken.

### 3. Harmadik Féltől Származó API-k
*   **Működés:** Léteznek olyan külső szolgáltatások (API-k), amelyek egy URL alapján visszaadják annak meta adatait, beleértve az `og:image`-et is (pl. JsonLink, Microlink).
*   **Értékelés:** Kényelmes megoldás lehet, mivel leveszi a fejlesztés terhét.
    *   **Előnyök:** Gyors implementáció, nem kell saját backendet fejleszteni a meta adatok kinyeréséhez.
    *   **Hátrányok:** Függőség egy külső szolgáltatótól, költségek (sokszor van ingyenes korlátos csomag, de nagyobb forgalomnál fizetős), a szolgáltató által meghatározott rate limitek, adatvédelmi megfontolások. Egy PoC (Proof of Concept) erejéig használható lehetne egy ingyenes API, de éles üzemben alaposabb mérlegelést igényel.

### 4. Build Idejű Lekérdezés
*   **Működés:** Ha az eszközök listája (`database.json`) viszonylag statikus és nem változik naponta többször, a meta képek URL-jei lekérdezhetők a weboldal buildelési folyamata során.
    1.  Egy szkript (pl. Node.js alapú) beolvassa az összes `source_url`-t a `database.json`-ból.
    2.  Minden URL-hez szerver-szerver kérést intéz (pl. `axios` vagy `node-fetch` segítségével), így itt nincs CORS probléma.
    3.  A letöltött HTML-ből kinyeri az `og:image` (vagy más releváns, pl. `twitter:image`) meta tag értékét (pl. `cheerio` könyvtárral).
    4.  A kinyert kép URL-eket elmenti, például egy új mező (`meta_image_url`) hozzáadásával a `database.json` megfelelő elemeihez, vagy egy különálló, az alkalmazással együtt csomagolt hozzárendelési fájlba.
*   **Értékelés:** **Ez tűnik a leginkább megvalósítható megközelítésnek a jelenlegi korlátok között.**
    *   **Előnyök:** Nincs futásidejű lekérdezési többletköltség a felhasználók számára, nincs szükség élő proxy szolgáltatásra ehhez a funkcióhoz. A kép URL-ek build időben ismertek, ami további optimalizálási lehetőségeket is nyithat (pl. képek proxyzása/gyorsítótárazása a saját domainen keresztül).
    *   **Hátrányok:** A build folyamat hosszabbá válik. A meta képek elavulhatnak, ha a külső oldalak megváltoztatják őket, és az alkalmazás nincs újrafordítva. Robosztus hibakezelés szükséges a build szkriptben (pl. nem elérhető oldalak, hiányzó meta tagek).

## Hibakezelés és Tartalék Mechanizmusok

Függetlenül a választott lekérdezési módszertől, fontos hangsúlyozni:
*   Nem minden weboldal rendelkezik `og:image` vagy más releváns meta képpel.
*   Az oldalak ideiglenesen elérhetetlenek lehetnek.
*   A meta kép URL-je maga is hibás lehet.
Ezért egy megbízható tartalékmechanizmus (fallback) továbbra is elengedhetetlen a felhasználói felületen (az `AssetCard.tsx`-ben már fejlesztett `thumbnail_url` fallback logika jó alap).

## Javasolt Következő Lépések (Tényleges Implementációhoz)

1.  **Node.js Szkript Fejlesztése:** Készíts egy Node.js szkriptet a build idejű meta kép URL lekérdezéshez (`axios` a HTTP kérésekhez, `cheerio` a HTML parsoláshoz).
2.  **Adattárolás Meghatározása:** Döntsd el, hogyan tárolod a lekért meta kép URL-eket (új mező a `database.json`-ban ajánlott).
3.  **Build Folyamat Integráció:** Integráld a szkriptet a build folyamatba. Kezdetben ez lehet egy manuálisan futtatott szkript, később automatizálható CI/CD pipeline részeként.
4.  **`AssetCard.tsx` Módosítása:** Frissítsd az `AssetCard.tsx`-t, hogy használja ezeket az új `meta_image_url` mezőket, előnyben részesítve őket a `thumbnail_url`-lel szemben, de továbbra is alkalmazva a már meglévő, többlépcsős fallback logikát.
```
