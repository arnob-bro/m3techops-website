const express = require("express");

function createNewsLetterRouter(newsLetterController) {
  const router = express.Router();

  router.post("/subscribe", newsLetterController.subscribe);
  router.get("/subscribers", newsLetterController.getSubscribers);
  router.put("/subscribers/:subscriber_id/status", newsLetterController.updateSubscriberStatus);

  router.post("/newsletters", newsLetterController.createNewsletter);         // Create
  router.get("/newsletters", newsLetterController.getNewsletters);         // List all (with pagination)
  router.patch("/newsletters/:newsletter_id", newsLetterController.updateNewsletter);    // Update title/content/status
  router.post("/newsletters/:newsletter_id/send", newsLetterController.sendNewsletter);  // Trigger sending


  return router;
}

module.exports = createNewsLetterRouter;
