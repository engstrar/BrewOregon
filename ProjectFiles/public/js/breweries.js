// Event listener for the addition of a new brewery
const addBrewery = document.querySelector("#addBrewery");
addBrewery.addEventListener("submit", function (e) {
	e.preventDefault();
	let breweryName = addBrewery.breweryName.value;
	let cityID = addBrewery.cityID.value;
	console.log("It worked!!", breweryName, cityID);
	addBrewery.reset();
});
