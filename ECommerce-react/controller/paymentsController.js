import express from 'express';
import { db } from '../db.js';
import { verifyJWT } from '../model/verifyJWT.js';
import { encode } from "@msgpack/msgpack";


const router = express.Router();



router.get("/get-payments", verifyJWT, (req, res) => {
    const user_uuid = req.user.user_uuid;

    if(!user_uuid) return res.status(401);
    const sql = ` SELECT * FROM transactions WHERE user_uuid = ?  `;
    db.query(sql,[user_uuid], (err, result) => {

        if(err) {
            res.status(500).json({message:'Error fetching transactions', err});
        };
 
        const buffer = encode(result || []);
        res.setHeader("Content-Type", "application/msgpack");
        return res.send(buffer); 
    });
});

router.delete("/delete-transaction/:id",verifyJWT, (req, res) => {
    const { id } = req.params;
    const  user_uuid  = req.user?.user_uuid;

    if(!id) return res.status(400).json({message: 'Product id is required'});

    const sql = ` DELETE FROM transactions WHERE id = ? AND user_uuid = ?`;
    
    db.query(sql, [id, user_uuid], (err, result) => {
        if(err) {
            res.status(500).json({message:'Server Error', err});
        };
        return res.status(204).json({ message: 'Removed successfully'});
    });
});
export default router