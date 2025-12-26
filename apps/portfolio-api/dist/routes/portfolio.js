"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pareto_optimization_1 = require("@portfolio/pareto-optimization");
const router = (0, express_1.Router)();
// Mock portfolio database (replace with real database)
let portfolioItems = pareto_optimization_1.PARETO_DOMAINS.map(domain => ({
    ...domain,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
}));
/**
 * GET /portfolio/items
 * List all portfolio items
 */
router.get('/items', async (req, res) => {
    try {
        const { type, priority, limit = 50, offset = 0 } = req.query;
        let filteredItems = portfolioItems;
        if (type) {
            filteredItems = filteredItems.filter(item => item.type === type);
        }
        if (priority) {
            filteredItems = filteredItems.filter(item => item.priority === priority);
        }
        const paginatedItems = filteredItems.slice(Number(offset), Number(offset) + Number(limit));
        res.json({
            success: true,
            data: {
                items: paginatedItems,
                pagination: {
                    total: filteredItems.length,
                    limit: Number(limit),
                    offset: Number(offset),
                    hasMore: Number(offset) + Number(limit) < filteredItems.length
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch portfolio items' }
        });
    }
});
/**
 * POST /portfolio/items
 * Create new portfolio item
 */
router.post('/items', async (req, res) => {
    try {
        const newItem = {
            ...req.body,
            id: `item_${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        portfolioItems.push(newItem);
        res.status(201).json({
            success: true,
            data: { item: newItem }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: 'Failed to create portfolio item' }
        });
    }
});
/**
 * GET /portfolio/items/:id
 * Get portfolio item by ID
 */
router.get('/items/:id', async (req, res) => {
    try {
        const item = portfolioItems.find(i => i.id === req.params.id);
        if (!item) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Portfolio item not found' }
            });
        }
        res.json({
            success: true,
            data: { item }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch portfolio item' }
        });
    }
});
/**
 * PUT /portfolio/items/:id
 * Update portfolio item
 */
router.put('/items/:id', async (req, res) => {
    try {
        const index = portfolioItems.findIndex(i => i.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Portfolio item not found' }
            });
        }
        portfolioItems[index] = {
            ...portfolioItems[index],
            ...req.body,
            updatedAt: new Date().toISOString()
        };
        res.json({
            success: true,
            data: { item: portfolioItems[index] }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: 'Failed to update portfolio item' }
        });
    }
});
/**
 * DELETE /portfolio/items/:id
 * Delete portfolio item
 */
router.delete('/items/:id', async (req, res) => {
    try {
        const index = portfolioItems.findIndex(i => i.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Portfolio item not found' }
            });
        }
        portfolioItems.splice(index, 1);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: 'Failed to delete portfolio item' }
        });
    }
});
exports.default = router;
