import pool from "../db/connectdb.js";

const createAssignment = async (req, res) => {
  try {
    const { title, course, professor, description, dueDate, oneDriveUrl } =
      req.body;

    const createdBy = req.user.id;

    if (!title || !description || !dueDate || !oneDriveUrl) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO assignments
   (title, course, professor, description, due_date, onedrive_link, created_by)
   VALUES ($1, $2, $3, $4, $5, $6, $7)
   RETURNING *`,
      [title, course, professor, description, dueDate, oneDriveUrl, createdBy],
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
      id,
      title,
      course,
      professor,
      description,
      due_date,
      onedrive_link,
      created_at
    FROM assignments
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

export { createAssignment, getAllAssignments };
