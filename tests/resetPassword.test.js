import { resetPassword } from "../controllers/authController";

describe("resetPassword", () => {
  it("should reset a user password", async () => {
    const req = { body: { token: "valid-token", newPassword: "new-password" } };
    const res = { json: jest.fn() };
    const user = { _id: "123", email: "johndoe@example.com" };
    jest.spyOn(User, "findById").mockImplementation(() => user);
    await resetPassword(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      message: "Password reset successfully",
    });
  });

  it("should throw an error if token is invalid or expired", async () => {
    const req = {
      body: { token: "invalid-token", newPassword: "new-password" },
    };
    const res = { status: jest.fn(), json: jest.fn() };
    jest.spyOn(User, "findById").mockImplementation(() => null);
    await resetPassword(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid or expired token",
    });
  });
});
