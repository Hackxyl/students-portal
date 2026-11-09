
import { useMemo, useState } from 'react'
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  GraduationCap,
  Search,
  Users,
} from 'lucide-react'

type Course = {
  id: number
  code: string
  title: string
  credits: number
  lecturer: string
  department: string
  semester: string
  academicYear: string
  status: 'Registered' | 'Completed'
  description: string
  schedule: string
}

const courses: Course[] = [
  {
    id: 1,
    code: 'BIT 310',
    title: 'Software Engineering',
    credits: 3,
    lecturer: 'Dr. James Mwangi',
    department: 'Information Technology',
    semester: 'Semester 1',
    academicYear: '2025/2026',
    status: 'Completed',
    description:
      'Software development methodologies, requirements engineering, software architecture, testing and maintenance.',
    schedule: 'Monday · 8:00 AM – 10:00 AM',
  },
  {
    id: 2,
    code: 'BIT 320',
    title: 'Database Management Systems',
    credits: 3,
    lecturer: 'Ms. Mary Wanjiku',
    department: 'Information Technology',
    semester: 'Semester 1',
    academicYear: '2025/2026',
    status: 'Completed',
    description:
      'Relational database design, SQL, normalization, transactions and database administration.',
    schedule: 'Tuesday · 10:00 AM – 12:00 PM',
  },
  {
    id: 3,
    code: 'BIT 315',
    title: 'Computer Networks',
    credits: 3,
    lecturer: 'Mr. Peter Kamau',
    department: 'Information Technology',
    semester: 'Semester 1',
    academicYear: '2025/2026',
    status: 'Completed',
    description:
      'Network architecture, communication protocols, routing, switching and network security.',
    schedule: 'Wednesday · 8:00 AM – 10:00 AM',
  },
  {
    id: 4,
    code: 'BIT 330',
    title: 'Systems Analysis and Design',
    credits: 3,
    lecturer: 'Dr. Alice Njeri',
    department: 'Information Technology',
    semester: 'Semester 1',
    academicYear: '2025/2026',
    status: 'Completed',
    description:
      'Information systems planning, requirements analysis, modelling and system design.',
    schedule: 'Thursday · 2:00 PM – 4:00 PM',
  },
  {
    id: 5,
    code: 'BIT 301',
    title: 'Research Methods',
    credits: 2,
    lecturer: 'Mr. David Mutua',
    department: 'Information Technology',
    semester: 'Semester 1',
    academicYear: '2025/2026',
    status: 'Completed',
    description:
      'Research design, data collection, research ethics, analysis and academic writing.',
    schedule: 'Friday · 10:00 AM – 12:00 PM',
  },
  {
    id: 6,
    code: 'BIT 340',
    title: 'Web Application Development',
    credits: 3,
    lecturer: 'Ms. Sarah Achieng',
    department: 'Information Technology',
    semester: 'Semester 2',
    academicYear: '2025/2026',
    status: 'Registered',
    description:
      'Modern web application development, client-server architecture, APIs and application security.',
    schedule: 'Monday · 2:00 PM – 4:00 PM',
  },
  {
    id: 7,
    code: 'BIT 350',
    title: 'Mobile Application Development',
    credits: 3,
    lecturer: 'Mr. Brian Otieno',
    department: 'Information Technology',
    semester: 'Semester 2',
    academicYear: '2025/2026',
    status: 'Registered',
    description:
      'Mobile application architecture, interface development, state management and API integration.',
    schedule: 'Wednesday · 10:00 AM – 12:00 PM',
  },
  {
    id: 8,
    code: 'BIT 360',
    title: 'Information Systems Security',
    credits: 3,
    lecturer: 'Dr. Grace Muthoni',
    department: 'Information Technology',
    semester: 'Semester 2',
    academicYear: '2025/2026',
    status: 'Registered',
    description:
      'Information security principles, access control, threat analysis and security management.',
    schedule: 'Friday · 8:00 AM – 10:00 AM',
  },
]

export default function MyCourses() {
  const [search, setSearch] = useState('')
  const [semester, setSemester] = useState('All')
  const [status, setStatus] = useState('All')
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null)

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase()

    return courses.filter((course) => {
      const matchesSearch =
        !query ||
        course.code.toLowerCase().includes(query) ||
        course.title.toLowerCase().includes(query) ||
        course.lecturer.toLowerCase().includes(query)

      const matchesSemester =
        semester === 'All' || course.semester === semester

      const matchesStatus = status === 'All' || course.status === status

      return matchesSearch && matchesSemester && matchesStatus
    })
  }, [search, semester, status])

  const registeredCount = courses.filter(
    (course) => course.status === 'Registered',
  ).length

  const completedCount = courses.filter(
    (course) => course.status === 'Completed',
  ).length

  const totalCredits = courses.reduce(
    (total, course) => total + course.credits,
    0,
  )

  const registeredCredits = courses
    .filter((course) => course.status === 'Registered')
    .reduce((total, course) => total + course.credits, 0)

  return (
    <section className="courses-page">
      <div className="courses-heading">
        <div>
          <span className="courses-eyebrow">ACADEMIC MANAGEMENT</span>
          <h1>My Courses</h1>
          <p>View your registered units and academic course information.</p>
        </div>

        <div className="courses-year-label">
          <CalendarDays size={16} />
          Academic Year 2025/2026
        </div>
      </div>

      <div className="courses-summary">
        <article className="courses-stat">
          <div className="courses-stat-icon blue">
            <BookOpen size={20} />
          </div>
          <span>Total Courses</span>
          <strong>{courses.length}</strong>
          <small>All academic records</small>
        </article>

        <article className="courses-stat">
          <div className="courses-stat-icon green">
            <CheckCircle2 size={20} />
          </div>
          <span>Completed</span>
          <strong>{completedCount}</strong>
          <small>Completed courses</small>
        </article>

        <article className="courses-stat">
          <div className="courses-stat-icon purple">
            <GraduationCap size={20} />
          </div>
          <span>Registered</span>
          <strong>{registeredCount}</strong>
          <small>Current registered courses</small>
        </article>

        <article className="courses-stat">
          <div className="courses-stat-icon orange">
            <Clock3 size={20} />
          </div>
          <span>Registered Credits</span>
          <strong>{registeredCredits}</strong>
          <small>{totalCredits} total recorded credit units</small>
        </article>
      </div>

      <div className="courses-panel">
        <div className="courses-panel-heading">
          <div>
            <h2>Course Catalogue</h2>
            <p>Courses associated with your academic programme.</p>
          </div>

          <span className="courses-count">
            {filteredCourses.length} courses
          </span>
        </div>

        <div className="courses-filters">
          <label className="courses-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search by course, code or lecturer..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <select
            aria-label="Filter courses by semester"
            value={semester}
            onChange={(event) => setSemester(event.target.value)}
          >
            <option value="All">All semesters</option>
            <option value="Semester 1">Semester 1</option>
            <option value="Semester 2">Semester 2</option>
          </select>

          <select
            aria-label="Filter courses by registration status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Registered">Registered</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="courses-list">
          {filteredCourses.map((course) => {
            const isExpanded = expandedCourse === course.id

            return (
              <article className="course-card" key={course.id}>
                <div className="course-card-main">
                  <div className="course-icon">
                    <BookOpen size={21} />
                  </div>

                  <div className="course-information">
                    <div className="course-title-row">
                      <span className="course-code">{course.code}</span>
                      <span
                        className={`course-status ${
                          course.status === 'Registered'
                            ? 'course-status-registered'
                            : 'course-status-completed'
                        }`}
                      >
                        {course.status === 'Registered' ? (
                          <Clock3 size={12} />
                        ) : (
                          <CheckCircle2 size={12} />
                        )}
                        {course.status}
                      </span>
                    </div>

                    <h3>{course.title}</h3>

                    <div className="course-meta">
                      <span>
                        <Users size={14} />
                        {course.lecturer}
                      </span>
                      <span>
                        <GraduationCap size={14} />
                        {course.credits} credit units
                      </span>
                      <span>
                        <CalendarDays size={14} />
                        {course.semester}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="course-details-button"
                    aria-expanded={isExpanded}
                    aria-controls={`course-details-${course.id}`}
                    onClick={() =>
                      setExpandedCourse(isExpanded ? null : course.id)
                    }
                  >
                    {isExpanded ? 'Hide details' : 'View details'}
                    <ChevronDown
                      size={16}
                      className={isExpanded ? 'course-chevron-open' : ''}
                    />
                  </button>
                </div>

                {isExpanded && (
                  <div
                    className="course-expanded"
                    id={`course-details-${course.id}`}
                  >
                    <div>
                      <span>Course description</span>
                      <p>{course.description}</p>
                    </div>

                    <div>
                      <span>Department</span>
                      <p>{course.department}</p>
                    </div>

                    <div>
                      <span>Academic year</span>
                      <p>{course.academicYear}</p>
                    </div>

                    <div>
                      <span>Class schedule (sample)</span>
                      <p>{course.schedule}</p>
                    </div>
                  </div>
                )}
              </article>
            )
          })}

          {filteredCourses.length === 0 && (
            <div className="courses-empty">
              <Search size={25} />
              <strong>No courses found</strong>
              <span>Try another search term or filter.</span>
            </div>
          )}
        </div>

        <div className="courses-footer">
          <span>Showing {filteredCourses.length} of {courses.length} courses</span>
          <span>Sample academic data · Prototype</span>
        </div>
      </div>

      <div className="courses-information-note">
        <BookOpen size={17} />
        <p>
          <strong>Registration information:</strong> This prototype displays
          sample course registrations. Actual course registration, add/drop
          requests and lecturer assignments require university backend
          integration.
        </p>
      </div>
    </section>
  )
}
