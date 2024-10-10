import { verifyEmail } from "../controllers/authController";

describe("verifyEmail", () => {
  it("should verify a user email and redirect to login page", async () => {
    const req = { query: { token: "valid-token" } };
    const res = { redirect: jest.fn() };
    await verifyEmail(req, res);
    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith(
      "http://localhost:3000/login?verified=true"
    );
  });

  it("should throw an error if token is invalid", async () => {
    const req = { query: { token: "invalid-token" } };
    const res = { redirect: jest.fn() };
    await verifyEmail(req, res);
    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith(
      "http://localhost:3000/error?message=invalid-token"
    );
  });
});
