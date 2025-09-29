const express = require("express");
const verifyAccessToken = require('../middlewares/verifyAccessToken');

function createTestimonialRouter(testimonialController) {
  const router = express.Router();

  router.post("/init", testimonialController.initTestimonial);
  router.get("/", testimonialController.getTestimonials);


  return router;
}

module.exports = createTestimonialRouter;
