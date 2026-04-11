#!/bin/bash

echo "Deploying backend to Vercel with working admin functionalities..."

# Check if we're in the backend directory
if [ ! -f "server.js" ]; then
    echo "Error: server.js not found. Please run this script from the backend directory."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
npx vercel --prod

echo "Backend deployed successfully!"
echo "Your admin functionalities should now be working at: https://workends.vercel.app"
echo ""
echo "Admin endpoints available:"
echo "- GET  /api/admin/test"
echo "- POST /api/admin/login"
echo "- GET  /api/admin/me"
echo "- GET  /api/admin/products"
echo "- POST /api/admin/products"
echo "- PUT  /api/admin/products/:id"
echo "- GET  /api/admin/gallery"
echo "- PUT  /api/admin/gallery"
echo "- GET  /api/admin/banner"
echo "- PUT  /api/admin/banner"
