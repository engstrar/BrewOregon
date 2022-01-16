// Setting the port number that will be used on the FLIP1 engr server
const port = 6969;

// Setting up express
const express = require("express");
const app = express();
const path = require("path");
const engine = require("ejs-mate");

// Setting up ejs and ejs-mate
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// For parsing post requests
app.use(express.urlencoded({ extended: true }));

// Setting up mySQL
const mysql = require("./dbcon.js");

// Serving static files
app.use(express.static("public"));

// Home
app.get("/", (req, res) => {
	const meta = { title: "Home" };
	res.render("home", meta);
});

// Viewing All Breweries
app.get("/breweries", (req, res, next) => {
	const meta = { title: "All Breweries" };
	mysql.pool.query(
		"SELECT breweryID, breweryName, cityName FROM Breweries JOIN Cities ON Breweries.cityID=Cities.cityID GROUP BY breweryID ASC",
		(err, rows, fields) => {
			if (err) {
				const meta = { title: "Database Error", error: err };
				res.render("dbError", meta);
				next(err);
				return;
			}
			meta.results = rows;
			mysql.pool.query(
				"SELECT * FROM Cities GROUP BY cityName ASC",
				(err2, rows2, fields2) => {
					if (err2) {
						const meta = { title: "Database Error", error: err2 };
						res.render("dbError", meta);
						next(err2);
						return;
					}
					meta.cities = rows2;
					res.render("breweries/breweries", meta);
				}
			);
		}
	);
});

//Searching for a Brewery
app.get("/brewerySearch", (req, res, next) => {
	const meta = { title: "Search Results" };
	if (req.query.breweryName == "" && req.query.cityName == "") {
		// Both search terms are empty, so view all breweries
		mysql.pool.query(
			"SELECT breweryID, breweryName, cityName FROM Breweries JOIN Cities ON Breweries.cityID=Cities.cityID GROUP BY breweryID ASC",
			(err, rows, fields) => {
				if (err) {
					const meta = { title: "Database Error", error: err };
					res.render("dbError", meta);
					next(err);
					return;
				}
				meta.results = rows;
				mysql.pool.query(
					"SELECT * FROM Cities GROUP BY cityName ASC",
					(err2, rows2, fields2) => {
						if (err2) {
							const meta = {
								title: "Database Error",
								error: err2,
							};
							res.render("dbError", meta);
							next(err2);
							return;
						}
						meta.cities = rows2;
						res.render("breweries/brewerySearch", meta);
					}
				);
			}
		);
	} else if (req.query.cityName == "") {
		//Search based only on breweryName
		const queryString = `SELECT breweryID, breweryName, cityName FROM Breweries JOIN Cities ON Breweries.cityID=Cities.cityID WHERE breweryName LIKE '%${req.query.breweryName}%' GROUP BY breweryID ASC`;
		mysql.pool.query(queryString, (err, rows, fields) => {
			if (err) {
				const meta = { title: "Database Error", error: err };
				res.render("dbError", meta);
				next(err);
				return;
			}
			meta.results = rows;
			mysql.pool.query(
				"SELECT * FROM Cities GROUP BY cityName ASC",
				(err2, rows2, fields2) => {
					if (err2) {
						const meta = { title: "Database Error", error: err2 };
						res.render("dbError", meta);
						next(err2);
						return;
					}
					meta.cities = rows2;
					res.render("breweries/brewerySearch", meta);
				}
			);
		});
	} else if (req.query.breweryName == "") {
		// Search using only cityName
		const queryString = `SELECT breweryID, breweryName, cityName FROM Breweries JOIN Cities ON Breweries.cityID=Cities.cityID WHERE cityName LIKE '%${req.query.cityName}%' GROUP BY breweryID ASC`;
		mysql.pool.query(queryString, (err, rows, fields) => {
			if (err) {
				const meta = { title: "Database Error", error: err };
				res.render("dbError", meta);
				next(err);
				return;
			}
			meta.results = rows;
			mysql.pool.query(
				"SELECT * FROM Cities GROUP BY cityName ASC",
				(err2, rows2, fields2) => {
					if (err2) {
						const meta = { title: "Database Error", error: err2 };
						res.render("dbError", meta);
						next(err2);
						return;
					}
					meta.cities = rows2;
					res.render("breweries/brewerySearch", meta);
				}
			);
		});
	} else {
		// Search for both breweryName and cityName
		const queryString = `SELECT breweryID, breweryName, cityName FROM Breweries JOIN Cities ON Breweries.cityID=Cities.cityID WHERE (breweryName LIKE '%${req.query.breweryName}%') OR (cityName LIKE '%${req.query.cityName}%') GROUP BY breweryID ASC`;
		mysql.pool.query(queryString, (err, rows, fields) => {
			if (err) {
				const meta = { title: "Database Error", error: err };
				res.render("dbError", meta);
				next(err);
				return;
			}
			meta.results = rows;
			mysql.pool.query(
				"SELECT * FROM Cities GROUP BY cityName ASC",
				(err2, rows2, fields2) => {
					if (err2) {
						const meta = { title: "Database Error", error: err2 };
						res.render("dbError", meta);
						next(err2);
						return;
					}
					meta.cities = rows2;
					res.render("breweries/brewerySearch", meta);
				}
			);
		});
	}
});

// Adding a New Brewery
app.get("/addBrewery", (req, res, next) => {
	let queryString = `INSERT INTO Breweries (breweryName, cityID) VALUES ('${req.query.breweryName}', '${req.query.cityID}')`;
	mysql.pool.query(queryString, (err, result) => {
		if (err) {
			const meta = { title: "Database Error", error: err };
			res.render("dbError", meta);
			next(err);
			return;
		}
		res.redirect("/breweries");
	});
});

// Page for Editing a Brewery
app.get("/editBrewery", (req, res, next) => {
	let breweryID = req.query.ID;
	const meta = { title: `Editing Brewery #${breweryID}` };
	let queryString = `SELECT * FROM Breweries WHERE breweryID = ${breweryID}`;
	mysql.pool.query(queryString, (err, rows, fields) => {
		if (err) {
			const meta = { title: "Database Error", error: err };
			res.render("dbError", meta);
			next(err);
			return;
		}
		meta.results = rows;
		mysql.pool.query(
			"SELECT * FROM Cities GROUP BY cityName ASC",
			(err2, rows2, fields2) => {
				if (err2) {
					const meta = { title: "Database Error", error: err2 };
					res.render("dbError", meta);
					next(err2);
					return;
				}
				meta.cities = rows2;
				res.render("breweries/edit", meta);
			}
		);
	});
});

// Updating a Brewery
app.get("/updateBrewery", (req, res, next) => {
	let queryString = `UPDATE Breweries SET breweryName='${req.query.breweryName}', cityID='${req.query.cityID}' WHERE breweryID=${req.query.breweryID}`;
	mysql.pool.query(queryString, (err, result) => {
		if (err) {
			const meta = { title: "Database Error", error: err };
			res.render("dbError", meta);
			next(err);
			return;
		}
		res.redirect("/breweries");
	});
});

// Deleting a Brewery
app.get("/deleteBrewery", (req, res, next) => {
	let queryString = `DELETE FROM Breweries WHERE breweryID=${req.query.ID}`;
	mysql.pool.query(queryString, (err, result) => {
		if (err) {
			const meta = { title: "Cannot Remove", error: err };
			res.render("cannotRemove", meta);
			next(err);
			return;
		}
		res.redirect("/breweries");
	});
});

// Viewing All Tap Houses
app.get("/taphouses", (req, res, next) => {
	const meta = { title: "All Tap Houses" };
	mysql.pool.query(
		"SELECT * FROM TapHouses JOIN Cities ON TapHouses.cityID=Cities.cityID JOIN Breweries ON TapHouses.breweryID=Breweries.breweryID GROUP BY tapHouseID ASC",
		(err, rows, fields) => {
			if (err) {
				const meta = { title: "Database Error", error: err };
				res.render("dbError", meta);
				next(err);
				return;
			}
			meta.results = rows;
			mysql.pool.query(
				"SELECT * FROM Cities GROUP BY cityName ASC",
				(err2, rows2, fields2) => {
					if (err2) {
						const meta = { title: "Database Error", error: err2 };
						res.render("dbError", meta);
						next(err2);
						return;
					}
					meta.cities = rows2;
					mysql.pool.query(
						"SELECT * FROM Breweries GROUP BY breweryName ASC",
						(err3, rows3, fields2) => {
							if (err3) {
								const meta = {
									title: "Database Error",
									error: err3,
								};
								res.render("dbError", meta);
								next(err3);
								return;
							}
							meta.breweries = rows3;
							res.render("taphouses/taphouses", meta);
						}
					);
				}
			);
		}
	);
});

// Adding a New Tap House
app.get("/addTapHouse", (req, res, next) => {
	let queryString = `INSERT INTO TapHouses (tapHouseName, breweryID, tapAddr1, cityID, tapState, tapZip, serveFood) 
	VALUES ('${req.query.tapHouseName}', '${req.query.breweryID}', '${req.query.tapAddr1}', '${req.query.cityID}', '${req.query.tapState}', '${req.query.tapZip}', '${req.query.serveFood}')`;
	mysql.pool.query(queryString, (err, result) => {
		if (err) {
			const meta = { title: "Database Error", error: err };
			res.render("dbError", meta);
			next(err);
			return;
		}
		res.redirect("/taphouses");
	});
});

// Page for Editing a Tap House
app.get("/editTapHouse", (req, res, next) => {
	let tapHouseID = req.query.ID;
	const meta = { title: `Editing Tap House #${tapHouseID}` };
	let queryString = `SELECT * FROM TapHouses WHERE tapHouseID = ${tapHouseID}`;
	mysql.pool.query(queryString, (err, rows, fields) => {
		if (err) {
			const meta = { title: "Database Error", error: err };
			res.render("dbError", meta);
			next(err);
			return;
		}
		meta.results = rows;
		mysql.pool.query(
			"SELECT * FROM Cities GROUP BY cityName ASC",
			(err2, rows2, fields2) => {
				if (err2) {
					const meta = { title: "Database Error", error: err2 };
					res.render("dbError", meta);
					next(err2);
					return;
				}
				meta.cities = rows2;
				mysql.pool.query(
					"SELECT * FROM Breweries GROUP BY breweryName ASC",
					(err3, rows3, fields2) => {
						if (err3) {
							const meta = {
								title: "Database Error",
								error: err3,
							};
							res.render("dbError", meta);
							next(err3);
							return;
						}
						meta.breweries = rows3;
						res.render("taphouses/edit", meta);
					}
				);
			}
		);
	});
});

// Updating a Tap House
app.get("/updateTapHouse", (req, res, next) => {
	let queryString = `UPDATE TapHouses SET tapHouseName='${req.query.tapHouseName}', breweryID='${req.query.breweryID}', tapAddr1='${req.query.tapAddr1}', cityID='${req.query.cityID}', tapZip='${req.query.tapZip}', serveFood='${req.query.serveFood}' WHERE tapHouseID=${req.query.tapHouseID}`;
	mysql.pool.query(queryString, (err, result) => {
		if (err) {
			const meta = { title: "Database Error", error: err };
			res.render("dbError", meta);
			next(err);
			return;
		}
		res.redirect("/taphouses");
	});
});

// Deleting a Tap House
app.get("/deleteTapHouse", (req, res, next) => {
	let queryString = `DELETE FROM TapHouses WHERE tapHouseID=${req.query.ID}`;
	mysql.pool.query(queryString, (err, result) => {
		if (err) {
			const meta = { title: "Cannot Remove", error: err };
			res.render("cannotRemove", meta);
			next(err);
			return;
		}
		res.redirect("/taphouses");
	});
});

// Viewing All Specialties
app.get("/specialties", (req, res) => {
	const meta = { title: "All Specialties" };
	mysql.pool.query(
		"SELECT * FROM Specialties GROUP BY specialtyName ASC",
		(err, rows, fields) => {
			if (err) {
				const meta = { title: "Database Error", error: err };
				res.render("dbError", meta);
				next(err);
				return;
			}
			meta.results = rows;
			res.render("specialties/specialties", meta);
		}
	);
});

// Adding a New Specialty
app.get("/addSpecialty", (req, res, next) => {
	let queryString = `INSERT INTO Specialties (specialtyName, description) VALUES ('${req.query.specialtyName}', '${req.query.description}')`;
	mysql.pool.query(queryString, (err, result) => {
		if (err) {
			const meta = { title: "Database Error", error: err };
			res.render("dbError", meta);
			next(err);
			return;
		}
		res.redirect("/specialties");
	});
});

// Page for Editing a Specialty
app.get("/editSpecialty", (req, res, next) => {
	let specialty = req.query.ID;
	const meta = { title: `Editing Specialty #${specialty}` };
	let queryString = `SELECT * FROM Specialties WHERE specialtyID = ${specialty}`;
	mysql.pool.query(queryString, (err, rows, fields) => {
		if (err) {
			const meta = { title: "Database Error", error: err };
			res.render("dbError", meta);
			next(err);
			return;
		}
		meta.results = rows;
		res.render("specialties/edit", meta);
	});
});

// Updating a Specialty
app.get("/updateSpecialty", (req, res, next) => {
	let queryString = `UPDATE Specialties SET specialtyName='${req.query.specialtyName}', description='${req.query.description}' WHERE specialtyID=${req.query.specialtyID}`;
	mysql.pool.query(queryString, (err, result) => {
		if (err) {
			const meta = { title: "Database Error", error: err };
			res.render("dbError", meta);
			next(err);
			return;
		}
		res.redirect("/specialties");
	});
});

// Deleting a Specialty
app.get("/deleteSpecialty", (req, res, next) => {
	let queryString = `DELETE FROM Specialties WHERE specialtyID=${req.query.ID}`;
	mysql.pool.query(queryString, (err, result) => {
		if (err) {
			const meta = { title: "Cannot Remove", error: err };
			res.render("cannotRemove", meta);
			next(err);
			return;
		}
		res.redirect("/specialties");
	});
});

// Viewing All Cities
app.get("/cities", (req, res, next) => {
	const meta = { title: "All Cities" };
	mysql.pool.query(
		"SELECT * FROM Cities GROUP BY cityName ASC",
		(err, rows, fields) => {
			if (err) {
				const meta = { title: "Database Error", error: err };
				res.render("dbError", meta);
				next(err);
				return;
			}
			meta.results = rows;
			res.render("cities/cities", meta);
		}
	);
});

// Adding a New City
app.get("/addCity", (req, res, next) => {
	let queryString = `INSERT INTO Cities (cityName, region) VALUES ('${req.query.cityName}', '${req.query.region}')`;
	mysql.pool.query(queryString, (err, result) => {
		if (err) {
			const meta = { title: "Database Error", error: err };
			res.render("dbError", meta);
			next(err);
			return;
		}
		res.redirect("/cities");
	});
});

// Page for Editing a City
app.get("/editCity", (req, res, next) => {
	let city = req.query.ID;
	const meta = { title: `Editing City #${city}` };
	let queryString = `SELECT * FROM Cities WHERE cityID = ${city}`;
	mysql.pool.query(queryString, (err, rows, fields) => {
		if (err) {
			const meta = { title: "Database Error", error: err };
			res.render("dbError", meta);
			next(err);
			return;
		}
		meta.results = rows;
		res.render("cities/edit", meta);
	});
});

// Updating a City
app.get("/updateCity", (req, res, next) => {
	let queryString = `UPDATE Cities SET cityName='${req.query.cityName}', region='${req.query.region}' WHERE cityID=${req.query.cityID}`;
	mysql.pool.query(queryString, (err, result) => {
		if (err) {
			const meta = { title: "Database Error", error: err };
			res.render("dbError", meta);
			next(err);
			return;
		}
		res.redirect("/cities");
	});
});

// Deleting a City
app.get("/deleteCity", (req, res, next) => {
	let queryString = `DELETE FROM Cities WHERE cityID=${req.query.ID}`;
	mysql.pool.query(queryString, (err, result) => {
		if (err) {
			const meta = { title: "Cannot Remove", error: err };
			res.render("cannotRemove", meta);
			next(err);
			return;
		}
		res.redirect("/cities");
	});
});

// Breweries and Specialties Relationship
app.get("/brew_special", (req, res) => {
	const meta = { title: "Find a Drink" };
	mysql.pool.query(
		"SELECT * FROM brew_special JOIN Breweries ON brew_special.breweryID=Breweries.breweryID JOIN Specialties ON brew_special.specialtyID=Specialties.specialtyID ORDER BY breweryName ASC",
		(err, rows, fields) => {
			if (err) {
				const meta = { title: "Database Error", error: err };
				res.render("dbError", meta);
				next(err);
				return;
			}
			meta.results = rows;
			mysql.pool.query(
				"SELECT * FROM Specialties GROUP BY specialtyName ASC",
				(err2, rows2, fields2) => {
					if (err2) {
						const meta = { title: "Database Error", error: err2 };
						res.render("dbError", meta);
						next(err2);
						return;
					}
					meta.specialties = rows2;
					mysql.pool.query(
						"SELECT * FROM Breweries GROUP BY breweryName ASC",
						(err3, rows3, fields2) => {
							if (err3) {
								const meta = {
									title: "Database Error",
									error: err3,
								};
								res.render("dbError", meta);
								next(err3);
								return;
							}
							meta.breweries = rows3;
							res.render("brew_special/brew_special", meta);
						}
					);
				}
			);
		}
	);
});

// Adding a brew_special relationship
app.get("/addBrewSpecial", (req, res, next) => {
	let queryString = `INSERT INTO brew_special (breweryID, specialtyID) VALUES ('${req.query.breweryID}', '${req.query.specialtyID}')`;
	mysql.pool.query(queryString, (err, result) => {
		if (err) {
			const meta = { title: "Database Error", error: err };
			res.render("dbError", meta);
			next(err);
			return;
		}
		res.redirect("/brew_special");
	});
});

// Page for Editing a Brewery-Specialty Relationship
app.get("/editBrewSpecial", (req, res, next) => {
	let specialtyID = req.query.specialtyID;
	let breweryID = req.query.breweryID;
	const meta = { title: `Editing Relationship` };
	let queryString = `SELECT * FROM brew_special WHERE specialtyID=${specialtyID} AND breweryID=${breweryID}`;
	mysql.pool.query(queryString, (err, rows, fields) => {
		if (err) {
			const meta = { title: "Database Error", error: err };
			res.render("dbError", meta);
			next(err);
			return;
		}
		meta.results = rows;
		mysql.pool.query(
			"SELECT * FROM Specialties GROUP BY specialtyName ASC",
			(err2, rows2, fields2) => {
				if (err2) {
					const meta = { title: "Database Error", error: err2 };
					res.render("dbError", meta);
					next(err2);
					return;
				}
				meta.specialties = rows2;
				mysql.pool.query(
					"SELECT * FROM Breweries GROUP BY breweryName ASC",
					(err3, rows3, fields2) => {
						if (err3) {
							const meta = {
								title: "Database Error",
								error: err3,
							};
							res.render("dbError", meta);
							next(err3);
							return;
						}
						meta.breweries = rows3;
						res.render("brew_special/edit", meta);
					}
				);
			}
		);
	});
});

// // Updating a Brewery-Specialty Relationship
// app.get("/updateBrewSpecial", (req, res, next) => {
// 	// let queryString = `UPDATE brew_special SET specialtyID='${req.query.specialtyID}', breweryID='${req.query.breweryID}' WHERE specialtyID=${req.query.specialtyID}`;
// 	mysql.pool.query(queryString, (err, result) => {
// 		if (err) {
// 			const meta = { title: "Database Error", error: err };
// 			res.render("dbError", meta);
// 			next(err);
// 			return;
// 		}
// 		res.redirect("/brew_special");
// 	});
// });

//Deleting a Brewery-Specialty Relationship
app.get("/deleteBrewSpecial", (req, res, next) => {
	let queryString = `DELETE FROM brew_special WHERE breweryID=${req.query.breweryID} AND specialtyID=${req.query.specialtyID}`;
	mysql.pool.query(queryString, (err, result) => {
		if (err) {
			const meta = { title: "Cannot Remove", error: err };
			res.render("cannotRemove", meta);
			next(err);
			return;
		}
		res.redirect("/brew_special");
	});
});

// Breweries and TapHouses Relationship
app.get("/brew_tap", (req, res) => {
	const meta = { title: "breweryName Tap Houses" };
	res.render("brew_tap", meta);
});

// Database Connection Test Page - Provided in Files on Canvas
app.get("/dbcon", (req, res, next) => {
	const meta = { title: "DB Test" };

	var createString =
		"CREATE TABLE diagnostic(" +
		"id INT PRIMARY KEY AUTO_INCREMENT," +
		"text VARCHAR(255) NOT NULL)";
	mysql.pool.query("DROP TABLE IF EXISTS diagnostic", function (err) {
		if (err) {
			next(err);
			return;
		}
		mysql.pool.query(createString, function (err) {
			if (err) {
				next(err);
				return;
			}
			mysql.pool.query(
				'INSERT INTO diagnostic (`text`) VALUES ("MySQL is Working!")',
				function (err) {
					mysql.pool.query(
						"SELECT * FROM diagnostic",
						function (err, rows, fields) {
							meta.results = JSON.stringify(rows);
							res.render("dbcon", meta);
						}
					);
				}
			);
		});
	});
});

// Error Handling
app.use((req, res) => {
	const meta = { title: "Not Found" };
	res.status(404);
	res.render("error404", meta);
});

// Communication on the server
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
