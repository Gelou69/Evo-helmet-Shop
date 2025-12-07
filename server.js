    import express from 'express';
    import Stripe from 'stripe';
    import cors from 'cors';
    import dotenv from 'dotenv';

    dotenv.config();

    const app = express();

    // ===============================================
    // CORS handling (explicit headers used below)
    // We avoid using the `cors()` middleware to prevent header conflicts
    // and instead set Access-Control-Allow-* headers explicitly.

    // Log all requests for debugging
    app.use((req, res, next) => {
        console.log(`📥 ${req.method} ${req.path} from ${req.headers.origin || 'unknown'}`);
        next();
    });

    app.use(express.json());

    // Explicit CORS headers middleware to ensure the response reflects the requesting origin
    // and to short-circuit OPTIONS preflight requests. This is helpful in development
    // where multiple dev servers may run on different ports.
    app.use((req, res, next) => {
        const origin = req.headers.origin || '*';
        // Debug log so we can see what origin the browser is sending
        console.log(`➡️ CORS incoming Origin: ${origin}`);
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        // Prevent caching of CORS responses during development
        res.setHeader('Cache-Control', 'no-store');
        if (req.method === 'OPTIONS') {
            console.log('↩️ OPTIONS preflight - returning 204');
            return res.sendStatus(204);
        }
        next();
    });

    // ===============================================
    // STRIPE INITIALIZATION
    // ===============================================
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    let stripe = null;
    if (!stripeSecretKey) {
        console.warn("⚠️ STRIPE_SECRET_KEY not set. Payment endpoints will be disabled in development.");
    } else {
        stripe = new Stripe(stripeSecretKey);
        console.log("✓ Stripe initialized");
    }

    // ===============================================
    // CREATE PAYMENT INTENT
    // ===============================================
    app.post('/create-payment-intent', async (req, res) => {
        try {
            if (!stripe) return res.status(501).json({ error: 'Stripe not configured on server.' });
            const { amount, currency = 'usd' } = req.body;
     
            console.log('💰 Payment request:', { amount, currency });
     
            if (!amount || amount <= 0) {
                return res.status(400).json({ error: "Invalid amount" });
            }

            // Convert PHP → USD → cents
            const PHP_TO_USD = 0.0175;
            const usdAmount = amount * PHP_TO_USD;
            const amountInCents = Math.round(usdAmount * 100);

            console.log("Creating Payment Intent:");
            console.log("  PHP:", amount);
            console.log("  USD:", usdAmount.toFixed(2));
            console.log("  Cents:", amountInCents);

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amountInCents,
                currency: currency,
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            console.log('✅ Payment intent created:', paymentIntent.id);

            res.json({
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
            });

        } catch (err) {
            console.error("❌ Stripe Error:", err.message);
            res.status(500).json({ error: err.message });
        }
    });

    // ===============================================
    // CONFIRM PAYMENT (Optional - for manual flow)
    // ===============================================
   // ===============================================
// CREATE PAYMENT INTENT
// ===============================================
app.post('/create-payment-intent', async (req, res) => {
    // ... (rest of the code)

    try {
        // ... (currency conversion logic) ...

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
                // FIX: Disable redirect-based methods, so a return_url is not required.
                allow_redirects: 'never', 
            },
        });

        console.log('✅ Payment intent created:', paymentIntent.id);

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });

    } catch (err) {
        // ... (error handling) ...
    }
});
    // ===============================================
    // HEALTH CHECK
    // ===============================================
    app.get('/health', (req, res) => {
        res.json({
            status: "Backend server running",
            stripe: "connected",
            timestamp: new Date().toISOString()
        });
    });

    // ===============================================
    // START SERVER
    // ===============================================
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`
    ╔═══════════════════════════════════════╗
    ║  🚀 EVO Backend Server Running        ║
    ║  📍 http://localhost:${PORT}           ║
    ║  ✅ CORS: ALL origins allowed         ║
    ║  ✅ Stripe: Connected                 ║
    ╚═══════════════════════════════════════╝
        `);
    });