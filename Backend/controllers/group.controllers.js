import pool from "../db/connectdb.js";

const groupController = async (req, res) => {
  try {
    const { name, code } = req.body;
    const createdBy = req.user.id;

    if (!name || !code) {
      return res.status(400).json({
        message: "Group name and code are required",
      });
    }

    const existingGroup = await pool.query(
      `SELECT group_id
   FROM group_members
   WHERE student_id = $1`,
      [createdBy],
    );

    if (existingGroup.rows.length > 0) {
      return res.status(409).json({
        message: "You are already a member of a group",
      });
    }
    const result = await pool.query(
      `INSERT INTO groups (name, code, created_by)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, code, createdBy],
    );

    const group = result.rows[0];

    // Add creator as group leader
    await pool.query(
      `INSERT INTO group_members (group_id, student_id, role)
       VALUES ($1, $2, 'leader')`,
      [group.id, createdBy],
    );

    res.status(201).json({
      message: "Group created successfully",
      group,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Group code already exists",
      });
    }

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getMyGroup = async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = await pool.query(
      `SELECT 
        g.id,
        g.name,
        g.code,
        g.created_by,
        gm.role
       FROM groups g
       JOIN group_members gm
         ON g.id = gm.group_id
       WHERE gm.student_id = $1`,
      [studentId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "You are not part of any group",
      });
    }

    const group = result.rows[0];

    const members = await pool.query(
      `SELECT 
        u.id,
        u.name,
        u.email,
        gm.role
       FROM group_members gm
       JOIN users u
         ON gm.student_id = u.id
       WHERE gm.group_id = $1`,
      [group.id],
    );

    res.status(200).json({
      group: {
        ...group,
        members: members.rows,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const addMember = async (req, res) => {
  try {
    const { groupId, email } = req.body;

    if (!groupId || !email) {
      return res.status(400).json({
        message: "Group ID and email are required",
      });
    }

    const userResult = await pool.query(
      `SELECT id, name, email FROM users WHERE email = $1`,
      [email],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const student = userResult.rows[0];

    await pool.query(
      `INSERT INTO group_members (group_id, student_id, role)
       VALUES ($1, $2, 'member')`,
      [groupId, student.id],
    );

    res.status(201).json({
      message: "Member added successfully",
      member: student,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Student is already a member of this group",
      });
    }

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllGroups = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        g.id,
        g.name,
        g.code,
        g.created_at,
        u.name AS leader,
        COUNT(gm.id) AS members_count
      FROM groups g
      JOIN users u
        ON g.created_by = u.id
      LEFT JOIN group_members gm
        ON g.id = gm.group_id
      GROUP BY g.id, u.name
      ORDER BY g.created_at DESC
    `);

    res.status(200).json({
      groups: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export { groupController, getMyGroup, addMember, getAllGroups };
