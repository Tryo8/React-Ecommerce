import { db  } from '../db.js';
import bcrypt from'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { isEmailValid } from '../utils/isEmailValid.js';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const registerController = async (req, res) => {
    const { username, address, email, pwd } = req.body;
    const DISALLOWED_USERNAMES = [
        "admin",
        "administrator",
        "root",
        "ceo",
        "support",
        "system",
        "null",
        "undefined",
        "owner",
        "nigga",
        "n-word",
        "fucker",
        "mod"
    ];
    if(!username || !address || !email || !pwd) { 
        return res.status(400).json({message:'All fields are required.'})
    }
    if (username.length > 38) return res.status(400).json({message: 'Username is too long'});
    else if (username.length < 4) return res.status(400).json({message: 'Username is too short'});
    else if (!USER_REGEX.test(username)) {
        return res.status(400).json({message: "Username must be 4-38 chars, start with letter"});
    }
    else if (DISALLOWED_USERNAMES.includes(username.toLowerCase())) {
        return res.status(400).json({ message: "This username is not allowed, please pick a different username"});
    }

    if (email.length > 159) return res.status(400).json({message: 'Email is too long'});
    else if (email.length < 5) return res.status(400).json({message: 'Email is too short'});
    else if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ message: "Invalid email format a typical email example@gmail.com" });
    } 
    const valid = await isEmailValid(email);
    if (!valid) {
        return res.status(400).json({ message: "Invalid or non-existent email" });
    }

    if (address.length > 68) return res.status(400).json({message: 'Address is too long'});
    else if (address.length < 5) return res.status(400).json({message: 'Address is too short'});

    if (pwd.length > 60) return res.status(400).json({message: 'Password is too long'});
    else if (pwd.length < 5) return res.status(400).json({message: 'Password is too short'});
    else if (!PWD_REGEX.test(pwd)) {
       return res.status(400).json({message: "Password must have uppercase, number, special char, 6-60 characters"});
    }
    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);    
        const newUser = {
            user_uuid: uuidv4(),
            username,
            address,
            email, 
            password: hashedPwd
        };
        const duplicate = `SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1`;
        db.query(duplicate, [username, email], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Database error', error: err });
            }
            if (results.length > 0) {
                return res.status(409).json({ message: 'Username or Email already exists' });
            }
  
            const insertSql = `INSERT INTO users SET ?`;
            db.query(insertSql, newUser, (err2, result2) => {
                if (err2) {
                    console.error(err2);
                    return res.status(500).json({ message: 'Database error', error: err2 });
                }
                res.status(201).json({ message: 'User created successfully', user_uuid: newUser.user_uuid});
                console.log(newUser)
            });
        });
    } 
    catch(err) {
        res.status(500).json({message: err.message})
    }
}