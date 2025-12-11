#!/bin/bash

# =============================================================================
# DNS CONFIGURATION GUIDE FOR 11-DOMAIN PORTFOLIO
# Complete DNS setup instructions for all domains
# =============================================================================

echo "🔧 DNS CONFIGURATION GUIDE - 11 Domain Portfolio"
echo "================================================"
echo ""

# Current live domains (already configured)
echo "✅ LIVE DOMAINS (5/11) - DNS Already Configured:"
echo "  • antonylambi.be"
echo "  • fixie.run"
echo "  • adaptogenic-mushrooms.com"
echo "  • brainhealthmushrooms.com"
echo "  • healthfulmushrooms.com"
echo ""

# Domains needing DNS configuration
echo "🎯 PENDING DOMAINS (6/11) - DNS Configuration Required:"
echo ""

# Vercel domains
echo "📦 VERCEL DOMAINS (3):"
echo "Configure at your domain registrar (OVH/GoDaddy/Namecheap/etc.):"
echo ""

DOMAINS_VERCEL=(
    "seobiz.be:Vercel"
    "rhymechain.win:Vercel"
    "aiftw.be:Vercel"
)

for domain_info in "${DOMAINS_VERCEL[@]}"; do
    IFS=':' read -r domain platform <<< "$domain_info"
    echo "🌐 $domain ($platform)"
    echo "   Type: A     Name: @     Value: 76.76.19.61     TTL: 300"
    echo "   Type: CNAME Name: www   Value: cname.vercel-dns.com  TTL: 300"
    echo ""
done

# GitHub Pages domains
echo "📦 GITHUB PAGES DOMAINS (3):"
echo "Configure at your domain registrar:"
echo ""

DOMAINS_GITHUB=(
    "tech-review-blog.com:GitHub Pages"
    "puffs-store.com:GitHub Pages"
    "affinitylove.eu:GitHub Pages"
)

for domain_info in "${DOMAINS_GITHUB[@]}"; do
    IFS=':' read -r domain platform <<< "$domain_info"
    echo "🌐 $domain ($platform)"
    echo "   Type: A     Name: @     Value: 185.199.108.153  TTL: 300"
    echo "   Type: A     Name: @     Value: 185.199.109.153  TTL: 300"
    echo "   Type: A     Name: @     Value: 185.199.110.153  TTL: 300"
    echo "   Type: A     Name: @     Value: 185.199.111.153  TTL: 300"
    echo "   Type: CNAME Name: www   Value: [YOUR_GITHUB_USERNAME].github.io  TTL: 300"
    echo ""
done

echo "🔍 DNS VERIFICATION COMMANDS:"
echo "Run these commands to verify DNS propagation:"
echo ""

cat << 'EOF'
# Check all domains
domains=(
    "seobiz.be"
    "rhymechain.win"
    "aiftw.be"
    "tech-review-blog.com"
    "puffs-store.com"
    "affinitylove.eu"
)

for domain in "${domains[@]}"; do
    echo "Checking $domain..."
    nslookup $domain
    echo "---"
done
EOF

echo ""
echo "⏱️  TIMELINE:"
echo "   • DNS changes: 5-15 minutes to update"
echo "   • Global propagation: 24-48 hours"
echo "   • SSL certificates: Auto-provisioned by hosting platforms"
echo ""

echo "✅ VERIFICATION STEPS:"
echo "   1. Run DNS verification commands above"
echo "   2. Visit each domain in browser"
echo "   3. Check SSL certificate validity"
echo "   4. Test all site functionality"
echo ""

echo "🚀 NEXT STEPS AFTER DNS:"
echo "   1. Set up Google Analytics 4"
echo "   2. Configure monitoring alerts"
echo "   3. Test cross-domain functionality"
echo "   4. Launch marketing campaigns"
echo ""

echo "💡 PRO TIP: Use tools like dnschecker.org to monitor propagation globally"
echo ""

# Generate DNS zone file template
echo "📄 DNS ZONE FILE TEMPLATE (for reference):"
echo ""

cat << 'EOF'
; Zone file for portfolio domains
$TTL 300
@       IN      SOA     ns1.example.com. admin.example.com. (
                        2023121001 ; Serial
                        3600       ; Refresh
                        1800       ; Retry
                        604800     ; Expire
                        300        ; TTL
                        )

; Vercel domains
seobiz.be.              A       76.76.19.61
seobiz.be.              CNAME   cname.vercel-dns.com
rhymechain.win.         A       76.76.19.61
rhymechain.win.         CNAME   cname.vercel-dns.com
aiftw.be.               A       76.76.19.61
aiftw.be.               CNAME   cname.vercel-dns.com

; GitHub Pages domains
tech-review-blog.com.   A       185.199.108.153
tech-review-blog.com.   A       185.199.109.153
tech-review-blog.com.   A       185.199.110.153
tech-review-blog.com.   A       185.199.111.153
puffs-store.com.        A       185.199.108.153
puffs-store.com.        A       185.199.109.153
puffs-store.com.        A       185.199.110.153
puffs-store.com.        A       185.199.111.153
affinitylove.eu.        A       185.199.108.153
affinitylove.eu.        A       185.199.109.153
affinitylove.eu.        A       185.199.110.153
affinitylove.eu.        A       185.199.111.153
EOF
