const express = require('express');
const { MongoClient } = require('mongodb');
const { Checkout } = require('checkout-sdk-node');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Initialize Checkout.com SDK and MongoDB
const cko = new Checkout(process.env.CHECKOUT_SECRET_KEY);
const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectToDB() {
    await client.connect();
    db = client.db('subscriptionsDB');
    console.log('Connected to MongoDB');
}
connectToDB().catch(console.error);

// Webhook Endpoint to Handle Events
app.post('/webhook', express.json(), async (req, res) => {
    const event = req.body;

    try {
        switch (event.type) {
            case 'payment_captured':
                // Handle successful payment
                await db.collection('subscriptions').updateOne(
                    { subscription_id: event.data.subscription_id },
                    { $set: { status: 'active', lastPaymentDate: new Date() } }
                );
                console.log('Payment captured:', event.data);
                break;

            case 'payment_declined':
            case 'payment_failed':
                // Handle failed payment
                await db.collection('subscriptions').updateOne(
                    { subscription_id: event.data.subscription_id },
                    { $set: { status: 'payment_failed' } }
                );
                console.log('Payment failed:', event.data);
                break;

            case 'subscription_cancelled':
                // Handle subscription cancellation
                await db.collection('subscriptions').updateOne(
                    { subscription_id: event.data.subscription_id },
                    { $set: { status: 'cancelled' } }
                );
                console.log('Subscription cancelled:', event.data);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        // Acknowledge receipt of the event
        res.status(200).send('Event received');
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(400).send('Error handling event');
    }
});

// Create Subscription and Make Initial Payment (Existing Endpoint)
app.post('/create-subscription', async (req, res) => {
    try {
        const { cardToken, email, name } = req.body;

        const customer = await cko.customers.create({ email, name });

        const payment = await cko.payments.request({
            source: { token: cardToken },
            customer: { id: customer.id },
            amount: 1000,
            currency: 'USD',
            capture: true,
            reference: 'subscription-initial-payment',
            recurring: { type: 'first' },
        });

        if (payment.approved) {
            const subscription = await cko.subscriptions.create({
                plan_id: 'your_plan_id',
                customer: { id: customer.id },
                source: { token: cardToken },
                billing: {
                    recurring: {
                        interval: 'monthly',
                        interval_count: 1,
                    },
                },
            });

            await db.collection('subscriptions').insertOne({
                customer_id: customer.id,
                plan_id: 'your_plan_id',
                subscription_id: subscription.id,
                payment_source_token: cardToken,
                status: 'active',
                createdAt: new Date(),
            });

            res.status(201).json({ message: 'Subscription created and payment processed successfully', subscription });
        } else {
            res.status(400).json({ message: 'Payment failed', payment });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start the Express server
const PORT = process.env.PORT || 3019;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
