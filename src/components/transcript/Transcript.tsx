
import { Award, Download, FileText, Printer } from 'lucide-react'

type TranscriptResult = {
  id: number
  code: string
  title: string
  credits: number
  marks: number
  grade: string
  semester: string
  academicYear: string
}

const gradePoints: Record<string, number> = {
  A: 4,
  'B+': 3.5,
  B: 3,
  'C+': 2.5,
  C: 2,
  D: 1,
  E: 0,
}

const transcriptResults: TranscriptResult[] = [
  {
    id: 1,
    code: 'BIT 310',
    title: 'Software Engineering',
    credits: 3,
    marks: 82,
    grade: 'A',
    semester: 'Semester 1',
    academicYear: '2025/2026',
  },
  {
    id: 2,
    code: 'BIT 320',
    title: 'Database Management Systems',
    credits: 3,
    marks: 76,
    grade: 'B+',
    semester: 'Semester 1',
    academicYear: '2025/2026',
  },
  {
    id: 3,
    code: 'BIT 315',
    title: 'Computer Networks',
    credits: 3,
    marks: 68,
    grade: 'B',
    semester: 'Semester 1',
    academicYear: '2025/2026',
  },
  {
    id: 4,
    code: 'BIT 330',
    title: 'Systems Analysis and Design',
    credits: 3,
    marks: 88,
    grade: 'A',
    semester: 'Semester 1',
    academicYear: '2025/2026',
  },
  {
    id: 5,
    code: 'BIT 301',
    title: 'Research Methods',
    credits: 2,
    marks: 72,
    grade: 'B+',
    semester: 'Semester 1',
    academicYear: '2025/2026',
  },
  {
    id: 6,
    code: 'BIT 210',
    title: 'Object Oriented Programming',
    credits: 3,
    marks: 79,
    grade: 'B+',
    semester: 'Semester 2',
    academicYear: '2024/2025',
  },
  {
    id: 7,
    code: 'BIT 220',
    title: 'Data Structures',
    credits: 3,
    marks: 85,
    grade: 'A',
    semester: 'Semester 2',
    academicYear: '2024/2025',
  },
]

const student = {
  name: 'Sample Student',
  registrationNumber: 'DEMO/2023/001',
  programme: 'Bachelor of Science in Information Technology',
  department: 'Information Technology',
  campus: 'Main Campus',
  studyMode: 'Full Time',
  admissionYear: '2023',
}

function gradeClass(grade: string) {
  if (grade === 'A') return 'transcript-grade-a'
  if (grade === 'B+' || grade === 'B') return 'transcript-grade-b'
  if (grade === 'C+' || grade === 'C') return 'transcript-grade-c'
  return 'transcript-grade-low'
}

export default function Transcript() {
  const totalCredits = transcriptResults.reduce(
    (total, result) => total + result.credits,
    0,
  )

  const totalQualityPoints = transcriptResults.reduce(
    (total, result) =>
      total + gradePoints[result.grade] * result.credits,
    0,
  )

  const cumulativeGpa = totalCredits
    ? totalQualityPoints / totalCredits
    : 0

  const academicYears = [
    ...new Set(transcriptResults.map((result) => result.academicYear)),
  ].sort((a, b) => b.localeCompare(a))

  function printTranscript() {
    window.print()
  }

  return (
    <section className="transcript-page">
      <div className="transcript-toolbar">
        <div>
          <span className="transcript-eyebrow">ACADEMIC RECORDS</span>
          <h1>Academic Transcript</h1>
          <p>View and print a consolidated academic performance record.</p>
        </div>

        <button
          type="button"
          className="transcript-print-button"
          onClick={printTranscript}
        >
          <Printer size={17} />
          Print / Save PDF
        </button>
      </div>

      <div className="transcript-notice">
        <FileText size={19} />
        <div>
          <strong>Sample academic transcript</strong>
          <p>
            This document uses demonstration data. It is not an official
            university transcript and has no institutional certification.
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
            <strong>{student.name}</strong>
          </div>
          <div>
            <span>Registration Number</span>
            <strong>{student.registrationNumber}</strong>
          </div>
          <div>
            <span>Programme</span>
            <strong>{student.programme}</strong>
          </div>
          <div>
            <span>Department</span>
            <strong>{student.department}</strong>
          </div>
          <div>
            <span>Campus</span>
            <strong>{student.campus}</strong>
          </div>
          <div>
            <span>Study Mode</span>
            <strong>{student.studyMode}</strong>
          </div>
          <div>
            <span>Admission Year</span>
            <strong>{student.admissionYear}</strong>
          </div>
          <div>
            <span>Academic Status</span>
            <strong>Sample Record</strong>
          </div>
        </div>

        <div className="transcript-student-heading transcript-results-heading">
          <h3>ACADEMIC PERFORMANCE</h3>
          <span>ALL RECORDED SEMESTERS</span>
        </div>

        {academicYears.map((year) => {
          const yearResults = transcriptResults.filter(
            (result) => result.academicYear === year,
          )

          const semesters = [
            ...new Set(yearResults.map((result) => result.semester)),
          ]

          return (
            <div className="transcript-year" key={year}>
              <h4>ACADEMIC YEAR {year}</h4>

              {semesters.map((semester) => {
                const semesterResults = yearResults.filter(
                  (result) => result.semester === semester,
                )

                return (
                  <div className="transcript-semester" key={semester}>
                    <h5>{semester}</h5>

                    <div className="transcript-table-wrapper">
                      <table className="transcript-table">
                        <thead>
                          <tr>
                            <th>COURSE CODE</th>
                            <th>COURSE TITLE</th>
                            <th>UNITS</th>
                            <th>MARKS</th>
                            <th>GRADE</th>
                          </tr>
                        </thead>

                        <tbody>
                          {semesterResults.map((result) => (
                            <tr key={result.id}>
                              <td>{result.code}</td>
                              <td>{result.title}</td>
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
                      Semester courses: {semesterResults.length} · Credit
                      units:{' '}
                      {semesterResults.reduce(
                        (total, result) => total + result.credits,
                        0,
                      )}
                    </p>
                  </div>
                )
              })}
            </div>
          )
        })}

        <div className="transcript-summary">
          <h3>ACADEMIC SUMMARY</h3>

          <div className="transcript-summary-grid">
            <div>
              <span>Courses Completed</span>
              <strong>{transcriptResults.length}</strong>
            </div>
            <div>
              <span>Total Credit Units</span>
              <strong>{totalCredits}</strong>
            </div>
            <div>
              <span>Cumulative GPA</span>
              <strong>{cumulativeGpa.toFixed(2)} / 4.00</strong>
            </div>
            <div>
              <span>Grade Scale</span>
              <strong>4.00 Point Scale</strong>
            </div>
          </div>
        </div>

        <div className="transcript-grading-note">
          <strong>Grading note:</strong> The grade-point mapping shown here is
          illustrative and is not a verified university grading policy.
        </div>

        <div className="transcript-document-footer">
          <span>STUDENT RESULTS PORTAL · ACADEMIC PROTOTYPE</span>
          <strong>UNOFFICIAL COPY</strong>
        </div>
      </div>

      <div className="transcript-bottom-note">
        <Download size={15} />
        Select Print / Save PDF and choose "Save as PDF" in your browser's
        print destination settings.
      </div>
    </section>
  )
}
