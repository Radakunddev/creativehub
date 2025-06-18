# CreativeHub Alkalmazás Funkcionalitása

A CreativeHub egy webalkalmazás, amely ingyenes kreatív eszközök és AI-alapú szoftverek kurált listáját jeleníti meg. A felhasználók számára lehetővé teszi a következőt:

*   **Főoldal Megtekintése:** Kiemelt szekciók és kategóriák böngészése.
*   **Keresés:** Eszközök keresése kulcsszavak alapján.
*   **Kategóriák Szerinti Böngészés:** Eszközök listázása előre definiált kategóriák szerint (pl. Videó Sablonok, AI Kép Generátorok).
*   **Szűrés:** Az eszközök szűrése a következők alapján:
    *   Típus (pl. `video_template`, `ai_image_generator`)
    *   Licenc (pl. `free`, `free_commercial`)
    *   Platform (pl. `Premiere Pro`, `Web`)
    *   Címkék (pl. `retro`, `logo`)
*   **Rendezés:** Az eszközök rendezése a következők alapján:
    *   Népszerűség (`popularity_score`)
    *   Név
    *   Legújabb (jelenleg népszerűség alapján)
*   **Nézet Módosítása:** Az eszközök megjelenítése különböző elrendezésekben:
    *   Rács (alapértelmezett)
    *   Kompakt rács
    *   Lista
*   **Lapozás:** Több oldalon keresztül navigálás az eszközök között.

## Technikai Megvalósítás

*   **Frontend:** React, Vite, TypeScript
*   **Stílus:** Tailwind CSS
*   **Adattárolás:** Az adatokat egy `public/database.json` fájl tartalmazza. Ez a fájl tartalmazza az egyes eszközök részleteit, mint például név, leírás (magyarul), kategória, címkék, forrás URL, licenc típus, népszerűségi pontszám, platform és bélyegkép URL (ami jelenleg üres).
*   **Adatkezelés:** Az `src/services/dataService.ts` felelős a `database.json` betöltéséért, az adatok feldolgozásáért (beleértve a magyar leírások angolra fordítását) és különböző lekérdezési funkciók biztosításáért (pl. összes elem, kategóriák, keresés, népszerű elemek).
*   **Komponensek:** Az UI elemeket az `src/components/` könyvtárban található React komponensek valósítják meg. Az `AssetsGrid.tsx` felelős az eszközök rácsos megjelenítéséért, szűréséért és lapozásáért. Az `App.tsx` a fő alkalmazás komponens, amely kezeli a nézeteket és az alapvető állapotokat.
