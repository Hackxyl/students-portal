
import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  AlertTriangle,
  Award,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Database,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Network,
  RefreshCw,
  ShieldCheck,
  Users,
  X,
  Server,
  LockKeyhole,
  ArrowRight,
  Gauge,
} from 'lucide-react'

import SystemArchitecture from './components/architecture/SystemArchitecture'
import MyResults from './components/results/MyResults'
import Transcript from './components/transcript/Transcript'
import MyCourses from './components/courses/MyCourses'
import MyProfile from './components/profile/MyProfile'
import PerformanceMonitor from './components/monitor/PerformanceMonitor'
import SecurityCenter from './components/security/SecurityCenter'
import ResultsManagement, {
  initialResults,
} from './components/admin/ResultsManagement'

import type {
  ManagedResult,
} from './components/admin/ResultsManagement'
import ReleaseManagement from './components/admin/ReleaseManagement'
import StudentManagement, {
  initialStudents,
} from './components/admin/StudentManagement'

import type {
  ManagedStudent,
} from './components/admin/StudentManagement'

type Portal = 'student' | 'admin'

type NavigationItem = {
  label: string
  icon: LucideIcon
}

const studentNavigation: NavigationItem[] = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'My Results', icon: ClipboardList },
  { label: 'Transcript', icon: FileText },
  { label: 'My Courses', icon: BookOpen },
  { label: 'My Profile', icon: Users },
]

const adminNavigation: NavigationItem[] = [
  { label: 'Admin Dashboard', icon: LayoutDashboard },
  { label: 'Results Management', icon: ClipboardCheck },
  { label: 'Release Management', icon: Award },
  { label: 'Student Management', icon: Users },
  { label: 'System Architecture', icon: Network },
  { label: 'Performance Monitor', icon: Activity },
  { label: 'Security Center', icon: ShieldCheck },
]

const examinationResults = [
  {
    code: 'BIT 310',
    unit: 'Database Management Systems',
    credits: 3,
    marks: 85,
    grade: 'A',
    status: 'Passed',
  },
  {
    code: 'BIT 320',
    unit: 'Web Application Development',
    credits: 3,
    marks: 78,
    grade: 'A-',
    status: 'Passed',
  },
  {
    code: 'BIT 315',
    unit: 'Computer Networks',
    credits: 3,
    marks: 72,
    grade: 'B+',
    status: 'Passed',
  },
  {
    code: 'BIT 330',
    unit: 'Systems Analysis and Design',
    credits: 3,
    marks: 68,
    grade: 'B',
    status: 'Passed',
  },
]

const pageDescriptions: Record<string, string> = {
  'Results Management':
    'Prepare, validate and review examination results before publication.',
  'Release Management':
    'Control the examination results publication process and student access.',
  'Student Management':
    'Review student records associated with the examination release.',
}



function PortalSelection({
  onSelect,
}: {
  onSelect: (portal: Portal) => void
}) {
  return (
    <div className="portal-selection">
      <div className="portal-selection-header">
        <div className="portal-selection-brand">
          <div className="portal-selection-logo">
            <GraduationCap size={28} />
          </div>
          <div>
            <h1>UniResults</h1>
            <p>UNIVERSITY RESULTS PORTAL</p>
          </div>
        </div>

        <span className="portal-demo-badge">
          <span />
          Academic prototype
        </span>
      </div>

      <div className="portal-selection-content">
        <div className="portal-selection-heading">
          <span className="portal-eyebrow">WELCOME TO UNIRESULTS</span>
          <h2>Choose your portal</h2>
          <p>
            Select the portal that corresponds to your role to continue.
          </p>
        </div>

        <div className="portal-choice-grid">
          <button
            type="button"
            className="portal-choice-card student-choice"
            onClick={() => onSelect('student')}
          >
            <div className="portal-choice-icon">
              <GraduationCap size={30} />
            </div>

            <span className="portal-choice-label">STUDENT ACCESS</span>
            <h3>Student Portal</h3>
            <p>
              Access examination results, academic transcripts,
              registered courses and your student profile.
            </p>

            <div className="portal-choice-footer">
              <span>Continue as student</span>
              <ArrowRight size={18} />
            </div>
          </button>

          <button
            type="button"
            className="portal-choice-card admin-choice"
            onClick={() => onSelect('admin')}
          >
            <div className="portal-choice-icon">
              <ShieldCheck size={30} />
            </div>

            <span className="portal-choice-label">AUTHORIZED STAFF</span>
            <h3>Admin Portal</h3>
            <p>
              Manage examination results, control publication and
              monitor release-day infrastructure.
            </p>

            <div className="portal-choice-footer">
              <span>Continue as administrator</span>
              <ArrowRight size={18} />
            </div>
          </button>
        </div>

        <div className="portal-selection-note">
          <LockKeyhole size={16} />
          <span>
            This is a demonstration portal. Portal selection simulates
            role separation and does not perform real authentication.
          </span>
        </div>
      </div>

      <footer className="portal-selection-footer">
        UniResults Academic Prototype · 2026/2027
      </footer>
    </div>
  )
}

function Sidebar({
  portal,
  activePage,
  onNavigate,
  isOpen,
  onSwitchPortal,
}: {
  portal: Portal
  activePage: string
  onNavigate: (page: string) => void
  isOpen: boolean
  onSwitchPortal: () => void
}) {
  const navigation =
    portal === 'student' ? studentNavigation : adminNavigation

  const portalName =
    portal === 'student' ? 'STUDENT PORTAL' : 'ADMIN PORTAL'

  const accountName =
    portal === 'student' ? 'Alex Morgan' : 'System Administrator'

  const accountRole =
    portal === 'student' ? 'Student account' : 'Administrator account'

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="brand">
        <div className="brand-icon">
          <GraduationCap size={25} />
        </div>

        <div>
          <div className="brand-name">UniResults</div>
          <div className="brand-subtitle">ACADEMIC PORTAL</div>
        </div>
      </div>

      <div className="nav-section">
        <p className="nav-heading">{portalName}</p>

        <nav className="nav-list" aria-label={portalName}>
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              className={`nav-link ${
                activePage === label ? 'active' : ''
              }`}
              onClick={() => onNavigate(label)}
              aria-current={activePage === label ? 'page' : undefined}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="student-mini-profile">
          <div className="avatar">
            {portal === 'student' ? 'AM' : 'AD'}
          </div>

          <div className="profile-details">
            <div className="profile-name">{accountName}</div>
            <div className="profile-role">{accountRole}</div>
          </div>
        </div>

        <button
  type="button"
  className="portal-switch-button"
  onClick={onSwitchPortal}
  aria-label={portal === 'admin' ? 'Switch account' : 'Switch portal'}
>
  <LogOut size={15} />
  {portal === 'admin' ? 'Switch account' : 'Switch portal'}
</button>
      </div>
    </aside>
  )
}

function StudentDashboard({
  onNavigate,
}: {
  onNavigate: (page: string) => void
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <h1 className="page-title">Academic Overview</h1>
          <p className="page-description">
            Welcome back, Alex. Here is an overview of your academic progress.
          </p>
        </div>

        <div className="prototype-label">
          <span className="prototype-dot" />
          Prototype environment
        </div>
      </div>

      <section className="stats-grid" aria-label="Academic statistics">
        <StatCard
          icon={BookOpen}
          label="Registered Units"
          value="8"
          description="Current academic semester"
          color="#2563eb"
          background="#eff6ff"
        />

        <StatCard
          icon={Award}
          label="Current GPA"
          value="3.65"
          description="Based on sample results"
          color="#16a34a"
          background="#f0fdf4"
        />

        <StatCard
          icon={ClipboardList}
          label="Completed Units"
          value="24"
          description="Across previous semesters"
          color="#9333ea"
          background="#faf5ff"
        />

        <StatCard
          icon={FileText}
          label="Latest Results"
          value="Published"
          description="Semester II · 2026/2027"
          color="#d97706"
          background="#fffbeb"
        />
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Recent Examination Results</h2>
              <p className="panel-description">
                Sample academic performance records
              </p>
            </div>

            <button
              className="text-action"
              type="button"
              onClick={() => onNavigate('My Results')}
            >
              View all <ChevronRight size={15} />
            </button>
          </div>

          <div className="table-wrapper">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Unit</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {examinationResults.map((result) => (
                  <tr key={result.code}>
                    <td>
                      <div className="unit-name">{result.unit}</div>
                      <div className="unit-code">{result.code}</div>
                    </td>
                    <td>{result.marks}%</td>
                    <td>
                      <span className="grade-badge">{result.grade}</span>
                    </td>
                    <td>
                      <span className="result-status">
                        <span className="status-dot" />
                        {result.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            Showing 4 sample examination records
          </div>
        </div>

        <div className="right-column">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Results Availability</h2>
                <p className="panel-description">
                  Examination release information
                </p>
              </div>

              <CheckCircle2 size={19} color="#16a34a" />
            </div>

            <div className="system-status-banner">
              <div className="status-indicator">
                <span className="status-dot" />
                Results published
              </div>
              <p>
                Sample results are available in this prototype.
              </p>
            </div>

            <div className="system-metric">
              <span className="system-metric-label">Academic year</span>
              <span className="system-metric-value">2026/2027</span>
            </div>

            <div className="system-metric">
              <span className="system-metric-label">Semester</span>
              <span className="system-metric-value">Semester II</span>
            </div>

            <div className="system-metric">
              <span className="system-metric-label">Result status</span>
              <span className="system-metric-value">Published</span>
            </div>
          </div>

          <div className="panel quick-access">
            <h2 className="panel-title">Academic Transcript</h2>
            <p className="panel-description">
              Review your academic history and printable transcript.
            </p>

            <button
              className="architecture-button"
              type="button"
              onClick={() => onNavigate('Transcript')}
            >
              View transcript
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      <footer className="dashboard-footer">
        <span>UniResults Student Portal</span>
        <span>Academic Prototype · Sample Data</span>
      </footer>
    </>
  )
}

function AdminDashboard({
  onNavigate,
}: {
  onNavigate: (page: string) => void
}) {
  return (
    <div className="admin-dashboard">
      <div className="page-heading">
        <div>
          <div className="admin-eyebrow">
            <Activity size={14} />
            EXAMINATION RELEASE OPERATIONS
          </div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-description">
            Monitor results publication readiness and simulated system
            capacity for 20,000 students accessing results simultaneously.
          </p>
        </div>

        <span className="admin-demo-badge">
          <span />
          Simulation mode
        </span>
      </div>

      <div className="admin-release-banner">
        <div className="admin-release-icon">
          <ClipboardCheck size={23} />
        </div>
        <div className="admin-release-copy">
          <strong>Examination results release simulation</strong>
          <p>
            This dashboard demonstrates the administrative operations
            required before and during results publication.
          </p>
        </div>
        <span className="admin-release-status">Demo environment</span>
      </div>

      <section className="stats-grid" aria-label="Release day statistics">
        <StatCard
          icon={Users}
          label="Expected Students"
          value="20,000"
          description="Simultaneous release-day access target"
          color="#2563eb"
          background="#eff6ff"
        />

        <StatCard
          icon={ClipboardCheck}
          label="Results Prepared"
          value="18,450"
          description="Illustrative student result records"
          color="#16a34a"
          background="#f0fdf4"
        />

        <StatCard
          icon={Server}
          label="Application Servers"
          value="3"
          description="Simulated active server instances"
          color="#9333ea"
          background="#faf5ff"
        />

        <StatCard
          icon={Database}
          label="Cache Service"
          value="Redis"
          description="Simulated result caching layer"
          color="#d97706"
          background="#fffbeb"
        />
      </section>

      <div className="admin-dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Release workflow</h2>
              <p className="panel-description">
                Administrative stages before students can access results
              </p>
            </div>
            <ClipboardList size={19} color="#64748b" />
          </div>

          <div className="admin-workflow">
            <div className="admin-workflow-step completed">
              <div className="admin-workflow-icon">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <strong>Results preparation</strong>
                <p>Sample examination records loaded for review.</p>
              </div>
              <span>Completed</span>
            </div>

            <div className="admin-workflow-step in-progress">
              <div className="admin-workflow-icon">
                <ClipboardCheck size={18} />
              </div>
              <div>
                <strong>Results review and approval</strong>
                <p>Academic verification stage.</p>
              </div>
              <span>In review</span>
            </div>

            <div className="admin-workflow-step pending">
              <div className="admin-workflow-icon">
                <LockKeyhole size={18} />
              </div>
              <div>
                <strong>Publication authorization</strong>
                <p>Results remain unavailable until publication is approved.</p>
              </div>
              <span>Pending</span>
            </div>

            <div className="admin-workflow-step pending">
              <div className="admin-workflow-icon">
                <RefreshCw size={18} />
              </div>
              <div>
                <strong>Cache refresh and student access</strong>
                <p>Simulate updating cached result availability.</p>
              </div>
              <span>Pending</span>
            </div>
          </div>

          <button
            className="admin-action-button"
            type="button"
            onClick={() => onNavigate('Release Management')}
          >
            Open release management
            <ArrowRight size={16} />
          </button>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Infrastructure overview</h2>
              <p className="panel-description">
                Simulated release-day architecture
              </p>
            </div>
            <Network size={19} color="#64748b" />
          </div>

          <div className="admin-infrastructure-list">
            <div className="admin-infrastructure-item">
              <div className="admin-infrastructure-icon">
                <Network size={17} />
              </div>
              <div>
                <strong>Load balancer</strong>
                <span>Request distribution</span>
              </div>
              <span className="admin-component-state">Simulated</span>
            </div>

            <div className="admin-infrastructure-item">
              <div className="admin-infrastructure-icon">
                <Server size={17} />
              </div>
              <div>
                <strong>Application cluster</strong>
                <span>3 application servers</span>
              </div>
              <span className="admin-component-state">Simulated</span>
            </div>

            <div className="admin-infrastructure-item">
              <div className="admin-infrastructure-icon">
                <Database size={17} />
              </div>
              <div>
                <strong>Redis cache</strong>
                <span>Frequently requested results</span>
              </div>
              <span className="admin-component-state">Simulated</span>
            </div>

            <div className="admin-infrastructure-item">
              <div className="admin-infrastructure-icon">
                <Database size={17} />
              </div>
              <div>
                <strong>Database server</strong>
                <span>Student and examination records</span>
              </div>
              <span className="admin-component-state">Mock data</span>
            </div>
          </div>

          <button
            className="admin-action-button"
            type="button"
            onClick={() => onNavigate('System Architecture')}
          >
            Explore system architecture
            <ArrowRight size={16} />
          </button>
        </section>
      </div>

      <section className="admin-operations-grid">
        <button
          type="button"
          className="admin-operation-card"
          onClick={() => onNavigate('Results Management')}
        >
          <div className="admin-operation-icon">
            <ClipboardCheck size={21} />
          </div>
          <strong>Results Management</strong>
          <span>Prepare and review examination results.</span>
          <ChevronRight size={17} />
        </button>

        <button
          type="button"
          className="admin-operation-card"
          onClick={() => onNavigate('Performance Monitor')}
        >
          <div className="admin-operation-icon">
            <Gauge size={21} />
          </div>
          <strong>Performance Monitor</strong>
          <span>Inspect simulated traffic and server load.</span>
          <ChevronRight size={17} />
        </button>

        <button
          type="button"
          className="admin-operation-card"
          onClick={() => onNavigate('Security Center')}
        >
          <div className="admin-operation-icon">
            <ShieldCheck size={21} />
          </div>
          <strong>Security Center</strong>
          <span>Demonstrate protection of student results.</span>
          <ChevronRight size={17} />
        </button>
      </section>

      <div className="admin-prototype-warning">
        <AlertTriangle size={17} />
        <p>
          <strong>Prototype limitation:</strong> All statistics,
          infrastructure states and workflow stages shown here are
          simulated locally. They do not represent live university systems
          or real performance measurements.
        </p>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  color,
  background,
}: {
  icon: LucideIcon
  label: string
  value: string
  description: string
  color: string
  background: string
}) {
  return (
    <article className="stat-card">
      <div className="stat-icon" style={{ color, background }}>
        <Icon size={20} strokeWidth={1.8} />
      </div>

      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-description">{description}</div>
    </article>
  )
}

function ModulePlaceholder({ title }: { title: string }) {
  return (
    <section className="module-placeholder panel">
      <div className="placeholder-icon">
        <GraduationCap size={30} />
      </div>

      <h1 className="page-title">{title}</h1>

      <p className="page-description">
        {pageDescriptions[title] ??
          'This administrative module will be implemented in the next development stage.'}
      </p>

      <div className="placeholder-notice">
        This module will use simulated data and interactions for the
        academic prototype. No real university records are modified.
      </div>
    </section>
  )
}

function App() {
  const [portal, setPortal] = useState<Portal | null>(null)
  const [activePage, setActivePage] = useState('Overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [results, setResults] = useState<ManagedResult[]>(initialResults)

const [students, setStudents] =
  useState<ManagedStudent[]>(initialStudents)

const [publishedFingerprint, setPublishedFingerprint] =
  useState<string | null>(null)

const [cachedFingerprint, setCachedFingerprint] =
  useState<string | null>(null)

  const navigate = (page: string) => {
    setActivePage(page)
    setSidebarOpen(false)
  }

  const switchPortal = () => {
    setPortal(null)
    setActivePage('Overview')
    setSidebarOpen(false)
  }

  if (!portal) {
    return (
      <PortalSelection
        onSelect={(selectedPortal) => {
          setPortal(selectedPortal)
          setActivePage(
            selectedPortal === 'student' ? 'Overview' : 'Admin Dashboard',
          )
        }}
      />
    )
  }

  const isStudent = portal === 'student'

  const pageTitle = isStudent
    ? 'Student Results Portal'
    : 'UniResults Administration'

  const pageSubtitle = isStudent
    ? 'Student Academic Services'
    : 'Examination Release Operations'

  return (
    <div className={`app-layout ${portal}-portal-layout`}>
      <button
        type="button"
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        aria-label="Close navigation menu"
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar
        portal={portal}
        activePage={activePage}
        onNavigate={navigate}
        isOpen={sidebarOpen}
        onSwitchPortal={switchPortal}
      />

      <div className="main-wrapper">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="icon-button mobile-menu-button"
              aria-label="Open navigation menu"
              onClick={() => setSidebarOpen((open) => !open)}
            >
              {sidebarOpen ? <X size={19} /> : <Menu size={19} />}
            </button>

            <div>
              <div className="topbar-title">{pageTitle}</div>
              <div className="topbar-subtitle">{pageSubtitle}</div>
            </div>
          </div>

          <div className="topbar-actions">
            <span className="semester-label">
              Academic Year 2026/2027
            </span>

            <div className="notification-icon" aria-label="Notifications">
              <Bell size={19} />
              <span />
            </div>

            <div className="topbar-avatar">
              {isStudent ? 'AM' : 'AD'}
            </div>
          </div>
        </header>

        <main className="main-content">
          {isStudent ? (
            activePage === 'Overview' ? (
              <StudentDashboard onNavigate={navigate} />
            ) : activePage === 'My Results' ? (
              <MyResults />
            ) : activePage === 'Transcript' ? (
              <Transcript />
            ) : activePage === 'My Courses' ? (
              <MyCourses />
            ) : activePage === 'My Profile' ? (
              <MyProfile />
            ) : (
              <ModulePlaceholder title={activePage} />
            )
          ) : activePage === 'Admin Dashboard' ? (
            <AdminDashboard onNavigate={navigate} />
          ) : activePage === 'Results Management' ? (
  <ResultsManagement
    results={results}
    onResultsChange={setResults}
  />
) : activePage === 'Release Management' ? (
  <ReleaseManagement
    results={results}
    publishedFingerprint={publishedFingerprint}
    cachedFingerprint={cachedFingerprint}
    onPublish={setPublishedFingerprint}
    onCacheRefresh={setCachedFingerprint}
  />
)
  : activePage === 'Student Management' ? (
  <StudentManagement
    students={students}
    onStudentsChange={setStudents}
    results={results}
    onResultsChange={setResults}
  />

) : activePage === 'System Architecture' ? (
            <SystemArchitecture />
          ) : activePage === 'Performance Monitor' ? (
            <PerformanceMonitor />
          ) : activePage === 'Security Center' ? (
            <SecurityCenter />
          
          ) : (
            <ModulePlaceholder title={activePage} />
          )}
        </main>
      </div>
    </div>
  )
}

export default App

