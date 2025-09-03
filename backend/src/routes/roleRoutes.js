const express = require("express");

function createRoleRouter(roleController) {
  const router = express.Router();

  router.post("/create-role", roleController.createRole);


  return router;
}

module.exports = createRoleRouter;
