
import { useMemo, useState } from 'react'
import {
  Award,
  BookOpen,
  Download,
  Search,
  TrendingUp,
  LockKeyhole,
} from 'lucide-react'

import type { ManagedResult } from '../admin/ResultsManagement'

type PeriodFingerprints = Record<string, string>

type MyResultsProps = {
  results: ManagedResult[]
  registrationNumber: string
  publishedFingerprints: PeriodFingerprints
  cachedFingerprints: PeriodFingerprints
}

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

const gradeOptions = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'E']

function getGradeColor(grade: string) {
  if (grade === 'A' || grade === 'A-') return 'grade-a'

  if (['B+', 'B', 'B-'].includes(grade)) return 'grade-b'

  if (grade === 'C+' || grade === 'C') return 'grade-c'

  return 'grade-low'
}

function createPeriodFingerprint(records: ManagedResult[]) {
  return JSON.stringify(
    [...records].sort((a, b) => a.id - b.id),
  )
}

function isPeriodAvailable(
  records: ManagedResult[],
  periodKey: string,
  publishedFingerprints: PeriodFingerprints,
  cachedFingerprints: PeriodFingerprints,
) {
  if (!records.length) return false

  const fingerprint = createPeriodFingerprint(records)

  return (
    publishedFingerprints[periodKey] === fingerprint &&
    cachedFingerprints[periodKey] === fingerprint
  )
}

export default function MyResults({
  results,
  registrationNumber,
  publishedFingerprints,
  cachedFingerprints,
}: MyResultsProps) {
  const [semester, setSemester] = useState('All')
  const [academicYear, setAcademicYear] = useState('All')
  const [search, setSearch] = useState('')

  const periodGroups = useMemo(() => {
    const groups = new Map<string, ManagedResult[]>()

    results.forEach((result) => {
      const key = `${result.academicYear}::${result.semester}`
      const existing = groups.get(key) ?? []

      existing.push(result)
      groups.set(key, existing)
    })

    return Array.from(groups.entries()).map(([key, records]) => ({
      key,
      records,
      academicYear: records[0].academicYear,
      semester: records[0].semester,
      available: isPeriodAvailable(
        records,
        key,
        publishedFingerprints,
        cachedFingerprints,
      ),
    }))
  }, [results, publishedFingerprints, cachedFingerprints])

  const accessibleResults = useMemo(() => {
    return periodGroups
      .filter((group) => group.available)
      .flatMap((group) => group.records)
      .filter(
        (result) =>
          result.registrationNumber.toLowerCase() ===
            registrationNumber.toLowerCase() &&
          result.status === 'Approved',
      )
      .map((result) => ({
        id: result.id,
        code: result.courseCode,
        name: result.courseName,
        credits: result.credits,
        marks: result.marks,
        grade: result.grade,
        semester: result.semester,
        academicYear: result.academicYear,
      }))
  }, [periodGroups, registrationNumber])

  const academicYears = useMemo(
    () =>
      [...new Set(accessibleResults.map((result) => result.academicYear))]
        .sort()
        .reverse(),
    [accessibleResults],
  )

  const semesters = useMemo(
    () =>
      [...new Set(accessibleResults.map((result) => result.semester))]
        .sort(),
    [accessibleResults],
  )

  const filteredResults = useMemo(() => {
    const query = search.toLowerCase().trim()

    return accessibleResults.filter((result) => {
      const matchesSemester =
        semester === 'All' || result.semester === semester

      const matchesYear =
        academicYear === 'All' ||
        result.academicYear === academicYear

      const matchesSearch =
        !query ||
        result.code.toLowerCase().includes(query) ||
        result.name.toLowerCase().includes(query)

      return matchesSemester && matchesYear && matchesSearch
    })
  }, [accessibleResults, semester, academicYear, search])

  const totalCredits = filteredResults.reduce(
    (total, result) => total + result.credits,
    0,
  )

  const average = filteredResults.length
    ? filteredResults.reduce(
        (total, result) => total + result.marks,
        0,
      ) / filteredResults.length
    : 0

  const gpa = totalCredits
    ? filteredResults.reduce(
        (total, result) =>
          total + (gradePoints[result.grade] ?? 0) * result.credits,
        0,
      ) / totalCredits
    : 0

  const gradeCounts = gradeOptions.map((grade) => ({
    grade,
    count: filteredResults.filter(
      (result) => result.grade === grade,
    ).length,
  }))

  const availablePeriods = periodGroups.filter(
    (group) => group.available,
  ).length

  const pendingPeriods = periodGroups.length - availablePeriods

  function exportResults() {
    if (!filteredResults.length) return

    const headers = [
      'Unit Code',
      'Unit Name',
      'Credits',
      'Marks',
      'Grade',
      'Semester',
      'Academic Year',
    ]

    const rows = filteredResults.map((result) => [
      result.code,
      result.name,
      result.credits,
      result.marks,
      result.grade,
      result.semester,
      result.academicYear,
    ])

    const escapeCsv = (value: string | number) => {
      let text = String(value)

      if (/^[\s]*[=+\-@]/.test(text)) {
        text = `'${text}`
      }

      return `"${text.replace(/"/g, '""')}"`
    }

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(','))
      .join('\r\n')

    const blob = new Blob(['\uFEFF', csv], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'student-examination-results.csv'

    document.body.appendChild(link)
    link.click()
    link.remove()

    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <section className="results-page">
      <div className="results-heading">
        <div>
          <span className="results-eyebrow">ACADEMIC RECORDS</span>
          <h1>My Results</h1>
          <p>
            Review your published examination performance and academic
            progress.
          </p>
        </div>

        <button
          type="button"
          className="results-export"
          onClick={exportResults}
          disabled={!filteredResults.length}
        >
          <Download size={17} />
          Export CSV
        </button>
      </div>

      <div className="results-summary">
        <article className="results-stat">
          <div className="results-stat-icon blue">
            <BookOpen size={20} />
          </div>
          <span>Total Examination Units</span>
          <strong>{filteredResults.length}</strong>
          <small>Published units matching your filters</small>
        </article>

        <article className="results-stat">
          <div className="results-stat-icon purple">
            <Award size={20} />
          </div>
          <span>Grade Point Average</span>
          <strong>{gpa.toFixed(2)}</strong>
          <small>Illustrative credit-weighted GPA</small>
        </article>

        <article className="results-stat">
          <div className="results-stat-icon green">
            <TrendingUp size={20} />
          </div>
          <span>Average Marks</span>
          <strong>{average.toFixed(1)}%</strong>
          <small>Average across displayed units</small>
        </article>
      </div>

      <div className="results-panel">
        <div className="results-panel-heading">
          <div>
            <h2>Examination Records</h2>
            <p>Your approved and published academic results.</p>
          </div>

          <span className="results-record-count">
            {filteredResults.length} records
          </span>
        </div>

        <div className="results-filters">
          <label className="results-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search unit code or name..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <select
            aria-label="Filter by academic year"
            value={academicYear}
            onChange={(event) => setAcademicYear(event.target.value)}
          >
            <option value="All">All academic years</option>

            {academicYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by semester"
            value={semester}
            onChange={(event) => setSemester(event.target.value)}
          >
            <option value="All">All semesters</option>

            {semesters.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="results-table-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                <th>EXAMINATION UNIT</th>
                <th>CREDITS</th>
                <th>MARKS</th>
                <th>GRADE</th>
                <th>SEMESTER</th>
              </tr>
            </thead>

            <tbody>
              {filteredResults.map((result) => (
                <tr key={result.id}>
                  <td>
                    <div className="results-course">
                      <strong>{result.code}</strong>
                      <span>{result.name}</span>
                    </div>
                  </td>

                  <td>{result.credits}</td>

                  <td>
                    <strong>{result.marks}%</strong>
                  </td>

                  <td>
                    <span
                      className={`results-grade ${getGradeColor(result.grade)}`}
                    >
                      {result.grade}
                    </span>
                  </td>

                  <td>
                    <div className="results-semester">
                      <span>{result.semester}</span>
                      <small>{result.academicYear}</small>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredResults.length === 0 && (
            <div className="results-empty">
              {accessibleResults.length === 0 ? (
                <>
                  <LockKeyhole size={25} />
                  <strong>No published results available</strong>
                  <span>
                    Your approved examination results will appear here
                    after the administrator publishes them and refreshes
                    the simulated cache for their academic period.
                  </span>
                </>
              ) : (
                <>
                  <Search size={25} />
                  <strong>No results found</strong>
                  <span>Try changing your search or filters.</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="results-table-footer">
          <span>
            Showing {filteredResults.length} examination records
          </span>
          <span>Academic prototype · Simulated publication</span>
        </div>
      </div>

      <div className="results-panel grade-distribution">
        <div className="results-panel-heading">
          <div>
            <h2>Grade Distribution</h2>
            <p>
              Distribution across the currently displayed results.
            </p>
          </div>
        </div>

        <div className="grade-distribution-list">
          {gradeCounts.map(({ grade, count }) => {
            const percentage = filteredResults.length
              ? (count / filteredResults.length) * 100
              : 0

            return (
              <div className="grade-distribution-item" key={grade}>
                <strong>{grade}</strong>

                <div className="grade-distribution-track">
                  <div
                    className={`grade-distribution-fill ${getGradeColor(grade)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span>{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      <p className="results-disclaimer">
        <strong>Prototype notice:</strong> Results are simulated academic
        records. Only approved records from published and cache-refreshed
        periods are displayed. The GPA scale is illustrative and is not
        an official university grading policy.
      </p>

      <p className="results-disclaimer">
        {pendingPeriods > 0
          ? `${pendingPeriods} academic period(s) are not currently available.`
          : 'All academic periods containing records have passed the simulated publication check.'}
      </p>
    </section>
  )
}

