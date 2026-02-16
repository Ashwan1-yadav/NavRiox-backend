const authService = require("./auth.service");

exports.register = async (req, res, next) => {
  try {
    await authService.register(req.body);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await authService.login(
      req.body.email,
      req.body.password
    );

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      })
      .json({ message: "Login successful" });
  } catch (err) {
    next(err);
  }
};
