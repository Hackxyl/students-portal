
import { useMemo } from 'react'
import {
  Award,
  FileText,
  Printer,
  LockKeyhole,
} from 'lucide-react'

import type { ManagedResult } from '../admin/ResultsManagement'

type PeriodFingerprints = Record<string, string>

type TranscriptProps = {
  results: ManagedResult[]
  registrationNumber: string
  studentName: string
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

function gradeClass(grade: string) {
  if (grade === 'A' || grade === 'A-') {
    return 'transcript-grade-a'
  }

  if (['B+', 'B', 'B-'].includes(grade)) {
    return 'transcript-grade-b'
  }

  if (['C+', 'C'].includes(grade)) {
    return 'transcript-grade-c'
  }

  return 'transcript-grade-low'
}

function createPeriodFingerprint(records: ManagedResult[]) {
  return JSON.stringify(
    [...records].sort((a, b) => a.id - b.id),
  )
}

function getPublishedResults(
  results: ManagedResult[],
  registrationNumber: string,
  publishedFingerprints: PeriodFingerprints,
  cachedFingerprints: PeriodFingerprints,
) {
  const periods = new Map<string, ManagedResult[]>()

  for (const result of results) {
    const key = `${result.academicYear}::${result.semester}`
    const records = periods.get(key) ?? []

    records.push(result)
    periods.set(key, records)
  }

  const accessibleResults: ManagedResult[] = []

  for (const [periodKey, records] of periods.entries()) {
    const fingerprint = createPeriodFingerprint(records)

    const isPublished =
      publishedFingerprints[periodKey] === fingerprint &&
      cachedFingerprints[periodKey] === fingerprint

    if (!isPublished) continue

    const studentResults = records.filter(
      (result) =>
        result.registrationNumber.toLowerCase() ===
          registrationNumber.toLowerCase() &&
        result.status === 'Approved',
    )

    accessibleResults.push(...studentResults)
  }

  return accessibleResults.sort(
    (a, b) =>
      b.academicYear.localeCompare(a.academicYear) ||
      getSemesterNumber(b.semester) - getSemesterNumber(a.semester) ||
      a.courseCode.localeCompare(b.courseCode),
  )
}

function getSemesterNumber(semester: string) {
  const match = semester.match(/\d+/)
  return match ? Number(match[0]) : 0
}

export default function Transcript({
  results,
  registrationNumber,
  studentName,
  publishedFingerprints,
  cachedFingerprints,
}: TranscriptProps) {
  const transcriptResults = useMemo(
    () =>
      getPublishedResults(
        results,
        registrationNumber,
        publishedFingerprints,
        cachedFingerprints,
      ),
    [
      results,
      registrationNumber,
      publishedFingerprints,
      cachedFingerprints,
    ],
  )

  const totalCredits = transcriptResults.reduce(
    (total, result) => total + result.credits,
    0,
  )

  const totalQualityPoints = transcriptResults.reduce(
    (total, result) =>
      total +
      (gradePoints[result.grade] ?? 0) * result.credits,
    0,
  )

  const cumulativeGpa = totalCredits
    ? totalQualityPoints / totalCredits
    : 0

  const averageMarks = transcriptResults.length
    ? transcriptResults.reduce(
        (total, result) => total + result.marks,
        0,
      ) / transcriptResults.length
    : 0

  const academicYears = [
    ...new Set(
      transcriptResults.map((result) => result.academicYear),
    ),
  ].sort((a, b) => b.localeCompare(a))

  function printTranscript() {
    window.print()
  }

  return (
    <section className="transcript-page">
      <div className="transcript-toolbar">
        <div>
          <span className="transcript-eyebrow">
            ACADEMIC RECORDS
          </span>

          <h1>Academic Transcript</h1>

          <p>
            View and print your consolidated examination performance
            record.
          </p>
        </div>

        <button
          type="button"
          className="transcript-print-button"
          onClick={printTranscript}
          disabled={transcriptResults.length === 0}
        >
          <Printer size={17} />
          Print / Save PDF
        </button>
      </div>

      <div className="transcript-notice">
        <FileText size={19} />

        <div>
          <strong>Unofficial academic transcript</strong>

          <p>
            This is a demonstration document generated from published
            examination records. It is not an official university
            transcript and has no institutional certification.
          </p>
        </div>
      </div>

      <div className="transcript-paper">
        <div className="transcript-document-header">
          <div className="transcript-university-mark">
            <Award size={28} />
          </div>

          <div className="transcript-institution">
            <h2>UNIVERSITY ACADEMIC RECORDS</h2>
            <p>STUDENT RESULTS MANAGEMENT PORTAL</p>
            <span>ACADEMIC TRANSCRIPT</span>
          </div>

          <div className="transcript-document-label">
            <span>DOCUMENT TYPE</span>
            <strong>UNOFFICIAL</strong>
          </div>
        </div>

        <div className="transcript-rule" />

        <div className="transcript-student-heading">
          <h3>STUDENT INFORMATION</h3>
          <span>DEMONSTRATION RECORD</span>
        </div>

        <div className="transcript-student-grid">
          <div>
            <span>Student Name</span>
            <strong>{studentName}</strong>
          </div>

          <div>
            <span>Registration Number</span>
            <strong>{registrationNumber}</strong>
          </div>
        </div>

        <div className="transcript-student-heading transcript-results-heading">
          <h3>EXAMINATION PERFORMANCE</h3>
          <span>APPROVED AND PUBLISHED RECORDS</span>
        </div>

        {academicYears.length > 0 ? (
          academicYears.map((year) => {
            const yearResults = transcriptResults.filter(
              (result) => result.academicYear === year,
            )

            const semesters = [
              ...new Set(
                yearResults.map((result) => result.semester),
              ),
            ].sort(
              (a, b) =>
                getSemesterNumber(b) - getSemesterNumber(a),
            )

            return (
              <div className="transcript-year" key={year}>
                <h4>ACADEMIC YEAR {year}</h4>

                {semesters.map((semester) => {
                  const semesterResults = yearResults.filter(
                    (result) => result.semester === semester,
                  )

                  const semesterCredits = semesterResults.reduce(
                    (total, result) => total + result.credits,
                    0,
                  )

                  const semesterQualityPoints =
                    semesterResults.reduce(
                      (total, result) =>
                        total +
                        (gradePoints[result.grade] ?? 0) *
                          result.credits,
                      0,
                    )

                  const semesterGpa = semesterCredits
                    ? semesterQualityPoints / semesterCredits
                    : 0

                  const semesterAverage =
                    semesterResults.length
                      ? semesterResults.reduce(
                          (total, result) => total + result.marks,
                          0,
                        ) / semesterResults.length
                      : 0

                  return (
                    <div
                      className="transcript-semester"
                      key={semester}
                    >
                      <h5>{semester}</h5>

                      <div className="transcript-table-wrapper">
                        <table className="transcript-table">
                          <thead>
                            <tr>
                              <th>UNIT CODE</th>
                              <th>UNIT TITLE</th>
                              <th>UNITS</th>
                              <th>MARKS</th>
                              <th>GRADE</th>
                            </tr>
                          </thead>

                          <tbody>
                            {semesterResults.map((result) => (
                              <tr key={result.id}>
                                <td>{result.courseCode}</td>
                                <td>{result.courseName}</td>
                                <td>{result.credits}</td>
                                <td>{result.marks}%</td>
                                <td>
                                  <span
                                    className={`transcript-grade ${gradeClass(result.grade)}`}
                                  >
                                    {result.grade}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <p className="transcript-semester-total">
                        Examination records: {semesterResults.length}
                        {' · '}
                        Credit units: {semesterCredits}
                        {' · '}
                        Average: {semesterAverage.toFixed(1)}%
                        {' · '}
                        GPA: {semesterGpa.toFixed(2)}
                      </p>
                    </div>
                  )
                })}
              </div>
            )
          })
        ) : (
          <div className="transcript-empty">
            <LockKeyhole size={28} />

            <strong>No published examination records</strong>

            <p>
              Your transcript will become available after the
              administrator approves, publishes and refreshes the
              examination results cache.
            </p>
          </div>
        )}

        <div className="transcript-summary">
          <h3>ACADEMIC SUMMARY</h3>

          <div className="transcript-summary-grid">
            <div>
              <span>Examination Records</span>
              <strong>{transcriptResults.length}</strong>
            </div>

            <div>
              <span>Total Credit Units</span>
              <strong>{totalCredits}</strong>
            </div>

            <div>
              <span>Cumulative GPA</span>
              <strong>
                {transcriptResults.length
                  ? `${cumulativeGpa.toFixed(2)} / 4.00`
                  : '--'}
              </strong>
            </div>

            <div>
              <span>Overall Average</span>
              <strong>
                {transcriptResults.length
                  ? `${averageMarks.toFixed(1)}%`
                  : '--'}
              </strong>
            </div>
          </div>
        </div>

        <div className="transcript-grading-note">
          <strong>Grading note:</strong> The grade-point mapping used
          in this demonstration is illustrative and is not a verified
          university grading policy.
        </div>

        <div className="transcript-document-footer">
          <span>
            STUDENT RESULTS PORTAL · ACADEMIC PROTOTYPE
          </span>

          <strong>UNOFFICIAL COPY</strong>
        </div>
      </div>

      <div className="transcript-bottom-note">
        <Printer size={15} />

        Select Print / Save PDF and choose "Save as PDF" in your
        browser's print destination settings.
      </div>
    </section>
  )
}

