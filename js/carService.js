import { appendCars } from "./template.js";
import * as clientStorage from "./clientStorage.js";

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const apiUrlPath =
  "https://bstavroulakis.com/pluralsight/courses/progressive-web-apps/service/";
const apiUrlLatest = `${apiUrlPath}latest-deals.php`;
const apiUrlCar = `${apiUrlPath}car.php?carId=`;

export const loadMoreRequest = async () => {
  document.getElementById("connection-status").innerHTML = await fetching();

  loadMore();
};

const fetching = async () => {
  try {
    const data = await Promise.race([
      fetch(`${apiUrlLatest}?carId=${clientStorage.getLastCarId()}`).then(r =>
        r.json()
      ),
      wait(3000)
    ]);

    if (!data) {
      return "The connection is hanging, showing offline results";
    }

    const { cars } = data;

    await clientStorage.addCars(cars);
    Promise.all(cars.map(preCacheDetailsPage));
    return "the connection is OK, showing latest results";
  } catch (e) {
    return "No connection, showing offline results";
  }
};

const preCacheDetailsPage = async car => {
  if (!"serviceWorker" in navigator) {
    return;
  }

  const carDefailsUrl = apiUrlCar + car.value.details_id;

  const cache = await window.caches.open("carDealsCachePagesV1");
  const response = await cache.match(carDefailsUrl);

  if (!response) {
    cache.add(new Request(carDefailsUrl));
  }
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
