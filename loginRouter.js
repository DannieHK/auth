import { Router } from 'express';
import templateEngine from '../util/templateEngine.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import getConnection from '../Database/dbConnection.js';

const router = Router();

async function findUserByUsername(username) {
  const connection = await getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];
    return user;
  } finally {
    connection.release();
  }
}

router.get('/', async (req, res) => {
  try {
    // Check if the user is already authenticated
    const token = req.cookies.token;
    if (token) {
      try {
        jwt.verify(token, process.env.TOKEN_SECRET);
        return res.redirect('/dashboard'); // Redirect to the dashboard
      } catch (error) {
        // If the token is not valid, ignore it and render the login page
      }
    }
    const loginPath = '../CLIENT/public/pages/login/login.html';
    const loginPage = templateEngine.readPage(loginPath);
    const renderedPage = templateEngine.renderPage(loginPage, false, {
      tabTitle: "Login",
    });

    res.send(renderedPage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error rendering login page: ", error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
      const { username, password } = req.body;
      const user = await findUserByUsername(username);
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ message: "Invalid username or password" });
      }
      const token = jwt.sign({ userId: user.user_id }, process.env.TOKEN_SECRET, { expiresIn: '10h' });
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/dashboard');
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error logging in: ", error: error.message });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

export default router;
