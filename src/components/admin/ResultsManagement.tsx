import { useMemo, useState } from 'react'
import {
  AlertCircle,
  Check,
  CheckCircle2,
  
  Clock3,
  Download,
  Pencil,
  Plus,
  Search,
  Users,
  X,
} from 'lucide-react'

export type ResultStatus = 'Pending review' | 'Approved' | 'Rejected'

export type ManagedResult = {
  id: number
  registrationNumber: string
  studentName: string
  courseCode: string
  courseName: string
  credits: number
  marks: number
  grade: string
  semester: string
  academicYear: string
  status: ResultStatus
}

type ResultDraft = {
  registrationNumber: string
  studentName: string
  courseCode: string
  courseName: string
  credits: string
  marks: string
  semester: string
  academicYear: string
}

export const initialResults: ManagedResult[] = [
  {
    id: 1,
    registrationNumber: 'BIT/001/2023',
    studentName: 'Alex Morgan',
    courseCode: 'BIT 310',
    courseName: 'Software Engineering',
    credits: 3,
    marks: 85,
    grade: 'A',
    semester: 'Semester 1',
    academicYear: '2025/2026',
    status: 'Approved',
  },
  {
    id: 2,
    registrationNumber: 'BIT/002/2023',
    studentName: 'Sarah Johnson',
    courseCode: 'BIT 320',
    courseName: 'Database Management Systems',
    credits: 3,
    marks: 76,
    grade: 'A-',
    semester: 'Semester 1',
    academicYear: '2025/2026',
    status: 'Pending review',
  },
  {
    id: 3,
    registrationNumber: 'BIT/003/2023',
    studentName: 'Daniel Mwangi',
    courseCode: 'BIT 315',
    courseName: 'Computer Networks',
    credits: 3,
    marks: 68,
    grade: 'B',
    semester: 'Semester 1',
    academicYear: '2025/2026',
    status: 'Pending review',
  },
  {
    id: 4,
    registrationNumber: 'BIT/004/2023',
    studentName: 'Grace Wanjiku',
    courseCode: 'BIT 330',
    courseName: 'Systems Analysis and Design',
    credits: 3,
    marks: 88,
    grade: 'A',
    semester: 'Semester 1',
    academicYear: '2025/2026',
    status: 'Approved',
  },
  {
    id: 5,
    registrationNumber: 'BIT/005/2023',
    studentName: 'Brian Otieno',
    courseCode: 'BIT 301',
    courseName: 'Research Methods',
    credits: 2,
    marks: 72,
    grade: 'B+',
    semester: 'Semester 1',
    academicYear: '2025/2026',
    status: 'Rejected',
  },
  {
    id: 6,
    registrationNumber: 'BIT/006/2023',
    studentName: 'Mary Njeri',
    courseCode: 'BIT 210',
    courseName: 'Object Oriented Programming',
    credits: 3,
    marks: 79,
    grade: 'A-',
    semester: 'Semester 2',
    academicYear: '2024/2025',
    status: 'Approved',
  },
  {
    id: 7,
    registrationNumber: 'BIT/007/2023',
    studentName: 'Peter Kimani',
    courseCode: 'BIT 220',
    courseName: 'Data Structures',
    credits: 3,
    marks: 85,
    grade: 'A',
    semester: 'Semester 2',
    academicYear: '2024/2025',
    status: 'Pending review',
  },
]

const emptyDraft: ResultDraft = {
  registrationNumber: '',
  studentName: '',
  courseCode: '',
  courseName: '',
  credits: '3',
  marks: '',
  semester: 'Semester 1',
  academicYear: '2025/2026',
}

// Illustrative grading bands for this academic prototype.
// Replace these with the institution's official grading policy.
function calculateGrade(marks: number): string {
  if (marks >= 80) return 'A'
  if (marks >= 75) return 'A-'
  if (marks >= 70) return 'B+'
  if (marks >= 65) return 'B'
  if (marks >= 60) return 'C+'
  if (marks >= 50) return 'C'
  if (marks >= 40) return 'D'
  return 'E'
}

function getGradeClass(grade: string): string {
  if (grade === 'A' || grade === 'A-') return 'admin-grade-a'
  if (grade === 'B+' || grade === 'B') return 'admin-grade-b'
  if (grade === 'C+' || grade === 'C') return 'admin-grade-c'
  return 'admin-grade-low'
}

function getStatusClass(status: ResultStatus): string {
  if (status === 'Approved') return 'admin-status-approved'
  if (status === 'Rejected') return 'admin-status-rejected'
  return 'admin-status-pending'
}

function escapeCsv(value: string | number): string {
  const text = String(value).replace(/"/g, '""')
  return `"${text}"`
}

type ResultsManagementProps = {
  results: ManagedResult[]
  onResultsChange: React.Dispatch<React.SetStateAction<ManagedResult[]>>
}

export default function ResultsManagement({
  results,
  onResultsChange,
}: ResultsManagementProps) {
  const setResults = onResultsChange
  
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [semesterFilter, setSemesterFilter] = useState('All')
  const [yearFilter, setYearFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<ResultDraft>(emptyDraft)
  const [formError, setFormError] = useState('')

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase()

    return results.filter((result) => {
      const matchesSearch =
        !query ||
        result.studentName.toLowerCase().includes(query) ||
        result.registrationNumber.toLowerCase().includes(query) ||
        result.courseCode.toLowerCase().includes(query) ||
        result.courseName.toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === 'All' || result.status === statusFilter

      const matchesSemester =
        semesterFilter === 'All' || result.semester === semesterFilter

      const matchesYear =
        yearFilter === 'All' || result.academicYear === yearFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSemester &&
        matchesYear
      )
    })
  }, [results, search, statusFilter, semesterFilter, yearFilter])

  const pendingCount = results.filter(
    (result) => result.status === 'Pending review',
  ).length

  const approvedCount = results.filter(
    (result) => result.status === 'Approved',
  ).length

  const rejectedCount = results.filter(
    (result) => result.status === 'Rejected',
  ).length

  function openAddModal() {
    setEditingId(null)
    setDraft({ ...emptyDraft })
    setFormError('')
    setIsModalOpen(true)
  }

  function openEditModal(result: ManagedResult) {
    setEditingId(result.id)
    setDraft({
      registrationNumber: result.registrationNumber,
      studentName: result.studentName,
      courseCode: result.courseCode,
      courseName: result.courseName,
      credits: String(result.credits),
      marks: String(result.marks),
      semester: result.semester,
      academicYear: result.academicYear,
    })
    setFormError('')
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingId(null)
    setDraft({ ...emptyDraft })
    setFormError('')
  }

  function updateDraft(field: keyof ResultDraft, value: string) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const registrationNumber = draft.registrationNumber.trim()
    const studentName = draft.studentName.trim()
    const courseCode = draft.courseCode.trim().toUpperCase()
    const courseName = draft.courseName.trim()
    const credits = Number(draft.credits)
    const marks = Number(draft.marks)

    if (
      !registrationNumber ||
      !studentName ||
      !courseCode ||
      !courseName
    ) {
      setFormError('Please complete all required fields.')
      return
    }

    if (
      !Number.isInteger(credits) ||
      credits < 1 ||
      credits > 10
    ) {
      setFormError('Credits must be a whole number between 1 and 10.')
      return
    }

    if (!Number.isFinite(marks) || marks < 0 || marks > 100) {
      setFormError('Marks must be a number between 0 and 100.')
      return
    }

    const duplicate = results.some(
      (result) =>
        result.id !== editingId &&
        result.registrationNumber.toLowerCase() ===
          registrationNumber.toLowerCase() &&
        result.courseCode.toLowerCase() === courseCode.toLowerCase() &&
        result.semester === draft.semester &&
        result.academicYear === draft.academicYear,
    )

    if (duplicate) {
      setFormError(
        'A result already exists for this student, course and semester.',
      )
      return
    }

    const updatedRecord: ManagedResult = {
      id: editingId ?? Math.max(0, ...results.map((item) =>item.id)) + 1,
      registrationNumber,
      studentName,
      courseCode,
      courseName,
      credits,
      marks,
      grade: calculateGrade(marks),
      semester: draft.semester,
      academicYear: draft.academicYear,
      // Any new or edited record must be reviewed again.
      status: 'Pending review',
    }

    if (editingId !== null) {
      setResults((current) =>
        current.map((result) =>
          result.id === editingId ? updatedRecord : result,
        ),
      )
    } else {
      setResults((current) => [updatedRecord, ...current])
    }

    closeModal()
  }

  function updateStatus(id: number, status: ResultStatus) {
    setResults((current) =>
      current.map((result) =>
        result.id === id ? { ...result, status } : result,
      ),
    )
  }

  function exportResults() {
    const headers = [
      'Registration Number',
      'Student Name',
      'Course Code',
      'Course Name',
      'Credits',
      'Marks',
      'Grade',
      'Semester',
      'Academic Year',
      'Status',
    ]

    const rows = filteredResults.map((result) => [
      result.registrationNumber,
      result.studentName,
      result.courseCode,
      result.courseName,
      result.credits,
      result.marks,
      result.grade,
      result.semester,
      result.academicYear,
      result.status,
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(','))
      .join('\n')

    const blob = new Blob(['\uFEFF', csv], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'admin-examination-results.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="admin-results-page">
      <div className="admin-results-heading">
        <div>
          <span className="admin-results-eyebrow">
            ACADEMIC OPERATIONS
          </span>
          <h1>Results Management</h1>
          <p>
            Manage, validate and review examination recordsbefore
            publication.
          </p>
        </div>

        <div className="admin-results-heading-actions">
          <button
            type="button"
            className="admin-results-secondary-button"
            onClick={exportResults}
          >
            <Download size={17} />
            Export CSV
          </button>

          <button
            type="button"
            className="admin-results-primary-button"
            onClick={openAddModal}
          >
            <Plus size={17} />
            Add result
          </button>
        </div>
      </div>

      <div className="admin-results-demo-notice">
        <AlertCircle size={17} />
        <span>
          Demonstration mode: records and approval actions are stored
          only in this browser session. No official university data is
          changed.
        </span>
      </div>

      <div className="admin-results-stats">
        <article className="admin-results-stat">
          <div className="admin-results-stat-icon blue">
            <Users size={20} />
          </div>
          <span>Total records</span>
          <strong>{results.length}</strong>
          <small>Examination records in this demo</small>
        </article>

        <article className="admin-results-stat">
          <div className="admin-results-stat-icon amber">
            <Clock3 size={20} />
          </div>
          <span>Pending review</span>
          <strong>{pendingCount}</strong>
          <small>Awaiting academic verification</small>
        </article>

        <article className="admin-results-stat">
          <div className="admin-results-stat-icon green">
            <CheckCircle2 size={20} />
          </div>
          <span>Approved</span>
          <strong>{approvedCount}</strong>
          <small>Ready for release workflow</small>
        </article>

        <article className="admin-results-stat">
          <div className="admin-results-stat-icon red">
            <AlertCircle size={20} />
          </div>
          <span>Rejected</span>
          <strong>{rejectedCount}</strong>
          <small>Require correction or review</small>
        </article>
      </div>

      <section className="admin-results-panel">
        <div className="admin-results-panel-heading">
          <div>
            <h2>Examination records</h2>
            <p>
              Search student records and manage their review status.
            </p>
          </div>

          <span className="admin-results-record-count">
            {filteredResults.length} records
          </span>
        </div>

        <div className="admin-results-filters">
          <label className="admin-results-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search name, registration numberor course..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <select
            aria-label="Filter by review status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Pending review">Pending review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            aria-label="Filter by academic year"
            value={yearFilter}
            onChange={(event) => setYearFilter(event.target.value)}
          >
            <option value="All">All academic years</option>
            <option value="2025/2026">2025/2026</option>
            <option value="2024/2025">2024/2025</option>
          </select>

          <select
            aria-label="Filter by semester"
            value={semesterFilter}
            onChange={(event) => setSemesterFilter(event.target.value)}
          >
            <option value="All">All semesters</option>
            <option value="Semester 1">Semester 1</option>
            <option value="Semester 2">Semester 2</option>
          </select>
        </div>

        <div className="admin-results-table-wrapper">
          <table className="admin-results-table">
            <thead>
              <tr>
                <th>STUDENT</th>
                <th>COURSE</th>
                <th>MARKS</th>
                <th>GRADE</th>
                <th>SEMESTER</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredResults.map((result) => (
                <tr key={result.id}>
                  <td>
                    <div className="admin-results-student">
                      <strong>{result.studentName}</strong>
                      <span>{result.registrationNumber}</span>
                    </div>
                  </td>

                  <td>
                    <div className="admin-results-course">
                      <strong>{result.courseCode}</strong>
                      <span>{result.courseName}</span>
                    </div>
                  </td>

                  <td>
                    <strong className="admin-results-marks">
                      {result.marks}%
                    </strong>
                  </td>

                  <td>
                    <span
                      className={`admin-results-grade ${getGradeClass(result.grade)}`}
                    >
                      {result.grade}
                    </span>
                  </td>

                  <td>
                    <div className="admin-results-semester">
                      <span>{result.semester}</span>
                      <small>{result.academicYear}</small>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`admin-results-status ${getStatusClass(result.status)}`}
                    >
                      {result.status}
                    </span>
                  </td>

                  <td>
                    <div className="admin-results-row-actions">
                      <button
                        type="button"
                        className="admin-results-edit-button"
                        onClick={() => openEditModal(result)}
                        aria-label={`Edit result for ${result.studentName}`}
                        title="Edit result"
                      >
                        <Pencil size={15} />
                      </button>

                      {result.status !== 'Approved' && (
                        <button
                          type="button"
                          className="admin-results-approve-button"
                          onClick={() =>
                            updateStatus(result.id, 'Approved')
                          }
                          aria-label={`Approve result for ${result.studentName}`}
                          title="Approve result"
                        >
                          <Check size={15} />
                        </button>
                      )}

                      {result.status !== 'Rejected' && (
                        <button
                          type="button"
                          className="admin-results-reject-button"
                          onClick={() =>
                            updateStatus(result.id, 'Rejected')
                          }
                          aria-label={`Reject result for ${result.studentName}`}
                          title="Reject result"
                        >
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredResults.length === 0 && (
            <div className="admin-results-empty">
              <Search size={25} />
              <strong>No examination records found</strong>
              <span>Try another search term or change your filters.</span>
            </div>
          )}
        </div>

        <div className="admin-results-table-footer">
          <span>
            Showing {filteredResults.length} of {results.length} records
          </span>
          <span>Academic prototype · Simulated data</span>
        </div>
      </section>

      <div className="admin-results-grading-note">
        <strong>Grading note:</strong> The displayed grading bands are
        illustrative for this prototype. They must be replaced with the
        university's official grading policy before real use.
      </div>

      {isModalOpen && (
        <div
          className="admin-results-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal()
          }}
        >
          <section
            className="admin-results-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-results-modal-title"
          >
            <div className="admin-results-modal-heading">
              <div>
                <span className="admin-results-eyebrow">
                  EXAMINATION RECORD
                </span>
                <h2 id="admin-results-modal-title">
                  {editingId === null ? 'Add examination result' : 'Edit examination result'}
                </h2>
                <p>
                  Enter student and course details. The grade is calculated
                  automatically.
                </p>
              </div>

              <button
                type="button"
                className="admin-results-modal-close"
                onClick={closeModal}
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-results-form-grid">
                <label>
                  Registration number
                  <input
                    required
                    value={draft.registrationNumber}
                    onChange={(event) =>
                      updateDraft('registrationNumber', event.target.value)
                    }
                    placeholder="e.g. BIT/008/2023"
                  />
                </label>

                <label>
                  Student name
                  <input
                    required
                    value={draft.studentName}
                    onChange={(event) =>
                      updateDraft('studentName', event.target.value)
                    }
                    placeholder="Enter student name"
                  />
                </label>

                <label>
                  Course code
                  <input
                    required
                    value={draft.courseCode}
                    onChange={(event) =>
                      updateDraft('courseCode', event.target.value)
                    }
                    placeholder="e.g. BIT 340"
                  />
                </label>

                <label>
                  Course name
                  <input
                    required
                    value={draft.courseName}
                    onChange={(event) =>
                      updateDraft('courseName', event.target.value)
                    }
                    placeholder="Enter course name"
                  />
                </label>

                <label>
                  Credit hours
                  <input
                    required
                    type="number"
                    min="1"
                    max="10"
                    step="1"
                    value={draft.credits}
                    onChange={(event) =>
                      updateDraft('credits', event.target.value)
                    }
                  />
                </label>

                <label>
                  Examination marks
                  <input
                    required
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={draft.marks}
                    onChange={(event) =>
                      updateDraft('marks', event.target.value)
                    }
                    placeholder="0–100"
                  />
                </label>

                <label>
                  Semester
                  <select
                    value={draft.semester}
                    onChange={(event) =>
                      updateDraft('semester', event.target.value)
                    }
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                  </select>
                </label>

                <label>
                  Academic year
                  <select
                    value={draft.academicYear}
                    onChange={(event) =>
                      updateDraft('academicYear', event.target.value)
                    }
                  >
                    <option value="2025/2026">2025/2026</option>
                    <option value="2024/2025">2024/2025</option>
                    <option value="2026/2027">2026/2027</option>
                  </select>
                </label>
              </div>

              {draft.marks !== '' &&
                Number.isFinite(Number(draft.marks)) &&
                Number(draft.marks) >= 0 &&
                Number(draft.marks) <= 100 && (
                  <div className="admin-results-grade-preview">
                    Calculated grade
                    <strong>{calculateGrade(Number(draft.marks))}</strong>
                  </div>
                )}

              {formError && (
                <div className="admin-results-form-error" role="alert">
                  <AlertCircle size={16} />
                  {formError}
                </div>
              )}

              <div className="admin-results-modal-actions">
                <button
                  type="button"
                  className="admin-results-secondary-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-results-primary-button"
                >
                  <Check size={16} />
                  {editingId === null ? 'Save result' : 'Save changes'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  )
}