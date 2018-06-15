import { appendCars } from "./template.js";

const apiUrlPath =
  "https://bstavroulakis.com/pluralsight/courses/progressive-web-apps/service/";
const apiUrlLatest = `${apiUrlPath}latest-deals.php`;
const apiUrlCar = `${apiUrlPath}car.php?carId=`;

let lastCarID;
export const loadMoreRequest = async () => {
  const data = await (await fetch(apiUrlLatest + "?carId=" + lastCarID)).json();
  const { cars } = data;

  appendCars(cars);
  console.log(cars[cars.length - 1].key);
  lastCarID = cars[cars.length - 1].key;
};

export const loadCarPage = async carId => {
  try {
    const data = await (await fetch(apiUrlCar + carId)).text();
    document.body.insertAdjacentHTML("beforeend", data);
  } catch (e) {
    alert("Oops, can't retrieve page");
  }
};
