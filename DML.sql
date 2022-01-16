-- Queries for inserting into each table with colon : character being used to 
-- denote the variables that will have data from the backend programming language.
-- Please note that all FK references will be referenced using SELECT subqueries on
-- the "Edit ___" page. Examples below are to demonstrate what a complete query will
-- look like when submitted to the db.

-- Insert query for Cities
INSERT INTO Cities (cityName, region)
VALUES (:cityName, :region);
-- Ex:
INSERT INTO Cities (cityName, region) 
VALUES ('Portland', 'Portland Metro');

-- Insert into Breweries 
INSERT INTO Breweries (breweryName, cityID)
VALUES (:breweryName, :cityID);
-- Ex:
INSERT INTO Breweries (breweryName, cityID)
VALUES ('10 Barrel Brewery', '1');

-- Insert query for Tap Houses
INSERT INTO TapHouses (tapHouseName, breweryID, tapAddr1, cityID, tapState, tapZip, serveFood) 
VALUES (:tapHouseName, :breweryID, :tapAddr1, :cityID, :tapState, :tapZip, serveFood);
-- Ex:
INSERT INTO TapHouses (tapHouseName, breweryID, tapAddr1, cityID, tapState, tapZip, serveFood)
VALUES ('10 Barrel Brewery - Portland Brewery', '1', '1411 NW Flanders St', '1', 'OR', '97209', '1');

-- Insert query for Specialties
INSERT INTO Specialties (specialtyName, description)
VALUES (:specialtyName, :description);
-- Ex:
INSERT INTO Specialties (specialtyName, description)
VALUES ('Beer', 'Beer is one of the oldest and most widely consumed alcoholic drinks in the world, and the third most popular drink overall after water and tea.');

-- Insert into brew_special
INSERT INTO brew_special (breweryID, specialtyID)
VALUES (:breweryID, :specialtyID);
-- Ex:
INSERT INTO brew_special (breweryID, specialtyID)
VALUES ('1', '1');

---------------------------------------------------------------------------------
-- Queries for selecting from each table with colon : character being used to 
-- denote the variables that will have data from the backend programming language

-- Selecting all breweries and joining names and other useful data from FK refreenced tables
SELECT breweryID, breweryName, cityName 
FROM Breweries 
JOIN Cities ON Breweries.cityID=Cities.cityID 
GROUP BY breweryID ASC;

-- Dynamically searching the breweries table based either on breweryName or cityName
SELECT breweryID, breweryName, cityName 
FROM Breweries 
JOIN Cities ON Breweries.cityID=Cities.cityID 
WHERE (breweryName LIKE :breweryNameSearch) OR (cityName LIKE :cityNameSearch) 
GROUP BY breweryID ASC;

-- Seleting all taphouses and names and other useful data from FK refreenced tables
SELECT tapHouseName, breweryName, tapAddr1, cityName, tapState, tapZip, serveFood
FROM TapHouses 
JOIN Cities ON TapHouses.cityID=Cities.cityID 
JOIN Breweries ON TapHouses.breweryID=Breweries.breweryID 
GROUP BY tapHouseID ASC;

-- Selecting all specialties
SELECT * 
FROM Specialties 
GROUP BY specialtyName ASC;

-- Selecting all cities
SELECT * 
FROM Cities 
GROUP BY cityName ASC;

-- Seleting all data from brew_special as well as names and other useful data from the
-- Breweries and Specialties table to provide the user with more useful information than
-- just IDs.
SELECT breweryName, specialtyName 
FROM brew_special 
JOIN Breweries ON brew_special.breweryID=Breweries.breweryID 
JOIN Specialties ON brew_special.specialtyID=Specialties.specialtyID 
ORDER BY breweryName ASC;

---------------------------------------------------------------------------------
-- Queries for editing each table with colon : character being used to 
-- denote the variables that will have data from the backend programming language

-- Updating a row in the Breweries table
UPDATE Breweries 
SET breweryName=:breweryName, cityID=:cityID 
WHERE breweryID=:selectedBreweryID;

-- Updating a row in TapHouses table
UPDATE TapHouses 
SET tapHouseName=:tapHouseName, breweryID=:breweryID, tapAddr1=:tapAddr1, cityID=:cityID, tapZip=:tapZip, serveFood=:serveFood 
WHERE tapHouseID=:selectedTapHouseID;

-- Updating a row in the Specialties table
UPDATE Specialties 
SET specialtyName=:specialtyName, description=:description 
WHERE specialtyID=:selectedSpecialtyID;

-- Updating a row in the Cities table
UPDATE Cities 
SET cityName=:cityName, region=:region 
WHERE cityID=:selectedCityID;

-- Updatign a row in the brew_special table
UPDATE brew_special
SET breweryID=:breweryID, specialtyID=:specialtyID
WHERE breweryID=:selectedBreweryID AND specialtyID=:selectedSpecialtyID;


---------------------------------------------------------------------------------
-- Queries for deleting an entry from each table with colon : character being used to 
-- denote the variables that will have data from the backend programming language

-- Deleting a row from the Breweries table
DELETE FROM Breweries WHERE breweryID=:selectedBreweryID;

-- Deleting a row from the TapHouses table
DELETE FROM TapHouses WHERE tapHouseID=:selectedTapHouseID;

-- Deleting a row from the Specialties table
DELETE FROM Specialties WHERE specialtyID=$:selectedSpecialtyID;

-- Deleting a row from the Cities table
DELETE FROM Cities WHERE cityID=:selectedCityID;

-- Deleting a row from the brew_special table
DELETE FROM brew_special WHERE breweryID=:breweryID AND specialtyID=:specialtyID;



