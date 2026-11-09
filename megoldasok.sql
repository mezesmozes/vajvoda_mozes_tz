--1. feladat: 2db insert into
INSERT INTO kategoriak (id, nev) 
VALUES (4, 'Bútorok');

INSERT INTO termekek (id, kategoria_id, nev, ar, keszlet, elerheto) 
VALUES (11, 1, 'Full HD Monitor 27"', 45900, 12, 1);
--2. feladat: 2db update
UPDATE termekek SET ar = 5990, keszlet = 20 WHERE id = 8;

UPDATE termekek SET elerheto = 0 WHERE keszlet = 0;
--3. feladat: 2db delete
DELETE FROM termekek WHERE id = 10;

DELETE FROM termekek WHERE keszlet = 0 AND elerheto = 0;


--5db tz lekerdezes--

--1.
SELECT * FROM termekek ORDER BY nev;
--2.
SELECT id, kategoria_id, nev, keszlet, elerheto FROM termekek WHERE elerheto = 1;
--3.
SELECT * FROM termekek WHERE nev LIKE %egér%;
--4.
SELECT COUNT(*) AS termek_db, AVG(ar) AS atlag_ar, SUM(keszlet) AS ossz_keszlet FROM termekek;
--5.
SELECT nev, ar FROM termekek WHERE ar > 10000;