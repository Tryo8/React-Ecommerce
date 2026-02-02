import express from 'express';
import { db } from '../db.js';

export const deleteOldCompletedOrders = async () => {
    try {
        const [result] = await db.execute(`
            UPDATE orders
            SET status = 'expired'
            WHERE status = 'delivered'
            AND created_at < NOW() - INTERVAL 1 DAY
        `);

        console.log(`🧹 Cleanup complete. Deleted ${result.affectedRows} old pending orders.`);
    } catch (err) {
        console.error("❌ Order cleanup failed:", err.message);
    }
};
