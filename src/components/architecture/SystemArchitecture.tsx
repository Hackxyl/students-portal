
import { useState } from 'react'
import {
  Activity,
  ArrowDown,
  CheckCircle2,
  Database,
  Globe,
  Layers3,
  LockKeyhole,
  Network,
  Plus,
  RefreshCw,
  Server,
  ShieldCheck,
  Users,
  X,
  Zap,
} from 'lucide-react'

type InfrastructureServer = {
  id: number
  requests: number
}

type CacheScenario = 'hit' | 'miss'

const initialServers: InfrastructureServer[] = [
  { id: 1, requests: 0 },
  { id: 2, requests: 0 },
  { id: 3, requests: 0 },
]

function InfrastructureNode({
  icon: Icon,
  title,
  subtitle,
  variant,
}: {
  icon: typeof Server
  title: string
  subtitle: string
  variant: string
}) {
  return (
    <div className={`architecture-node ${variant}`}>
      <div className="architecture-node-icon">
        <Icon size={22} />
      </div>

      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  )
}

function SystemArchitecture() {
  const [servers, setServers] = useState(initialServers)
  const [scenario, setScenario] = useState<CacheScenario>('miss')
  const [requestCount, setRequestCount] = useState(0)
  const [cacheHits, setCacheHits] = useState(0)
  const [cacheMisses, setCacheMisses] = useState(0)
  const [databaseReads, setDatabaseReads] = useState(0)
  const [lastServer, setLastServer] = useState<number | null>(null)
  const [lastResult, setLastResult] = useState('')
  const [lastResponseTime, setLastResponseTime] = useState<number | null>(
    null,
  )
  const [cached, setCached] = useState(false)

  const totalServerRequests = servers.reduce(
    (total, server) => total + server.requests,
    0,
  )

  const addServer = () => {
    if (servers.length >= 6) return

    const nextId = Math.max(...servers.map((server) => server.id)) + 1

    setServers((current) => [
      ...current,
      { id: nextId, requests: 0 },
    ])
  }

  const removeServer = () => {
    if (servers.length <= 1) return

    setServers((current) => current.slice(0, -1))
  }

  const processRequest = () => {
    const selectedServer = [...servers].sort(
      (a, b) => a.requests - b.requests || a.id - b.id,
    )[0]

    if (!selectedServer) return

    setServers((current) =>
      current.map((server) =>
        server.id === selectedServer.id
          ? { ...server, requests: server.requests + 1 }
          : server,
      ),
    )

    setLastServer(selectedServer.id)
    setRequestCount((count) => count + 1)

    if (scenario === 'hit' && cached) {
      setCacheHits((count) => count + 1)
      setLastResponseTime(45)
      setLastResult(
        `Cache HIT: Application Server ${selectedServer.id} retrieved the result from Redis without querying the database.`,
      )
    } else {
      setCacheMisses((count) => count + 1)
      setDatabaseReads((count) => count + 1)
      setCached(true)
      setLastResponseTime(180)
      setLastResult(
        `Cache MISS: Application Server ${selectedServer.id} retrieved the result from the database and stored it in Redis.`,
      )
    }
  }

  const resetSimulation = () => {
    setServers(initialServers)
    setRequestCount(0)
    setCacheHits(0)
    setCacheMisses(0)
    setDatabaseReads(0)
    setLastServer(null)
    setLastResult('')
    setLastResponseTime(null)
    setCached(false)
    setScenario('miss')
  }

  const cacheHitRate =
    requestCount === 0
      ? 0
      : Math.round((cacheHits / requestCount) * 100)

  return (
    <div className="architecture-page">
      <div className="page-heading">
        <div>
          <div className="architecture-eyebrow">
            <Network size={14} />
            INFRASTRUCTURE OVERVIEW
          </div>

          <h1 className="page-title">System Architecture</h1>

          <p className="page-description">
            Explore how the Student Results Portal handles examination
            requests from 20,000 students using distributed infrastructure.
          </p>
        </div>

        <span className="architecture-demo-label">
          <span />
          Interactive simulation
        </span>
      </div>

      <div className="architecture-notice">
        <Activity size={17} />

        <p>
          <strong>Academic prototype:</strong> All servers, network
          connections, Redis operations and database requests shown here
          are simulated locally. No external infrastructure is running.
        </p>
      </div>

      <section className="architecture-stats">
        <article className="architecture-stat">
          <Users size={19} />

          <div>
            <span>Target students</span>
            <strong>20,000</strong>
          </div>
        </article>

        <article className="architecture-stat">
          <Server size={19} />

          <div>
            <span>Active application servers</span>
            <strong>{servers.length}</strong>
          </div>
        </article>

        <article className="architecture-stat">
          <Activity size={19} />

          <div>
            <span>Processed requests</span>
            <strong>{requestCount}</strong>
          </div>
        </article>

        <article className="architecture-stat">
          <Zap size={19} />

          <div>
            <span>Cache hit rate</span>
            <strong>{cacheHitRate}%</strong>
          </div>
        </article>
      </section>

      <section className="panel architecture-diagram-panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Infrastructure Diagram</h2>
            <p className="panel-description">
              Logical request flow through the portal infrastructure
            </p>
          </div>

          <span className="architecture-diagram-badge">
            <span />
            Simulated
          </span>
        </div>

        <div className="architecture-flow">
          <InfrastructureNode
            icon={Users}
            title="Student Clients"
            subtitle="20,000 students"
            variant="student"
          />

          <div className="architecture-connector">
            <ArrowDown size={19} />
            <span>HTTPS requests</span>
          </div>

          <InfrastructureNode
            icon={Globe}
            title="Internet"
            subtitle="Web browsers and mobile devices"
            variant="internet"
          />

          <div className="architecture-connector">
            <ArrowDown size={19} />
          </div>

          <InfrastructureNode
            icon={ShieldCheck}
            title="Firewall"
            subtitle="Filters incoming network traffic"
            variant="firewall"
          />

          <div className="architecture-connector">
            <ArrowDown size={19} />
          </div>

          <InfrastructureNode
            icon={Network}
            title="Load Balancer"
            subtitle="Distributes requests across application servers"
            variant="load-balancer"
          />

          <div className="architecture-connector">
            <ArrowDown size={19} />
            <span>Distributed requests</span>
          </div>

          <div className="architecture-server-group">
            <div className="architecture-group-heading">
              <Layers3 size={17} />
              <strong>Application Server Cluster</strong>
              <span>{servers.length} active</span>
            </div>

            <div className="architecture-server-grid">
              {servers.map((server) => (
                <div
                  className={`architecture-server ${lastServer === server.id ? 'selected' : ''}`}
                  key={server.id}
                >
                  <Server size={23} />

                  <strong>App Server {server.id}</strong>

                  <span>Request processing</span>

                  <div className="architecture-server-load">
                    {server.requests} requests
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="architecture-connector">
            <ArrowDown size={19} />
            <span>Application data access</span>
          </div>

          <div className="architecture-data-layer">
            <div className="architecture-data-node cache-node">
              <div className="architecture-data-icon">
                <Zap size={23} />
              </div>

              <div>
                <strong>Redis Cache</strong>
                <p>Temporary storage of frequently accessed results</p>
                <span className={cached ? 'cache-ready' : 'cache-empty'}>
                  {cached ? 'Sample result cached' : 'Cache empty'}
                </span>
              </div>
            </div>

            <div className="architecture-cache-connector">
              <ArrowDown size={17} />
              <span>Cache miss only</span>
            </div>

            <div className="architecture-data-node database-node">
              <div className="architecture-data-icon">
                <Database size={23} />
              </div>

              <div>
                <strong>Database Server</strong>
                <p>Student records, examination results and accounts</p>
                <span>Persistent storage · Mock data</span>
              </div>
            </div>
          </div>
        </div>

        <div className="architecture-legend">
          <span><i className="legend-blue" /> Network layer</span>
          <span><i className="legend-purple" /> Application layer</span>
          <span><i className="legend-green" /> Cache layer</span>
          <span><i className="legend-orange" /> Database layer</span>
        </div>
      </section>

      <section className="architecture-lower-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Request Flow Simulator</h2>
              <p className="panel-description">
                Simulate a student retrieving examination results
              </p>
            </div>

            <RefreshCw size={18} color="#2563eb" />
          </div>

          <div className="architecture-scenario">
            <span>Cache scenario</span>

            <div className="architecture-scenario-options">
              <button
                type="button"
                className={scenario === 'miss' ? 'selected' : ''}
                onClick={() => setScenario('miss')}
              >
                Cache miss
              </button>

              <button
                type="button"
                className={scenario === 'hit' ? 'selected' : ''}
                onClick={() => setScenario('hit')}
              >
                Cache hit
              </button>
            </div>
          </div>

          <p className="architecture-helper">
            {scenario === 'hit'
              ? 'A cache hit is available after the first request has populated Redis.'
              : 'A cache miss retrieves the result from the database and populates Redis.'}
          </p>

          <button
            type="button"
            className="primary-button architecture-run-button"
            onClick={processRequest}
          >
            <Zap size={16} />
            Process student request
          </button>

          {lastResult && (
            <div className="architecture-result" aria-live="polite">
              <CheckCircle2 size={19} />

              <div>
                <strong>Request processed</strong>
                <p>{lastResult}</p>
              </div>
            </div>
          )}

          {lastResponseTime !== null && (
            <div className="architecture-response">
              <span>Simulated response time</span>
              <strong>{lastResponseTime} ms</strong>
            </div>
          )}

          <div className="architecture-simulation-footer">
            <span>
              {requestCount} requests processed
            </span>

            <button type="button" onClick={resetSimulation}>
              <RefreshCw size={13} />
              Reset simulation
            </button>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Infrastructure Metrics</h2>
              <p className="panel-description">
                Results from the local simulation
              </p>
            </div>

            <Activity size={18} color="#16a34a" />
          </div>

          <div className="architecture-metric">
            <div>
              <span>Cache hits</span>
              <strong>{cacheHits}</strong>
            </div>
            <div className="metric-track">
              <div
                className="metric-fill green-fill"
                style={{
                  width: `${requestCount ? (cacheHits / requestCount) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="architecture-metric">
            <div>
              <span>Cache misses</span>
              <strong>{cacheMisses}</strong>
            </div>
            <div className="metric-track">
              <div
                className="metric-fill orange-fill"
                style={{
                  width: `${requestCount ? (cacheMisses / requestCount) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="architecture-metric">
            <div>
              <span>Database reads</span>
              <strong>{databaseReads}</strong>
            </div>
            <div className="metric-track">
              <div
                className="metric-fill blue-fill"
                style={{
                  width: `${requestCount ? (databaseReads / requestCount) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="architecture-metric">
            <div>
              <span>Application requests</span>
              <strong>{totalServerRequests}</strong>
            </div>
          </div>

          <div className="architecture-metric">
            <div>
              <span>Last selected server</span>
              <strong>
                {lastServer === null ? 'Not assigned' : `Server ${lastServer}`}
              </strong>
            </div>
          </div>

          <p className="architecture-metric-note">
            Response times and metrics are illustrative values, not measured
            production performance.
          </p>
        </div>
      </section>

      <section className="panel architecture-scaling-panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Horizontal Scaling</h2>
            <p className="panel-description">
              Increase application capacity by adding more application servers.
            </p>
          </div>

          <Layers3 size={20} color="#2563eb" />
        </div>

        <div className="architecture-scaling-content">
          <div>
            <span className="architecture-scaling-label">
              Application server instances
            </span>

            <strong className="architecture-scaling-value">
              {servers.length} / 6
            </strong>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(servers.length / 6) * 100}%` }}
              />
            </div>
          </div>

          <div className="architecture-scaling-actions">
            <button
              type="button"
              className="architecture-scale-button"
              onClick={removeServer}
              disabled={servers.length <= 1}
            >
              <X size={15} />
              Remove server
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={addServer}
              disabled={servers.length >= 6}
            >
              <Plus size={16} />
              Add server
            </button>
          </div>
        </div>

        <p className="architecture-scaling-note">
          The simulated load balancer distributes new requests to the
          application server with the lowest cumulative request count.
          Additional servers increase the number of available processing
          instances. The simulation does not measure real throughput.
        </p>
      </section>

      <section className="architecture-security-note">
        <div className="architecture-security-icon">
          <LockKeyhole size={22} />
        </div>

        <div>
          <h3>Security at every layer</h3>
          <p>
            HTTPS protects data in transit. Firewall rules restrict network
            traffic. Authentication verifies student identity, while
            authorization ensures students can only access their own results.
            Database permissions restrict access to stored academic records.
          </p>
        </div>
      </section>

      <footer className="dashboard-footer">
        <span>UniResults Academic Portal</span>
        <span>Infrastructure simulation · Sample data only</span>
      </footer>
    </div>
  )
}

export default SystemArchitecture
