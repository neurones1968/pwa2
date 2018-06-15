(async () => {
  if (!"serviceWorker" in navigator) {
    return;
  }

  try {
    const swRegistration = await navigator.serviceWorker.register("sw.js");

    console.log(swRegistration);
  } catch (e) {
    console.warn("ServiceWorker registration has failed.", e);
  }
})();
