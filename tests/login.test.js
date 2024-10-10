import { login } from "../controllers/authController";

describe("login", () => {
  it("should login a user and return a JWT token", async () => {
    const req = {
      body: { email: "johndoe@example.com", password: "password" },
    };
    const res = { json: jest.fn() };
    const user = { _id: "123", role: "user" };
    jest.spyOn(User, "findOne").mockImplementation(() => user);
    await login(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ token: expect.any(String) });
  });

  it("should throw an error if user not found", async () => {
    const req = {
      body: { email: "johndoe@example.com", password: "password" },
    };
    const res = { status: jest.fn(), json: jest.fn() };
    jest.spyOn(User, "findOne").mockImplementation(() => null);
    await login(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: "User  not found" });
  });

  it("should throw an error if password is invalid", async () => {
    const req = {
      body: { email: "johndoe@example.com", password: "invalid-password" },
    };
    const res = { status: jest.fn(), json: jest.fn() };
    const user = { _id: "123", role: "user" };
    jest.spyOn(User, "findOne").mockImplementation(() => user);
    jest.spyOn(bcrypt, "compare").mockImplementation(() => false);
    await login(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
  });
});
