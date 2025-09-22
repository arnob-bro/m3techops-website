const express = require("express");

function createBlogRouter(blogController) {
  const router = express.Router();

    router.get('/', blogController.getAllBlogs);
    router.get('/:blog_id', blogController.getBlogById);
    router.post('/', blogController.createBlog);
    router.put('/:blog_id', blogController.updateBlog);
    router.patch('/:blog_id/toggle', blogController.toggleActive);

  return router;
}

module.exports = createBlogRouter;
