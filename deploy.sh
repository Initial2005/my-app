#!/bin/bash

# BrainChainPSIT - Quick Deploy Script
# This script helps you deploy your app to Vercel

echo "🚀 BrainChainPSIT Deployment Helper"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js is installed"

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from your project root."
    exit 1
fi

echo "✓ Found package.json"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✓ Dependencies ready"
echo ""

# Ask user which deployment method
echo "Choose deployment method:"
echo "1) Vercel (Recommended - Free, Fast, Easy)"
echo "2) Netlify (Free, Popular)"
echo "3) Build locally (create production build)"
echo "4) Test locally (start dev server)"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🌐 Deploying to Vercel..."
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo "📥 Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        echo ""
        echo "Starting deployment..."
        echo "You'll need to:"
        echo "  1. Login to Vercel (via browser)"
        echo "  2. Confirm project settings"
        echo "  3. Wait for deployment"
        echo ""
        
        vercel
        
        echo ""
        echo "✅ Deployment complete!"
        echo "📱 Your link is ready to share on WhatsApp!"
        ;;
        
    2)
        echo ""
        echo "🌐 Deploying to Netlify..."
        
        # Check if Netlify CLI is installed
        if ! command -v netlify &> /dev/null; then
            echo "📥 Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        
        echo "Building app..."
        npm run build
        
        echo ""
        echo "Starting deployment..."
        netlify deploy --prod
        
        echo ""
        echo "✅ Deployment complete!"
        ;;
        
    3)
        echo ""
        echo "🔨 Building production version..."
        npm run build
        
        echo ""
        echo "✅ Build complete!"
        echo "📁 Your production files are in the 'build' folder"
        echo "You can now:"
        echo "  - Upload to any web hosting service"
        echo "  - Use 'npx serve -s build' to test locally"
        ;;
        
    4)
        echo ""
        echo "🧪 Starting development server..."
        echo "📱 Access at: http://localhost:3000"
        echo ""
        echo "Press Ctrl+C to stop the server"
        echo ""
        npm start
        ;;
        
    *)
        echo "❌ Invalid choice. Please run again and select 1-4."
        exit 1
        ;;
esac

echo ""
echo "🎉 Done!"
