import pool from "../db/connectdb.js";

const confirmSubmission = async (req, res) => {
  try {
    const { assignmentId, groupId } = req.body;
    const userId = req.user.id;

    if (!assignmentId || !groupId) {
      return res.status(400).json({
        message: "Assignment ID and Group ID are required",
      });
    }

    const parsedAssignmentId = parseInt(assignmentId, 10);
    const parsedGroupId = parseInt(groupId, 10);
    const parsedUserId = parseInt(userId, 10);

    if (!parsedAssignmentId || !parsedGroupId || !parsedUserId) {
      return res.status(400).json({
        message: "Invalid submission data",
      });
    }

    const result = await pool.query(
      `INSERT INTO submissions 
       (assignment_id, group_id, confirmed_by)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [parsedAssignmentId, parsedGroupId, parsedUserId]
    );

    res.status(201).json({
      message: "Submission confirmed successfully",
      submission: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "This assignment is already confirmed for this group",
      });
    }

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getMySubmissions = async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = await pool.query(
      `SELECT 
        s.id,
        s.assignment_id,
        s.group_id,
        s.confirmed_at
       FROM submissions s
       JOIN group_members gm
         ON s.group_id = gm.group_id
       WHERE gm.student_id = $1
       ORDER BY s.confirmed_at DESC`,
      [studentId]
    );

    res.status(200).json({
      submissions: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllSubmissions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        s.id,
        a.title AS "assignmentTitle",
        a.course AS "course",
        a.professor AS "professor",
        g.name AS "groupName",
        u.name AS "studentName",
        u.email AS "studentEmail",
        s.confirmed_at AS "confirmedAt",
        a.onedrive_link AS "oneDriveUrl"
      FROM submissions s
      JOIN assignments a
        ON s.assignment_id = a.id
      JOIN groups g
        ON s.group_id = g.id
      JOIN users u
        ON g.created_by = u.id
      ORDER BY s.confirmed_at DESC
    `);

    res.status(200).json({
      submissions: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export {
  confirmSubmission,
  getMySubmissions,
  getAllSubmissions,
};