import { verifyOTP } from "../controllers/authController";

describe("verifyOTP", () => {
  it("should verify an OTP and return a JWT token", async () => {
    const req = { body: { email: "johndoe@example.com", otp: "123456" } };
    const res = { json: jest.fn() };
    const user = {
      _id: "123",
      role: "user",
      otp: "123456",
      otpExpires: Date.now() + 10 * 60 * 1000,
    };
    jest.spyOn(User, "findOne").mockImplementation(() => user);
    await verifyOTP(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      message: "OTP verified successfully",
      token: expect.any(String),
    });
  });

  it("should throw an error if OTP is invalid or expired", async () => {
    const req = { body: { email: "johndoe@example.com", otp: "invalid-otp" } };
    const res = { status: jest.fn(), json: jest.fn() };
    const user = {
      _id: "123",
      role: "user",
      otp: "123456",
      otpExpires: Date.now() - 10 * 60 * 1000,
    };
    jest.spyOn(User, "findOne").mockImplementation(() => user);
    await verifyOTP(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid or expired OTP",
    });
  });
});
