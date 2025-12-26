"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pareto_optimization_1 = require("@portfolio/pareto-optimization");
const router = (0, express_1.Router)();
const { analyticsEngine } = (0, pareto_optimization_1.createParetoOptimization)();
/**
 * GET /analytics/metrics
 * Get real-time metrics
 */
router.get('/metrics', async (req, res) => {
    try {
        const metrics = analyticsEngine.calculateRealtimeMetrics();
        res.json({
            success: true,
            data: metrics
        });
    }
    catch (error) {
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
router.get('/reports/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const { timeframe } = req.query;
        const report = analyticsEngine.generatePerformanceReport(timeframe || 'monthly');
        res.json({
            success: true,
            data: { report }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: 'Failed to generate report' }
        });
    }
});
exports.default = router;
