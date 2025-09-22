class BlogController {
    constructor(blogService) {
        this.blogService = blogService;

        this.getAllBlogs = this.getAllBlogs.bind(this);
        this.getBlogById = this.getBlogById.bind(this);
        this.createBlog = this.createBlog.bind(this);
        this.updateBlog = this.updateBlog.bind(this);
        this.toggleActive = this.toggleActive.bind(this);
    }

    async getAllBlogs(req, res) {
        try {
            const { page, limit, title, active } = req.query;
            const result = await this.blogService.getBlogs(page, limit, title, active);
            return res.json({success: true, data: result });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async getBlogById(req, res) {
        try {
            const { blog_id } = req.params;
            const blog = await this.blogService.getById(blog_id);
            if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
            return res.json({ success: true, blog });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async createBlog(req, res) {
        try {
            const {
                title,
                category,
                excerpt,
                content,
                image,
                read_time,
                author_name,
                author_avatar,
                author_role,
                active
            } = req.body;

            // Validation
            if (!title || typeof title !== 'string' || title.trim().length < 3) {
                return res.status(400).json({ success: false, message: 'Title is required and must be at least 3 characters' });
            }
            if (!category || typeof category !== 'string' || category.trim().length === 0) {
                return res.status(400).json({ success: false, message: 'Category is required' });
            }
            if (!excerpt || typeof excerpt !== 'string' || excerpt.trim().length < 10) {
                return res.status(400).json({ success: false, message: 'Excerpt is required and must be at least 10 characters' });
            }
            if (!content || typeof content !== 'string' || content.trim().length < 20) {
                return res.status(400).json({ success: false, message: 'Content is required and must be at least 20 characters' });
            }
            if (!author_name || typeof author_name !== 'string' || author_name.trim().length < 2) {
                return res.status(400).json({ success: false, message: 'Author name is required and must be at least 2 characters' });
            }

            // Optional fields validation
            if (read_time && typeof read_time !== 'string') {
                return res.status(400).json({ success: false, message: 'Read time must be a string (e.g., "5 min read")' });
            }
            if (image && typeof image !== 'string') {
                return res.status(400).json({ success: false, message: 'Image must be a string (URL)' });
            }
            if (author_avatar && typeof author_avatar !== 'string') {
                return res.status(400).json({ success: false, message: 'Author avatar must be a string (URL)' });
            }
            if (author_role && typeof author_role !== 'string') {
                return res.status(400).json({ success: false, message: 'Author role must be a string' });
            }

            const blog = await this.blogService.create({
                title: title.trim(),
                category: category.trim(),
                excerpt: excerpt.trim(),
                content: content.trim(),
                image: image ? image.trim() : null,
                read_time: read_time ? read_time.trim() : '5 min read',
                author_name: author_name.trim(),
                author_avatar: author_avatar ? author_avatar.trim() : null,
                author_role: author_role ? author_role.trim() : null,
                active: active ?? true
            });

            return res.status(201).json({ success: true, blog });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async updateBlog(req, res) {
        try {
            const { blog_id } = req.params;
            const updateData = {};
            const {
                title,
                category,
                excerpt,
                content,
                image,
                read_time,
                author_name,
                author_avatar,
                author_role,
                active
            } = req.body;

            // Apply validation only if fields exist
            if (title !== undefined) {
                if (typeof title !== 'string' || title.trim().length < 3) {
                    return res.status(400).json({ success: false, message: 'Title must be at least 3 characters' });
                }
                updateData.title = title.trim();
            }
            if (category !== undefined) {
                if (typeof category !== 'string' || category.trim().length === 0) {
                    return res.status(400).json({ success: false, message: 'Category must be a non-empty string' });
                }
                updateData.category = category.trim();
            }
            if (excerpt !== undefined) {
                if (typeof excerpt !== 'string' || excerpt.trim().length < 10) {
                    return res.status(400).json({ success: false, message: 'Excerpt must be at least 10 characters' });
                }
                updateData.excerpt = excerpt.trim();
            }
            if (content !== undefined) {
                if (typeof content !== 'string' || content.trim().length < 20) {
                    return res.status(400).json({ success: false, message: 'Content must be at least 20 characters' });
                }
                updateData.content = content.trim();
            }
            if (author_name !== undefined) {
                if (typeof author_name !== 'string' || author_name.trim().length < 2) {
                    return res.status(400).json({ success: false, message: 'Author name must be at least 2 characters' });
                }
                updateData.author_name = author_name.trim();
            }

            // Optional fields
            if (read_time !== undefined) {
                if (typeof read_time !== 'string') {
                    return res.status(400).json({ success: false, message: 'Read time must be a string' });
                }
                updateData.read_time = read_time.trim();
            }
            if (image !== undefined) {
                if (image && typeof image !== 'string') {
                    return res.status(400).json({ success: false, message: 'Image must be a string (URL)' });
                }
                updateData.image = image ? image.trim() : null;
            }
            if (author_avatar !== undefined) {
                if (author_avatar && typeof author_avatar !== 'string') {
                    return res.status(400).json({ success: false, message: 'Author avatar must be a string (URL)' });
                }
                updateData.author_avatar = author_avatar ? author_avatar.trim() : null;
            }
            if (author_role !== undefined) {
                if (author_role && typeof author_role !== 'string') {
                    return res.status(400).json({ success: false, message: 'Author role must be a string' });
                }
                updateData.author_role = author_role ? author_role.trim() : null;
            }
            if (active !== undefined) {
                updateData.active = !!active;
            }

            const updated = await this.blogService.update(blog_id, updateData);
            if (!updated) return res.status(404).json({ success: false, message: 'Blog not found' });

            return res.json({ success: true, blog: updated });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async toggleActive(req, res) {
        try {
            const { blog_id } = req.params;
            const blog = await this.blogService.toggleActive(blog_id);
            if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
            return res.json({ success: true, blog });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}

module.exports = BlogController;
