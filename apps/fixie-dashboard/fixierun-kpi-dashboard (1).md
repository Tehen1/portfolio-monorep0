# 📊 FIXIERUN - KPI DASHBOARD & METRICS
**Real-Time Monitoring | Business & Technical Metrics**

**Status** : ✅ Production Ready  
**Tools** : Grafana, Dune Analytics, Datadog  
**Audience** : Product Managers, Finance, Operations

---

## 📈 KEY PRODUCT METRICS

### Daily Active Users (DAU) & Cohorts

```sql
-- Dune Analytics Query: DAU Trend
SELECT
  DATE(block_time) as date,
  COUNT(DISTINCT user_address) as dau,
  COUNT(DISTINCT user_address) OVER (ORDER BY DATE(block_time)) as cumulative_users
FROM blockchain.events
WHERE event_name = 'ActivityMinted'
  AND block_time >= NOW() - INTERVAL '90 days'
GROUP BY DATE(block_time)
ORDER BY date DESC;
```

**Target Tracking** :
| Month | Target | Actual | Δ |
|-------|--------|--------|---|
| Nov 2025 | 25K | 31.2K | ✅ +24.8% |
| Dec 2025 | 35K | TBD | - |
| Q1 2026 | 50K | - | - |
| Q2 2026 | 75K | - | - |

---

### 7-Day & 30-Day Retention

```sql
-- 7-Day Retention Cohort
WITH first_activity AS (
  SELECT
    user_address,
    DATE(block_time) as first_date,
    MIN(DATE(block_time)) OVER (PARTITION BY user_address) as cohort_date
  FROM blockchain.events
  WHERE event_name = 'ActivityMinted'
)
SELECT
  cohort_date,
  COUNT(*) as cohort_size,
  SUM(CASE WHEN first_date <= cohort_date + 7 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as retention_d7,
  SUM(CASE WHEN first_date <= cohort_date + 30 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as retention_d30
FROM first_activity
GROUP BY cohort_date
ORDER BY cohort_date DESC;
```

**Current Status** :
- 7-day retention: **52%**
- 30-day retention: **32%**
- Target Q1: 65% / 45%

---

## 💰 ECONOMIC METRICS

### Total Value Locked (TVL)

```sql
-- TVL across all chains
SELECT
  DATE(block_time) as date,
  SUM(CASE WHEN contract_name = 'NFTStaking' THEN amount_usd ELSE 0 END) as nft_staking_tvl,
  SUM(CASE WHEN contract_name = 'LiquidityPool' THEN amount_usd ELSE 0 END) as liquidity_tvl,
  SUM(CASE WHEN contract_name = 'FarmsPool' THEN amount_usd ELSE 0 END) as farms_tvl,
  SUM(amount_usd) as total_tvl
FROM dune.blockchain.tvl_history
WHERE protocol = 'FixieRun'
GROUP BY date
ORDER BY date DESC;
```

**TVL Breakdown** (Nov 2025):
| Pool | Amount | % of Total |
|------|--------|-----------|
| NFT Staking | €1.2M | 50% |
| Liquidity (AMM) | €600K | 25% |
| Yield Farming | €500K | 21% |
| Insurance Fund | €100K | 4% |
| **TOTAL** | **€2.4M** | **100%** |

**Target** : €5M by Q4 2025

---

### Revenue Per User (ARPU)

```sql
-- Monthly ARPU
SELECT
  DATE_TRUNC('month', block_time) as month,
  COUNT(DISTINCT user_address) as monthly_users,
  SUM(platform_fees_usd) as total_fees,
  SUM(platform_fees_usd) / COUNT(DISTINCT user_address) as arpu
FROM blockchain.transactions
WHERE block_time >= NOW() - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', block_time)
ORDER BY month DESC;
```

**Current ARPU** : €2.50/user/month  
**Target** : €4.00 by Q4 2025

---

## 🎮 ENGAGEMENT METRICS

### Sessions & Session Duration

```sql
-- Daily sessions and average duration
SELECT
  DATE(session_start) as date,
  COUNT(*) as total_sessions,
  COUNT(DISTINCT user_address) as unique_users,
  ROUND(AVG(EXTRACT(EPOCH FROM (session_end - session_start)) / 60), 1) as avg_duration_min
FROM app_analytics.sessions
WHERE session_start >= NOW() - INTERVAL '30 days'
GROUP BY DATE(session_start)
ORDER BY date DESC;
```

**Metrics** :
- Sessions/day: **67,800** (target: 50K)
- Avg session duration: **8.5 min** (target: 10 min)
- Sessions/user/day: **2.2** (target: 2.5)

---

### Feature Adoption Rates

```sql
-- Feature adoption tracking
SELECT
  feature_name,
  COUNT(DISTINCT user_address) as users_adopted,
  ROUND(100.0 * COUNT(DISTINCT user_address) / (SELECT COUNT(DISTINCT user_address) FROM users), 1) as adoption_rate,
  ROUND(AVG(daily_usage_count), 1) as avg_daily_usage
FROM app_analytics.feature_usage
WHERE date >= NOW() - INTERVAL '30 days'
GROUP BY feature_name
ORDER BY adoption_rate DESC;
```

**Adoption Rates** :
- NFT Minting: **78%** ✅
- Staking: **42%** (target: 60%)
- Marketplace: **18%** (target: 40%)
- Social (beta): **5%** (launching Q4)

---

## 🔐 SECURITY & FRAUD METRICS

### Fraud Detection Performance

```sql
-- Fraud detection model performance
SELECT
  DATE(check_timestamp) as date,
  COUNT(*) as total_checks,
  SUM(CASE WHEN is_fraud = TRUE THEN 1 ELSE 0 END) as flagged_as_fraud,
  SUM(CASE WHEN is_fraud = TRUE AND manually_verified = TRUE THEN 1 ELSE 0 END) as confirmed_fraud,
  ROUND(100.0 * SUM(CASE WHEN is_fraud = TRUE AND manually_verified = TRUE THEN 1 ELSE 0 END) / COUNT(*), 2) as accuracy_pct
FROM fraud_detection.checks
WHERE check_timestamp >= NOW() - INTERVAL '30 days'
GROUP BY date
ORDER BY date DESC;
```

**Current Performance** :
- Fraud Detection Rate: **99.4%** ✅
- False Positive Rate: **0.3%** (target: <0.2%)
- Precision: **98.5%**
- Recall: **95.2%**

---

## 🔧 TECHNICAL METRICS

### API Performance

```sql
-- API latency tracking (P50, P95, P99)
SELECT
  endpoint,
  DATE(request_time) as date,
  COUNT(*) as total_requests,
  ROUND(PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY latency_ms), 0) as p50_ms,
  ROUND(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY latency_ms), 0) as p95_ms,
  ROUND(PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY latency_ms), 0) as p99_ms,
  SUM(CASE WHEN error_code IS NOT NULL THEN 1 ELSE 0 END) as error_count
FROM api_logs.requests
WHERE request_time >= NOW() - INTERVAL '30 days'
GROUP BY endpoint, date
ORDER BY date DESC, p95_ms DESC;
```

**Latency SLAs** :
| Endpoint | P95 | Target | Status |
|----------|-----|--------|--------|
| /api/activities | 120ms | <200ms | ✅ |
| /api/rewards | 85ms | <150ms | ✅ |
| /api/sync/google-fit | 340ms | <500ms | ✅ |
| /api/blockchain/mint | 250ms | <400ms | ✅ |

---

### Blockchain Transaction Costs

```sql
-- Gas costs per chain
SELECT
  blockchain,
  DATE(transaction_timestamp) as date,
  AVG(gas_used) as avg_gas,
  AVG(gas_price_usd) as avg_gas_price_usd,
  AVG(total_cost_usd) as avg_cost_usd
FROM blockchain.transactions
WHERE transaction_timestamp >= NOW() - INTERVAL '30 days'
GROUP BY blockchain, date
ORDER BY date DESC;
```

**Cost Tracking** :
| Chain | Avg Cost | Target |
|-------|----------|--------|
| zkSync Era | €0.0032 | <€0.01 ✅ |
| Scroll | €0.0045 | <€0.01 ✅ |
| Polygon | €0.006 | <€0.01 ✅ |
| Solana | $0.00002 | <$0.001 ✅ |

---

### Uptime & Reliability

```sql
-- System uptime tracking
SELECT
  service,
  DATE(check_time) as date,
  ROUND(100.0 * (COUNT(*) - SUM(CASE WHEN status != 'UP' THEN 1 ELSE 0 END)) / COUNT(*), 2) as uptime_pct
FROM monitoring.health_checks
WHERE check_time >= NOW() - INTERVAL '30 days'
GROUP BY service, date
ORDER BY date DESC;
```

**Uptime Status** :
- API Servers: **99.97%** (target: 99.9%) ✅
- Database: **99.99%** ✅
- Smart Contracts: **100%** (no emergency pause)
- CDN: **99.98%** ✅

---

## 📊 GRAFANA DASHBOARD CONFIG

### Dashboard JSON (Copy-paste to Grafana)

```json
{
  \"dashboard\": {
    \"title\": \"FixieRun - KPI Dashboard\",
    \"timezone\": \"UTC\",
    \"panels\": [
      {
        \"title\": \"Daily Active Users (DAU)\",
        \"targets\": [
          {
            \"expr\": \"sum(rate(fixierun_mints_total[1d]))\",
            \"legendFormat\": \"DAU\"
          }
        ],
        \"type\": \"graph\"
      },
      {
        \"title\": \"Total Value Locked (TVL)\",
        \"targets\": [
          {
            \"datasource\": \"Dune\",
            \"query\": \"SELECT SUM(amount_usd) as tvl FROM fixierun_tvl\"
          }
        ],
        \"type\": \"stat\"
      },
      {
        \"title\": \"API Latency - P95\",
        \"targets\": [
          {
            \"expr\": \"histogram_quantile(0.95, fixierun_api_latency_ms)\",
            \"legendFormat\": \"P95 Latency\"
          }
        ],
        \"type\": \"graph\"
      },
      {
        \"title\": \"Fraud Detection Accuracy\",
        \"targets\": [
          {
            \"expr\": \"rate(fixierun_fraud_correct[5m])\",
            \"legendFormat\": \"Accuracy\"
          }
        ],
        \"type\": \"gauge\"
      },
      {
        \"title\": \"Smart Contract Gas Costs\",
        \"targets\": [
          {
            \"expr\": \"avg(fixierun_gas_cost_usd)\",
            \"legendFormat\": \"Avg Gas Cost\"
          }
        ],
        \"type\": \"stat\"
      },
      {
        \"title\": \"System Uptime\",
        \"targets\": [
          {
            \"expr\": \"avg(fixierun_uptime_percentage)\",\n            \"legendFormat\": \"Uptime\"\n          }\n        ],\n        \"type\": \"stat\"\n      }\n    ]\n  }\n}\n```\n\n---\n\n## 🚨 ALERT RULES (PagerDuty/Slack)\n\n### Critical Alerts\n\n```yaml\n# DAU drops >30% day-over-day\n- alert: DAUDropCritical\n  expr: rate(fixierun_dau[1d]) < 0.7 * rate(fixierun_dau[1d] offset 1d)\n  for: 30m\n  annotations:\n    severity: critical\n    message: \"DAU dropped >30% YoY. Investigating...\"\n\n# API latency P95 > 1s\n- alert: APILatencyHigh\n  expr: histogram_quantile(0.95, fixierun_api_latency_ms) > 1000\n  for: 5m\n  annotations:\n    severity: critical\n    action: \"Check database / API servers\"\n\n# Uptime < 99%\n- alert: UptimeLow\n  expr: avg(fixierun_uptime_percentage) < 99\n  for: 1m\n  annotations:\n    severity: critical\n    action: \"Page on-call engineer\"\n\n# Smart contract exploit detected\n- alert: FraudDetectionAccuracyDrop\n  expr: fixierun_fraud_accuracy < 0.99\n  for: 5m\n  annotations:\n    severity: critical\n    action: \"Pause contract + investigate\"\n```\n\n---\n\n## 📱 SLACK INTEGRATION\n\n### Daily Digest Message\n\n```\n⚡ FIXIERUN - DAILY DIGEST (Nov 21, 2025)\n\n📊 Key Metrics\n├─ DAU: 31,200 (+2.1% vs yesterday)\n├─ Sessions: 67,800 (+1.8%)\n├─ TVL: €2.4M (stable)\n└─ Revenue: €15K (+5%)\n\n💰 Economics\n├─ ARPU: €2.50 (stable)\n├─ NFT Volume: €150K/month\n├─ $FIXIE Price: €0.32 (-2%)\n└─ $PEDAL Price: €0.012 (stable)\n\n🔐 Security\n├─ Fraud Accuracy: 99.4% ✅\n├─ Uptime: 99.97% ✅\n└─ Incidents: 0\n\n⚠️ Alerts: None\n\nView full dashboard: https://grafana.fixierun.app\n```\n\n---\n\n## 📋 OKRs TRACKING\n\n### Q4 2025 OKRs\n\n| OKR | Current | Target | Progress |\n|-----|---------|--------|----------|\n| 50K DAU | 31.2K | 50K | 62% |\n| €5M TVL | €2.4M | €5M | 48% |\n| 65% D7 Retention | 52% | 65% | 80% |\n| 99.4% Fraud Detection | 99.4% | 99.5% | 100% |\n| <500ms API Latency P95 | 340ms | 500ms | ✅ |  \n| €300K NFT volume/month | €150K | €300K | 50% |\n\n---\n\n## 🎯 SUCCESS CRITERIA\n\nTo declare Q1 2026 \"successful\":\n\n✅ **Product** \n- DAU ≥ 50K\n- 7-day retention ≥ 65%\n- ARPU ≥ €4.00\n- TVL ≥ €5M\n\n✅ **Technical**\n- Uptime ≥ 99.9%\n- P95 latency ≤ 500ms\n- Zero critical security incidents\n- Fraud detection ≥ 99.5%\n\n✅ **Business**\n- Revenue ≥ €40K/month\n- All OKRs at 80%+\n- Zero regulatory issues\n- Community NPS ≥ 50\n\n---\n\n**Document Version** : 1.0  \n**Last Updated** : 21 Novembre 2025\n