#!/bin/bash

# =============================================================================
# COMPREHENSIVE SECURITY AUDIT & VULNERABILITY FIX SCRIPT
# Automated security patching for all Node.js projects in the portfolio
# =============================================================================

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
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
# FIND ALL NODE.JS PROJECTS
# =============================================================================
find_nodejs_projects() {
    log "Finding all Node.js projects..."

    # Find all directories containing package.json
    find . -name "package.json" -type f -not -path "./node_modules/*" -exec dirname {} \; | sort -u
}

# =============================================================================
# SECURITY AUDIT FUNCTION
# =============================================================================
audit_project() {
    local project_path="$1"
    local project_name=$(basename "$project_path")

    log "🔍 Auditing: $project_name ($project_path)"

    cd "$project_path"

    # Check if package-lock.json exists
    if [ ! -f "package-lock.json" ]; then
        warn "No package-lock.json found. Creating one..."
        npm i --package-lock-only 2>/dev/null || true
    fi

    # Run security audit
    if npm audit --audit-level=moderate --json > /tmp/audit_$project_name.json 2>/dev/null; then
        # Parse audit results
        vulnerabilities=$(jq -r '.metadata.vulnerabilities.total // 0' /tmp/audit_$project_name.json 2>/dev/null || echo "0")

        if [ "$vulnerabilities" -gt 0 ]; then
            error "❌ $project_name: $vulnerabilities vulnerabilities found"

            # Show details
            npm audit --audit-level=moderate

            # Try automatic fix
            log "🔧 Attempting automatic fix for $project_name..."
            if npm audit fix --audit-level=moderate; then
                log "✅ Auto-fix successful for $project_name"

                # Verify fix
                if npm audit --audit-level=moderate > /dev/null 2>&1; then
                    log "✅ $project_name: All vulnerabilities fixed"
                else
                    warn "⚠️ $project_name: Some vulnerabilities remain - manual review needed"
                fi
            else
                warn "⚠️ Auto-fix failed for $project_name - manual intervention required"
            fi
        else
            log "✅ $project_name: No vulnerabilities found"
        fi
    else
        warn "Could not run audit for $project_name"
    fi

    # Return to script directory
    cd "$SCRIPT_DIR"
    echo ""
}

# =============================================================================
# MANUAL FIX ASSISTANCE
# =============================================================================
manual_fix_assistance() {
    log "📋 MANUAL FIX ASSISTANCE"
    echo "=========================="

    cat << 'EOF'
For projects requiring manual fixes, follow these steps:

1. Review the vulnerability details:
   npm audit --audit-level=moderate

2. Update problematic packages manually:
   npm update <package-name>@latest

3. If update doesn't work, check for major version updates:
   npm install <package-name>@latest

4. For breaking changes, update code accordingly:
   - Check package changelogs
   - Update import statements if needed
   - Test functionality after updates

5. Alternative: Use npm-force-resolutions for problematic deps
   Add to package.json:
   "overrides": {
     "vulnerable-package": "^safe-version"
   }

6. Run tests after fixes:
   npm test
   npm run build

7. Re-run security audit:
   npm audit --audit-level=moderate

CRITICAL PACKAGES TO WATCH:
- react, next.js, vue (framework updates)
- webpack, vite, rollup (build tools)
- eslint, typescript (dev tools)
- axios, node-fetch (HTTP clients)
- lodash, underscore (utilities)
EOF

    echo ""
}

# =============================================================================
# DEPENDENCY UPDATE FUNCTION
# =============================================================================
update_dependencies() {
    local project_path="$1"
    local project_name=$(basename "$project_path")

    log "⬆️ Updating dependencies for: $project_name"

    cd "$project_path"

    # Update dependencies interactively
    log "Running: npm update"
    npm update

    # Check for outdated packages
    log "Checking for outdated packages..."
    npm outdated

    # Optional: Update to latest major versions (use with caution)
    read -p "Update to latest major versions for $project_name? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        warn "⚠️ Updating to latest major versions - this may break things!"
        npm install $(npm outdated | awk 'NR>1 {print $1"@latest"}' | tr '\n' ' ')
    fi

    cd "$SCRIPT_DIR"
}

# =============================================================================
# BULK SECURITY UPDATE
# =============================================================================
bulk_security_update() {
    log "🚀 STARTING BULK SECURITY UPDATE"
    echo "=================================="

    # Find all projects
    projects=$(find_nodejs_projects)

    total_projects=$(echo "$projects" | wc -l)
    processed=0
    fixed=0
    manual=0

    echo "$projects" | while read -r project_path; do
        ((processed++))
        log "Processing $processed/$total_projects: $project_path"

        # Audit and attempt to fix
        audit_output=$(audit_project "$project_path" 2>&1)

        # Check if manual intervention is needed
        if echo "$audit_output" | grep -q "manual.*intervention\|remain"; then
            ((manual++))
        elif echo "$audit_output" | grep -q "All vulnerabilities fixed\|No vulnerabilities"; then
            ((fixed++))
        fi
    done

    log "📊 BULK UPDATE SUMMARY"
    echo "========================"
    log "Total projects processed: $total_projects"
    log "Automatically fixed: $fixed"
    log "Require manual review: $manual"
    log "Success rate: $((fixed * 100 / total_projects))%"

    if [ $manual -gt 0 ]; then
        warn "⚠️ $manual projects need manual intervention"
        manual_fix_assistance
    fi
}

# =============================================================================
# INDIVIDUAL PROJECT FIX
# =============================================================================
fix_individual_project() {
    local project_name="$1"

    log "🔧 Fixing individual project: $project_name"

    # Find project path
    project_path=$(find . -name "package.json" -type f -not -path "./node_modules/*" | xargs dirname | grep "/$project_name$" | head -1)

    if [ -z "$project_path" ]; then
        error "Project '$project_name' not found"
        return 1
    fi

    log "Found project at: $project_path"

    # Audit and fix
    audit_project "$project_path"

    # Optional dependency update
    read -p "Update all dependencies for $project_name? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        update_dependencies "$project_path"
    fi
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================
main() {
    log "🛡️ COMPREHENSIVE SECURITY AUDIT & FIX"
    echo "======================================"

    case "${1:-}" in
        "bulk")
            log "Running bulk security update for all projects..."
            bulk_security_update
            ;;
        "fix")
            if [ -z "$2" ]; then
                error "Usage: $0 fix <project-name>"
                exit 1
            fi
            fix_individual_project "$2"
            ;;
        "audit")
            log "Running security audit only..."
            find_nodejs_projects | while read -r project_path; do
                audit_project "$project_path"
            done
            ;;
        "help"|*)
            echo "Usage: $0 [command] [options]"
            echo ""
            echo "Commands:"
            echo "  bulk     - Run security audit and fix for all projects"
            echo "  audit    - Run security audit only (no fixes)"
            echo "  fix      - Fix individual project: $0 fix <project-name>"
            echo "  help     - Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 bulk                    # Fix all projects"
            echo "  $0 audit                   # Audit all projects"
            echo "  $0 fix my-project         # Fix specific project"
            echo ""
            ;;
    esac
}

# Run main function
main "$@"
