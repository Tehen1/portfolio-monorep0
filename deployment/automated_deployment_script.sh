#!/bin/bash

# =============================================================================
# AUTOMATED MULTI-DOMAIN DEPLOYMENT SCRIPT
# Complete deployment solution for 11-domain portfolio
# =============================================================================

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"
}

# =============================================================================
# DEPENDENCY CHECKS
# =============================================================================
check_dependencies() {
    log "Checking dependencies..."

    local missing_deps=()

    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    fi

    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    fi

    if ! command -v git &> /dev/null; then
        missing_deps+=("git")
    fi

    if ! command -v curl &> /dev/null; then
        missing_deps+=("curl")
    fi

    if [ ${#missing_deps[@]} -gt 0 ]; then
        error "Missing dependencies: ${missing_deps[*]}"
        error "Please install missing dependencies and run again."
        exit 1
    fi

    log "All dependencies available"
}

# =============================================================================
# VERCEL DEPLOYMENT FUNCTION
# =============================================================================
deploy_vercel_site() {
    local site_name="$1"
    local domain="$2"
    local site_path="$SCRIPT_DIR/sites_deploy/$site_name"

    log "Starting Vercel deployment for $domain..."

    if [ ! -d "$site_path" ]; then
        error "Site directory not found: $site_path"
        return 1
    fi

    cd "$site_path"

    # Check if vercel CLI is available
    if ! command -v vercel &> /dev/null; then
        warn "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi

    # Check Vercel authentication
    if ! vercel whoami &> /dev/null; then
        warn "Vercel authentication required. Please run:"
        echo "  vercel login"
        echo "  Then re-run this script"
        return 1
    fi

    # Deploy to Vercel
    log "Deploying $domain to Vercel..."
    if vercel --prod --yes; then
        log "✅ $domain deployed to Vercel"

        # Add custom domain
        log "Adding custom domain $domain..."
        vercel domains add "$domain"

        # Enable HTTPS
        vercel domains inspect "$domain"

        return 0
    else
        error "Failed to deploy $domain to Vercel"
        return 1
    fi
}

# =============================================================================
# GITHUB PAGES DEPLOYMENT FUNCTION
# =============================================================================
deploy_github_pages_site() {
    local site_name="$1"
    local domain="$2"
    local repo_name="portfolio-$site_name"
    local site_path="$SCRIPT_DIR/sites_deploy/$site_name"

    log "Starting GitHub Pages deployment for $domain..."

    if [ ! -d "$site_path" ]; then
        error "Site directory not found: $site_path"
        return 1
    fi

    cd "$site_path"

    # Check if gh CLI is available
    if ! command -v gh &> /dev/null; then
        warn "GitHub CLI not found. Installing..."
        # Install GitHub CLI
        if command -v brew &> /dev/null; then
            brew install gh
        else
            warn "Please install GitHub CLI manually: https://cli.github.com/"
            warn "Then run: gh auth login"
            return 1
        fi
    fi

    # Check GitHub authentication
    if ! gh auth status &> /dev/null; then
        warn "GitHub authentication required. Please run:"
        echo "  gh auth login"
        echo "  Then re-run this script"
        return 1
    fi

    # Get GitHub username
    GITHUB_USER=$(gh api user --jq '.login' 2>/dev/null)
    if [ -z "$GITHUB_USER" ]; then
        warn "Could not get GitHub username. Using default: tehen1"
        GITHUB_USER="tehen1"
    fi

    # Create repository if it doesn't exist
    if ! gh repo view "$GITHUB_USER/$repo_name" &> /dev/null; then
        log "Creating GitHub repository: $repo_name"
        gh repo create "$repo_name" --public --description "Portfolio domain site - $domain"
    fi

    # Initialize git if not already done
    if [ ! -d ".git" ]; then
        git init
        git checkout -b main
        git remote add origin "https://github.com/$GITHUB_USER/$repo_name.git"
    fi

    # Add, commit, and push
    git add .
    git commit -m "Deploy $domain - $(date)" || true
    git push -u origin main

    # Enable GitHub Pages
    log "Enabling GitHub Pages for $repo_name..."
    gh repo edit "$repo_name" --default-branch main

    # Use GitHub API to enable Pages
    curl -X POST \
         -H "Authorization: token $(gh auth token)" \
         -H "Accept: application/vnd.github.v3+json" \
         "https://api.github.com/repos/$GITHUB_USER/$repo_name/pages" \
         -d '{"source":{"branch":"main","path":"/"}}'

    log "✅ $domain deployed to GitHub Pages"
    log "  Repository: https://github.com/$GITHUB_USER/$repo_name"
    log "  Site will be available at: https://$GITHUB_USER.github.io/$repo_name"

    return 0
}

# =============================================================================
# DNS CONFIGURATION
# =============================================================================
configure_dns() {
    local domain="$1"
    local platform="$2"

    log "DNS Configuration for $domain ($platform)"

    case $platform in
        "vercel")
            echo "Configure these DNS records at your registrar:"
            echo "Type: A"
            echo "Name: @"
            echo "Value: 76.76.19.61"
            echo "TTL: 300"
            echo ""
            echo "Type: CNAME"
            echo "Name: www"
            echo "Value: cname.vercel-dns.com"
            echo "TTL: 300"
            ;;
        "github")
            echo "Configure these DNS records at your registrar:"
            echo "Type: A"
            echo "Name: @"
            echo "Value: 185.199.108.153"
            echo "TTL: 300"
            echo ""
            echo "Type: A"
            echo "Name: @"
            echo "Value: 185.199.109.153"
            echo "TTL: 300"
            echo ""
            echo "Type: A"
            echo "Name: @"
            echo "Value: 185.199.110.153"
            echo "TTL: 300"
            echo ""
            echo "Type: A"
            echo "Name: @"
            echo "Value: 185.199.111.153"
            echo "TTL: 300"
            echo ""
            echo "Type: CNAME"
            echo "Name: www"
            echo "Value: $GITHUB_USER.github.io"
            echo "TTL: 300"
            ;;
    esac
    echo ""
}

# =============================================================================
# MAIN DEPLOYMENT EXECUTION
# =============================================================================
main() {
    log "🚀 Starting Multi-Domain Portfolio Deployment"
    log "Target: 11 domains - Complete automation"

    check_dependencies

    # Track deployment results
    local vercel_success=0
    local vercel_total=0
    local github_success=0
    local github_total=0

    # Vercel deployments
    log "📦 Starting Vercel deployments..."

    declare -a vercel_sites=(
        "seobiz-be:seobiz.be"
        "rhymechain-win:rhymechain.win"
        "aiftw-be:aiftw.be"
    )

    for site_info in "${vercel_sites[@]}"; do
        IFS=':' read -r site_name domain <<< "$site_info"
        ((vercel_total++))
        if deploy_vercel_site "$site_name" "$domain"; then
            ((vercel_success++))
        fi
        echo ""
    done

    # GitHub Pages deployments
    log "📦 Starting GitHub Pages deployments..."

    declare -a github_sites=(
        "tech-review-blog:tech-review-blog.com"
        "puffs-store:puffs-store.com"
        "affinitylove:affinitylove.eu"
    )

    for site_info in "${github_sites[@]}"; do
        IFS=':' read -r site_name domain <<< "$site_info"
        ((github_total++))
        if deploy_github_pages_site "$site_name" "$domain"; then
            ((github_success++))
        fi
        echo ""
    done

    # DNS Configuration Instructions
    log "🔧 DNS Configuration Required"
    echo "========================================"

    # Vercel DNS
    for site_info in "${vercel_sites[@]}"; do
        IFS=':' read -r site_name domain <<< "$site_info"
        configure_dns "$domain" "vercel"
    done

    # GitHub DNS
    for site_info in "${github_sites[@]}"; do
        IFS=':' read -r site_name domain <<< "$site_info"
        configure_dns "$domain" "github"
    done

    # Final Report
    log "📊 DEPLOYMENT SUMMARY"
    echo "========================================"
    log "Vercel Deployments: $vercel_success/$vercel_total successful"
    log "GitHub Pages Deployments: $github_success/$github_total successful"
    log "Total Progress: $((vercel_success + github_success))/6 domains deployed"

    if [ $((vercel_success + github_success)) -eq 6 ]; then
        log "🎉 ALL DEPLOYMENTS COMPLETED!"
        log "Next steps:"
        log "  1. Configure DNS records (see instructions above)"
        log "  2. Wait for DNS propagation (24-48 hours)"
        log "  3. Verify SSL certificates"
        log "  4. Set up analytics and monitoring"
    else
        warn "⚠️  Some deployments failed. Please check errors above."
        warn "Manual intervention may be required for failed deployments."
    fi

    log "Deployment script completed at $(date)"
}

# Handle command line arguments
case "${1:-}" in
    "vercel")
        log "Deploying only Vercel sites..."
        check_dependencies
        deploy_vercel_site "seobiz-be" "seobiz.be"
        deploy_vercel_site "rhymechain-win" "rhymechain.win"
        deploy_vercel_site "aiftw-be" "aiftw.be"
        ;;
    "github")
        log "Deploying only GitHub Pages sites..."
        check_dependencies
        deploy_github_pages_site "tech-review-blog" "tech-review-blog.com"
        deploy_github_pages_site "puffs-store" "puffs-store.com"
        deploy_github_pages_site "affinitylove" "affinitylove.eu"
        ;;
    "dns")
        log "Showing DNS configuration..."
        configure_dns "seobiz.be" "vercel"
        configure_dns "rhymechain.win" "vercel"
        configure_dns "aiftw.be" "vercel"
        configure_dns "tech-review-blog.com" "github"
        configure_dns "puffs-store.com" "github"
        configure_dns "affinitylove.eu" "github"
        ;;
    *)
        main "$@"
        ;;
esac
