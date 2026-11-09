
import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Database,
  Gauge,
  HardDrive,
  Play,
  RotateCcw,
  Server,
  Users,
  Zap,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type ServerMetric = {
  id: number
  name: string
  requests: number
  cpu: number
  memory: number
}

const baselineServers: ServerMetric[] = [
  { id: 1, name: 'Application Server 1', requests: 4000, cpu: 42, memory: 58 },
  { id: 2, name: 'Application Server 2', requests: 4000, cpu: 39, memory: 54 },
  { id: 3, name: 'Application Server 3', requests: 4000, cpu: 41, memory: 56 },
]

const trafficData = [
  { time: '08:00', requests: 1200 },
  { time: '08:05', requests: 2100 },
  { time: '08:10', requests: 3400 },
  { time: '08:15', requests: 2900 },
  { time: '08:20', requests: 4800 },
  { time: '08:25', requests: 6200 },
  { time: '08:30', requests: 5400 },
  { time: '08:35', requests: 7600 },
  { time: '08:40', requests: 8900 },
  { time: '08:45', requests: 7200 },
  { time: '08:50', requests: 9600 },
  { time: '08:55', requests: 10000 },
]

const peakTrafficData = [
  { time: '08:00', requests: 3000 },
  { time: '08:05', requests: 5200 },
  { time: '08:10', requests: 7800 },
  { time: '08:15', requests: 9600 },
  { time: '08:20', requests: 12500 },
  { time: '08:25', requests: 14800 },
  { time: '08:30', requests: 16300 },
  { time: '08:35', requests: 17800 },
  { time: '08:40', requests: 19000 },
  { time: '08:45', requests: 20000 },
  { time: '08:50', requests: 20000 },
  { time: '08:55', requests: 20000 },
]

function MetricCard({
  label,
  value,
  unit,
  description,
  icon: Icon,
  trend,
}: {
  label: string
  value: string
  unit?: string
  description: string
  icon: typeof Activity
  trend?: 'up' | 'down'
}) {
  return (
    <article className="monitor-metric-card">
      <div className="monitor-metric-top">
        <span className="monitor-metric-icon">
          <Icon size={19} />
        </span>
        {trend && (
          <span className={`monitor-trend monitor-trend-${trend}`}>
            {trend === 'up' ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
            {trend === 'up' ? 'Increased' : 'Reduced'}
          </span>
        )}
      </div>
      <p className="monitor-metric-label">{label}</p>
      <div className="monitor-metric-value">
        {value}
        {unit && <span>{unit}</span>}
      </div>
      <p className="monitor-metric-description">{description}</p>
    </article>
  )
}

function UsageBar({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="monitor-usage">
      <div className="monitor-usage-heading">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div
        className="monitor-usage-track"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function PerformanceMonitor() {
  const [peakMode, setPeakMode] = useState(false)

  const servers = useMemo<ServerMetric[]>(() => {
    if (!peakMode) return baselineServers

    return [
      { id: 1, name: 'Application Server 1', requests: 6800, cpu: 68, memory: 64 },
      { id: 2, name: 'Application Server 2', requests: 6650, cpu: 65, memory: 62 },
      { id: 3, name: 'Application Server 3', requests: 6550, cpu: 67, memory: 63 },
      { id: 4, name: 'Application Server 4', requests: 0, cpu: 12, memory: 24 },
    ]
  }, [peakMode])

  const totalRequests = peakMode ? 20000 : 12000
const cacheHitRate = peakMode ? 86.5 : 78.2
const responseTime = peakMode ? 184 : 126

const databaseReads = Math.round(
  totalRequests * (100 - cacheHitRate) / 100,
)

const chartData = peakMode ? peakTrafficData : trafficData

  const totalServerRequests = servers.reduce(
    (total, server) => total + server.requests,
    0,
  )

  return (
    <section className="monitor-page">
      <header className="monitor-header">
        <div>
          <div className="monitor-eyebrow">
            <Activity size={14} />
            SYSTEM OBSERVABILITY
          </div>
          <h1>Performance Monitor</h1>
          <p>
            Monitor simulated portal traffic, application servers, and cache
            performance during examination results release.
          </p>
        </div>

        <div className="monitor-header-actions">
          <span className="monitor-simulation-status">
            <span />
            SIMULATION MODE
          </span>
          <button
            type="button"
            className="monitor-reset-button"
            onClick={() => setPeakMode(false)}
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>
      </header>

      <div className="monitor-notice">
        <Gauge size={19} />
        <div>
          <strong>Demonstration data only</strong>
          <p>
            These figures are illustrative. This prototype does not connect to
            real servers, Redis, a database monitoring service, or a load
            testing tool.
          </p>
        </div>
      </div>

      <div className="monitor-scenario">
        <div>
          <span className="monitor-section-kicker">TRAFFIC SCENARIO</span>
          <h2>{peakMode ? 'Examination release day' : 'Normal portal activity'}</h2>
          <p>
            {peakMode
              ? '20,000 virtual student requests distributed across the application server cluster.'
              : 'A baseline scenario representing regular student portal activity.'}
          </p>
        </div>

        <button
          type="button"
          className="monitor-simulation-button"
          onClick={() => setPeakMode((current) => !current)}
        >
          {peakMode ? <RotateCcw size={16} /> : <Play size={16} />}
          {peakMode ? 'Show baseline' : 'Simulate 20,000 requests'}
        </button>
      </div>

      <div className="monitor-metrics-grid">
        <MetricCard
          label="Virtual requests"
          value={totalRequests.toLocaleString()}
          description="Requests in the selected scenario"
          icon={Users}
          trend={peakMode ? 'up' : undefined}
        />
        <MetricCard
          label="Average response"
          value={String(responseTime)}
          unit="ms"
          description="Illustrative request response time"
          icon={Zap}
        />
        <MetricCard
          label="Redis cache hit rate"
          value={String(cacheHitRate)}
          unit="%"
          description="Requests served from simulated cache"
          icon={HardDrive}
          trend={peakMode ? 'up' : undefined}
        />
        <MetricCard
          label="Database reads"
          value={databaseReads.toLocaleString()}
          description="Illustrative cache-miss reads"
          icon={Database}
          trend={peakMode ? 'up' : undefined}
        />
      </div>

      <div className="monitor-main-grid">
        <article className="monitor-panel monitor-traffic-panel">
          <div className="monitor-panel-heading">
            <div>
              <span className="monitor-section-kicker">REQUEST ACTIVITY</span>
              <h2>Incoming traffic</h2>
            </div>
            <span className="monitor-chart-unit">Requests / interval</span>
          </div>

          <div className="monitor-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 12, right: 8, left: -18, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="monitorTrafficFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#252936" strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#858b9b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={20}
                />
                <YAxis
                  tick={{ fill: '#858b9b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value: number) => `${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: '#171a23',
                    border: '1px solid #303442',
                    borderRadius: '10px',
                    color: '#f4f4f5',
                  }}
                  labelStyle={{ color: '#a1a1aa' }}
                  formatter={(value) => [
                    Number(value).toLocaleString(),
                    'Requests',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#9b7af8"
                  strokeWidth={2.5}
                  fill="url(#monitorTrafficFill)"
                  activeDot={{ r: 5, fill: '#9b7af8' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="monitor-panel monitor-cache-panel">
          <div className="monitor-panel-heading">
            <div>
              <span className="monitor-section-kicker">CACHE PERFORMANCE</span>
              <h2>Redis cache</h2>
            </div>
            <span className="monitor-status-pill">
              <span />
              Simulated
            </span>
          </div>

          <div className="monitor-cache-score">
            <div>
              <strong>{cacheHitRate}%</strong>
              <span>Cache hit rate</span>
            </div>
            <div className="monitor-cache-icon">
              <HardDrive size={25} />
            </div>
          </div>

          <div className="monitor-cache-bar">
            <span style={{ width: `${cacheHitRate}%` }} />
          </div>

          <div className="monitor-cache-stats">
            <div>
              <span className="monitor-dot monitor-dot-purple" />
              <span>Cache hits</span>
              <strong>{Math.round(totalRequests * cacheHitRate / 100).toLocaleString()}</strong>
            </div>
            <div>
              <span className="monitor-dot monitor-dot-orange" />
              <span>Cache misses</span>
              <strong>{Math.round(totalRequests * (100 - cacheHitRate) / 100).toLocaleString()}</strong>
            </div>
          </div>

          <div className="monitor-cache-explanation">
            <CheckCircle2 size={16} />
            <p>
              Cached results reduce repeated database queries and help improve
              response times during high traffic.
            </p>
          </div>
        </article>
      </div>

      <article className="monitor-panel monitor-servers-panel">
        <div className="monitor-panel-heading">
          <div>
            <span className="monitor-section-kicker">HORIZONTAL SCALING</span>
            <h2>Application server cluster</h2>
            <p>
              The load balancer distributes incoming requests across available
              application servers.
            </p>
          </div>
          <span className="monitor-server-count">
            {servers.length} servers
          </span>
        </div>

        <div className="monitor-server-list">
          {servers.map((server) => (
            <div className="monitor-server-card" key={server.id}>
              <div className="monitor-server-heading">
                <span className="monitor-server-icon">
                  <Server size={19} />
                </span>
                <div>
                  <strong>{server.name}</strong>
                  <span className="monitor-server-health">
                    <span />
                    {server.requests > 0 ? 'Active' : 'New capacity'}
                  </span>
                </div>
              </div>

              <div className="monitor-server-requests">
                <strong>{server.requests.toLocaleString()}</strong>
                <span>Assigned requests</span>
              </div>

              <UsageBar label="CPU usage" value={server.cpu} />
              <UsageBar label="Memory usage" value={server.memory} />
            </div>
          ))}
        </div>

        <div className="monitor-cluster-footer">
          <div>
            <CheckCircle2 size={17} />
            <span>
              {peakMode
                ? 'An additional application server demonstrates horizontal scaling.'
                : 'Three application servers are available in the baseline scenario.'}
            </span>
          </div>
          <span>
            {totalServerRequests.toLocaleString()} assigned requests
          </span>
        </div>
      </article>

      <div className="monitor-bottom-grid">
        <article className="monitor-panel">
          <div className="monitor-panel-heading">
            <div>
              <span className="monitor-section-kicker">REQUEST ROUTING</span>
              <h2>Load balancer</h2>
            </div>
            <span className="monitor-status-pill">
              <span />
              Active in simulation
            </span>
          </div>

          <div className="monitor-lb-flow">
            <div className="monitor-lb-node">
              <Users size={20} />
              <strong>Students</strong>
              <span>20,000 virtual users</span>
            </div>
            <div className="monitor-flow-line">
              <span />
              <ArrowDown size={16} />
            </div>
            <div className="monitor-lb-node monitor-lb-highlight">
              <Gauge size={20} />
              <strong>Load balancer</strong>
              <span>Distributes requests</span>
            </div>
            <div className="monitor-flow-line">
              <span />
              <ArrowDown size={16} />
            </div>
            <div className="monitor-lb-destinations">
              <span>App 1</span>
              <span>App 2</span>
              <span>App 3</span>
              {peakMode && <span>App 4</span>}
            </div>
          </div>
        </article>

        <article className="monitor-panel monitor-database-panel">
          <div className="monitor-panel-heading">
            <div>
              <span className="monitor-section-kicker">PERSISTENT STORAGE</span>
              <h2>Database server</h2>
            </div>
            <Database size={21} />
          </div>
          <div className="monitor-database-stat">
            <strong>{databaseReads.toLocaleString()}</strong>
            <span>Illustrative database reads</span>
          </div>
          <div className="monitor-database-details">
            <div>
              <span>Data source</span>
              <strong>Mock examination records</strong>
            </div>
            <div>
              <span>Access path</span>
              <strong>Application server</strong>
            </div>
            <div>
              <span>Cache strategy</span>
              <strong>Cache-aside pattern</strong>
            </div>
          </div>
        </article>
      </div>

      <footer className="monitor-footer">
        <Activity size={15} />
        <span>
          Student Results Portal prototype · Metrics are illustrative and do
          not represent a real load test or production monitoring system.
        </span>
      </footer>
    </section>
  )
}
