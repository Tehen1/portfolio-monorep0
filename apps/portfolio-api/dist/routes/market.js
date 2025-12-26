"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
/**
 * GET /market/stock/:symbol
 * Get stock price data
 */
router.get('/stock/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        // Mock stock data (replace with real API call)
        const mockData = {
            symbol: symbol.toUpperCase(),
            price: Math.random() * 1000 + 100,
            change: (Math.random() - 0.5) * 20,
            changePercent: (Math.random() - 0.5) * 10,
            volume: Math.floor(Math.random() * 10000000),
            marketCap: Math.floor(Math.random() * 1000000000000),
            lastUpdated: new Date().toISOString(),
            source: 'Mock API'
        };
        mockData.changePercent = (mockData.change / (mockData.price - mockData.change)) * 100;
        res.json({
            success: true,
            data: mockData
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'EXTERNAL_API_ERROR', message: 'Failed to fetch stock data' }
        });
    }
});
/**
 * GET /market/crypto/:symbol
 * Get cryptocurrency data
 */
router.get('/crypto/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        // Mock crypto data
        const mockData = {
            symbol: symbol.toUpperCase(),
            name: symbol === 'BTC' ? 'Bitcoin' : symbol === 'ETH' ? 'Ethereum' : 'Unknown',
            price: symbol === 'BTC' ? 43250 + Math.random() * 1000 : 2650 + Math.random() * 200,
            change24h: (Math.random() - 0.5) * 500,
            changePercent24h: (Math.random() - 0.5) * 5,
            volume24h: Math.floor(Math.random() * 50000000000),
            marketCap: Math.floor(Math.random() * 1000000000000),
            lastUpdated: new Date().toISOString(),
            source: 'Mock API'
        };
        res.json({
            success: true,
            data: mockData
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'EXTERNAL_API_ERROR', message: 'Failed to fetch crypto data' }
        });
    }
});
/**
 * GET /market/forex/:pair
 * Get forex rates
 */
router.get('/forex/:pair', async (req, res) => {
    try {
        const { pair } = req.params;
        // Mock forex data
        const baseRate = pair.startsWith('EUR') ? 1.0825 : 1.25;
        const mockData = {
            pair: pair.toUpperCase(),
            rate: baseRate + (Math.random() - 0.5) * 0.1,
            change: (Math.random() - 0.5) * 0.01,
            changePercent: (Math.random() - 0.5) * 1,
            lastUpdated: new Date().toISOString(),
            source: 'Mock API'
        };
        res.json({
            success: true,
            data: mockData
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'EXTERNAL_API_ERROR', message: 'Failed to fetch forex data' }
        });
    }
});
exports.default = router;
