


export const verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const [rows] = await db.execute(
      `SELECT email_otp, otp_expires FROM users WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    if (user.email_otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    if (new Date(user.otp_expires) < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    await db.execute(
      `UPDATE users
       SET email_verified = true,
           email_otp = NULL,
           otp_expires = NULL
       WHERE email = ?`,
      [email]
    );

    res.json({ message: "Email verified successfully" });

  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
};

