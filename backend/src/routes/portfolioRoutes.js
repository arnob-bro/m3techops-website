const express = require("express");

function createPortfolioRouter(portfolioController) {
  const router = express.Router();

    router.get('/', portfolioController.getAllPortfolios);
    router.get('/:portfolio_item_id', portfolioController.getPortfolioById);
    router.post('/', portfolioController.createPortfolio);
    router.put('/:portfolio_item_id', portfolioController.updatePortfolio);

  return router;
}

module.exports = createPortfolioRouter;
