const express = require("express");

function createAuthRouter(authController) {
  const router = express.Router();

  router.post("/signup", authController.signup);
  router.post("/login", authController.login);
  router.post("/logout", authController.logout);
  router.get("/verify-email", authController.verifyEmail);

  return router;
}

module.exports = createAuthRouter;
