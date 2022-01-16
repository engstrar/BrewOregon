// Event listener for the addition of a new tap house
const addSpecialty = document.querySelector("#addSpecialty");
addSpecialty.addEventListener("submit", function (e) {
	e.preventDefault();
	let specialtyName = addSpecialty.specialtyName.value;
	let description = addSpecialty.description.value;
	addSpecialty.reset();
});
