// Event listener for editing a city
const addBrewery = document.querySelector("#addBrewery");
addBrewery.addEventListener("submit", function (e) {
	e.preventDefault();
	let breweryName = addBrewery.breweryName.value;
	let cityID = addBrewery.cityID.value;
	console.log("It worked!!", breweryName, cityID);
	addBrewery.reset();
});
