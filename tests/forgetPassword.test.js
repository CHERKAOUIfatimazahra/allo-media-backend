import { forgetPassword } from '../controllers/authController';

describe('forgetPassword', () => {
  it('should send a password reset email', async () => {
    const req = { body: { email: 'johndoe@example.com' } };
    const res = { json: jest.fn() };
    const user = { _id: '123', email: 'johndoe@example.com' };
    jest.spyOn(User, 'findOne').mockImplementation(() => user);
    await forgetPassword(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email sent for password reset' });
  });

  it('should throw an error if user not found', async () => {
    const req = { body: { email: 'johndoe@example.com' } };
    const res = { status: jest.fn(), json: jest.fn() };
    jest.spyOn(User, 'findOne').mockImplementation(() => null);
    await forgetPassword(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });
})