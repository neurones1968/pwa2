import * as carService from "./carService.js";

window.pageEvents = {
  loadCarPage: function(carId) {
    carService.loadCarPage(carId);
  },
  loadMore: function() {
    carService.loadMoreRequest();
  }
};

carService.loadMoreRequest();
