# Razorpay Payment Gateway Setup Guide

## ✅ Razorpay Integration Complete!

Your wallet now uses **Razorpay** for secure payments with **UPI support**.

---

## 🔧 Setup Steps

### 1. Create Razorpay Account

1. Go to [https://razorpay.com/](https://razorpay.com/)
2. Click **Sign Up** and create an account
3. Complete KYC verification (required for live mode)

### 2. Get API Keys

#### For Testing (Test Mode):

1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to **Settings** → **API Keys**
3. Click **Generate Test Keys**
4. Copy your **Key ID** (starts with `rzp_test_`)

#### For Production (Live Mode):

1. Complete KYC verification
2. Go to **Settings** → **API Keys**
3. Click **Generate Live Keys**
4. Copy your **Key ID** (starts with `rzp_live_`)

### 3. Add API Key to Your App

Open `src/components/Wallet.jsx` and replace line 72:

```javascript
key: 'rzp_test_YOUR_KEY_ID', // Replace with your actual Key ID
```

**Example:**

```javascript
key: 'rzp_test_1234567890abcd',
```

---

## 💳 Supported Payment Methods

Razorpay automatically supports:

- ✅ **UPI** (Google Pay, PhonePe, Paytm, BHIM)
- ✅ **Credit/Debit Cards** (Visa, Mastercard, RuPay, Amex)
- ✅ **Net Banking** (All major banks)
- ✅ **Wallets** (Paytm, PhonePe, MobiKwik, etc.)
- ✅ **EMI Options**

Users can choose any method at checkout!

---

## 🧪 Testing with Test Mode

### Test Mode Features:

- No real money is charged
- Use test credentials to simulate payments
- All payment methods available for testing

### Test UPI Credentials:

- **UPI ID**: `success@razorpay`
- **Status**: Payment will succeed

### Test Card:

- **Card Number**: `4111 1111 1111 1111`
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **Status**: Payment will succeed

### More Test Credentials:

Visit: [Razorpay Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)

---

## 🔄 Payment Flow

1. **User clicks "Add Money"**
2. **Enters amount** (₹100, ₹500, ₹1000, ₹2000 quick options)
3. **Razorpay checkout opens** with all payment options
4. **User pays** via UPI/Card/Net Banking
5. **On success:**
   - Wallet balance updated in Firebase
   - Transaction recorded with Razorpay payment ID
6. **On failure/cancel:**
   - Alert shown, wallet unchanged

---

## 🚀 Going Live

### Before Activating Live Mode:

1. ✅ Complete KYC verification
2. ✅ Add business details
3. ✅ Set up settlement account (where money goes)
4. ✅ Replace test key with live key
5. ✅ Test thoroughly in test mode first

### Razorpay Fees:

- **2%** per transaction (standard pricing)
- No setup fees
- No annual maintenance fees

---

## 🔒 Security Features

- ✅ PCI DSS compliant
- ✅ 256-bit SSL encryption
- ✅ 3D Secure authentication
- ✅ Automatic fraud detection
- ✅ No card details stored on your server

---

## 📱 How It Works for Users

1. Click "Wallet" button in navigation
2. Click "Add Money"
3. Enter amount or select quick amount (₹100-₹2000)
4. Click "Pay via Razorpay"
5. **Razorpay popup opens** with payment options:
   - Scan UPI QR code
   - Enter UPI ID
   - Pay with card
   - Net banking
6. Complete payment
7. Wallet balance updates instantly!

---

## 🐛 Troubleshooting

### Razorpay not loading?

- Check internet connection
- Verify Key ID is correct
- Check browser console for errors

### Payment successful but wallet not updated?

- Check Firebase rules allow wallet updates
- Check console for Firestore errors
- Verify transaction recorded in Firebase

### Test mode not working?

- Ensure using test key (starts with `rzp_test_`)
- Use test credentials from Razorpay docs
- Clear browser cache

---

## 📚 Additional Resources

- [Razorpay Docs](https://razorpay.com/docs/)
- [Payment Methods](https://razorpay.com/payment-methods/)
- [Checkout Options](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/)
- [Support](https://razorpay.com/support/)

---

## 💡 Current Implementation

**Currency**: Indian Rupee (₹)
**Quick Amounts**: ₹100, ₹500, ₹1000, ₹2000
**Payment Gateway**: Razorpay Checkout (Standard)
**Integration Type**: Client-side (Web)

---

## ✨ Next Steps

1. Get Razorpay Key ID
2. Replace in `Wallet.jsx` line 72
3. Test with test credentials
4. Complete KYC for live mode
5. Switch to live key when ready!

---

**Note**: Always start with test mode and switch to live mode only after thorough testing!
