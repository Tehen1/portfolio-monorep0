#!/bin/bash

# =============================================================================
# QUICK SECURITY FIX SCRIPT
# Fast vulnerability patching for critical Node.js projects
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Fix a single project
fix_project() {
    local project_path="$1"
    local project_name=$(basename "$project_path")

    log "🔧 Fixing: $project_name"

    cd "$project_path"

    # Create package-lock.json if missing
    if [ ! -f "package-lock.json" ]; then
        npm i --package-lock-only 2>/dev/null || true
    fi

    # Run audit and fix
    if npm audit fix --audit-level=moderate --force 2>/dev/null; then
        log "✅ Fixed: $project_name"
    else
        warn "⚠️ Could not auto-fix: $project_name"
    fi

    # Try alternative fix
    npm audit fix --audit-level=high --force 2>/dev/null || true

    cd - > /dev/null
}

# Main projects to fix (based on vulnerability report)
main() {
    log "🚀 QUICK SECURITY FIX - Critical Projects"
    echo "==========================================="

    # Key projects from vulnerability report
    projects=(
        "./antonylambi-portfolio"
        "./apps/fixie-run"
        "./deployment/sites_deploy/seobiz-be"
        "./deployment/sites_deploy/rhymechain-win"
        "./deployment/sites_deploy/aiftw-be"
        "./deployment/sites_deploy/tech-review-blog"
        "./deployment/sites_deploy/puffs-store"
        "./deployment/sites_deploy/affinitylove"
    )

    fixed=0
    total=0

    for project in "${projects[@]}"; do
        ((total++))
        if [ -d "$project" ] && [ -f "$project/package.json" ]; then
            if fix_project "$project"; then
                ((fixed++))
            fi
        else
            warn "Project not found: $project"
        fi
    done

    log "📊 SUMMARY: $fixed/$total projects fixed"

    # Final verification
    log "🔍 Running final verification..."
    for project in "${projects[@]}"; do
        if [ -d "$project" ] && [ -f "$project/package.json" ]; then
            cd "$project"
            if npm audit --audit-level=moderate > /dev/null 2>&1; then
                log "✅ $(basename "$project"): Clean"
            else
                warn "⚠️ $(basename "$project"): Still has issues"
            fi
            cd - > /dev/null
        fi
    done
}

main "$@"
