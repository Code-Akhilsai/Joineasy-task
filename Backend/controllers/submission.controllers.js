import pool from "../db/connectdb.js";

const confirmSubmission = async (req, res) => {
  try {
    const { assignmentId, groupId } = req.body;
    const userId = req.user.id;

    if (!assignmentId) {
      return res.status(400).json({
        message: "Assignment ID is required",
      });
    }

    const parsedAssignmentId = parseInt(assignmentId, 10);
    const parsedUserId = parseInt(userId, 10);

    if (!parsedAssignmentId || !parsedUserId) {
      return res.status(400).json({
        message: "Invalid submission data",
      });
    }

    // Get assignment submission type
    const assignmentResult = await pool.query(
      `SELECT submission_type
       FROM assignments
       WHERE id = $1`,
      [parsedAssignmentId],
    );

    if (assignmentResult.rows.length === 0) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    const submissionType = assignmentResult.rows[0].submission_type || "Group";

    // Individual submission
    if (submissionType.toLowerCase() === "individual") {
      const result = await pool.query(
        `INSERT INTO submissions
         (assignment_id, student_id, confirmed_by)
         VALUES ($1, $2, $2)
         RETURNING *`,
        [parsedAssignmentId, parsedUserId],
      );

      return res.status(201).json({
        message: "Submission confirmed successfully",
        submission: result.rows[0],
      });
    }

    // Group submission
    if (!groupId) {
      return res.status(400).json({
        message: "Group ID is required for group assignments",
      });
    }

    const parsedGroupId = parseInt(groupId, 10);

    if (!parsedGroupId) {
      return res.status(400).json({
        message: "Invalid group ID",
      });
    }

    // Check whether the student belongs to this group
    const memberResult = await pool.query(
      `SELECT role
       FROM group_members
       WHERE group_id = $1
       AND student_id = $2`,
      [parsedGroupId, parsedUserId],
    );

    if (memberResult.rows.length === 0) {
      return res.status(403).json({
        message: "You are not a member of this group",
      });
    }

    // Only leader can acknowledge
    if (memberResult.rows[0].role !== "leader") {
      return res.status(403).json({
        message: "Only the group leader can acknowledge the submission",
      });
    }

    const result = await pool.query(
      `INSERT INTO submissions
       (assignment_id, group_id, confirmed_by)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [parsedAssignmentId, parsedGroupId, parsedUserId],
    );

    res.status(201).json({
      message: "Submission confirmed successfully",
      submission: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "This assignment has already been submitted",
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
        s.student_id,
        s.group_id,
        s.confirmed_by,
        s.confirmed_at
       FROM submissions s
       WHERE
         s.student_id = $1
         OR s.group_id IN (
           SELECT group_id
           FROM group_members
           WHERE student_id = $1
         )
       ORDER BY s.confirmed_at DESC`,
      [studentId],
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
        COALESCE(gu.name, u.name) AS "studentName",
        COALESCE(gu.email, u.email) AS "studentEmail",
        s.confirmed_at AS "confirmedAt",
        a.onedrive_link AS "oneDriveUrl"
      FROM submissions s
      JOIN assignments a
        ON s.assignment_id = a.id
      LEFT JOIN groups g
        ON s.group_id = g.id
      LEFT JOIN users gu
        ON s.student_id = gu.id
      LEFT JOIN users u
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

export { confirmSubmission, getMySubmissions, getAllSubmissions };
