import { db  } from '../db.js';
import bcrypt from'bcrypt';
import jwt from 'jsonwebtoken';



export const handleLogin = async (req, res) => {
    const { email, pwd } = req.body;

    if (!email || !pwd) {
        return res.status(400).json({
            message: 'Email and password are required.'
        });
    }

    if (email.length > 28) return res.status(400).json({message: 'email is too long'});
    else if (email.length < 3) return res.status(400).json({message: 'email is too short'});

    try {
        const sql = `SELECT id, user_uuid, username, email, password FROM users WHERE email = ? LIMIT 1 `;
        db.query(sql, [ email], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Database error' });
            };

            if (results.length === 0) return res.status(401).json({message: 'Sorry,but we couldn\'t find you'}) // user not found
            
            const user = results[0];
            const match = await bcrypt.compare(pwd, user.password);
            if (!match) {
                return res.status(401).json({message: 'Invalid email or password'}) // wrong password
            };
            const accessToken = jwt.sign(
                {"username": user.username, "address": user.address, "id": user.id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            const refreshToken = jwt.sign(
                {"username": user.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            const sqlUpdate = `UPDATE users SET refreshToken = ? WHERE id = ?`;
            db.query(sqlUpdate, [refreshToken, user.id], (err) => {
                if (err) console.error('Failed to store refresh token:', err);
            });
            const otherUsers = `SELECT id, user_uuid, username, email FROM users WHERE username != ?`;
            db.query(otherUsers,[user.id],(err, otherUsers) => {
                if (err) return res.status(500).json({ message: "Database error" });
                
                res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000}); // 1 day
                res.json({
                    message: `User ${user.email} logged in`,
                    user_uuid: user.user_uuid,
                    accessToken,
                    id: user.id,
                    otherUsers
                });
            });
           
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    };
};
