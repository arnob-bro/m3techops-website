const express = require("express");

function createCareerRouter(careerController) {
  const router = express.Router();

    router.get('/', careerController.getCareers);
    router.post('/',careerController.createCareer);
    // router.put('/:career_id', careerController.updateCareer);
    // router.delete('/:career_id', careerController.deleteCareer);

  return router;
}

module.exports = createCareerRouter;
