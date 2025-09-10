const express = require("express");

function createServiceRouter(serviceController) {
  const router = express.Router();

  router.post("/", serviceController.createService);
  router.get("/", serviceController.getServices);
  router.put("/:service_id", serviceController.updateService);


  return router;
}

module.exports = createServiceRouter;

