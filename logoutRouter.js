import express from 'express';

const router = express.Router();

// Logout route
router.get('/', (req, res) => {
    // Clear the token cookie
    res.clearCookie('token');
    // Redirect to the login page
    res.redirect('/');
  });

export default router;
