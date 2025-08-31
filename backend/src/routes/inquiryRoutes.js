const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");

function createInquiryRouter(inquiryController) {
  const router = express.Router();

  router.post("/", inquiryController.makeInquiry);
  router.get("/", inquiryController.getInquiries);
  router.post("/:inquiry_id/reply", inquiryController.replyToInquiry);

  return router;
}

module.exports = createInquiryRouter;
