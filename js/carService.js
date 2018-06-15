import { appendCars } from "./template.js";
import * as clientStorage from "./clientStorage.js";

const apiUrlPath =
  "https://bstavroulakis.com/pluralsight/courses/progressive-web-apps/service/";
const apiUrlLatest = `${apiUrlPath}latest-deals.php`;
const apiUrlCar = `${apiUrlPath}car.php?carId=`;

export const loadMoreRequest = async () => {
  const data = await (await fetch(
    `${apiUrlLatest}?carId=${clientStorage.getLastCarId()}`
  )).json();
  const { cars } = data;

  await clientStorage.addCars(cars);
  loadMore(cars);

  console.log(cars[cars.length - 1].key);
};

const loadMore = async () => {
  const cars = await clientStorage.getCars();

  appendCars(cars);
};

export const loadCarPage = async carId => {
  try {
    const data = await (await fetch(apiUrlCar + carId)).text();
    document.body.insertAdjacentHTML("beforeend", data);
  } catch (e) {
    alert("Oops, can't retrieve page");
  }
};
