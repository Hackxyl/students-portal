
import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Database,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Users,
  XCircle,
} from 'lucide-react'

import type { ManagedResult } from './ResultsManagement'

type ReleaseManagementProps = {
  results: ManagedResult[]
  publishedFingerprints: Record<string, string>
  cachedFingerprints: Record<string, string>
  onPublish: (periodKey: string, fingerprint: string) => void
  onCacheRefresh: (periodKey: string, fingerprint: string) => void
}

type ExaminationPeriod = {
  academicYear: string
  semester: string
  key: string
}

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

export default function ReleaseManagement({
  results,
  publishedFingerprints,
  cachedFingerprints,
  onPublish,
  onCacheRefresh,
}: ReleaseManagementProps) {
  // =======================================
  // AVAILABLE EXAMINATION PERIODS
  // =======================================

  const availablePeriods = useMemo<ExaminationPeriod[]>(
    () => {
      const periods = new Map<string, ExaminationPeriod>()

      for (const result of results) {
        const key = getPeriodKey(
          result.academicYear,
          result.semester,
        )

        periods.set(key, {
          academicYear: result.academicYear,
          semester: result.semester,
          key,
        })
      }

      return [...periods.values()].sort(
        (a, b) =>
          b.academicYear.localeCompare(a.academicYear) ||
          a.semester.localeCompare(b.semester),
      )
    },
    [results],
  )

  const initialPeriod =
    availablePeriods.find(
      (period) =>
        period.academicYear === '2025/2026' &&
        period.semester === 'Semester 1',
    ) ?? availablePeriods[0]

  const [academicYear, setAcademicYear] = useState(
    initialPeriod?.academicYear ?? '',
  )

  const [semester, setSemester] = useState(
    initialPeriod?.semester ?? '',
  )

  const academicYears = useMemo(
    () =>
      [...new Set(
        availablePeriods.map((period) => period.academicYear),
      )].sort((a, b) => b.localeCompare(a)),
    [availablePeriods],
  )

  const semesters = useMemo(
    () =>
      availablePeriods
        .filter(
          (period) => period.academicYear === academicYear,
        )
        .map((period) => period.semester)
        .sort((a, b) => {
          const first = Number(a.match(/\d+/)?.[0] ?? 0)
          const second = Number(b.match(/\d+/)?.[0] ?? 0)

          return first - second
        }),
    [availablePeriods, academicYear],
  )

  // Keep the selected period valid when records change.
  useEffect(() => {
    if (!academicYears.includes(academicYear)) {
      setAcademicYear(academicYears[0] ?? '')
      return
    }

    if (!semesters.includes(semester)) {
      setSemester(semesters[0] ?? '')
    }
  }, [academicYears, academicYear, semesters, semester])

  // =======================================
  // SELECTED PERIOD
  // =======================================

  const periodKey = getPeriodKey(academicYear, semester)

  const periodResults = useMemo(
    () =>
      results.filter(
        (result) =>
          result.academicYear === academicYear &&
          result.semester === semester,
      ),
    [results, academicYear, semester],
  )

  const approvedCount = periodResults.filter(
    (result) => result.status === 'Approved',
  ).length

  const pendingCount = periodResults.filter(
    (result) => result.status === 'Pending review',
  ).length

  const rejectedCount = periodResults.filter(
    (result) => result.status === 'Rejected',
  ).length

  const totalCount = periodResults.length

  const allApproved =
    totalCount > 0 && approvedCount === totalCount

  // A change to any record invalidates this period's old release.
  const fingerprint = createPeriodFingerprint(periodResults)

  const publishedFingerprint =
    publishedFingerprints[periodKey] ?? null

  const cachedFingerprint =
    cachedFingerprints[periodKey] ?? null

  const isPublished =
    allApproved && publishedFingerprint === fingerprint

  const isCacheRefreshed =
    isPublished && cachedFingerprint === fingerprint

  const canPublish = allApproved && !isPublished

  const canRefreshCache =
    isPublished && !isCacheRefreshed

  // =======================================
  // WORKFLOW
  // =======================================

  const workflowSteps = [
    {
      title: 'Results preparation',
      description: `${totalCount} examination records loaded for the selected period.`,
      completed: totalCount > 0,
      icon: ClipboardCheck,
    },
    {
      title: 'Academic review and approval',
      description: `${approvedCount} approved, ${pendingCount} pending and ${rejectedCount} rejected.`,
      completed: allApproved,
      icon: ShieldCheck,
    },
    {
      title: 'Publication authorization',
      description: isPublished
        ? 'Publication has been authorized for this period.'
        : 'Publication is locked until all records are approved.',
      completed: isPublished,
      icon: LockKeyhole,
    },
    {
      title: 'Redis cache refresh',
      description: isCacheRefreshed
        ? 'The simulated cache has been refreshed.'
        : 'Refresh the simulated cache after publication.',
      completed: isCacheRefreshed,
      icon: Database,
    },
  ]

  // =======================================
  // RENDER
  // =======================================

  return (
    <section className="release-page">
      <div className="release-heading">
        <div>
          <span className="release-eyebrow">
            EXAMINATION OPERATIONS
          </span>

          <h1>Release Management</h1>

          <p>
            Review examination readiness, authorize publication and
            simulate student access to released results.
          </p>
        </div>

        <span className="release-demo-badge">
          <span />
          Simulation mode
        </span>
      </div>

      <div className="release-notice">
        <AlertTriangle size={18} />

        <p>
          <strong>Demonstration environment:</strong> Publication and
          Redis cache operations are simulated locally. No real student
          records or university infrastructure are modified.
        </p>
      </div>

      <section className="release-period-panel">
        <div>
          <h2>Examination period</h2>

          <p>
            Select the academic period whose results you want to release.
          </p>
        </div>

        <div className="release-period-controls">
          <label>
            Academic year

            <select
              value={academicYear}
              disabled={academicYears.length === 0}
              onChange={(event) => {
                const nextYear = event.target.value

                setAcademicYear(nextYear)

                const nextSemester = availablePeriods.find(
                  (period) => period.academicYear === nextYear,
                )?.semester

                setSemester(nextSemester ?? '')
              }}
            >
              {academicYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <label>
            Semester

            <select
              value={semester}
              disabled={semesters.length === 0}
              onChange={(event) => setSemester(event.target.value)}
            >
              {semesters.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <div className="release-stats">
        <article className="release-stat">
          <div className="release-stat-icon blue">
            <Users size={20} />
          </div>

          <span>Total records</span>
          <strong>{totalCount}</strong>
          <small>Selected examination period</small>
        </article>

        <article className="release-stat">
          <div className="release-stat-icon green">
            <CheckCircle2 size={20} />
          </div>

          <span>Approved</span>
          <strong>{approvedCount}</strong>
          <small>Verified examination records</small>
        </article>

        <article className="release-stat">
          <div className="release-stat-icon amber">
            <Clock3 size={20} />
          </div>

          <span>Pending review</span>
          <strong>{pendingCount}</strong>
          <small>Awaiting approval</small>
        </article>

        <article className="release-stat">
          <div className="release-stat-icon red">
            <XCircle size={20} />
          </div>

          <span>Rejected</span>
          <strong>{rejectedCount}</strong>
          <small>Require correction</small>
        </article>
      </div>

      <div className="release-content-grid">
        <section className="release-panel">
          <div className="release-panel-heading">
            <div>
              <h2>Publication workflow</h2>
              <p>Required stages before student access is enabled.</p>
            </div>

            <ClipboardCheck size={20} />
          </div>

          <div className="release-timeline">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon

              return (
                <div
                  className={`release-step ${
                    step.completed ? 'completed' : ''
                  }`}
                  key={step.title}
                >
                  <div className="release-step-marker">
                    {step.completed ? (
                      <CheckCircle2 size={19} />
                    ) : (
                      <Icon size={19} />
                    )}
                  </div>

                  <div className="release-step-content">
                    <strong>
                      {index + 1}. {step.title}
                    </strong>

                    <p>{step.description}</p>
                  </div>

                  <span className="release-step-status">
                    {step.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        <section className="release-panel release-control-panel">
          <div className="release-panel-heading">
            <div>
              <h2>Publication controls</h2>
              <p>Manage the selected examination period.</p>
            </div>

            <LockKeyhole size={20} />
          </div>

          {!isPublished && (
            <div className="release-control-warning">
              <AlertTriangle size={18} />

              <div>
                <strong>Publication not authorized</strong>

                <p>
                  {totalCount === 0
                    ? 'There are no examination records for this period.'
                    : !allApproved
                      ? 'Every record must be approved before publication. Pending and rejected records must be resolved.'
                      : 'All records are approved. Publication can now be authorized.'}
                </p>
              </div>
            </div>
          )}

          {isPublished && (
            <div className="release-control-success">
              <CheckCircle2 size={19} />

              <div>
                <strong>Results successfully published</strong>

                <p>
                  Publication is authorized for {semester}, {academicYear}.
                </p>
              </div>
            </div>
          )}

          <div className="release-control-actions">
            <button
              type="button"
              className="release-publish-button"
              disabled={!canPublish}
              onClick={() => onPublish(periodKey, fingerprint)}
            >
              <ShieldCheck size={17} />
              Authorize publication
            </button>

            <button
              type="button"
              className="release-cache-button"
              disabled={!canRefreshCache}
              onClick={() => onCacheRefresh(periodKey, fingerprint)}
            >
              <RefreshCw size={17} />
              Simulate Redis cache refresh
            </button>
          </div>

          <div className="release-cache-status">
            <Database size={18} />

            <div>
              <strong>Redis cache status</strong>

              <p>
                {isCacheRefreshed
                  ? 'Cache refreshed successfully. Published results are ready for simulated student access.'
                  : isPublished
                    ? 'Publication complete. Cache refresh is still required.'
                    : 'Cache refresh is unavailable until results are published.'}
              </p>
            </div>

            <span
              className={`release-cache-indicator ${
                isCacheRefreshed ? 'active' : ''
              }`}
            >
              {isCacheRefreshed ? 'Ready' : 'Waiting'}
            </span>
          </div>

          <div
            className={`release-student-access ${
              isCacheRefreshed ? 'available' : ''
            }`}
          >
            {isCacheRefreshed ? (
              <CheckCircle2 size={20} />
            ) : (
              <LockKeyhole size={20} />
            )}

            <div>
              <strong>
                {isCacheRefreshed
                  ? 'Student access enabled'
                  : 'Student access locked'}
              </strong>

              <p>
                {isCacheRefreshed
                  ? 'The selected period is ready for students in this simulation.'
                  : 'Students cannot access this period until publication and cache refresh are complete.'}
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="release-records-panel">
        <div className="release-panel-heading">
          <div>
            <h2>Release eligibility</h2>

            <p>
              Examination records included in the selected publication.
            </p>
          </div>

          <span>{totalCount} records</span>
        </div>

        {totalCount > 0 ? (
          <div className="release-records-table-wrapper">
            <table className="release-records-table">
              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>REGISTRATION NUMBER</th>
                  <th>EXAMINATION UNIT</th>
                  <th>MARKS</th>
                  <th>GRADE</th>
                  <th>REVIEW STATUS</th>
                </tr>
              </thead>

              <tbody>
                {periodResults.map((result) => (
                  <tr key={result.id}>
                    <td>{result.studentName}</td>
                    <td>{result.registrationNumber}</td>

                    <td>
                      <strong>{result.courseCode}</strong>
                      <span>{result.courseName}</span>
                    </td>

                    <td>{result.marks}%</td>
                    <td>{result.grade}</td>

                    <td>
                      <span
                        className={`release-record-status ${
                          result.status === 'Approved'
                            ? 'approved'
                            : result.status === 'Rejected'
                              ? 'rejected'
                              : 'pending'
                        }`}
                      >
                        {result.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="release-empty-state">
            <ClipboardCheck size={28} />

            <strong>No records for this examination period</strong>

            <p>
              Add examination records in Results Management before
              starting the release workflow.
            </p>
          </div>
        )}
      </section>

      <div className="release-prototype-note">
        <AlertTriangle size={17} />

        <p>
          <strong>Prototype limitation:</strong> Publication authorization
          and Redis operations are frontend simulations. A real system
          would require authenticated administrative permissions,
          server-side approval validation, transactional publication,
          cache invalidation and audit logging.
        </p>
      </div>
    </section>
  )
}

