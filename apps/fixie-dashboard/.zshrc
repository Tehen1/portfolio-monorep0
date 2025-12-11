# Oh My Zsh
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="robbyrussell"

plugins=(
  git
  docker
  node
  npm
  github
  ssh-agent
  brew
  gcloud
)

source $ZSH/oh-my-zsh.sh

# NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# NPM Global Path
export PATH=~/.npm-global/bin:$PATH

# Homebrew M1 optimized
export PATH="/opt/homebrew/bin:$PATH"
export PATH="/opt/homebrew/sbin:$PATH"

# Git
export GIT_SSH_COMMAND="ssh -i ~/.ssh/github"

# Node optimization
export NODE_OPTIONS=--max-old-space-size=4096

# Aliases
alias ll='ls -lah'
alias l='ls -lh'
alias cd..='cd ..'
alias cls='clear'
alias gs='git status'
alias ga='git add'
alias gp='git push'
alias gl='git pull'
alias gc='git commit'
alias gco='git checkout'
alias dev='npm run dev'
alias test='npm run test'
alias build='npm run build'
alias lint='npm run lint'
alias format='npm run format'
alias docker-ps='docker ps --format "{{.ID}}\t{{.Names}}\t{{.Status}}"'
alias docker-logs='docker logs -f'
alias docker-stats='docker stats --no-stream'
alias mcp-start='docker compose -f docker-compose.mcp.yml up -d'
alias mcp-stop='docker compose -f docker-compose.mcp.yml down'
alias mcp-logs='docker compose -f docker-compose.mcp.yml logs -f'
alias forge-test='forge test -vvv'
alias hardhat-test='npx hardhat test'

# Useful functions
function mkcd() {
  mkdir -p "$@" && cd "$_";
}

function verify-stack() {
  echo "=== WEB3 STACK ==="
  echo "Node: $(node --version)"
  echo "NPM: $(npm --version)"
  echo "PNPM: $(pnpm --version)"
  echo "Docker: $(docker --version)"
  echo "Git: $(git --version)"
  echo "Foundry: $(forge --version)"
  echo "=== ✓ READY ==="
}

# Prompt customization
PROMPT='%F{blue}%n@%m%f %F{cyan}%~%f %F{green}➜%f '