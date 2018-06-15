"use strict";

const carDealsCacheName = "carDealsCacheV1";
const carDealsCachePagesName = "carDealsCachePagesV1";
const carDealsCacheImagesName = "carDealsCacheImagesV1";

const carDealsCacheFiles = [
  "js/app.js",
  "js/carService.js",
  "js/clientStorage.js",
  "js/swRegister.js",
  "js/template.js",
  "./",
  "resources/es6-promise/es6-promise.js",
  "resources/es6-promise/es6-promise.map",
  "resources/fetch/fetch.js",
  "resources/localforage/localforage.min.js",
  "resources/localforage/localforage-getitems.js",
  "resources/localforage/localforage-setitems.js",
  "resources/material-design-light/material.min.js",
  "resources/material-design-light/material.min.js.map",
  "resources/material-design-light/material.red-indigo.min.css",
  "resources/systemjs/system.js",
  "resources/systemjs/system-polyfills.js",
  "resources/systemjs/system-polyfills.js.map",
  "resources/systemjs/system-polyfills.src.js",
  "resources/systemjs/system.js.map",
  "resources/systemjs/system.src.js"
];

const resourcePath = {
  latest: "/pluralsight/courses/progressive-web-apps/service/latest-deals.php",
  image: "/pluralsight/courses/progressive-web-apps/service/car-image.php",
  car: "/pluralsight/courses/progressive-web-apps/service/car.php"
};

self.addEventListener("install", event => {
  console.log('From SW: Install Event"', event);
  self.skipWaiting();

  event.waitUntil(
    (async () => {
      const cache = await caches.open(carDealsCacheName);
      await cache.addAll(carDealsCacheFiles);
    })()
  );
});

self.addEventListener("activate", event => {
  console.log("From SW: Activate State", event);
  self.clients.claim();

  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();

      const cacheNames = [
        carDealsCacheName,
        carDealsCachePagesName,
        carDealsCacheImagesName
      ];
      const deleting = cacheKeys
        .filter(item => !cacheNames.includes(item))
        .map(caches.delete.bind(caches));

      Promise.all(deleting);
    })()
  );
});

self.addEventListener("fetch", e => {
  const requestUrl = new URL(e.request.url);
  const { pathname: requestPath } = requestUrl;
  const fileName = requestPath.substring(requestPath.lastIndexOf("/"));

  if (requestPath === resourcePath.latest || fileName === "sw.js") {
    e.respondWith(fetch(e.request));
  } else if (requestPath === resourcePath.image) {
    e.respondWith(networkFirstStrategy(e.request));
  } else {
    e.respondWith(cacheFirstStrategy(e.request));
  }
});

const getCacheName = request => {
  const requestUrl = new URL(request.url);
  const { pathName: requestPath } = requestUrl;

  switch (requestPath) {
    case resourcePath.image:
      return carDealsCacheImagesName;
    case resourcePath.car:
      return carDealsCachePagesName;
    default:
      return carDealsCacheName;
  }
};
const fetchRequestAndCache = async request => {
  const networkResponse = await fetch(request);
  caches
    .open(getCacheName(request))
    .then(cache => cache.put(request, networkResponse));

  return networkResponse.clone();
};

const cacheFirstStrategy = async request => {
  const cacheResponse = await caches.match(request);

  return cacheResponse || fetchRequestAndCache(request);
};

const networkFirstStrategy = async request => {
  try {
    return await fetchRequestAndCache(request);
  } catch (e) {
    return caches.match(request);
  }
};
