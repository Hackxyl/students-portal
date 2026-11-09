
import { useMemo, useState } from 'react'
import {
  Award,
  BookOpen,
  Download,
  Search,
  TrendingUp,
} from 'lucide-react'

type Result = {
  id: number
  code: string
  name: string
  credits: number
  marks: number
  grade: string
  semester: string
  academicYear: string
}

const results: Result[] = [
  { id: 1, code: 'BIT 310', name: 'Software Engineering', credits: 3, marks: 82, grade: 'A', semester: 'Semester 1', academicYear: '2025/2026' },
  { id: 2, code: 'BIT 320', name: 'Database Management Systems', credits: 3, marks: 76, grade: 'B+', semester: 'Semester 1', academicYear: '2025/2026' },
  { id: 3, code: 'BIT 315', name: 'Computer Networks', credits: 3, marks: 68, grade: 'B', semester: 'Semester 1', academicYear: '2025/2026' },
  { id: 4, code: 'BIT 330', name: 'Systems Analysis and Design', credits: 3, marks: 88, grade: 'A', semester: 'Semester 1', academicYear: '2025/2026' },
  { id: 5, code: 'BIT 301', name: 'Research Methods', credits: 2, marks: 72, grade: 'B+', semester: 'Semester 1', academicYear: '2025/2026' },
  { id: 6, code: 'BIT 210', name: 'Object Oriented Programming', credits: 3, marks: 79, grade: 'B+', semester: 'Semester 2', academicYear: '2024/2025' },
  { id: 7, code: 'BIT 220', name: 'Data Structures', credits: 3, marks: 85, grade: 'A', semester: 'Semester 2', academicYear: '2024/2025' },
]

const gradePoints: Record<string, number> = {
  A: 4,
  'B+': 3.5,
  B: 3,
  'C+': 2.5,
  C: 2,
  D: 1,
  E: 0,
}

function getGradeColor(grade: string) {
  if (grade === 'A') return 'grade-a'
  if (grade === 'B+' || grade === 'B') return 'grade-b'
  if (grade === 'C+' || grade === 'C') return 'grade-c'
  return 'grade-low'
}

export default function MyResults() {
  const [semester, setSemester] = useState('All')
  const [academicYear, setAcademicYear] = useState('All')
  const [search, setSearch] = useState('')

  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const matchesSemester =
        semester === 'All' || result.semester === semester

      const matchesYear =
        academicYear === 'All' || result.academicYear === academicYear

      const query = search.toLowerCase().trim()
      const matchesSearch =
        !query ||
        result.code.toLowerCase().includes(query) ||
        result.name.toLowerCase().includes(query)

      return matchesSemester && matchesYear && matchesSearch
    })
  }, [semester, academicYear, search])

  const totalCredits = filteredResults.reduce(
    (total, result) => total + result.credits,
    0,
  )

  const average = filteredResults.length
    ? filteredResults.reduce((total, result) => total + result.marks, 0) /
      filteredResults.length
    : 0

  const gpa = totalCredits
    ? filteredResults.reduce(
        (total, result) =>
          total + gradePoints[result.grade] * result.credits,
        0,
      ) / totalCredits
    : 0

  const gradeCounts = ['A', 'B+', 'B', 'C+', 'C', 'D', 'E'].map((grade) => ({
    grade,
    count: filteredResults.filter((result) => result.grade === grade).length,
  }))

  function exportResults() {
    const headers = ['Course Code', 'Course Name', 'Credits', 'Marks', 'Grade']
    const rows = filteredResults.map((result) => [
      result.code,
      result.name,
      result.credits,
      result.marks,
      result.grade,
    ])

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','),
      )
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'student-results.csv'
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <section className="results-page">
      <div className="results-heading">
        <div>
          <span className="results-eyebrow">ACADEMIC RECORDS</span>
          <h1>My Results</h1>
          <p>Review your examination performance and academic progress.</p>
        </div>

        <button className="results-export" onClick={exportResults}>
          <Download size={17} />
          Export CSV
        </button>
      </div>

      <div className="results-summary">
        <article className="results-stat">
          <div className="results-stat-icon blue">
            <BookOpen size={20} />
          </div>
          <span>Total Courses</span>
          <strong>{filteredResults.length}</strong>
          <small>Courses matching your filters</small>
        </article>

        <article className="results-stat">
          <div className="results-stat-icon purple">
            <Award size={20} />
          </div>
          <span>Grade Point Average</span>
          <strong>{gpa.toFixed(2)}</strong>
          <small>Weighted by course credits</small>
        </article>

        <article className="results-stat">
          <div className="results-stat-icon green">
            <TrendingUp size={20} />
          </div>
          <span>Average Marks</span>
          <strong>{average.toFixed(1)}%</strong>
          <small>Average across displayed courses</small>
        </article>
      </div>

      <div className="results-panel">
        <div className="results-panel-heading">
          <div>
            <h2>Examination Records</h2>
            <p>Your academic results by course.</p>
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
              placeholder="Search course code or name..."
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
            <option value="2025/2026">2025/2026</option>
            <option value="2024/2025">2024/2025</option>
          </select>

          <select
            aria-label="Filter by semester"
            value={semester}
            onChange={(event) => setSemester(event.target.value)}
          >
            <option value="All">All semesters</option>
            <option value="Semester 1">Semester 1</option>
            <option value="Semester 2">Semester 2</option>
          </select>
        </div>

        <div className="results-table-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                <th>COURSE</th>
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
                    <span className={`results-grade ${getGradeColor(result.grade)}`}>
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
              <Search size={25} />
              <strong>No results found</strong>
              <span>Try changing your search or filters.</span>
            </div>
          )}
        </div>

        <div className="results-table-footer">
          <span>Showing {filteredResults.length} examination records</span>
          <span>Academic prototype · Sample data</span>
        </div>
      </div>

      <div className="results-panel grade-distribution">
        <div className="results-panel-heading">
          <div>
            <h2>Grade Distribution</h2>
            <p>Distribution across the currently displayed results.</p>
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
        <strong>Prototype notice:</strong> These are illustrative examination
        records. They are not official university results.
      </p>
    </section>
  )
}
