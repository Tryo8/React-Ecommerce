import jwt from 'jsonwebtoken';


export const verifyJWT = (req, res, next) => {

    const cookieToken = req.cookies?.access_token;

    const authHeader = req.headers.authorization || req.headers.Authorization || req.headers['authorization'];
    if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    // const headerToken = req.headers.authorization?.startsWith("Bearer ")
    // ? req.headers.authorization.split(" ")[1]
    // : null;
    console.log("Auth header:", authHeader);

    const token = cookieToken || authHeader.split(' ')[1];
    // const token = cookieToken || headerToken;

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.sendStatus(403); //invalid token
            req.user = {
                id: decoded.id,
                user_uuid: decoded.user_uuid,
                username: decoded.username,
                email: decoded.email,
                address: decoded.address,
            };
            console.log("JWT error:", err);
            console.log("Decoded:'💛💛🧡❤❤", decoded);


            next();
        }
    );
};