// Event listener for the addition of a new tap house
const addTapHouse = document.querySelector("#addTapHouse");
addTapHouse.addEventListener("submit", function (e) {
	e.preventDefault();
	let breweryID = addTapHouse.breweryID.value;
	let tapAddr1 = addTapHouse.tapAddr1.value;
	let tapAddr2 = addTapHouse.tapAddr2.value;
	let cityID = addTapHouse.cityID.value;
	let tapState = addTapHouse.tapState.value;
	let tapZip = addTapHouse.tapZip.value;
	addTapHouse.reset();
});
