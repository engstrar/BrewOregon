-- Quieries for creating the database tables and foreign keys
-- Creating Cities Table

CREATE TABLE Cities (
    `cityID` int(11) AUTO_INCREMENT UNIQUE NOT NULL,
    `cityName` varchar(255) UNIQUE NOT NULL,
    `region` varchar(255) NOT NULL,
    PRIMARY KEY (`cityID`)
) ENGINE=INNODB;

-- Creating Breweries Table

CREATE TABLE Breweries (
    `breweryID` int(11) AUTO_INCREMENT UNIQUE NOT NULL,
    `breweryName` varchar(255) NOT NULL,
    `cityID` int(11) NOT NULL,
    PRIMARY KEY (`breweryID`),
    FOREIGN KEY (`cityID`) REFERENCES Cities(`cityID`)
) ENGINE=INNODB;

-- Creating TapHouses Table

CREATE TABLE TapHouses (
    `tapHouseID` int(11) AUTO_INCREMENT UNIQUE NOT NULL,
    `tapHouseName` varchar(255) NOT NULL,
    `tapAddr1` varchar(255) NOT NULL,
    `cityID` int(11) NOT NULL,
    `tapState` varchar(2) NOT NULL DEFAULT 'OR',
    `tapZip` varchar(5) NOT NULL,
    `serveFood` BOOLEAN,
    `breweryID` int(11) NOT NULL,
    PRIMARY KEY (`tapHouseID`),
    FOREIGN KEY (`breweryID`) REFERENCES Breweries(`breweryID`),
    FOREIGN KEY (`cityID`) REFERENCES Cities(`cityID`)
) ENGINE=INNODB;

-- Creating Specialties Table

CREATE TABLE Specialties (
    `specialtyID` int(11) AUTO_INCREMENT UNIQUE NOT NULL,
    `specialtyName` varchar(255) UNIQUE NOT NULL,
    `description` text NOT NULL,
    PRIMARY KEY (`specialtyID`)
) ENGINE=INNODB;

-- Creating brew_special Table

CREATE TABLE brew_special (
    `breweryID` int,
    `specialtyID` int,
    PRIMARY KEY (`breweryID`,`specialtyID`),
    FOREIGN KEY (`breweryID`) REFERENCES Breweries(`breweryID`),
    FOREIGN KEY (`specialtyID`) REFERENCES Specialties(`specialtyID`)
) ENGINE=INNODB;
