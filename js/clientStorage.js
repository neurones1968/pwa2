const { localforage: localForage } = window;

const carsInstance = localForage.createInstance({
  name: "cars"
});

export const addCars = newCars => carsInstance.setItems(newCars);

const limit = 3;
let lastItemId = null;

export const getCars = async () => {
  const keys = await carsInstance.keys();
  let index = keys.indexOf(lastItemId);

  if (index === -1) {
    index = keys.length;
  } else if (index === 0) {
    return [];
  }

  const newKeys = keys.splice(index - limit, limit);
  const results = await carsInstance.getItems(newKeys);

  const returnArr = Object.values(results).reverse();
  lastItemId = returnArr[returnArr.length - 1].id;

  return returnArr;
};

export const getLastCarId = () => lastItemId;
