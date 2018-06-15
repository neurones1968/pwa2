(async () => {
  if (!"serviceWorker" in navigator) {
    return;
  }

  navigator.serviceWorker.addEventListener("controllerchange", e => {
    console.log("Controller Changed!");
  });

  try {
    const swRegistration = await navigator.serviceWorker.register("sw.js", {
      scope: ""
    });
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

    swRegistration.addEventListener("updatefound", e => {
      swRegistration.installing.addEventListener("statechange", e => {
        console.log("New service worker state: ", e.target.state);
      });
      console.log("New service worker found!", swRegistration);
    });

    setInterval(() => {
      swRegistration.update();
    }, 1000 * 60 * 60);

    // if (navigator.serviceWorker.controller) {
    //   navigator.serviceWorker.controller.postMessage("hello");
    // }
  } catch (e) {
    console.warn("ServiceWorker registration has failed.", e);
  }
})();
