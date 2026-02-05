import express from 'express';
import { db } from '../db.js';
import { verifyJWT } from '../model/verifyJWT.js';
import { encode } from "@msgpack/msgpack";
import { addReviewLimiter, addToCartLimiter, addToWishListLimiter, reportLimiter } from '../model/rateLimiter.js';


const router = express.Router();


router.get("/get-products", (req, res) => {
    const sql = ` SELECT * FROM products `;
    db.query(sql, (err, result) => {
        if(err) {
            res.status(500).json({message:'Error fetching products', err});
        };
 
        return res.status(200).json(result || []);
    });
});

router.get("/get-categories", (req, res) => {
    const sql = ` SELECT DISTINCT category FROM products `;
    db.query(sql, (err, result) => {
        if(err) {
            res.status(500).json({message:'Error fetching categories', err});
        };
        return res.status(200).json(result);
    });
});

router.get("/get-products-by-category/:category", (req, res) => {
    const { category } = req.params;

    if(!category) return res.status(400).json({message: 'Category is required'});

    const sql = ` SELECT * FROM products WHERE category = ?`;
    
    db.query(sql,[category], (err, result) => {
        if(err) {
            res.status(500).json({message:'Error fetching Category', err});
        };
        if (result.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json(result);
    });
});


router.get("/get-product/:uuid", (req, res) => {
    const { uuid } = req.params;

    if(!uuid) return res.status(400).json({message: 'Product uuid is required'});

    const sql = ` SELECT * FROM products WHERE product_uuid = ? `;
    db.query(sql,[uuid], (err, result) => {
        if(err) {
            res.status(500).json({message:'Error fetching product', err});
        };
        if (result.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(result[0]);
    });
});

router.get("/get-product-by-id/:product_id", (req, res) => {
    const { product_id } = req.params;

    if(!product_id) return res.status(400).json({message: 'Product product_id is required'});

    const sql = ` SELECT * FROM products WHERE product_id = ? `;
    db.query(sql,[product_id], (err, result) => {
        if(err) {
            res.status(500).json({message:'Error fetching product', err});
        };
        if (result.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(result[0]);
    });
});
// [POST]
router.post("/add-to-cart/:product_id",verifyJWT, addToCartLimiter, (req, res) => {
    const { product_id } = req.params;
    const user_id  = req.user.id  // req.user.id;
   
    if(!user_id) return res.status(400).json({ message: 'User is missing '});

    if(!product_id) return res.status(400).json({message: 'Product is missing'});
  

    const sql = ` INSERT INTO cart (user_id, product_id) VALUES ( ?, ?) `;
    db.query(sql,[user_id,product_id], (err, result) => {
        if(err) {
            res.status(500).json({message:'Error adding to cart', err});
        };
        return res.status(200).json({ message: 'Added product to cart successfully'});
    });
});
// [POST]
router.post("/add-to-wish-list/:product_id",verifyJWT, addToWishListLimiter, (req, res) => {
    const { product_id } = req.params;
    const user_id  = req.user.id  // req.user.id;
   
    if(!user_id) return res.status(400).json({ message: 'User is missing '});

    if(!product_id) return res.status(400).json({message: 'Product is missing'});
  

    const sql = ` INSERT INTO wish_list (user_id, product_id) VALUES ( ?, ?) `;
    db.query(sql,[user_id, product_id], (err, result) => {
        if(err) {
            return res.status(500).json({message:'Error adding to withlist, Try again later', err});
        };
        return res.status(200).json({ message: 'Added product to cart successfully'});
    });
});

router.delete("/remove-wish-list-item/:product_id",verifyJWT, (req, res) => {
    const { product_id } = req.params;
    const  user_id  = req.user?.id;

    if(!product_id) return res.status(400).json({message: 'Product id is required'});

    const sql = ` DELETE FROM wish_list WHERE product_id = ? AND user_id = ?`;
    
    db.query(sql, [product_id, user_id], (err, result) => {
        if(err) {
            res.status(500).json({message:'Error fetching user', err});
        };
        return res.status(204).json({ message: 'Removed from cart successfully'});
    });
});

router.get("/get-cart-items/:user_id", (req, res) => {
    const { user_id } = req.params;

    if(!user_id) return res.status(400).json({message: 'User id is required'});

    const sql = ` 
    SELECT c.id AS cart_id,
    c.created_at,
    p.product_id,
    p.name,
    p.price,
    p.product_img,
    c.quantity,
    p.description,
    p.product_discount
    FROM cart c
    JOIN products p ON c.product_id = p.product_id
    WHERE c.user_id = ?
    `;
    db.query(sql, [user_id], (err, result) => {
        if(err) {
            res.status(500).json({message:'Error fetching user', err});
        };
        return res.status(200).json(result || []);
    });
});

router.delete("/remove-cart-item/:product_id",verifyJWT, (req, res) => {
    const { product_id } = req.params;
    const user_id = req.user.id;

    if(!product_id || !user_id) return res.status(400).json({message: 'Product and user are required'});

    const sql = ` DELETE FROM cart WHERE product_id = ? AND user_id = ?`;

    db.query(sql, [product_id, user_id], (err, result) => {
        if(err) {
            res.status(500).json({message:'Error removing cart items', err});
        };
        return res.status(204).json({ message: 'Removed from cart successfully'});
    });
}); 

router.delete("/remove-all-cart-items",verifyJWT, (req, res) => {
    const user_id  = req.user?.id;

    if(!user_id) return res.status(400).json({message: 'Product id is required'});
    const sql = ` DELETE FROM cart WHERE user_id = ?`;

    db.query(sql, [user_id], (err, result) => {
        if(err) {
            res.status(500).json({message:'Error removing cart items', err});
        };
        return res.status(204).json({ message: 'Removed from cart successfully'});
    });
});





router.get('/search-products', (req, res) => {
    const query = req.query.q; 
    if (!query) return res.status(400).json({ message: "Query is required" });

    const sql =  `SELECT * FROM products WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ? 
    OR LOWER(category) LIKE ?`;
    const searchTerm = `%${query.toLowerCase()}%`;
    db.query(sql, [searchTerm,searchTerm,searchTerm], (err, result) => {
        if(err) {
            res.status(500).json({message:'Error fetching products', err});
        };
        return res.status(200).json(result || []);
    });
});

router.get('/filter-price/:category', (req, res) => {
    const price = Number(req.query.q);
    if (isNaN(price)) {
        return res.status(400).json({ message: "Price must be a number" });
    }

    const sql = `SELECT * FROM products WHERE price >= ? AND LOWER(category) LIKE ?  `;
    db.query(sql, [price], (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", err });
        res.json(result);
    });
});


// REVIEWS

router.get("/get-product-reviews/:product_id", (req, res) => {
   const { product_id } = req.params;

    const sql = `
        SELECT r.review_id, r.review_uuid,r.product_id, r.rating, r.comment, r.created_at,
            u.username,
            u.user_img,
            u.id,
            u.user_uuid,
            u.avatar
        FROM product_reviews r
        JOIN users u ON u.id = r.user_id
        WHERE r.product_id = ?
        ORDER BY r.created_at DESC
    `;

    db.query(sql, [product_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to load reviews" });
        }
        res.json(results);
    });
});

// [POST]
router.post("/add-review/:product_id",verifyJWT, addReviewLimiter, (req, res) => {
    const { product_id } = req.params;
    const user_id  = req.user.id  // req.user.id;
    const { rating, comment } = req.body;
    
    if(!user_id) return res.status(400).json({ message: 'User is missing '});

    if(!product_id) return res.status(400).json({message: 'Product is missing'});
    if(!rating || !comment) return res.status(400).json({message: 'Please fill all the feilds'});

    const sql = `
        INSERT INTO product_reviews (user_id, product_id, rating, comment)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            rating = VALUES(rating),
            comment = VALUES(comment),
            updated_at = NOW()
    `;
    db.query(sql,[user_id, product_id, rating, comment], (err, result) => {
        if(err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "You already added review to this product"
                });
            }
            return res.status(500).json({message:'Error adding to review', err});
        };
        return res.status(200).json({ message: 'Added review successfully'});
    });
});

router.get("/get-product-review/:productId/:userId", (req, res) => {
  const { productId, userId } = req.params;

  const sql = `
    SELECT 
      r.review_id,
      r.review_uuid,
      r.rating,
      r.comment,
      r.created_at,
      u.username,
      u.user_img,
      u.id AS user_id,
      u.user_uuid,
      u.avatar
    FROM product_reviews r
    JOIN users u ON u.id = r.user_id
    WHERE r.product_id = ?
      AND r.user_id = ?
    LIMIT 1
  `;

  db.query(sql, [productId, userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to load review" });
    }

    res.json(results[0] || null); // 👈 single review or null
  });
});


router.delete("/delete-review/:product_id/:review_id/:user_id", (req, res) => {
    const { product_id, review_id,user_id } = req.params;

    if(!user_id) return res.status(400).json({message: 'User is required'});
    if(!product_id) return res.status(400).json({message: 'Product is required'});
    if(!review_id) return res.status(400).json({message: 'Could not find review'});

    const sql = ` DELETE FROM product_reviews WHERE product_id = ? AND review_id = ? AND user_id = ? `;

    db.query(sql, [product_id, review_id, user_id], (err, result) => {
        if(err) {
            res.status(500).json({message:'Error occured', err});
        };
        if(result.affectedRows === 0)return res.status(404).json({ message: 'Review not found' });

        return res.status(200).json({ message: 'Removed review successfully'});
    });
});



// REPORT
// [POST]
router.post("/report-review/:review_uuid",reportLimiter, (req, res) => {
    const { review_uuid } = req.params;
    const { user_id, report } = req.body;
    const { reason, comment } = report || {};

    if (!user_id || !report) {
        return res.status(400).json({ message: "Something is missing" });
    }

    if (!reason || !comment) {
        return res.status(400).json({ message: "Pleae  select a reason and add comment" });
    }

    const sql = `
        INSERT INTO reports (user_id, review_uuid, reason, comment)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [user_id, review_uuid, reason, comment ?? null], (err) => {
        if (err) {
        console.error(err.sqlMessage);
        return res.status(500).json({ message: "Error occurred", err });
        }
        res.status(200).json({ message: "Report submitted successfully" });
    });
});


// ORDERS
router.get("/get-orders/:user_id", (req, res) => {
    const { user_id } = req.params;
    if(!user_id) return res.status(400).json({message:"User is missing"});

    const sql = ` 
        SELECT 
        o.order_id,
        o.status,
        o.quantity,
        o.created_at,
        p.product_id,

        p.name,
        p.price,
        p.description,
        p.category,
        p.product_img,

        pr.rating AS user_rating,
        pr.comment AS user_comment


        FROM orders o
        JOIN products p ON o.product_id = p.product_id

        LEFT JOIN product_reviews pr 
            ON pr.product_id = p.product_id 
            AND pr.user_id = o.user_id  

        WHERE o.user_id = ?
        ORDER BY o.created_at DESC`;
    db.query(sql,[user_id], (err, result) => {
        if(err) {
            res.status(500).json({message:'Error fetching orders', err});
        };
 
        return res.status(200).json(result || []);
    });
});
// [POST]
router.post("/checkout-success", verifyJWT, (req, res) => {
    const user_id = req.user?.id;
    if (!user_id) return res.status(400).json({ message: "User missing" });

    const insertOrdersSql = `
        INSERT INTO orders (user_id, product_id,quantity, status)
        SELECT user_id, product_id,quantity, 'pending'
        FROM cart
        WHERE user_id = ?
    `;

    db.query(insertOrdersSql, [user_id], (err) => {
        if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error creating orders",err });
        }

        const clearCartSql = `DELETE FROM cart WHERE user_id = ?`;
        db.query(clearCartSql, [user_id], (err2) => {
        if (err2) {
            console.error(err2);
            return res.status(500).json({ message: "Order created but cart not cleared" });
        }

        res.status(200).json({ message: "Order placed successfully 🎉" });
        });
    });
});

router.patch("/delivered/:product_id",verifyJWT, async (req, res) => {
    const { product_id } = req.params;
    const user_id = req.user.id;

    if (!product_id || !user_id) return res.status(400).json({message:"Product or user is missing"})
      
    db.query( 
        "UPDATE orders SET status = 'delivered' WHERE product_id = ? AND user_id = ?",
        [product_id, user_id]
    );

    res.status(200).json({ message: "Order delivered" });
});

router.delete("/delete-order/:order_id",verifyJWT, (req, res) => {
    const { order_id } = req.params;
    const user_id  = req.user?.id;

    if(!user_id || !order_id) return res.status(400).json({message: 'Order and user are required'});
    const sql = ` DELETE FROM orders WHERE user_id = ? AND order_id = ?`;

    db.query(sql, [user_id, order_id], (err, result) => {
        if(err) {
            res.status(500).json({message:'Error removing corder', err});
        };
        return res.status(204).json({ message: 'Removed order successfully'});
    });
});



// CART ITEM QUANTITY


// Increase quantity
// [UPDATE]
router.patch("/increase-quantity/:product_id",verifyJWT, async (req, res) => {
    const { product_id } = req.params;
    const user_id = req.user.id;

    if (!product_id || !user_id) return res.status(400).json({message:"Product or user is missing"})
    db.query(
        "UPDATE cart SET quantity = quantity + 1 WHERE product_id = ? AND user_id = ?  AND quantity < 50",
        [product_id, user_id]
    );

    res.status(200).json({ message: "Quantity increased" });
});


// Decrease quantity
// [UPDATE]
router.patch("/decrease-quantity/:product_id",verifyJWT, async (req, res) => {
    const { product_id } = req.params;
    const user_id = req.user.id;

    if (!product_id || !user_id) return res.status(400).json({message:"Product or user is missing"})
      
    db.query( 
        "UPDATE cart SET quantity = quantity - 1 WHERE product_id = ? AND user_id = ? AND quantity > 1",
        [product_id, user_id]
    );

    res.status(200).json({ message: "Quantity decreased" });
});


export default router