#!/bin/bash

# XenAlgo Python Microservices Deployment Script
# This script deploys the Trading Psychology AI service to Railway

set -e

echo "🚀 Starting XenAlgo Python Microservices Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Railway CLI is installed
check_railway_cli() {
    if ! command -v railway &> /dev/null; then
        print_error "Railway CLI is not installed. Installing now..."
        npm install -g @railway/cli
    else
        print_success "Railway CLI is already installed"
    fi
}

# Check if user is logged in to Railway
check_railway_auth() {
    if ! railway whoami &> /dev/null; then
        print_warning "Not logged in to Railway. Please login:"
        railway login
    else
        print_success "Already logged in to Railway"
    fi
}

# Deploy trading psychology AI service
deploy_trading_psychology_ai() {
    print_status "Deploying Trading Psychology AI service..."
    
    cd python-services/trading-psychology-ai
    
    # Check if Railway project exists
    if [ ! -f "railway.toml" ]; then
        print_status "Initializing Railway project..."
        railway init
    fi
    
    # Deploy to Railway
    print_status "Deploying to Railway..."
    railway up
    
    # Get the deployment URL
    DEPLOYMENT_URL=$(railway status --json | jq -r '.deployment.url')
    
    if [ "$DEPLOYMENT_URL" != "null" ]; then
        print_success "Trading Psychology AI deployed successfully!"
        print_success "Deployment URL: $DEPLOYMENT_URL"
        
        # Test the deployment
        print_status "Testing deployment..."
        if curl -f "$DEPLOYMENT_URL/health" &> /dev/null; then
            print_success "Health check passed!"
        else
            print_warning "Health check failed. Service might still be starting..."
        fi
    else
        print_error "Failed to get deployment URL"
        exit 1
    fi
    
    cd ../..
}

# Update environment variables
update_env_vars() {
    print_status "Updating environment variables..."
    
    # Get the deployment URL
    cd python-services/trading-psychology-ai
    DEPLOYMENT_URL=$(railway status --json | jq -r '.deployment.url')
    cd ../..
    
    if [ "$DEPLOYMENT_URL" != "null" ]; then
        # Create .env.local file for React app
        cat > .env.local << EOF
# XenAlgo AI Service URLs
REACT_APP_AI_SERVICE_URL=$DEPLOYMENT_URL
REACT_APP_TRADING_PSYCHOLOGY_AI_URL=$DEPLOYMENT_URL
EOF
        
        print_success "Environment variables updated in .env.local"
        print_status "Please restart your React development server"
    else
        print_error "Failed to get deployment URL for environment variables"
    fi
}

# Main deployment function
main() {
    print_status "Starting XenAlgo Python Microservices deployment..."
    
    # Check prerequisites
    check_railway_cli
    check_railway_auth
    
    # Deploy services
    deploy_trading_psychology_ai
    
    # Update environment variables
    update_env_vars
    
    print_success "🎉 Deployment completed successfully!"
    print_status "Next steps:"
    echo "1. Run the SQL migration in Supabase:"
    echo "   supabase/migrations/20250101000000-add-behavioral-analysis.sql"
    echo ""
    echo "2. Restart your React development server:"
    echo "   npm run dev"
    echo ""
    echo "3. Test the integration in your app"
}

# Run main function
main "$@" 