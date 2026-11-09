
import { useMemo, useState } from 'react'
import type {
  Dispatch,
  FormEvent,
  SetStateAction,
} from 'react'
import {
  AlertCircle,
  BookOpen,
  Check,
  CheckCircle2,
  Download,
  Eye,
  Pencil,
  Plus,
  Search,
  UserRound,
  Users,
  X,
} from 'lucide-react'

import type { ManagedResult } from './ResultsManagement'
import { initialResults } from './ResultsManagement'

export type StudentStatus = 'Active' | 'Inactive'

export type ManagedStudent = {
  id: number
  registrationNumber: string
  fullName: string
  status: StudentStatus
}

type StudentDraft = {
  registrationNumber: string
  fullName: string
  status: StudentStatus
}

type StudentManagementProps = {
  students: ManagedStudent[]
  onStudentsChange: Dispatch<SetStateAction<ManagedStudent[]>>
  results: ManagedResult[]
  onResultsChange: Dispatch<SetStateAction<ManagedResult[]>>
}

const emptyDraft: StudentDraft = {
  registrationNumber: '',
  fullName: '',
  status: 'Active',
}

// Build one student record per unique registration number.
// These are illustrative records derived from the existing sample results.
export const initialStudents: ManagedStudent[] = initialResults.reduce<
  ManagedStudent[]
>((students, result) => {
  const registrationNumber = result.registrationNumber.trim()

  const exists = students.some(
    (student) =>
      student.registrationNumber.toLowerCase() ===
      registrationNumber.toLowerCase(),
  )

  if (!exists) {
    students.push({
      id: result.id,
      registrationNumber,
      fullName: result.studentName,
      status: 'Active',
    })
  }

  return students
}, [])

function escapeCsv(value: string | number): string {
  return `"${String(value).replace(/"/g, '""')}"`
}

export default function StudentManagement({
  students,
  onStudentsChange,
  results,
  onResultsChange,
}: StudentManagementProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<StudentDraft>(emptyDraft)
  const [formError, setFormError] = useState('')
  const [selectedStudentId, setSelectedStudentId] =
    useState<number | null>(null)

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase()

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        student.fullName.toLowerCase().includes(query) ||
        student.registrationNumber.toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === 'All' || student.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [students, search, statusFilter])

  const activeCount = students.filter(
    (student) => student.status === 'Active',
  ).length

  const inactiveCount = students.filter(
    (student) => student.status === 'Inactive',
  ).length

  const studentsWithResults = students.filter((student) =>
  results.some(
    (result) =>
      result.registrationNumber.toLowerCase() ===
      student.registrationNumber.toLowerCase(),
  ),
).length

  const selectedStudent = students.find(
    (student) => student.id === selectedStudentId,
  )

  const selectedResults = selectedStudent
    ? results.filter(
        (result) =>
          result.registrationNumber.toLowerCase() ===
          selectedStudent.registrationNumber.toLowerCase(),
      )
    : []

  function openAddModal() {
    setEditingId(null)
    setDraft({ ...emptyDraft })
    setFormError('')
    setIsModalOpen(true)
  }

  function openEditModal(student: ManagedStudent) {
    setEditingId(student.id)
    setDraft({
      registrationNumber: student.registrationNumber,
      fullName: student.fullName,
      status: student.status,
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

  function updateDraft(
    field: keyof StudentDraft,
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const registrationNumber = draft.registrationNumber.trim()
    const fullName = draft.fullName.trim()

    if (!registrationNumber || !fullName) {
      setFormError('Please complete all required fields.')
      return
    }

    const duplicate = students.some(
      (student) =>
        student.id !== editingId &&
        student.registrationNumber.toLowerCase() ===
          registrationNumber.toLowerCase(),
    )

    if (duplicate) {
      setFormError(
        'A student with this registration number already exists.',
      )
      return
    }

    if (editingId !== null) {
      const existingStudent = students.find(
        (student) => student.id === editingId,
      )

      if (!existingStudent) {
        setFormError('The selected student could not be found.')
        return
      }

      const previousRegistrationNumber =
        existingStudent.registrationNumber

      const registrationChanged =
        previousRegistrationNumber.toLowerCase() !==
        registrationNumber.toLowerCase()

      onStudentsChange((current) =>
        current.map((student) =>
          student.id === editingId
            ? {
                ...student,
                registrationNumber,
                fullName,
                status: draft.status,
              }
            : student,
        ),
      )

      // Keep all existing examination records linked to this student.
      onResultsChange((current) =>
        current.map((result) =>
          result.registrationNumber.toLowerCase() ===
          previousRegistrationNumber.toLowerCase()
            ? {
                ...result,
                registrationNumber,
                studentName: fullName,
              }
            : result,
        ),
      )

      if (registrationChanged) {
        setSelectedStudentId(editingId)
      }
    } else {
      const nextId =
        Math.max(0, ...students.map((student) => student.id)) + 1

      onStudentsChange((current) => [
        {
          id: nextId,
          registrationNumber,
          fullName,
          status: draft.status,
        },
        ...current,
      ])

      setSelectedStudentId(nextId)
    }

    closeModal()
  }

  function exportStudents() {
    const headers = [
      'Registration Number',
      'Full Name',
      'Status',
      'Examination Records',
    ]

    const rows = filteredStudents.map((student) => {
      const recordCount = results.filter(
        (result) =>
          result.registrationNumber.toLowerCase() ===
          student.registrationNumber.toLowerCase(),
      ).length

      return [
        student.registrationNumber,
        student.fullName,
        student.status,
        recordCount,
      ]
    })

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(','))
      .join('\n')

    const blob = new Blob(['\uFEFF', csv], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'admin-student-directory.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="admin-students-page">
      <div className="admin-students-heading">
        <div>
          <span className="admin-students-eyebrow">
            ACADEMIC OPERATIONS
          </span>
          <h1>Student Management</h1>
          <p>
            Maintain student records and review their associated
            examination history.
          </p>
        </div>

        <div className="admin-students-heading-actions">
          <button
            type="button"
            className="admin-students-secondary-button"
            onClick={exportStudents}
          >
            <Download size={17} />
            Export CSV
          </button>

          <button
            type="button"
            className="admin-students-primary-button"
            onClick={openAddModal}
          >
            <Plus size={17} />
            Add student
          </button>
        </div>
      </div>

      <div className="admin-students-notice">
        <AlertCircle size={17} />
        <span>
          Demonstration mode: student records are stored in shared
          application state for this browser session. No official
          university records are modified.
        </span>
      </div>

      <div className="admin-students-stats">
        <article className="admin-students-stat">
          <div className="admin-students-stat-icon blue">
            <Users size={20} />
          </div>
          <span>Total students</span>
          <strong>{students.length}</strong>
          <small>Registered demo records</small>
        </article>

        <article className="admin-students-stat">
          <div className="admin-students-stat-icon green">
            <CheckCircle2 size={20} />
          </div>
          <span>Active students</span>
          <strong>{activeCount}</strong>
          <small>Currently marked active</small>
        </article>

        <article className="admin-students-stat">
          <div className="admin-students-stat-icon red">
            <AlertCircle size={20} />
          </div>
          <span>Inactive students</span>
          <strong>{inactiveCount}</strong>
          <small>Retained student records</small>
        </article>

        <article className="admin-students-stat">
          <div className="admin-students-stat-icon purple">
            <BookOpen size={20} />
          </div>
          <span>Students with results</span>
          <strong>{studentsWithResults}</strong>
          <small>Linked examination records</small>
        </article>
      </div>

      <section className="admin-students-panel">
        <div className="admin-students-panel-heading">
          <div>
            <h2>Student directory</h2>
            <p>
              Search, review and update registered student records.
            </p>
          </div>

          <span className="admin-students-record-count">
            {filteredStudents.length} students
          </span>
        </div>

        <div className="admin-students-filters">
          <label className="admin-students-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search name or registration number..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <select
            aria-label="Filter students by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All student statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="admin-students-table-wrapper">
          <table className="admin-students-table">
            <thead>
              <tr>
                <th>STUDENT</th>
                <th>REGISTRATION NUMBER</th>
                <th>EXAMINATION RECORDS</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => {
                const recordCount = results.filter(
                  (result) =>
                    result.registrationNumber.toLowerCase() ===
                    student.registrationNumber.toLowerCase(),
                ).length

                return (
                  <tr key={student.id}>
                    <td>
                      <div className="admin-students-person">
                        <div className="admin-students-avatar">
                          {student.fullName
                            .split(/\s+/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((part) => part[0]?.toUpperCase())
                            .join('')}
                        </div>

                        <strong>{student.fullName}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="admin-students-registration">
                        {student.registrationNumber}
                      </span>
                    </td>

                    <td>
                      <span className="admin-students-result-count">
                        <BookOpen size={14} />
                        {recordCount} {recordCount === 1 ? 'record' : 'records'}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`admin-students-status ${
                          student.status === 'Active'
                            ? 'active'
                            : 'inactive'
                        }`}
                      >
                        <span />
                        {student.status}
                      </span>
                    </td>

                    <td>
                      <div className="admin-students-row-actions">
                        <button
                          type="button"
                          className="admin-students-view-button"
                          onClick={() =>
                            setSelectedStudentId(student.id)
                          }
                          aria-label={`View ${student.fullName}`}
                          title="View student"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          className="admin-students-edit-button"
                          onClick={() => openEditModal(student)}
                          aria-label={`Edit ${student.fullName}`}
                          title="Edit student"
                        >
                          <Pencil size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="admin-students-empty">
              <Search size={25} />
              <strong>No students found</strong>
              <span>
                Try another search term or change the status filter.
              </span>
            </div>
          )}
        </div>

        <div className="admin-students-table-footer">
          <span>
            Showing {filteredStudents.length} of {students.length} students
          </span>
          <span>Academic prototype · Simulated data</span>
        </div>
      </section>

      {selectedStudent && (
        <section className="admin-students-panel admin-students-detail">
          <div className="admin-students-panel-heading">
            <div>
              <span className="admin-students-eyebrow">
                STUDENT RECORD
              </span>
              <h2>{selectedStudent.fullName}</h2>
              <p>{selectedStudent.registrationNumber}</p>
            </div>

            <button
              type="button"
              className="admin-students-secondary-button"
              onClick={() => setSelectedStudentId(null)}
            >
              <X size={16} />
              Close details
            </button>
          </div>

          <div className="admin-students-detail-summary">
            <div>
              <span>Student status</span>
              <strong>{selectedStudent.status}</strong>
            </div>

            <div>
              <span>Examination records</span>
              <strong>{selectedResults.length}</strong>
            </div>

            <div>
              <span>Approved results</span>
              <strong>
                {selectedResults.filter(
                  (result) => result.status === 'Approved',
                ).length}
              </strong>
            </div>
          </div>

          <div className="admin-students-panel-heading admin-students-history-heading">
            <div>
              <h2>Examination history</h2>
              <p>Results associated with this registration number.</p>
            </div>
          </div>

          {selectedResults.length > 0 ? (
            <div className="admin-students-table-wrapper">
              <table className="admin-students-table">
                <thead>
                  <tr>
                    <th>COURSE</th>
                    <th>MARKS</th>
                    <th>GRADE</th>
                    <th>SEMESTER</th>
                    <th>STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedResults.map((result) => (
                    <tr key={result.id}>
                      <td>
                        <div className="admin-students-course">
                          <strong>{result.courseCode}</strong>
                          <span>{result.courseName}</span>
                        </div>
                      </td>
                      <td>{result.marks}%</td>
                      <td>
                        <strong>{result.grade}</strong>
                      </td>
                      <td>
                        <div className="admin-students-course">
                          <strong>{result.semester}</strong>
                          <span>{result.academicYear}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`admin-students-result-status ${result.status.toLowerCase().replace(/\s+/g, '-')}`}
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
            <div className="admin-students-empty">
              <BookOpen size={25} />
              <strong>No examination records</strong>
              <span>
                No results are currently linked to this student.
              </span>
            </div>
          )}
        </section>
      )}

      {isModalOpen && (
        <div
          className="admin-students-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal()
          }}
        >
          <section
            className="admin-students-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-students-modal-title"
          >
            <div className="admin-students-modal-heading">
              <div>
                <span className="admin-students-eyebrow">
                  STUDENT RECORD
                </span>
                <h2 id="admin-students-modal-title">
                  {editingId === null ? 'Add student' : 'Edit student'}
                </h2>
                <p>
                  Enter the student's registration details and account status.
                </p>
              </div>

              <button
                type="button"
                className="admin-students-modal-close"
                onClick={closeModal}
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-students-form-grid">
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
                  Full name
                  <input
                    required
                    value={draft.fullName}
                    onChange={(event) =>
                      updateDraft('fullName', event.target.value)
                    }
                    placeholder="Enter student's full name"
                  />
                </label>

                <label>
                  Student status
                  <select
                    value={draft.status}
                    onChange={(event) =>
                      updateDraft(
                        'status',
                        event.target.value as StudentStatus,
                      )
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </label>
              </div>

              {formError && (
                <div className="admin-students-form-error" role="alert">
                  <AlertCircle size={16} />
                  {formError}
                </div>
              )}

              <div className="admin-students-modal-actions">
                <button
                  type="button"
                  className="admin-students-secondary-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-students-primary-button"
                >
                  <Check size={16} />
                  {editingId === null ? 'Save student' : 'Save changes'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  )
}
