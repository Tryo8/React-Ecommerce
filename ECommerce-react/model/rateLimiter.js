import { rateLimit } from 'express-rate-limit'

export const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 25,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
    message: { message: "Too many requests, try again later." }
	// ipv6Subnet: 56, // the less the more aggresive
});

export const registerLimiter = rateLimit({
	windowMs: 10 * 60 * 1000,  // 10 minutes
	limit: 35,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
    message: { message: "Too many requests, try again later." }
});


export const reportLimiter = rateLimit({
	windowMs: 10 * 60 * 1000,  // 10 minutes
	limit: 4,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
    message: { message: "Too many requests, try again later." }
});


export const addToWishListLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,  // 15 minutes
	limit: 30,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
    message: { message: "Too many requests, try again later." }
});


export const addReviewLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,  // 15 minutes
	limit: 30,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
    message: { message: "Too many requests, try again later." }
});

export const addToCartLimiter = rateLimit({
	windowMs: 5 * 60 * 1000,  // 5 minutes
	limit: 50,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
    message: { message: "Too many requests, try again later." }
});








