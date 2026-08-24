import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/connectdb.js";

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const secretKey = process.env.JWT_SECRET || process.env.JWT_SECREATE_KEY;

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      secretKey,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export default loginController;
