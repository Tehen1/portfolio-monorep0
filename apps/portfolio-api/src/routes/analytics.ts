import { Router, Request, Response } from 'express';
import { createParetoOptimization } from '@portfolio/pareto-optimization';

const router = Router();
const { analyticsEngine } = createParetoOptimization();

/**
 * GET /analytics/metrics
 * Get real-time metrics
 */
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const metrics = analyticsEngine.calculateRealtimeMetrics();

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to retrieve metrics' }
    });
  }
});

/**
 * GET /analytics/reports/:type
 * Generate analytics report
 */
router.get('/reports/:type', async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const { timeframe } = req.query;

    const report = analyticsEngine.generatePerformanceReport(timeframe as any || 'monthly');

    res.json({
      success: true,
      data: { report }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to generate report' }
    });
  }
});

export default router;
