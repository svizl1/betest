const speakeasy = require('speakeasy');

async function authenticate2FA(req, res, next) {
  const { token, userId } = req.body;
  const user = await User.findById(userId);

  if (user && user.two_factor_enabled) {
    const verified = speakeasy.totp.verify({
      secret: user.secret,
      encoding: 'base32',
      token: token,
    });

    if (verified) {
      next();
    } else {
      res.status(401).json({ message: 'Invalid 2FA token' });
    }
  } else {
    next(); // If 2FA is not enabled, proceed without checking the token
  }
}

module.exports = authenticate2FA;
