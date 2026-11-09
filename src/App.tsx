
import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { LucideIcon } from 'lucide-react'

import {
  Activity,
  AlertTriangle,
  Award,
  Bell,
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

// =========================================
// LAZY-LOADED PAGE MODULES
// =========================================

const SystemArchitecture = lazy(
  () => import('./components/architecture/SystemArchitecture'),
)

const MyResults = lazy(
  () => import('./components/results/MyResults'),
)

const Transcript = lazy(
  () => import('./components/transcript/Transcript'),
)

const MyProfile = lazy(
  () => import('./components/profile/MyProfile'),
)

const PerformanceMonitor = lazy(
  () => import('./components/monitor/PerformanceMonitor'),
)

const SecurityCenter = lazy(
  () => import('./components/security/SecurityCenter'),
)

const ResultsManagement = lazy(
  () => import('./components/admin/ResultsManagement'),
)

const ReleaseManagement = lazy(
  () => import('./components/admin/ReleaseManagement'),
)

const StudentManagement = lazy(
  () => import('./components/admin/StudentManagement'),
)

// =========================================
// DEMONSTRATION DATA
// =========================================

import { initialResults } from './components/admin/ResultsManagement'
import type { ManagedResult } from './components/admin/ResultsManagement'

import { initialStudents } from './components/admin/StudentManagement'
import type { ManagedStudent } from './components/admin/StudentManagement'

// =========================================
// TYPES
// =========================================

type Portal = 'student' | 'admin'

type NavigationItem = {
  label: string
  icon: LucideIcon
}

type PeriodFingerprints = Record<string, string>

// =========================================
// LOCAL STORAGE PERSISTENCE
// =========================================

const STORAGE_KEY = 'uniresults-portal-state-v1'

type PersistedPortalState = {
  version: 1
  results: ManagedResult[]
  students: ManagedStudent[]
  publishedFingerprints: PeriodFingerprints
  cachedFingerprints: PeriodFingerprints
}

function isFingerprintMap(
  value: unknown,
): value is PeriodFingerprints {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every(
      (item) => typeof item === 'string',
    )
  )
}

function isValidResult(value: unknown): value is ManagedResult {
  if (
    typeof value !== 'object' ||
    value === null
  ) {
    return false
  }

  const result = value as Record<string, unknown>

  return (
    typeof result.id === 'number' &&
    typeof result.registrationNumber === 'string' &&
    typeof result.studentName === 'string' &&
    typeof result.courseCode === 'string' &&
    typeof result.courseName === 'string' &&
    typeof result.credits === 'number' &&
    typeof result.marks === 'number' &&
    typeof result.grade === 'string' &&
    typeof result.semester === 'string' &&
    typeof result.academicYear === 'string' &&
    (
      result.status === 'Pending review' ||
      result.status === 'Approved' ||
      result.status === 'Rejected'
    )
  )
}

function isValidStudent(value: unknown): value is ManagedStudent {
  if (
    typeof value !== 'object' ||
    value === null
  ) {
    return false
  }

  const student = value as Record<string, unknown>

  return (
    typeof student.id === 'number' &&
    typeof student.registrationNumber === 'string' &&
    typeof student.fullName === 'string'
  )
}

function isValidPortalState(
  value: unknown,
): value is PersistedPortalState {
  if (
    typeof value !== 'object' ||
    value === null
  ) {
    return false
  }

  const state = value as Record<string, unknown>

  return (
    state.version === 1 &&
    Array.isArray(state.results) &&
    state.results.every(isValidResult) &&
    Array.isArray(state.students) &&
    state.students.every(isValidStudent) &&
    isFingerprintMap(state.publishedFingerprints) &&
    isFingerprintMap(state.cachedFingerprints)
  )
}

function loadPortalState(): PersistedPortalState | null {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY)

    if (!savedState) {
      console.info(
        'UniResults: No saved portal state found. Loading initial demo data.',
      )

      return null
    }

    const parsed: unknown = JSON.parse(savedState)

    if (!isValidPortalState(parsed)) {
      console.warn(
        'UniResults: Invalid saved state. Using initial demo data.',
      )

      return null
    }

    console.info(
      'UniResults: Portal state restored successfully.',
    )

    return parsed
  } catch (error) {
    console.error(
      'UniResults: Failed to restore saved state.',
      error,
    )

    return null
  }
}

// =========================================
// PERIOD FINGERPRINTS
// =========================================

function getPeriodKey(
  academicYear: string,
  semester: string,
) {
  return `${academicYear}::${semester}`
}

function createPeriodFingerprint(records: ManagedResult[]) {
  return JSON.stringify(
    [...records].sort((a, b) => a.id - b.id),
  )
}

// =========================================
// DEMONSTRATION STUDENT
// =========================================

const DEMO_STUDENT = {
  fullName: 'Alex Morgan',
  registrationNumber: 'BIT/001/2023',
}

// =========================================
// GRADING CONFIGURATION
// Illustrative prototype grading scale
// =========================================

const gradePoints: Record<string, number> = {
  A: 4,
  'A-': 3.7,
  'B+': 3.5,
  B: 3,
  'B-': 2.7,
  'C+': 2.5,
  C: 2,
  D: 1,
  E: 0,
}

// =========================================
// NAVIGATION
// =========================================

const studentNavigation: NavigationItem[] = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'My Results', icon: ClipboardList },
  { label: 'Transcript', icon: FileText },
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

// =========================================
// PAGE DESCRIPTIONS
// =========================================

const pageDescriptions: Record<string, string> = {
  'Results Management':
    'Prepare, validate and review examination results before publication.',

  'Release Management':
    'Control the examination results publication process and student access.',

  'Student Management':
    'Review student records associated with the examination release.',
}

// =========================================
// STUDENT RESULT ACCESS
// Each academic period is validated independently.
// =========================================

function getPublishedStudentResults(
  results: ManagedResult[],
  registrationNumber: string,
  publishedFingerprints: PeriodFingerprints,
  cachedFingerprints: PeriodFingerprints,
): ManagedResult[] {
  const periods = new Map<string, ManagedResult[]>()

  for (const result of results) {
    const key = getPeriodKey(
      result.academicYear,
      result.semester,
    )

    const existingRecords = periods.get(key) ?? []

    existingRecords.push(result)

    periods.set(key, existingRecords)
  }

  const accessibleResults: ManagedResult[] = []

  const normalizedRegistrationNumber =
    registrationNumber.trim().toLowerCase()

  for (const [periodKey, periodRecords] of periods) {
    const fingerprint = createPeriodFingerprint(periodRecords)

    const isPublished =
      publishedFingerprints[periodKey] === fingerprint

    const isCached =
      cachedFingerprints[periodKey] === fingerprint

    if (!isPublished || !isCached) {
      continue
    }

    const studentResults = periodRecords.filter(
      (result) =>
        result.registrationNumber.trim().toLowerCase() ===
          normalizedRegistrationNumber &&
        result.status === 'Approved',
    )

    accessibleResults.push(...studentResults)
  }

  return accessibleResults.sort(
    (a, b) =>
      b.academicYear.localeCompare(a.academicYear) ||
      getSemesterNumber(b.semester) -
        getSemesterNumber(a.semester) ||
      a.courseCode.localeCompare(b.courseCode),
  )
}

function getSemesterNumber(semester: string) {
  const match = semester.match(/\d+/)
  return match ? Number(match[0]) : 0
}

// =========================================
// PAGE LOADING FALLBACK
// =========================================

function ModuleLoading() {
  return (
    <div
      className="module-loading"
      role="status"
      aria-live="polite"
      style={{
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        color: '#64748b',
      }}
    >
      <RefreshCw
        size={25}
        style={{
          animation: 'module-loading-spin 1s linear infinite',
        }}
      />

      <span>Loading module...</span>

      <style>
        {`
          @keyframes module-loading-spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  )
}

// =========================================
// PORTAL SELECTION
// =========================================

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
          <span className="portal-eyebrow">
            WELCOME TO UNIRESULTS
          </span>

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

            <span className="portal-choice-label">
              STUDENT ACCESS
            </span>

            <h3>Student Portal</h3>

            <p>
              Access examination results, academic transcripts
              and your student profile.
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

            <span className="portal-choice-label">
              AUTHORIZED STAFF
            </span>

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

// =========================================
// SIDEBAR
// =========================================

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
    portal === 'student'
      ? DEMO_STUDENT.fullName
      : 'System Administrator'

  const accountRole =
    portal === 'student'
      ? 'Student account'
      : 'Administrator account'

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="brand">
        <div className="brand-icon">
          <GraduationCap size={25} />
        </div>

        <div>
          <div className="brand-name">UniResults</div>
          <div className="brand-subtitle">
            ACADEMIC PORTAL
          </div>
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
              aria-current={
                activePage === label ? 'page' : undefined
              }
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
            <div className="profile-name">
              {accountName}
            </div>

            <div className="profile-role">
              {accountRole}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="portal-switch-button"
          onClick={onSwitchPortal}
          aria-label={
            portal === 'admin'
              ? 'Switch account'
              : 'Switch portal'
          }
        >
          <LogOut size={15} />
          {portal === 'admin'
            ? 'Switch account'
            : 'Switch portal'}
        </button>
      </div>
    </aside>
  )
}

// =========================================
// STUDENT DASHBOARD
// =========================================

function StudentDashboard({
  onNavigate,
  results,
  publishedFingerprints,
  cachedFingerprints,
}: {
  onNavigate: (page: string) => void
  results: ManagedResult[]
  publishedFingerprints: PeriodFingerprints
  cachedFingerprints: PeriodFingerprints
}) {
  const publishedResults = useMemo(
    () =>
      getPublishedStudentResults(
        results,
        DEMO_STUDENT.registrationNumber,
        publishedFingerprints,
        cachedFingerprints,
      ),
    [
      results,
      publishedFingerprints,
      cachedFingerprints,
    ],
  )

  // TEMPORARY DIAGNOSTICS
  useEffect(() => {
    console.table({
      studentRegistration: DEMO_STUDENT.registrationNumber,
      totalRecords: results.length,
      publishedResults: publishedResults.length,
      publishedPeriods: Object.keys(publishedFingerprints).length,
      cachedPeriods: Object.keys(cachedFingerprints).length,
    })

    console.table(
      results.map((result) => ({
        registrationNumber: result.registrationNumber,
        studentName: result.studentName,
        academicYear: result.academicYear,
        semester: result.semester,
        status: result.status,
      })),
    )

    console.log('Published fingerprints:', publishedFingerprints)
    console.log('Cached fingerprints:', cachedFingerprints)
  }, [
    results,
    publishedResults,
    publishedFingerprints,
    cachedFingerprints,
  ])

  const totalCredits = publishedResults.reduce(
    (total, result) => total + result.credits,
    0,
  )

  const averageMarks = publishedResults.length
    ? publishedResults.reduce(
        (total, result) => total + result.marks,
        0,
      ) / publishedResults.length
    : 0

  const gpa = totalCredits
    ? publishedResults.reduce(
        (total, result) =>
          total +
          (gradePoints[result.grade] ?? 0) * result.credits,
        0,
      ) / totalCredits
    : 0

  const recentResults = publishedResults.slice(0, 4)
  const latestPeriod = publishedResults[0]

  return (
    <>
      <div className="page-heading">
        <div>
          <h1 className="page-title">
            Academic Overview
          </h1>

          <p className="page-description">
            Welcome back, {DEMO_STUDENT.fullName}. Here is an
            overview of your published academic progress.
          </p>
        </div>

        <div className="prototype-label">
          <span className="prototype-dot" />
          Prototype environment
        </div>
      </div>

      <section
        className="stats-grid"
        aria-label="Academic statistics"
      >
        <StatCard
          icon={ClipboardList}
          label="Published Results"
          value={String(publishedResults.length)}
          description="Approved and accessible results"
          color="#2563eb"
          background="#eff6ff"
        />

        <StatCard
          icon={Award}
          label="Current GPA"
          value={
            publishedResults.length
              ? gpa.toFixed(2)
              : '--'
          }
          description="Illustrative credit-weighted GPA"
          color="#16a34a"
          background="#f0fdf4"
        />

        <StatCard
          icon={GraduationCap}
          label="Completed Credits"
          value={String(totalCredits)}
          description="Credits from published results"
          color="#9333ea"
          background="#faf5ff"
        />

        <StatCard
          icon={FileText}
          label="Latest Results"
          value={latestPeriod ? 'Published' : 'Pending'}
          description={
            latestPeriod
              ? `${latestPeriod.semester} · ${latestPeriod.academicYear}`
              : 'Awaiting publication and cache refresh'
          }
          color="#d97706"
          background="#fffbeb"
        />
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">
                Recent Examination Results
              </h2>

              <p className="panel-description">
                Your latest approved and published academic records
              </p>
            </div>

            <button
              className="text-action"
              type="button"
              onClick={() => onNavigate('My Results')}
            >
              View all
              <ChevronRight size={15} />
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
                {recentResults.map((result) => (
                  <tr key={result.id}>
                    <td>
                      <div className="unit-name">
                        {result.courseName}
                      </div>

                      <div className="unit-code">
                        {result.courseCode}
                      </div>
                    </td>

                    <td>{result.marks}%</td>

                    <td>
                      <span className="grade-badge">
                        {result.grade}
                      </span>
                    </td>

                    <td>
                      <span className="result-status">
                        <span className="status-dot" />
                        Approved
                      </span>
                    </td>
                  </tr>
                ))}

                {recentResults.length === 0 && (
                  <tr>
                    <td colSpan={4}>
                      <div className="results-empty">
                        <LockKeyhole size={23} />

                        <strong>
                          No published results yet
                        </strong>

                        <span>
                          Your examination records will appear here
                          after publication and cache refresh.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            Showing {recentResults.length} published examination
            records
          </div>
        </div>

        <div className="right-column">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">
                  Results Availability
                </h2>

                <p className="panel-description">
                  Examination release information
                </p>
              </div>

              <CheckCircle2
                size={19}
                color={
                  publishedResults.length
                    ? '#16a34a'
                    : '#d97706'
                }
              />
            </div>

            <div className="system-status-banner">
              <div className="status-indicator">
                <span
                  className="status-dot"
                  style={{
                    background: publishedResults.length
                      ? '#16a34a'
                      : '#d97706',
                  }}
                />

                {publishedResults.length
                  ? 'Results published'
                  : 'No results available'}
              </div>

              <p>
                {publishedResults.length
                  ? 'Your approved results are accessible.'
                  : 'Results are awaiting administrative publication and cache refresh.'}
              </p>
            </div>

            <div className="system-metric">
              <span className="system-metric-label">
                Registration number
              </span>

              <span className="system-metric-value">
                {DEMO_STUDENT.registrationNumber}
              </span>
            </div>

            <div className="system-metric">
              <span className="system-metric-label">
                Academic year
              </span>

              <span className="system-metric-value">
                {latestPeriod?.academicYear ?? 'Not available'}
              </span>
            </div>

            <div className="system-metric">
              <span className="system-metric-label">
                Semester
              </span>

              <span className="system-metric-value">
                {latestPeriod?.semester ?? 'Not available'}
              </span>
            </div>

            <div className="system-metric">
              <span className="system-metric-label">
                Average marks
              </span>

              <span className="system-metric-value">
                {publishedResults.length
                  ? `${averageMarks.toFixed(1)}%`
                  : '--'}
              </span>
            </div>
          </div>

          <div className="panel quick-access">
            <h2 className="panel-title">
              Academic Transcript
            </h2>

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
        <span>Academic Prototype · Simulated Data</span>
      </footer>
    </>
  )
}

// =========================================
// ADMIN DASHBOARD
// =========================================

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

          <h1 className="page-title">
            Admin Dashboard
          </h1>

          <p className="page-description">
            Monitor results publication readiness and simulated
            system capacity for 20,000 students accessing results
            simultaneously.
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
          <strong>
            Examination results release simulation
          </strong>

          <p>
            This dashboard demonstrates the administrative operations
            required before and during results publication.
          </p>
        </div>

        <span className="admin-release-status">
          Demo environment
        </span>
      </div>

      <section
        className="stats-grid"
        aria-label="Release day statistics"
      >
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
              <h2 className="panel-title">
                Release workflow
              </h2>

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
                <p>
                  Sample examination records loaded for review.
                </p>
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
                <p>
                  Results remain unavailable until publication is approved.
                </p>
              </div>

              <span>Pending</span>
            </div>

            <div className="admin-workflow-step pending">
              <div className="admin-workflow-icon">
                <RefreshCw size={18} />
              </div>

              <div>
                <strong>Cache refresh and student access</strong>
                <p>
                  Simulate updating cached result availability.
                </p>
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
              <h2 className="panel-title">
                Infrastructure overview
              </h2>

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

              <span className="admin-component-state">
                Simulated
              </span>
            </div>

            <div className="admin-infrastructure-item">
              <div className="admin-infrastructure-icon">
                <Server size={17} />
              </div>

              <div>
                <strong>Application cluster</strong>
                <span>3 application servers</span>
              </div>

              <span className="admin-component-state">
                Simulated
              </span>
            </div>

            <div className="admin-infrastructure-item">
              <div className="admin-infrastructure-icon">
                <Database size={17} />
              </div>

              <div>
                <strong>Redis cache</strong>
                <span>Frequently requested results</span>
              </div>

              <span className="admin-component-state">
                Simulated
              </span>
            </div>

            <div className="admin-infrastructure-item">
              <div className="admin-infrastructure-icon">
                <Database size={17} />
              </div>

              <div>
                <strong>Database server</strong>
                <span>Student and examination records</span>
              </div>

              <span className="admin-component-state">
                Mock data
              </span>
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

          <span>
            Prepare and review examination results.
          </span>

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

          <span>
            Inspect simulated traffic and server load.
          </span>

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

          <span>
            Demonstrate protection of student results.
          </span>

          <ChevronRight size={17} />
        </button>
      </section>

      <div className="admin-prototype-warning">
        <AlertTriangle size={17} />

        <p>
          <strong>Prototype limitation:</strong> All statistics,
          infrastructure states and workflow stages shown here are
          simulated locally. They do not represent live university
          systems or real performance measurements.
        </p>
      </div>
    </div>
  )
}

// =========================================
// REUSABLE STAT CARD
// =========================================

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
      <div
        className="stat-icon"
        style={{ color, background }}
      >
        <Icon size={20} strokeWidth={1.8} />
      </div>

      <div className="stat-label">{label}</div>

      <div className="stat-value">{value}</div>

      <div className="stat-description">
        {description}
      </div>
    </article>
  )
}

// =========================================
// MODULE PLACEHOLDER
// =========================================

function ModulePlaceholder({
  title,
}: {
  title: string
}) {
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

// =========================================
// MAIN APPLICATION
// =========================================

function App() {
  const [portal, setPortal] = useState<Portal | null>(null)

  const [activePage, setActivePage] = useState('Overview')

  const [sidebarOpen, setSidebarOpen] = useState(false)

  // =======================================
  // RESTORE PERSISTED PORTAL DATA
  // Load localStorage only once.
  // =======================================

  const [initialPortalState] = useState<PersistedPortalState | null>(
    () => loadPortalState(),
  )

  const [results, setResults] = useState<ManagedResult[]>(
    () => initialPortalState?.results ?? initialResults,
  )

  const [students, setStudents] = useState<ManagedStudent[]>(
    () => initialPortalState?.students ?? initialStudents,
  )

  const [publishedFingerprints, setPublishedFingerprints] =
    useState<PeriodFingerprints>(
      () => initialPortalState?.publishedFingerprints ?? {},
    )

  const [cachedFingerprints, setCachedFingerprints] =
    useState<PeriodFingerprints>(
      () => initialPortalState?.cachedFingerprints ?? {},
    )

  // =======================================
  // SAVE PORTAL DATA AUTOMATICALLY
  // =======================================

  useEffect(() => {
    const state: PersistedPortalState = {
      version: 1,
      results,
      students,
      publishedFingerprints,
      cachedFingerprints,
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state),
      )
    } catch (error) {
      console.error(
        'UniResults: Failed to save portal state.',
        error,
      )
    }
  }, [
    results,
    students,
    publishedFingerprints,
    cachedFingerprints,
  ])

  // =======================================
  // PUBLISH ACADEMIC PERIOD
  // =======================================

  const publishPeriod = (
    periodKey: string,
    fingerprint: string,
  ) => {
    setPublishedFingerprints((current) => ({
      ...current,
      [periodKey]: fingerprint,
    }))

    // A new publication requires a fresh cache refresh.
    setCachedFingerprints((current) => {
      const next = { ...current }

      delete next[periodKey]

      return next
    })
  }

  // =======================================
  // REFRESH PERIOD CACHE
  // =======================================

  const refreshPeriodCache = (
    periodKey: string,
    fingerprint: string,
  ) => {
    setCachedFingerprints((current) => ({
      ...current,
      [periodKey]: fingerprint,
    }))
  }

  // =======================================
  // NAVIGATION
  // =======================================

  const navigate = (page: string) => {
    setActivePage(page)
    setSidebarOpen(false)
  }

  const switchPortal = () => {
    setPortal(null)
    setActivePage('Overview')
    setSidebarOpen(false)
  }

  // =======================================
  // PORTAL SELECTION
  // =======================================

  if (!portal) {
    return (
      <PortalSelection
        onSelect={(selectedPortal) => {
          setPortal(selectedPortal)

          setActivePage(
            selectedPortal === 'student'
              ? 'Overview'
              : 'Admin Dashboard',
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

  // =======================================
  // APPLICATION LAYOUT
  // =======================================

  return (
    <div className={`app-layout ${portal}-portal-layout`}>
      <button
        type="button"
        className={`sidebar-overlay ${
          sidebarOpen ? 'open' : ''
        }`}
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
              {sidebarOpen ? (
                <X size={19} />
              ) : (
                <Menu size={19} />
              )}
            </button>

            <div>
              <div className="topbar-title">
                {pageTitle}
              </div>

              <div className="topbar-subtitle">
                {pageSubtitle}
              </div>
            </div>
          </div>

          <div className="topbar-actions">
            <span className="semester-label">
              Academic Year 2026/2027
            </span>

            <div
              className="notification-icon"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span />
            </div>

            <div className="topbar-avatar">
              {isStudent ? 'AM' : 'AD'}
            </div>
          </div>
        </header>

        <main className="main-content">
          <Suspense fallback={<ModuleLoading />}>
            {/* =================================
                STUDENT PORTAL
            ================================= */}

            {isStudent ? (
              activePage === 'Overview' ? (
                <StudentDashboard
                  onNavigate={navigate}
                  results={results}
                  publishedFingerprints={publishedFingerprints}
                  cachedFingerprints={cachedFingerprints}
                />
              ) : activePage === 'My Results' ? (
                <MyResults
                  results={results}
                  registrationNumber={DEMO_STUDENT.registrationNumber}
                  publishedFingerprints={publishedFingerprints}
                  cachedFingerprints={cachedFingerprints}
                />
              ) : activePage === 'Transcript' ? (
                <Transcript
                  results={results}
                  registrationNumber={DEMO_STUDENT.registrationNumber}
                  studentName={DEMO_STUDENT.fullName}
                  publishedFingerprints={publishedFingerprints}
                  cachedFingerprints={cachedFingerprints}
                />
              ) : activePage === 'My Profile' ? (
                <MyProfile />
              ) : (
                <ModulePlaceholder title={activePage} />
              )
            ) : (
              /* =================================
                 ADMIN PORTAL
              ================================= */

              activePage === 'Admin Dashboard' ? (
                <AdminDashboard onNavigate={navigate} />
              ) : activePage === 'Results Management' ? (
                <ResultsManagement
                  results={results}
                  onResultsChange={setResults}
                />
              ) : activePage === 'Release Management' ? (
                <ReleaseManagement
                  results={results}
                  publishedFingerprints={publishedFingerprints}
                  cachedFingerprints={cachedFingerprints}
                  onPublish={publishPeriod}
                  onCacheRefresh={refreshPeriodCache}
                />
              ) : activePage === 'Student Management' ? (
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
              )
            )}
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default App
