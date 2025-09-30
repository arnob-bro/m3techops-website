const express = require("express");
const multer = require("multer");
const verifyAccessToken = require('../middlewares/verifyAccessToken');

function createTestimonialRouter(testimonialController) {
  const router = express.Router();
  const upload = multer({ storage: multer.memoryStorage() });

  router.post("/init", testimonialController.initTestimonial);
  router.get("/", testimonialController.getTestimonials);
  router.get("/feedback-status/:token", testimonialController.getTestimonialFeedbackStatusByToken);
  router.get("/:token", testimonialController.getTestimonialByToken);
  router.post("/submit/:token", upload.single("image"), testimonialController.submitTestimonial);

  return router;
}

module.exports = createTestimonialRouter;
