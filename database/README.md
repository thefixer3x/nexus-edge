# PostgreSQL Database Scaling Strategies

This document outlines the implementation of database scaling strategies for PostgreSQL within the B2C e-commerce marketplace platform, focusing on high availability, read scaling, efficient connection management, and future scalability considerations.

## 1. Database Replication (High Availability & Read Scaling)

PostgreSQL streaming replication is configured to ensure high availability and enable read scaling. This setup involves a primary database instance and at least one read replica.

### Primary Database Configuration:
- **`postgresql.conf` settings:**
    - `wal_level = replica`
    - `max_wal_senders = 10` (or more, depending on the number of replicas)
    - `wal_keep_size = 5GB` (or sufficient size to prevent replica desynchronization)
    - `archive_mode = on`
    - `archive_command = 'cp %p /path/to/wal_archive/%f'` (for WAL archiving, e.g., to S3)
    - `listen_addresses = '*'` (or specific IP addresses for network access)
- **`pg_hba.conf` settings:**
    - Add entries to allow replication connections from read replicas:
      `host    replication     replicator_user     0.0.0.0/0       md5` (or specific replica IPs)
- **User for Replication:** A dedicated replication user (e.g., `replicator_user`) with `REPLICATION` privilege is created.

### Read Replica Configuration:
- **Base Backup:** A base backup of the primary database is taken using `pg_basebackup`.
- **`postgresql.conf` settings:**
    - `hot_standby = on`
    - `primary_conninfo = 'host=primary_db_ip port=5432 user=replicator_user password=your_password application_name=read_replica'`
    - `restore_command = 'cp /path/to/wal_archive/%f %p'` (if using WAL archiving)
    - `standby_mode = on` (for older versions, `primary_conninfo` is sufficient for newer)
- **`recovery.conf` (or `standby.signal` and `postgresql.conf` for newer versions):**
    - `standby_mode = 'on'`
    - `primary_conninfo = 'host=primary_db_ip port=5432 user=replicator_user password=your_password'`
    - `trigger_file = '/tmp/postgresql.trigger'` (for manual failover)

### Deployment Notes:
- Replication is managed by Neon MCP, abstracting much of the manual configuration. The above details represent the underlying principles.
- Automated failover and promotion of replicas are handled by the Neon MCP control plane.

## 2. Connection Pooling (PgBouncer)

PgBouncer is implemented as a lightweight connection pooler to efficiently manage database connections from microservices, reducing overhead and improving performance.

### Configuration (`pgbouncer.ini`):
```ini
[databases]
# Primary database for write operations
marketplace_primary = host=primary_db_ip port=5432 dbname=marketplace_db

# Read replica for read operations
marketplace_replica = host=read_replica_ip port=5432 dbname=marketplace_db

[users]
# Define users that PgBouncer will authenticate
pgbouncer_user = ANY

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction ; or session, depending on application needs
default_pool_size = 20
max_client_conn = 1000
reserve_pool_size = 5
reserve_timeout = 5.0
server_reset_query = DISCARD ALL
server_check_delay = 10
server_check_query = SELECT 1
```

### Userlist (`userlist.txt`):
```
"pgbouncer_user" "md5yourhashedpassword"
```
(Note: `md5yourhashedpassword` is the MD5 hash of the actual password, prefixed with `md5`.)

### Integration with Microservices:
- Microservices connect to PgBouncer's `listen_port` (e.g., 6432) instead of directly to PostgreSQL.
- Connection strings are updated to point to the PgBouncer instance.
- Separate connection pools can be configured for read-only and read-write operations, routing traffic appropriately.

### Deployment Notes:
- PgBouncer instances are deployed as sidecars or dedicated services within the Kubernetes cluster (or equivalent container orchestration).
- Configuration is managed via Kubernetes ConfigMaps and Secrets.

## 3. Sharding/Partitioning Considerations (Initial Setup)

While full sharding is planned for a later phase, initial considerations for partitioning are in place to facilitate future scalability.

### Current Approach:
- **Logical Partitioning:** For large tables (e.g., `orders`, `order_items`, `user_events`), logical partitioning by `created_at` date or `user_id` range is considered.
- **PostgreSQL Declarative Partitioning:** Utilizing PostgreSQL's built-in declarative partitioning for tables that are expected to grow significantly.
  - Example for `orders` table by `created_at`:
    ```sql
    CREATE TABLE orders (
        order_id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        total_amount NUMERIC(10, 2)
    ) PARTITION BY RANGE (created_at);

    CREATE TABLE orders_q1_2024 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

    CREATE TABLE orders_q2_2024 PARTITION OF orders
    FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');
    -- ... and so on for future quarters
    ```
- **Application-Level Routing:** Microservices are designed with the flexibility to route queries to specific partitions if needed, though this is not actively implemented for sharding yet.

### Future Sharding Plan:
- **Horizontal Sharding:** When data volume or transaction rates exceed the capacity of a single PostgreSQL instance (even with replication), horizontal sharding will be implemented.
- **Sharding Key:** `user_id` is identified as a primary candidate for the sharding key, as most queries are user-centric.
- **Sharding Middleware/Framework:** Evaluation of solutions like CitusData (for distributed PostgreSQL) or custom application-level sharding logic will be performed.
- **Data Migration Strategy:** A plan for migrating existing data to sharded instances will be developed.

## 4. Monitoring

Basic monitoring is in place to track database performance, replication status, and PgBouncer metrics.

### Key Metrics Monitored:
- **PostgreSQL:**
    - **Replication Lag:** `pg_stat_replication` (bytes_behind, replay_lag)
    - **Connection Count:** `pg_stat_activity`
    - **Query Performance:** Slow queries, active queries, query execution times
    - **Resource Utilization:** CPU, memory, disk I/O, network
    - **WAL Activity:** WAL file generation, archiving status
- **PgBouncer:**
    - **Active Connections:** Client and server connections
    - **Pool Utilization:** Idle, active, waiting connections
    - **Query Counts:** Queries processed per second
    - **Errors:** Connection errors, authentication failures

### Monitoring Tools:
- **Prometheus & Grafana:** Used for collecting, storing, and visualizing metrics.
- **Alertmanager:** Configured for alerting on critical thresholds (e.g., high replication lag, low disk space, high connection count).
- **Neon MCP Built-in Monitoring:** Leveraging the monitoring capabilities provided by Neon MCP for managed PostgreSQL instances.

### Alerting Strategy:
- **Critical Alerts:** PagerDuty/OpsGenie for immediate notification on replication failure, primary database downtime, or severe performance degradation.
- **Warning Alerts:** Slack/Email for high replication lag, increasing slow query counts, or resource utilization approaching thresholds.

This comprehensive approach ensures the PostgreSQL database can scale effectively to meet the demands of a growing e-commerce platform while maintaining high availability and performance.