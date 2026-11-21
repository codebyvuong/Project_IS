const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { csrfProtection } = require('../middleware/csrfMiddleware');

function createAuthRoutes(authController, loginRateLimiter) {
  const router = express.Router();

  router.get('/csrf-token', authController.getCsrfToken);
  router.post('/login', loginRateLimiter, csrfProtection, authController.login);
  router.get('/me', requireAuth, authController.me);
  router.post('/logout', csrfProtection, authController.logout);

  return router;
}

module.exports = { createAuthRoutes };
