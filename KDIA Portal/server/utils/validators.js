/**
 * Input Validation Schemas — Zod
 *
 * Reusable validators for future integration into routes.
 * These schemas do NOT modify any existing route behavior.
 * They are available as a utility for future hardening work.
 *
 * Usage example:
 *   const { loginSchema } = require('../utils/validators');
 *   const result = loginSchema.safeParse(req.body);
 *   if (!result.success) return res.status(400).json({ success: false, message: result.error.errors[0].message });
 */

const { z } = require('zod');

// ─── Login ───────────────────────────────────────────────────────────────────
const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email is required.' })
        .email({ message: 'Please provide a valid email address.' })
        .trim()
        .toLowerCase(),
    password: z
        .string({ required_error: 'Password is required.' })
        .min(1, { message: 'Password cannot be empty.' }),
});

// ─── Register ─────────────────────────────────────────────────────────────────
const registerSchema = z.object({
    name: z
        .string({ required_error: 'Name is required.' })
        .min(2, { message: 'Name must be at least 2 characters.' })
        .max(100, { message: 'Name must be at most 100 characters.' })
        .trim(),
    email: z
        .string({ required_error: 'Email is required.' })
        .email({ message: 'Please provide a valid email address.' })
        .trim()
        .toLowerCase(),
    password: z
        .string({ required_error: 'Password is required.' })
        .min(8, { message: 'Password must be at least 8 characters.' })
        .max(128, { message: 'Password must be at most 128 characters.' }),
});

// ─── Support Ticket ───────────────────────────────────────────────────────────
const supportTicketSchema = z.object({
    subject: z
        .string({ required_error: 'Subject is required.' })
        .min(5, { message: 'Subject must be at least 5 characters.' })
        .max(200, { message: 'Subject must be at most 200 characters.' })
        .trim(),
    message: z
        .string({ required_error: 'Message is required.' })
        .min(10, { message: 'Message must be at least 10 characters.' })
        .max(5000, { message: 'Message must be at most 5000 characters.' })
        .trim(),
    category: z
        .enum(['billing', 'technical', 'general', 'other'], {
            errorMap: () => ({ message: 'Category must be one of: billing, technical, general, other.' }),
        })
        .optional(),
});

module.exports = {
    loginSchema,
    registerSchema,
    supportTicketSchema,
};
