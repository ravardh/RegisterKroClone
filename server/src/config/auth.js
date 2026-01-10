import jwt from "jsonwebtoken";

export const genUserToken = async (user, res) => {
  try {
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    
  } catch (error) {
    const err = new Error("Token generation failed");
    err.statusCode = 500;
    throw err;
  }
};
