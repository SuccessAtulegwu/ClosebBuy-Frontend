# CloseBuy Payment Integration Setup Script
# Run this after completing the integration

Write-Host "🚀 Setting up CloseBuy Payment Integration..." -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Must run this script from the closebuy directory" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install react-native-paystack-webview

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    @"
# Backend API URL
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Paystack Public Key (Get from https://dashboard.paystack.com)
EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx

# Note: NEVER put secret keys here!
# Secret keys should ONLY be in the backend (.env)
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Created .env file - Please update with your actual keys" -ForegroundColor Green
} else {
    Write-Host "ℹ️  .env file already exists" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Update .env with your actual API URL and Paystack public key"
Write-Host "2. Ensure backend (HMB) is running with correct environment variables"
Write-Host "3. Run: npm start"
Write-Host "4. Test the complete checkout flow"
Write-Host ""
Write-Host "📚 For detailed instructions, see: CHECKOUT_INTEGRATION_GUIDE.md" -ForegroundColor Yellow
Write-Host ""

