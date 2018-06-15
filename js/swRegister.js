(async () => {
  if (!"serviceWorker" in navigator) {
    return;
  }

  try {
    const swRegistration = await navigator.serviceWorker.register("sw.js");
    let serviceWorker;

    if (swRegistration.installing) {
      console.log("Resolved at installing: ", swRegistration);
      serviceWorker = swRegistration.installing;
    } else if (swRegistration.waiting) {
      console.log("Resolved at installed/waiting: ", swRegistration);
      serviceWorker = swRegistration.waiting;
    } else if (swRegistration.active) {
      console.log("Resolved at activated: ", swRegistration);
      serviceWorker = swRegistration.active;
    }

    if (serviceWorker) {
      serviceWorker.addEventListener("statechange", e => {
        console.log(e.target.state);
      });
    }
  } catch (e) {
    console.warn("ServiceWorker registration has failed.", e);
  }
})();
