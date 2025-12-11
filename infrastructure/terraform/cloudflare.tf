# Cloudflare CDN Infrastructure for Multi-Domain Portfolio Platform
# Global edge locations with <50ms latency and 99.99% uptime

terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }

  backend "s3" {
    bucket = "portfolio-terraform-state"
    key    = "cloudflare/terraform.tfstate"
    region = "eu-west-1"
  }
}

# =============================================================================
# PROVIDER CONFIGURATION
# =============================================================================
provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# =============================================================================
# VARIABLES
# =============================================================================
variable "cloudflare_api_token" {
  description = "Cloudflare API token with zone and DNS permissions"
  type        = string
  sensitive   = true
}

variable "domains" {
  description = "List of domains to configure"
  type = list(object({
    name         = string
    zone_id      = string
    origin_ip    = string
    ssl_mode     = optional(string, "strict")
    waf_enabled  = optional(bool, true)
  }))
  default = [
    {
      name        = "antonylambi.be"
      zone_id     = "zone_id_here"
      origin_ip   = "nginx-ingress-controller.portfolio.svc.cluster.local"
      ssl_mode    = "strict"
      waf_enabled = true
    },
    {
      name        = "fixie.run"
      zone_id     = "zone_id_here"
      origin_ip   = "nginx-ingress-controller.portfolio.svc.cluster.local"
      ssl_mode    = "strict"
      waf_enabled = true
    },
    {
      name        = "seobiz.be"
      zone_id     = "zone_id_here"
      origin_ip   = "nginx-ingress-controller.portfolio.svc.cluster.local"
      ssl_mode    = "strict"
      waf_enabled = true
    },
    {
      name        = "adaptogenic-mushrooms.com"
      zone_id     = "zone_id_here"
      origin_ip   = "nginx-ingress-controller.portfolio.svc.cluster.local"
      ssl_mode    = "strict"
      waf_enabled = true
    },
    {
      name        = "rhymechain.win"
      zone_id     = "zone_id_here"
      origin_ip   = "nginx-ingress-controller.portfolio.svc.cluster.local"
      ssl_mode    = "strict"
      waf_enabled = true
    }
  ]
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

# =============================================================================
# CLOUDFLARE ZONES
# =============================================================================
resource "cloudflare_zone" "portfolio_zones" {
  for_each = { for domain in var.domains : domain.name => domain }

  zone = each.value.name
  plan = "enterprise"
  type = "full"

  settings {
    # Performance optimizations
    minify {
      css  = "on"
      html = "on"
      js   = "on"
    }

    # Security settings
    security_level = "high"
    challenge_ttl  = 1800

    # SSL/TLS settings
    ssl = each.value.ssl_mode

    # Always Use HTTPS
    always_use_https = "on"

    # HTTP Strict Transport Security
    hsts {
      max_age         = 31536000
      include_subdomains = true
      preload         = true
    }

    # Opportunistic Encryption
    opportunistic_encryption = "on"

    # TLS 1.3
    tls_1_3 = "on"

    # Automatic HTTPS Rewrites
    automatic_https_rewrites = "on"

    # Browser Cache TTL
    browser_cache_ttl = 14400

    # Cache Level
    cache_level = "aggressive"

    # Edge Cache TTL
    edge_cache_ttl = 7200
  }
}

# =============================================================================
# DNS RECORDS
# =============================================================================
resource "cloudflare_record" "portfolio_dns" {
  for_each = { for domain in var.domains : domain.name => domain }

  zone_id = cloudflare_zone.portfolio_zones[each.key].id
  name    = each.key
  value   = each.value.origin_ip
  type    = "CNAME"
  ttl     = 1
  proxied = true

  depends_on = [cloudflare_zone.portfolio_zones]
}

# WWW redirects
resource "cloudflare_record" "www_redirects" {
  for_each = { for domain in var.domains : domain.name => domain }

  zone_id = cloudflare_zone.portfolio_zones[each.key].id
  name    = "www"
  value   = each.key
  type    = "CNAME"
  ttl     = 1
  proxied = true

  depends_on = [cloudflare_zone.portfolio_zones]
}

# =============================================================================
# LOAD BALANCING
# =============================================================================
resource "cloudflare_load_balancer" "portfolio_lb" {
  for_each = { for domain in var.domains : domain.name => domain }

  zone_id          = cloudflare_zone.portfolio_zones[each.key].id
  name             = "${each.key}-lb"
  fallback_pool_id = cloudflare_load_balancer_pool.fallback[each.key].id
  default_pool_ids = [cloudflare_load_balancer_pool.primary[each.key].id]

  # Geographic steering
  steering_policy = "geo"

  # Session affinity
  session_affinity = "cookie"
  session_affinity_ttl = 3600
  session_affinity_attributes {
    samesite = "Strict"
    secure   = "Always"
    http_only = true
  }

  # Health checks
  adaptive_routing {
    failover_across_pools = true
  }

  depends_on = [cloudflare_zone.portfolio_zones]
}

# Primary pool (Kubernetes ingress)
resource "cloudflare_load_balancer_pool" "primary" {
  for_each = { for domain in var.domains : domain.name => domain }

  name = "${each.key}-primary-pool"

  origins {
    name    = "${each.key}-k8s"
    address = each.value.origin_ip
    enabled = true

    headers = {
      Host = each.key
    }
  }

  # Health check
  check_regions = ["ENAM", "EEUR", "ESAM", "WNAM", "WEUR", "WSAM"]

  monitor = cloudflare_load_balancer_monitor.http_monitor.id

  description = "Primary Kubernetes ingress pool for ${each.key}"
}

# Fallback pool (CDN cache/static assets)
resource "cloudflare_load_balancer_pool" "fallback" {
  for_each = { for domain in var.domains : domain.name => domain }

  name = "${each.key}-fallback-pool"

  origins {
    name    = "${each.key}-cdn"
    address = "cdn.${each.key}"
    enabled = true
  }

  monitor = cloudflare_load_balancer_monitor.http_monitor.id

  description = "Fallback CDN pool for ${each.key}"
}

# Health monitor
resource "cloudflare_load_balancer_monitor" "http_monitor" {
  type      = "http"
  interval  = 60
  timeout   = 5
  retries   = 2

  expected_codes = "200"
  method         = "GET"
  path           = "/health"
  header {
    header = "User-Agent"
    values = ["Cloudflare Load Balancer"]
  }

  description = "HTTP health check for portfolio services"
}

# =============================================================================
# WAF AND SECURITY RULES
# =============================================================================
resource "cloudflare_firewall_rule" "waf_rules" {
  for_each = { for domain in var.domains : domain.name => domain if domain.waf_enabled }

  zone_id     = cloudflare_zone.portfolio_zones[each.key].id
  description = "WAF protection for ${each.key}"
  filter_id   = cloudflare_filter.waf_filter[each.key].id
  action      = "block"

  depends_on = [cloudflare_zone.portfolio_zones]
}

resource "cloudflare_filter" "waf_filter" {
  for_each = { for domain in var.domains : domain.name => domain if domain.waf_enabled }

  zone_id     = cloudflare_zone.portfolio_zones[each.key].id
  description = "WAF filter for ${each.key}"
  expression  = "(http.request.uri.path contains \"wp-admin\" or http.request.uri.path contains \"wp-login\" or http.request.uri.path contains \"phpmyadmin\") or (http.request.method eq \"POST\" and http.request.uri.path contains \"xmlrpc.php\") or (cf.threat_score ge 10)"

  depends_on = [cloudflare_zone.portfolio_zones]
}

# Rate limiting
resource "cloudflare_rate_limit" "api_rate_limit" {
  for_each = { for domain in var.domains : domain.name => domain }

  zone_id     = cloudflare_zone.portfolio_zones[each.key].id
  description = "API rate limiting for ${each.key}"

  # Match API endpoints
  match {
    request {
      url_pattern = "${each.key}/api/*"
      schemes     = ["HTTP", "HTTPS"]
      methods     = ["GET", "POST", "PUT", "DELETE", "PATCH"]
    }
  }

  # Rate limit configuration
  threshold = 100
  period    = 60

  # Action when rate limit exceeded
  action {
    mode    = "simulate"
    timeout = 60
    response {
      content_type = "text/plain"
      body         = "Rate limit exceeded. Please try again later."
    }
  }

  depends_on = [cloudflare_zone.portfolio_zones]
}

# DDoS protection
resource "cloudflare_argo" "argo_smart_routing" {
  for_each = { for domain in var.domains : domain.name => domain }

  zone_id        = cloudflare_zone.portfolio_zones[each.key].id
  smart_routing  = "on"

  depends_on = [cloudflare_zone.portfolio_zones]
}

# =============================================================================
# PAGE RULES
# =============================================================================
resource "cloudflare_page_rule" "security_headers" {
  for_each = { for domain in var.domains : domain.name => domain }

  zone_id  = cloudflare_zone.portfolio_zones[each.key].id
  target   = "${each.key}/*"
  priority = 1

  actions {
    # Security headers
    security_header {
      enabled            = true
      include_subdomains = true
      max_age            = 31536000
      preload            = true
    }

    # Cache static assets
    cache_level = "cache_everything"

    # Browser cache TTL
    browser_cache_ttl = 14400

    # Edge cache TTL
    edge_cache_ttl = 7200
  }

  depends_on = [cloudflare_zone.portfolio_zones]
}

# =============================================================================
# WORKERS FOR EDGE COMPUTING
# =============================================================================
resource "cloudflare_worker_script" "edge_optimization" {
  for_each = { for domain in var.domains : domain.name => domain }

  name    = "${replace(each.key, ".", "_")}_edge_optimizer"
  content = file("${path.module}/workers/edge_optimizer.js")

  depends_on = [cloudflare_zone.portfolio_zones]
}

resource "cloudflare_worker_route" "edge_routes" {
  for_each = { for domain in var.domains : domain.name => domain }

  zone_id     = cloudflare_zone.portfolio_zones[each.key].id
  pattern     = "${each.key}/*"
  script_name = cloudflare_worker_script.edge_optimization[each.key].name

  depends_on = [cloudflare_worker_script.edge_optimization]
}

# =============================================================================
# ANALYTICS AND MONITORING
# =============================================================================
resource "cloudflare_logpush_job" "http_requests" {
  for_each = { for domain in var.domains : domain.name => domain }

  zone_id        = cloudflare_zone.portfolio_zones[each.key].id
  name           = "${each.key}-http-logs"
  destination_conf = "s3://portfolio-logs/${each.key}/http/ region=eu-west-1"
  dataset        = "http_requests"
  enabled        = true

  # Filter for production traffic only
  filter = "EdgeResponseStatus < 500"

  depends_on = [cloudflare_zone.portfolio_zones]
}

resource "cloudflare_logpush_job" "firewall_events" {
  for_each = { for domain in var.domains : domain.name => domain }

  zone_id        = cloudflare_zone.portfolio_zones[each.key].id
  name           = "${each.key}-firewall-logs"
  destination_conf = "s3://portfolio-logs/${each.key}/firewall/ region=eu-west-1"
  dataset        = "firewall_events"
  enabled        = true

  depends_on = [cloudflare_zone.portfolio_zones]
}

# =============================================================================
# OUTPUTS
# =============================================================================
output "zone_ids" {
  description = "Cloudflare zone IDs for each domain"
  value = {
    for domain in var.domains :
    domain.name => cloudflare_zone.portfolio_zones[domain.name].id
  }
}

output "load_balancer_ids" {
  description = "Load balancer IDs for each domain"
  value = {
    for domain in var.domains :
    domain.name => cloudflare_load_balancer.portfolio_lb[domain.name].id
  }
}

output "name_servers" {
  description = "Cloudflare name servers for DNS configuration"
  value = {
    for domain in var.domains :
    domain.name => cloudflare_zone.portfolio_zones[domain.name].name_servers
  }
}