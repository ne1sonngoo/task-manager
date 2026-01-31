const express = require("express");
const pool = require("../db"); // adjust if your Pool export is elsewhere

const router = express.Router();

/**
 * Helper: validate status values
 * (You can expand these later)
 */
const ALLOWED_STATUS = new Set(["pending", "in_progress", "completed"]);

/**
 * GET /tasks
 * Returns only tasks owned by the logged-in user.
 * Optional query: ?status=pending
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    // Optional filtering by status, still scoped to the user
    if (status !== undefined) {
      if (!ALLOWED_STATUS.has(status)) {
        return res.status(400).json({
          error: `invalid status. allowed: ${Array.from(ALLOWED_STATUS).join(", ")}`
        });
      }

      const result = await pool.query(
        "SELECT id, user_id, title, status FROM tasks WHERE user_id = $1 AND status = $2 ORDER BY id DESC",
        [userId, status]
      );
      return res.json(result.rows);
    }

    const result = await pool.query(
      "SELECT id, user_id, title, status FROM tasks WHERE user_id = $1 ORDER BY id DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

/**
 * GET /tasks/:id
 * Returns a single task only if it belongs to the logged-in user.
 */
router.get("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId)) {
      return res.status(400).json({ error: "task id must be an integer" });
    }

    const result = await pool.query(
      "SELECT id, user_id, title, status FROM tasks WHERE id = $1 AND user_id = $2",
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      // Either doesn't exist OR not yours (we don't reveal which)
      return res.sendStatus(404);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

/**
 * POST /tasks
 * Creates a task owned by the logged-in user.
 * Body: { title, status? }
 *
 * IMPORTANT: client never provides user_id.
 * Ownership comes from req.user.id (from the verified JWT).
 */
router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, status } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "title is required" });
    }

    if (status !== undefined && !ALLOWED_STATUS.has(status)) {
      return res.status(400).json({
        error: `invalid status. allowed: ${Array.from(ALLOWED_STATUS).join(", ")}`
      });
    }

    // If status is omitted, the DB default 'pending' will be used
    const result = await pool.query(
      status === undefined
        ? "INSERT INTO tasks (user_id, title) VALUES ($1, $2) RETURNING id, user_id, title, status"
        : "INSERT INTO tasks (user_id, title, status) VALUES ($1, $2, $3) RETURNING id, user_id, title, status",
      status === undefined ? [userId, title] : [userId, title, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

/**
 * PUT /tasks/:id
 * Updates a task only if it belongs to the logged-in user.
 * Body: { title?, status? }
 */
router.put("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId)) {
      return res.status(400).json({ error: "task id must be an integer" });
    }

    const { title, status } = req.body;

    if (title === undefined && status === undefined) {
      return res.status(400).json({ error: "nothing to update" });
    }

    if (title !== undefined && (typeof title !== "string" || title.length === 0)) {
      return res.status(400).json({ error: "title must be a non-empty string" });
    }

    if (status !== undefined && !ALLOWED_STATUS.has(status)) {
      return res.status(400).json({
        error: `invalid status. allowed: ${Array.from(ALLOWED_STATUS).join(", ")}`
      });
    }

    const result = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           status = COALESCE($2, status)
       WHERE id = $3 AND user_id = $4
       RETURNING id, user_id, title, status`,
      [title ?? null, status ?? null, taskId, userId]
    );

    if (result.rows.length === 0) {
      return res.sendStatus(404);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

/**
 * DELETE /tasks/:id
 * Deletes a task only if it belongs to the logged-in user.
 */
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId)) {
      return res.status(400).json({ error: "task id must be an integer" });
    }

    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id",
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      return res.sendStatus(404);
    }

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
