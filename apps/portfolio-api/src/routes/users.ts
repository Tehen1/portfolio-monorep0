import { Router, Request, Response } from 'express';

const router = Router();

// Mock user data
const mockUser = {
  id: 'user_123',
  email: 'anthony@antonylambi.be',
  name: 'Anthony Lambi',
  role: 'admin',
  preferences: {
    theme: 'dark',
    notifications: true,
    defaultTimeframe: 'monthly'
  },
  createdAt: '2025-01-01T00:00:00Z',
  lastLogin: '2025-12-14T01:00:00Z'
};

/**
 * GET /users/profile
 * Get user profile
 */
router.get('/profile', async (req: Request, res: Response) => {
  try {
    // In production, get user from req.user
    res.json({
      success: true,
      data: { user: mockUser }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch user profile' }
    });
  }
});

/**
 * PUT /users/profile
 * Update user profile
 */
router.put('/profile', async (req: Request, res: Response) => {
  try {
    const { name, preferences } = req.body;

    const updatedUser = {
      ...mockUser,
      name: name || mockUser.name,
      preferences: { ...mockUser.preferences, ...preferences }
    };

    res.json({
      success: true,
      data: { user: updatedUser }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update user profile' }
    });
  }
});

/**
 * POST /users/change-password
 * Change user password
 */
router.post('/change-password', async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Mock password validation (use proper validation in production)
    if (currentPassword !== 'password123') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Current password is incorrect'
        }
      });
    }

    // Mock password update
    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to change password' }
    });
  }
});

export default router;
