#!/bin/bash
# Business metrics collection

echo "=== REVENUE METRICS ===" >> /var/log/business_metrics.log
date >> /var/log/business_metrics.log

# Domain availability
for domain in antonylambi.be fixie.run adaptogenic-mushrooms.com brainhealthmushrooms.com healthfulmushrooms.com tech-review-blog.com seobiz.be rhymechain.win aiftw.be puffs-store.com affinitylove.eu; do
    status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 2>/dev/null || echo "000")
    echo "$domain: HTTP $status" >> /var/log/business_metrics.log
done

# Performance metrics
echo "=== PERFORMANCE METRICS ===" >> /var/log/business_metrics.log
response_time=$(curl -o /dev/null -s -w '%{time_total}\n' http://localhost:3001 2>/dev/null || echo "0")
echo "Homepage response time: ${response_time}s" >> /var/log/business_metrics.log

# System metrics
echo "=== SYSTEM METRICS ===" >> /var/log/business_metrics.log
echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1 2>/dev/null || echo "N/A")%" >> /var/log/business_metrics.log
echo "Memory Usage: $(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}' 2>/dev/null || echo "N/A")%" >> /var/log/business_metrics.log
echo "Disk Usage: $(df -BG . | awk 'NR==2 {print $5}' | sed 's/G//' 2>/dev/null || echo "N/A")GB" >> /var/log/business_metrics.log

echo "" >> /var/log/business_metrics.log
