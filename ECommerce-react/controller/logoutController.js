import { db } from '../db.js';

export const handleLogout = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        res.clearCookie('jwt', { httpOnly: true });
        res.clearCookie('access_token', { httpOnly: true });
        return res.sendStatus(204);
    }

    const refreshToken = cookies.jwt;

    const findUserSql = `
        SELECT id FROM users WHERE refreshToken = ? LIMIT 1
    `;

    db.query(findUserSql, [refreshToken], (err, results) => {
        // Always clear cookies (logout must succeed regardless)
        res.clearCookie('jwt', { httpOnly: true });
        res.clearCookie('access_token', { httpOnly: true });

        if (err) {
            console.error('Database error:', err);
            return res.sendStatus(204);
        }

        if (results.length === 0) {
            return res.sendStatus(204);
        }

        const deleteTokenSql = `
            UPDATE users SET refreshToken = NULL WHERE refreshToken = ?
        `;

        db.query(deleteTokenSql, [refreshToken], (err) => {
            if (err) console.error('Failed to delete refresh token:', err);
            return res.sendStatus(204);
        });
    });
};
