import { db  } from '../db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


export const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(403); // if cookies true THEN if there's a jwt prop
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    

    try {
        const sql = `SELECT id, user_uuid, username, address, email FROM users WHERE refreshToken  = ? LIMIT 1 `;
        db.query(sql, [refreshToken],  (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Database error' });
            };

            if (results.length === 0) return res.sendStatus(403); // user not found
            const user = results[0];
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
                (err, decoded) => {
                    if(err) return res.sendStatus(403);

                    const accessToken = jwt.sign(
                        {"username": decoded.username,  "user_uuid": user.user_uuid, "address": user.address, 
                            "id": user.id},
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '30s' }
                    );
                    console.log('ACCESS TOKEN BRO', accessToken)
                    return res.json({ accessToken  ,user:user.username, user_uuid: user.user_uuid, address: user.address, id: user.id })

                }
            )       
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    };
};
