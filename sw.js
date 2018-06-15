"use strict";

const carDealsCacheName = "carDealsCacheV1";
const carDealsCachePagesName = "carDealsCachePagesV1";
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

      const deleting = cacheKeys
        .filter(
          item => item !== carDealsCacheName && item !== carDealsCachePagesName
        )
        .map(caches.delete.bind(caches));

      await Promise.all(deleting);
    })()
  );
});
