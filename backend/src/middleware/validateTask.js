function validateTask(req, res, next) {
    const { title, user_id } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Invalid or missing title' });
    }
    next();
};

module.exports = validateTask;