# Maricica învață să fie curată · ediția 5

O poveste educațională interactivă în limba română, pentru copii de aproximativ 3 ani, cu audio ElevenLabs furnizat de utilizatoare. Adaptare educațională după „Maricica” de Luiza Vlădescu.

## Revizie scenă cu scenă

1. **Dimineața, acasă** — dormitor 3D, personaj cu fundițe roșii; fără elemente interactive suprapuse care ascund figura.
2. **Obiectele din baie** — o singură oglindă în imagine, fără stratul de oglindă artificială care dubla fața; oglinda și fetița apar în aceeași ilustrație. Sunt vizibile petele de murdărie, mâinile și obiectele de îngrijire.
3. **La grădiniță** — Maricica este tristă și separată de cei patru copii care se joacă; ursulețul este prezent în ilustrație, fără alt decupaj lipit deasupra.
4. **Întoarcerea acasă** — se păstrează aceeași ilustrație cu o singură oglindă, înainte de spălare.
5. **Îngrijirea** — imaginea se schimbă în funcție de replica audio: spălatul pe mâini (cu apă și spumă), pieptănat sau periajul dinților.
6. **Finalul** — o singură imagine cu Maricica și ursulețul împreună, fără alte două figuri decupate peste fundal.

## Jocuri

- **Puzzle 4 sau 6 piese:** piesele au o imagine comună, se lipesc fără spații la așezare, se pot trage cu mouse-ul sau pe ecran tactil și se pot potrivi și prin două atingeri. Joc fără cronometru sau penalizări.
- **Memory 4, 6 sau 8 cartonașe:** imagini mari cu săpun, pieptene, periuță și apă. Maricica rămâne alături, în partea dreaptă, pe ecrane mari.
- **Întrebări audio și mișcări:** se păstrează cele 19 înregistrări interactive. Pauzele încep după încheierea replicii: 6, 8, 7 și 8 secunde, extensibile cu 5 secunde.

## Ecrane și teste

Verificat cu Chromium/Playwright la **390×844, 768×1024, 1440×900 și 1920×1080**:
- încărcarea paginilor și lipsa erorilor JavaScript;
- povestea cu toate cele șase momente și schimbarea ilustrațiilor la mișcări;
- puzzle 4/6 piese, inclusiv drag-and-drop real pe desktop și potrivirea prin atingeri;
- Memory 4/6/8 cartonașe;
- lipsa derulării orizontale nedorite.

**Nu a fost testată fizic tabla Samsung.** Testele au simulat rezoluția ei în browser; atingerea, sunetul și comportamentul browserului instalat trebuie confirmate pe dispozitiv.

**Nu sunt animații 3D rigate sau cu sincronizare a buzelor.** Este o aplicație 2,5D, cu fotografii-ilustrații 3D, mișcări cinematografice lente și tranziții. Unele imagini generate diferă ușor de modelul inițial al personajului. Nu prezenta versiunea ca film animat complet.

## Actualizare GitHub Pages

1. Descarcă `Maricica_Actualizare_V5_GitHub.zip` și extrage-l.
2. Deschide `https://github.com/alinapalcu1-ship-it/maricica/upload/main`.
3. Trage **conținutul folderului extras** — `index.html`, `v5.css`, `v5.js`, `README.md`, folderul `assets/cinema5` — în pagina GitHub.
4. Alege **Commit changes**. **Nu șterge** folderele `audio`, `assets/cinema`, `assets/cinema4` și codul deja existent.
5. Site-ul folosește `main /(root)` și apare la `https://alinapalcu1-ship-it.github.io/maricica/` după publicarea cu succes. Pe PC, apasă `Ctrl+F5` pentru a elimina fișierele vechi din cache.

Aplicația nu solicită cont, nu stochează date despre copii și nu conține reclame.
