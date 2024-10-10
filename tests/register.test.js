import { register } from "../controllers/authController";

describe("register", () => {
  it("should create a new user and send a verification email", async () => {
    const req = {
      body: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password",
        phoneNumber: "1234567890",
        address: "123 Main St",
      },
    };
    const res = { status: jest.fn(), json: jest.fn() };
    await register(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "User  registered successfully. Please check your email for verification.",
    });
  });

  it("should throw an error if user creation fails", async () => {
    const req = {
      body: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password",
        phoneNumber: "1234567890",
        address: "123 Main St",
      },
    };
    const res = { status: jest.fn(), json: jest.fn() };
    jest.spyOn(User, "create").mockImplementation(() => {
      throw new Error("User  creation failed");
    });
    await register(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: "User  creation failed" });
  });
});
