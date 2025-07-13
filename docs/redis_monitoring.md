# Redis Monitoring Strategy

This document outlines a basic strategy for monitoring Redis performance and availability. For a production environment, integration with a dedicated monitoring solution (e.g., Prometheus + Grafana, Datadog, New Relic) is highly recommended.

## 1. Key Redis Metrics to Monitor

*   **Availability:** Is the Redis instance up and reachable?
*   **Memory Usage:**
    *   `used_memory`: Total memory consumed by Redis.
    *   `used_memory_rss`: Resident Set Size, memory allocated by the OS.
    *   `mem_fragmentation_ratio`: Ratio of `used_memory_rss` to `used_memory`. A value > 1 indicates fragmentation.
*   **Performance:**
    *   `connected_clients`: Number of connected clients.
    *   `instantaneous_ops_per_sec`: Operations per second.
    *   `hits` / `misses`: Cache hit ratio (`keyspace_hits` / (`keyspace_hits` + `keyspace_misses`)). A low hit ratio indicates inefficient caching.
    *   `evicted_keys`: Number of keys evicted due to max memory policy.
    *   `blocked_clients`: Number of clients blocked by a blocking command (e.g., `BLPOP`).
*   **Persistence:**
    *   `rdb_last_save_time`: Timestamp of the last RDB save.
    *   `aof_last_rewrite_time_sec`: Time taken for the last AOF rewrite.
*   **Replication (if applicable):**
    *   `master_link_status`: Status of the link between master and replica.
    *   `master_repl_offset`: Replication offset of the master.
    *   `slave_repl_offset`: Replication offset of the replica.

## 2. Basic Monitoring Setup (CLI/Scripting)

For basic checks, you can use the `redis-cli` `INFO` command.

### a. Manual Checks

Connect to Redis and run `INFO`:

```bash
docker exec -it nexus-edge-redis redis-cli -a $REDIS_PASSWORD INFO
```

This will output a large amount of information. You can filter it:

```bash
docker exec -it nexus-edge-redis redis-cli -a $REDIS_PASSWORD INFO memory
docker exec -it nexus-edge-redis redis-cli -a $REDIS_PASSWORD INFO stats
```

### b. Simple Health Check Script (Example)

You can create a simple shell script to check Redis availability and key metrics.

`monitor_redis.sh`:

```bash
#!/bin/bash

REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD="${REDIS_PASSWORD}" # Ensure REDIS_PASSWORD is set in your environment

# Check if Redis is reachable
if docker exec -it nexus-edge-redis redis-cli -h $REDIS_HOST -p $REDIS_PORT -a $REDIS_PASSWORD PING &> /dev/null; then
  echo "Redis is UP."
else
  echo "Redis is DOWN or unreachable!"
  exit 1
fi

echo "--- Redis Memory Usage ---"
docker exec -it nexus-edge-redis redis-cli -h $REDIS_HOST -p $REDIS_PORT -a $REDIS_PASSWORD INFO memory | grep -E 'used_memory|mem_fragmentation_ratio'

echo "--- Redis Stats ---"
docker exec -it nexus-edge-redis redis-cli -h $REDIS_HOST -p $REDIS_PORT -a $REDIS_PASSWORD INFO stats | grep -E 'total_connections_received|total_commands_processed|instantaneous_ops_per_sec|keyspace_hits|keyspace_misses|evicted_keys'

echo "--- Redis Clients ---"
docker exec -it nexus-edge-redis redis-cli -h $REDIS_HOST -p $REDIS_PORT -a $REDIS_PASSWORD INFO clients | grep -E 'connected_clients|blocked_clients'
```

Make the script executable: `chmod +x monitor_redis.sh`
Run the script: `./monitor_redis.sh`

## 3. Integration with Monitoring Systems (Production Recommendation)

For a robust production setup, integrate Redis with a dedicated monitoring system:

*   **Prometheus & Grafana:**
    *   Deploy `redis_exporter` (a Prometheus exporter for Redis metrics).
    *   Configure Prometheus to scrape metrics from `redis_exporter`.
    *   Create Grafana dashboards to visualize Redis metrics and set up alerts.
*   **Cloud Provider Monitoring:** If Redis is deployed as a managed service (e.g., AWS ElastiCache, Azure Cache for Redis, Google Cloud Memorystore), leverage the cloud provider's native monitoring tools (CloudWatch, Azure Monitor, Cloud Monitoring) for metrics, logs, and alerting.
*   **APM Tools (Datadog, New Relic, etc.):** These tools often provide Redis integrations that collect metrics, trace commands, and offer comprehensive dashboards and alerting capabilities.

## 4. Alerting

Set up alerts for critical thresholds:
*   Redis instance down.
*   High memory usage (e.g., >80% of `maxmemory`).
*   Low cache hit ratio (e.g., <90%).
*   High `instantaneous_ops_per_sec` (indicating high load).
*   High `mem_fragmentation_ratio` (indicating memory issues).
*   High `blocked_clients`.

## 5. Logging

Configure Redis to log to a persistent volume or a centralized logging system (e.g., ELK stack, Splunk). Monitor logs for errors, warnings, and unusual activity.