import { Router } from 'express';
import templateEngine from '../util/templateEngine.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByUsername, createUser } from '../Database/userBase.js';

const router = Router();

router.get('/', (req, res) => {
  const frontpage = templateEngine.readPage('../CLIENT/public/pages/login/register.html');
  const frontpagePage = templateEngine.renderPage(frontpage, {
    tabTitle: "Register",
  });
  res.send(frontpagePage);
});

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await findUserByUsername(username); // Checks if user already exists
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // Hashes the password
    const userId = await createUser(username, hashedPassword); // Create new user

    // Generates the JWT Token
    const token = jwt.sign({ id: userId }, process.env.TOKEN_SECRET, { expiresIn: '10h' }); // Works in 10 hours

    res.status(201).json({ token, username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user: ", error: error.message });
  }
});

export default router;
