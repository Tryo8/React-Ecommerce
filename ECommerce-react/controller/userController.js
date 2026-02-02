import express from 'express';
import { db } from '../db.js';
import { verifyJWT } from '../model/verifyJWT.js';
import { encode } from "@msgpack/msgpack";

const router = express.Router();


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


// router.get("/get-user/:uuid",verifyJWT, (req, res) => {
//   const { uuid } = req.params;

//   if(!uuid) return res.status(400).json({message: 'User uuid required'});

//   const sql = ` SELECT username, id, user_uuid, user_img, email, address, country, avatar created_at FROM users WHERE user_uuid = ? `;
//   db.query(sql,[uuid], (err, result) => {
//       if(err) {
//           res.status(500).json({message:'Error fetching user', err});
//       };
//       if (result.length === 0) {
//           return res.status(404).json({ message: "User not found" });
//       }
//       return res.status(200).json(result[0]);
//   });
// });

router.get("/get-current-user",verifyJWT, (req, res) => {
  const userUUID = req.user.user_uuid;
  
  if(!userUUID) return res.status(400).json({message: 'User uuid required'});
  const sql = ` SELECT username, id, user_uuid, user_img, email, address, country, avatar, created_at FROM users WHERE user_uuid = ? `;
  db.query(sql,[userUUID], (err, result) => {
    if(err) {
      res.status(500).json({message:'Error fetching user', err});
    };
    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const buffer = encode(result[0]);
    res.setHeader("Content-Type", "application/msgpack");
    return res.send(buffer); // sends binary
    // return res.status(200).json(result[0]);
  });
});

router.get("/get-user/:user_uuid", (req, res) => {
  const {user_uuid} = req.params;
  
  if(!user_uuid) return res.status(400).json({message: 'User uuid required'});
  const sql = ` SELECT username, id, user_uuid, user_img, email, address, country, avatar, created_at FROM users WHERE user_uuid = ? `;
  db.query(sql,[user_uuid], (err, result) => {
    if(err) {
      res.status(500).json({message:'Error fetching user', err});
    };
    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(result[0]);
  });
});

router.get("/get-wish-list", verifyJWT, (req, res) => {
  const userUUID = req.user.user_uuid;
  
  if(!userUUID) return res.status(400).json({message: 'User uuid required'});
  const sql = `
    SELECT 
      w.id AS wishlist_id,
      w.created_at AS added_at,
      p.product_id,
      p.product_uuid,
      p.name,
      p.price,
      p.product_img,
      p.description,
      p.category,
      p.product_discount,
      p.status
    FROM wish_list w
    JOIN users u ON u.id = w.user_id
    JOIN products p ON p.product_id = w.product_id
    WHERE u.user_uuid = ?
  `;

  db.query(sql,[userUUID], (err, result) => {
    if(err) {
      res.status(500).json({message:'Error fetching user', err});
    };
   
    return res.status(200).json(result || []);
  });
});

router.put("/update-current-user",verifyJWT, async (req, res) => {
  const userUUID = req.user.user_uuid;
  const { username, email,address, country } = req.body;


  if(!username || !email || !address || !country){
    return res.status(400).json({ message: "Username, email and address are required"});
  } 
  if(username.length > 100) {
    return res.status(400).json({ message: "Username is too long"});
  }
  if(username.length < 3) {
    return res.status(400).json({ message: "Username is too short"});
  }
  if (DISALLOWED_USERNAMES.includes(username.toLowerCase())) {
    return res.status(400).json({ message: "This username is not allowed, please pick different one"});
  }

  const sql =`UPDATE users SET username = ?, email = ? ,address = ?, country = ?  WHERE user_uuid = ?`

  await db.execute(sql,[username, email, address, country, userUUID]);

  res.json({ message: "Updated successfully" });
});


router.post("/add-user-location", verifyJWT, async (req, res) => {
  const user_id = req.user.id;
  const {
    latitude,
    longitude,
    country = null,
    city = null,
    house_number = null,
    city_district = null,
    state = null,
    postcode = null,
    house_name = null,
    road = null,
    label = null,
    suburb = null,
    neighbourhood = null
  } = req.body;


  if (latitude == null || longitude == null) {
    return res.status(400).json({ message: "Latitude and longitude are required" });
  }

  if (Number.isNaN(latitude) || Number.isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return res.status(400).json({ message: "Invalid location" });
  }
  if (!state || !country) {
    return res.status(400).json({ message: "Country or state are missing" });
  }


  try{
    const sql = `
      INSERT INTO user_locations
      (user_id, latitude, longitude, country, city, house_number, city_district, state, postcode, house_name, road, label,suburb,neighbourhood)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      latitude = VALUES(latitude),
      longitude = VALUES(longitude),
      country = VALUES(country),
      city = VALUES(city),
      house_number = VALUES(house_number),
      city_district = VALUES(city_district),
      state = VALUES(state),
      postcode = VALUES(postcode),
      house_name = VALUES(house_name),
      road = VALUES(road),
      label = VALUES(label),
      suburb = VALUES(suburb),
      neighbourhood = VALUES(neighbourhood)
    `;
    
    await db.execute(sql, [
      user_id,
      latitude,
      longitude,
      country,
      city,
      house_number,
      city_district,
      state,
      postcode,
      house_name,
      road,
      label,
      suburb, neighbourhood
    ]);

    res.json({ message: "Location saved successfully" });
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "User already has a saved location"
      });
    }
    res.status(500).json({ message: "Database error", err });
  }
});

router.get("/get-location",verifyJWT, (req, res) => {
  const user_id = req.user.id;
  
  if(!user_id) return res.status(400).json({message: 'User required'});
  const sql = ` SELECT * FROM user_locations WHERE user_id = ? `;
  db.query(sql,[user_id], (err, result) => {
    if(err) {
      res.status(500).json({message:'Error fetching user', err});
    };
    if (result.length === 0) {
      return res.status(404).json({ message: "location not found" });
    }

    return res.status(200).json(result[0]);
  });
});






export default router