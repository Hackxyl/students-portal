
import { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Fingerprint,
  LockKeyhole,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  XCircle,
} from 'lucide-react'

type StudentRecord = {
  id: string
  name: string
  registrationNumber: string
  programme: string
  average: string
}

type ActivityEntry = {
  id: number
  action: string
  status: 'allowed' | 'blocked' | 'warning'
  time: string
  detail: string
}

const currentStudent = {
  id: 'student-001',
  name: 'Alex Student',
  registrationNumber: 'DEMO/2023/001',
}

const studentRecords: StudentRecord[] = [
  {
    id: 'student-001',
    name: 'Alex Student',
    registrationNumber: 'DEMO/2023/001',
    programme: 'BSc Information Technology',
    average: '72.5%',
  },
  {
    id: 'student-002',
    name: 'Jordan Student',
    registrationNumber: 'DEMO/2023/002',
    programme: 'BSc Computer Science',
    average: '68.0%',
  },
  {
    id: 'student-003',
    name: 'Taylor Student',
    registrationNumber: 'DEMO/2023/003',
    programme: 'BSc Information Technology',
    average: '81.2%',
  },
]

const initialActivity: ActivityEntry[] = [
  {
    id: 1,
    action: 'Student authenticated',
    status: 'allowed',
    time: '09:00:12',
    detail: 'Demo student session established.',
  },
  {
    id: 2,
    action: 'Own results requested',
    status: 'allowed',
    time: '09:00:18',
    detail: 'Student ownership check passed.',
  },
]

export default function SecurityCenter() {
  const [selectedStudentId, setSelectedStudentId] = useState('student-002')
  const [secureMode, setSecureMode] = useState(true)
  const [activity, setActivity] = useState<ActivityEntry[]>(initialActivity)
  const [lastResult, setLastResult] = useState<{
    status: 'allowed' | 'blocked' | 'warning'
    message: string
    record?: StudentRecord
  } | null>(null)

  const selectedStudent = studentRecords.find(
    (student) => student.id === selectedStudentId,
  )

  const runAccessAttempt = () => {
    if (!selectedStudent) return

    const isOwner = selectedStudent.id === currentStudent.id

    if (secureMode && !isOwner) {
      setLastResult({
        status: 'blocked',
        message:
          '403 Forbidden — Access denied. You cannot access another student’s examination results.',
      })

      setActivity((previous) => [
        {
          id: Date.now(),
          action: 'Unauthorized results request',
          status: 'blocked',
          time: new Date().toLocaleTimeString(),
          detail: `Attempted access to ${selectedStudent.registrationNumber}. Ownership check failed.`,
        },
        ...previous,
      ])

      return
    }

    setLastResult({
      status: isOwner ? 'allowed' : 'warning',
      message: isOwner
        ? '200 OK — Your examination results are available.'
        : 'VULNERABILITY — The insecure endpoint exposed another student’s results.',
      record: selectedStudent,
    })

    setActivity((previous) => [
      {
        id: Date.now(),
        action: isOwner
          ? 'Own results request'
          : 'Unauthorized access succeeded',
        status: isOwner ? 'allowed' : 'warning',
        time: new Date().toLocaleTimeString(),
        detail: isOwner
          ? 'Student ownership check passed.'
          : `The insecure endpoint returned ${selectedStudent.registrationNumber}'s record.`,
      },
      ...previous,
    ])
  }

  const resetDemo = () => {
    setSelectedStudentId('student-002')
    setSecureMode(true)
    setLastResult(null)
    setActivity(initialActivity)
  }

  return (
    <section className="security-page">
      <header className="security-header">
        <div>
          <div className="security-eyebrow">
            <ShieldCheck size={15} />
            APPLICATION SECURITY
          </div>
          <h1>Security Center</h1>
          <p>
            Explore how authentication, authorization and student ownership
            checks protect examination records.
          </p>
        </div>

        <span className="security-demo-badge">
          <span />
          DEMONSTRATION MODE
        </span>
      </header>

      <div className="security-warning">
        <AlertTriangle size={20} />
        <div>
          <strong>Educational security simulation</strong>
          <p>
            This demonstration uses local sample records. It does not
            authenticate real users, expose a real API, or access a database.
          </p>
        </div>
      </div>

      <div className="security-overview">
        <article className="security-overview-card">
          <span className="security-overview-icon">
            <UserRound size={20} />
          </span>
          <div>
            <span>Authenticated student</span>
            <strong>{currentStudent.name}</strong>
            <small>{currentStudent.registrationNumber}</small>
          </div>
        </article>

        <article className="security-overview-card">
          <span className="security-overview-icon">
            <Shield size={20} />
          </span>
          <div>
            <span>Authorization policy</span>
            <strong>Student ownership</strong>
            <small>Students can access their own records only</small>
          </div>
        </article>

        <article className="security-overview-card">
          <span className="security-overview-icon">
            <Fingerprint size={20} />
          </span>
          <div>
            <span>Access control</span>
            <strong>{secureMode ? 'Protected' : 'Insecure demo'}</strong>
            <small>
              {secureMode ? 'Ownership validation enabled' : 'Ownership validation disabled'}
            </small>
          </div>
        </article>
      </div>

      <div className="security-main-grid">
        <article className="security-panel security-simulator">
          <div className="security-panel-heading">
            <div>
              <span className="security-kicker">INTERACTIVE DEMONSTRATION</span>
              <h2>Student record access test</h2>
              <p>
                Simulate a student changing a registration ID to request
                another student's results.
              </p>
            </div>
            <LockKeyhole size={23} />
          </div>

          <div className="security-identity">
            <div className="security-avatar">
              <UserRound size={20} />
            </div>
            <div>
              <span>Logged-in identity</span>
              <strong>{currentStudent.registrationNumber}</strong>
            </div>
            <span className="security-authenticated">
              <CheckCircle2 size={14} />
              Authenticated
            </span>
          </div>

          <label className="security-field-label" htmlFor="target-student">
            Requested student record
          </label>

          <select
            id="target-student"
            className="security-select"
            value={selectedStudentId}
            onChange={(event) => {
              setSelectedStudentId(event.target.value)
              setLastResult(null)
            }}
          >
            {studentRecords.map((student) => (
              <option key={student.id} value={student.id}>
                {student.registrationNumber} — {student.name}
              </option>
            ))}
          </select>

          <div className="security-mode-control">
            <div>
              <strong>Ownership authorization</strong>
              <span>
                {secureMode
                  ? 'The server checks whether the requested record belongs to the authenticated student.'
                  : 'The simulated vulnerable endpoint skips the ownership check.'}
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={secureMode}
              aria-label="Toggle ownership authorization"
              className={`security-switch ${secureMode ? 'security-switch-on' : ''}`}
              onClick={() => {
                setSecureMode((current) => !current)
                setLastResult(null)
              }}
            >
              <span />
            </button>
          </div>

          <div className="security-simulator-actions">
            <button
              type="button"
              className="security-test-button"
              onClick={runAccessAttempt}
            >
              <ShieldCheck size={16} />
              Test access request
            </button>
            <button
              type="button"
              className="security-reset-button"
              onClick={resetDemo}
            >
              Reset demo
            </button>
          </div>

          {lastResult && (
            <div
              className={`security-result security-result-${lastResult.status}`}
              role="status"
              aria-live="polite"
            >
              <div className="security-result-heading">
                {lastResult.status === 'allowed' ? (
                  <CheckCircle2 size={19} />
                ) : lastResult.status === 'blocked' ? (
                  <ShieldAlert size={19} />
                ) : (
                  <AlertTriangle size={19} />
                )}
                <strong>
                  {lastResult.status === 'allowed'
                    ? 'Access granted'
                    : lastResult.status === 'blocked'
                      ? 'Access blocked'
                      : 'Security vulnerability detected'}
                </strong>
              </div>

              <p>{lastResult.message}</p>

              {lastResult.record && (
                <div className="security-exposed-record">
                  <span>Registration number</span>
                  <strong>{lastResult.record.registrationNumber}</strong>
                  <span>Student name</span>
                  <strong>{lastResult.record.name}</strong>
                  <span>Programme</span>
                  <strong>{lastResult.record.programme}</strong>
                  <span>Average score</span>
                  <strong>{lastResult.record.average}</strong>
                </div>
              )}
            </div>
          )}
        </article>

        <article className="security-panel security-explanation">
          <div className="security-panel-heading">
            <div>
              <span className="security-kicker">THREAT ANALYSIS</span>
              <h2>IDOR vulnerability</h2>
            </div>
            <ShieldAlert size={22} />
          </div>

          <div className="security-threat">
            <span className="security-threat-label">Example attack</span>
            <code>GET /api/results/student-002</code>
            <p>
              An attacker changes the student identifier in a URL or API
              request to try to retrieve another student's results.
            </p>
          </div>

          <div className="security-comparison">
            <div className="security-comparison-item security-insecure">
              <XCircle size={17} />
              <div>
                <strong>Insecure implementation</strong>
                <p>
                  Trusts the requested student ID without checking record
                  ownership.
                </p>
              </div>
            </div>
            <div className="security-comparison-item security-secure">
              <CheckCircle2 size={17} />
              <div>
                <strong>Secure implementation</strong>
                <p>
                  Derives the authenticated student identity from the
                  verified session and enforces ownership on the server.
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>

      <article className="security-panel security-controls-panel">
        <div className="security-panel-heading">
          <div>
            <span className="security-kicker">PROTECTION MEASURES</span>
            <h2>Security controls</h2>
            <p>Measures required to protect student records.</p>
          </div>
          <ShieldCheck size={22} />
        </div>

        <div className="security-controls-grid">
          <div className="security-control">
            <span><LockKeyhole size={19} /></span>
            <div>
              <strong>Authentication</strong>
              <p>
                Use secure sessions or validated JWT access tokens to
                establish student identity.
              </p>
            </div>
          </div>

          <div className="security-control">
            <span><Shield size={19} /></span>
            <div>
              <strong>Authorization</strong>
              <p>
                Enforce role-based access control and verify record ownership
                on every protected request.
              </p>
            </div>
          </div>

          <div className="security-control">
            <span><Fingerprint size={19} /></span>
            <div>
              <strong>Database protection</strong>
              <p>
                Restrict database credentials, use least-privilege access and
                parameterized queries.
              </p>
            </div>
          </div>

          <div className="security-control">
            <span><ShieldCheck size={19} /></span>
            <div>
              <strong>HTTPS encryption</strong>
              <p>
                Encrypt data in transit using HTTPS and secure cookies for
                session-based authentication.
              </p>
            </div>
          </div>
        </div>
      </article>

      <article className="security-panel security-activity-panel">
        <div className="security-panel-heading">
          <div>
            <span className="security-kicker">AUDIT TRAIL</span>
            <h2>Security activity</h2>
            <p>Requests generated by this local demonstration.</p>
          </div>
          <Clock size={21} />
        </div>

        <div className="security-activity-list">
          {activity.map((entry) => (
            <div className="security-activity-item" key={entry.id}>
              <span
                className={`security-activity-icon security-activity-${entry.status}`}
              >
                {entry.status === 'allowed' ? (
                  <CheckCircle2 size={17} />
                ) : entry.status === 'blocked' ? (
                  <ShieldAlert size={17} />
                ) : (
                  <AlertTriangle size={17} />
                )}
              </span>
              <div className="security-activity-content">
                <strong>{entry.action}</strong>
                <p>{entry.detail}</p>
              </div>
              <span className="security-activity-time">{entry.time}</span>
            </div>
          ))}
        </div>
      </article>

      <footer className="security-footer">
        <ShieldCheck size={15} />
        <span>
          Student Results Portal · Security controls are demonstrated locally.
          Real enforcement must happen in the backend API.
        </span>
      </footer>
    </section>
  )
}
