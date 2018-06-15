function generateCarCard(car) {
  const template = document.querySelector("#car-card").innerHTML;
  const title = car.brand + " " + car.model + " " + car.year;

  return template
    .replace("{{title}}", title)
    .replace("{{details-id}}", car.details_id)
    .replace("{{image}}", car.image)
    .replace("{{price}}", car.price);
}

export function appendCars(cars) {
  document.getElementById("first-load").innerHTML = "";

  const cardHTML = cars
    .map(item => item.value)
    .map(generateCarCard)
    .join("");

  document.querySelector(".mdl-grid").insertAdjacentHTML("beforeend", cardHTML);
  //Force Redraw Fix for IE
  document.querySelector(".mdl-layout__content").style.display = "none";
  document.querySelector(".mdl-layout__content").style.display = "inline-block";
}
