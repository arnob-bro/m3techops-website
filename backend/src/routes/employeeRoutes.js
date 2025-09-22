const express = require("express");
const verifyAccessToken = require('../middlewares/verifyAccessToken');

function createEmployeeRouter(employeeController) {
  const router = express.Router();

  router.get('/', employeeController.getEmployees);
  router.get('/:employee_id', employeeController.getEmployeeById);
  router.post('/', employeeController.createEmployee);
  router.put('/:employee_id', employeeController.updateEmployee);

  return router;
}

module.exports = createEmployeeRouter;
