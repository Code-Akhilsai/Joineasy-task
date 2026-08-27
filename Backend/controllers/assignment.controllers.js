import pool from "../db/connectdb.js";

const createAssignment = async (req, res) => {
  try {
    const { title, course, professor, description, dueDate, oneDriveUrl } =
      req.body;

    const createdBy = req.user.id;

    if (!title || !course || !description || !dueDate || !oneDriveUrl) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const courseResult = await pool.query(
      `INSERT INTO courses (name)
       VALUES ($1)
       ON CONFLICT (name)
       DO UPDATE SET name = EXCLUDED.name
       RETURNING id, name`,
      [course],
    );

    const courseId = courseResult.rows[0].id;

    const result = await pool.query(
      `INSERT INTO assignments
       (title, course, course_id, professor, description, due_date, onedrive_link, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        title,
        course,
        courseId,
        professor,
        description,
        dueDate,
        oneDriveUrl,
        createdBy,
      ],
    );

    res.status(201).json({
      message: "Assignment created successfully",
      assignment: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllAssignments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.id,
        a.title,
        c.name AS course,
        a.course_id,
        a.professor,
        a.description,
        a.due_date,
        a.onedrive_link,
        a.created_at,
        COUNT(s.id)::int AS "submittedCount"
      FROM assignments a
      JOIN courses c
        ON a.course_id = c.id
      LEFT JOIN submissions s
        ON s.assignment_id = a.id
      GROUP BY
        a.id,
        c.name
      ORDER BY a.created_at DESC
    `);

    res.status(200).json({
      assignments: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, course, professor, description, dueDate, oneDriveUrl } =
      req.body;

    if (!title || !course || !description || !dueDate || !oneDriveUrl) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const courseResult = await pool.query(
      `INSERT INTO courses (name)
       VALUES ($1)
       ON CONFLICT (name)
       DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [course],
    );

    const courseId = courseResult.rows[0].id;

    const result = await pool.query(
      `UPDATE assignments
       SET
         title = $1,
         course = $2,
         course_id = $3,
         professor = $4,
         description = $5,
         due_date = $6,
         onedrive_link = $7
       WHERE id = $8
       RETURNING *`,
      [
        title,
        course,
        courseId,
        professor,
        description,
        dueDate,
        oneDriveUrl,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      message: "Assignment updated successfully",
      assignment: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export { createAssignment, getAllAssignments, updateAssignment };
