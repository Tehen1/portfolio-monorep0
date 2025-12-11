#!/bin/bash

# =============================================================================
# DOMAIN VERIFICATION SCRIPT
# Check status of all 11 domains in the portfolio
# =============================================================================

echo "🔍 DOMAIN VERIFICATION - 11 Domain Portfolio"
echo "============================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to check domain
check_domain() {
    local domain="$1"
    local expected_status="$2"

    echo -n "Checking $domain... "

    # Check HTTP status
    local http_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://$domain" 2>/dev/null)

    # Check DNS resolution
    local dns_check=$(nslookup "$domain" 2>/dev/null | grep -c "Address:")

    # Check SSL certificate
    local ssl_check=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null | wc -l)

    if [ "$http_status" = "200" ] || [ "$http_status" = "301" ]; then
        echo -e "${GREEN}✅ LIVE${NC} (HTTP $http_status)"
        if [ "$ssl_check" -gt 0 ]; then
            echo -e "  ${GREEN}✓ SSL Valid${NC}"
        else
            echo -e "  ${YELLOW}⚠ SSL Check Failed${NC}"
        fi
        return 0
    elif [ "$http_status" = "000" ]; then
        echo -e "${RED}❌ OFFLINE${NC} (No response)"
        return 1
    elif [ "$http_status" = "404" ]; then
        echo -e "${YELLOW}⚠ NOT FOUND${NC} (HTTP 404)"
        return 1
    elif [ "$http_status" = "307" ] || [ "$http_status" = "308" ]; then
        echo -e "${BLUE}🔄 REDIRECT${NC} (HTTP $http_status)"
        return 1
    else
        echo -e "${YELLOW}⚠ UNKNOWN${NC} (HTTP $http_status)"
        return 1
    fi
}

# Current live domains (5/11)
echo "✅ CURRENTLY LIVE DOMAINS (5/11):"
echo "----------------------------------"
live_domains=(
    "antonylambi.be"
    "fixie.run"
    "adaptogenic-mushrooms.com"
    "brainhealthmushrooms.com"
    "healthfulmushrooms.com"
)

live_count=0
for domain in "${live_domains[@]}"; do
    if check_domain "$domain" "live"; then
        ((live_count++))
    fi
done

echo ""
echo "📦 PENDING DEPLOYMENT DOMAINS (6/11):"
echo "-------------------------------------"
pending_domains=(
    "seobiz.be"
    "rhymechain.win"
    "aiftw.be"
    "tech-review-blog.com"
    "puffs-store.com"
    "affinitylove.eu"
)

pending_count=0
for domain in "${pending_domains[@]}"; do
    if check_domain "$domain" "pending"; then
        ((pending_count++))
    fi
done

echo ""
echo "📊 VERIFICATION SUMMARY:"
echo "========================="
echo "Live domains: $live_count/5"
echo "Pending domains: $pending_count/6"
echo "Total operational: $((live_count + pending_count))/11 ($(( (live_count + pending_count) * 100 / 11 ))%)"

if [ $live_count -eq 5 ] && [ $pending_count -eq 6 ]; then
    echo ""
    echo -e "${GREEN}🎉 ALL DOMAINS ARE NOW OPERATIONAL!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Set up Google Analytics 4"
    echo "  2. Configure monitoring and alerts"
    echo "  3. Test cross-domain functionality"
    echo "  4. Launch marketing campaigns"
else
    echo ""
    echo -e "${YELLOW}⚠️ DEPLOYMENT INCOMPLETE${NC}"
    echo ""
    echo "Remaining tasks:"
    if [ $pending_count -lt 6 ]; then
        echo "  - Deploy remaining domains to hosting platforms"
    fi
    if [ $live_count -lt 5 ]; then
        echo "  - Check and fix live domain issues"
    fi
    echo "  - Configure DNS records for all domains"
    echo "  - Verify SSL certificates"
fi

echo ""
echo "🔄 TO RE-RUN VERIFICATION:"
echo "   ./domain_verification_script.sh"
echo ""
echo "📋 MANUAL DEPLOYMENT GUIDE:"
echo "   ./deployment/automated_deployment_script.sh dns"
echo ""
echo "🚀 QUICK DEPLOYMENT:"
echo "   # For Vercel domains:"
echo "   ./deployment/automated_deployment_script.sh vercel"
echo ""
echo "   # For GitHub Pages domains:"
echo "   ./deployment/automated_deployment_script.sh github"
