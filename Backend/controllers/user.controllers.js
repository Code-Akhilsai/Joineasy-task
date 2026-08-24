import pool from "../db/connectdb.js";

const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, name, email, role
       FROM users
       WHERE id = $1`,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export { getMyProfile };
