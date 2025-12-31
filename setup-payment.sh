#!/bin/bash

# CloseBuy Payment Integration Setup Script
# Run this after completing the integration

echo "🚀 Setting up CloseBuy Payment Integration..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must run this script from the closebuy directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install react-native-paystack-webview

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Backend API URL
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Paystack Public Key (Get from https://dashboard.paystack.com)
EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx

# Note: NEVER put secret keys here!
# Secret keys should ONLY be in the backend (.env)
EOF
    echo "✅ Created .env file - Please update with your actual keys"
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env with your actual API URL and Paystack public key"
echo "2. Ensure backend (HMB) is running with correct environment variables"
echo "3. Run: npm start"
echo "4. Test the complete checkout flow"
echo ""
echo "📚 For detailed instructions, see: CHECKOUT_INTEGRATION_GUIDE.md"
echo ""

