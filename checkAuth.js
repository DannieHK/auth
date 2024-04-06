import dotenv from 'dotenv/config';
import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
  const token = req.cookies.token; // Extract token from cookies
  if (!token) {
    return res.redirect('/login');
  };

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decodedToken.user; // Set decoded user object in req.user
    next();
  } catch (error) {
    return res.redirect('/login');
  }
};

export default checkAuth;
