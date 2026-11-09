
import { useMemo, useState, type FormEvent } from 'react'
import {
  AtSign,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  LockKeyhole,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react'

type StudentProfile = {
  fullName: string
  registrationNumber: string
  email: string
  phone: string
  programme: string
  department: string
  campus: string
  yearOfStudy: string
  admissionYear: string
}

const initialProfile: StudentProfile = {
  fullName: 'Sample Student',
  registrationNumber: 'DEMO/2023/001',
  email: 'student@example.com',
  phone: '+254 700 000 000',
  programme: 'Bachelor of Science in Information Technology',
  department: 'Information Technology',
  campus: 'Main Campus',
  yearOfStudy: 'Third Year',
  admissionYear: '2023',
}

export default function MyProfile() {
  const [profile, setProfile] = useState(initialProfile)
  const [draft, setDraft] = useState(initialProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const completion = useMemo(() => {
    const fields: (keyof StudentProfile)[] = [
      'fullName',
      'registrationNumber',
      'email',
      'phone',
      'programme',
      'department',
      'campus',
      'yearOfStudy',
      'admissionYear',
    ]

    const completed = fields.filter((field) =>
      profile[field].trim(),
    ).length

    return Math.round((completed / fields.length) * 100)
  }, [profile])

  function startEditing() {
    setDraft(profile)
    setIsEditing(true)
    setSaved(false)
    setError('')
  }

  function cancelEditing() {
    setDraft(profile)
    setIsEditing(false)
    setError('')
  }

  function updateField(field: keyof StudentProfile, value: string) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }))
    setSaved(false)
    setError('')
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!draft.fullName.trim() || !draft.email.trim() || !draft.phone.trim()) {
      setError('Name, email address and phone number are required.')
      return
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)

    if (!emailIsValid) {
      setError('Enter a valid email address.')
      return
    }

    const phoneDigits = draft.phone.replace(/\D/g, '')

    if (phoneDigits.length < 9 || phoneDigits.length > 15) {
      setError('Enter a valid phone number.')
      return
    }

    setProfile(draft)
    setIsEditing(false)
    setSaved(true)
    setError('')
  }

  return (
    <section className="profile-page">
      <div className="profile-page-heading">
        <div>
          <span className="profile-eyebrow">ACCOUNT MANAGEMENT</span>
          <h1>My Profile</h1>
          <p>Manage your personal information and account preferences.</p>
        </div>

        {!isEditing && (
          <button
            type="button"
            className="profile-edit-button"
            onClick={startEditing}
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        )}
      </div>

      {saved && (
        <div className="profile-feedback profile-feedback-success" role="status">
          <CheckCircle2 size={17} />
          Your profile changes have been saved in this prototype.
        </div>
      )}

      <div className="profile-layout">
        <div className="profile-main-column">
          <section className="profile-card">
            <div className="profile-card-heading">
              <div>
                <h2>Personal Information</h2>
                <p>Update the contact details associated with your account.</p>
              </div>

              <div className="profile-section-icon">
                <UserRound size={20} />
              </div>
            </div>

            <form onSubmit={saveProfile}>
              <div className="profile-identity">
                <div className="profile-avatar">
                  <UserRound size={34} />
                </div>

                <div>
                  <h3>{profile.fullName}</h3>
                  <span>{profile.registrationNumber}</span>
                  <div className="profile-student-badge">
                    <BadgeCheck size={13} />
                    Sample student account
                  </div>
                </div>
              </div>

              <div className="profile-fields">
                <label className="profile-field">
                  <span>Full name</span>
                  <div className="profile-input-wrapper">
                    <UserRound size={16} />
                    <input
                      type="text"
                      value={draft.fullName}
                      disabled={!isEditing}
                      onChange={(event) =>
                        updateField('fullName', event.target.value)
                      }
                      required
                      maxLength={100}
                    />
                  </div>
                </label>

                <label className="profile-field">
                  <span>Registration number</span>
                  <div className="profile-input-wrapper profile-readonly">
                    <BadgeCheck size={16} />
                    <input
                      type="text"
                      value={draft.registrationNumber}
                      disabled
                      readOnly
                    />
                  </div>
                  <small>Registration number cannot be changed here.</small>
                </label>

                <label className="profile-field">
                  <span>Email address</span>
                  <div className="profile-input-wrapper">
                    <Mail size={16} />
                    <input
                      type="email"
                      value={draft.email}
                      disabled={!isEditing}
                      onChange={(event) =>
                        updateField('email', event.target.value)
                      }
                      required
                      maxLength={254}
                    />
                  </div>
                </label>

                <label className="profile-field">
                  <span>Phone number</span>
                  <div className="profile-input-wrapper">
                    <Phone size={16} />
                    <input
                      type="tel"
                      value={draft.phone}
                      disabled={!isEditing}
                      onChange={(event) =>
                        updateField('phone', event.target.value)
                      }
                      required
                      maxLength={20}
                    />
                  </div>
                </label>
              </div>

              {error && (
                <div className="profile-feedback profile-feedback-error" role="alert">
                  <X size={16} />
                  {error}
                </div>
              )}

              {isEditing && (
                <div className="profile-form-actions">
                  <button
                    type="button"
                    className="profile-cancel-button"
                    onClick={cancelEditing}
                  >
                    <X size={16} />
                    Cancel
                  </button>

                  <button type="submit" className="profile-save-button">
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </section>

          <section className="profile-card">
            <div className="profile-card-heading">
              <div>
                <h2>Academic Information</h2>
                <p>Your programme and university enrolment details.</p>
              </div>

              <div className="profile-section-icon">
                <GraduationCap size={20} />
              </div>
            </div>

            <div className="profile-academic-grid">
              <div>
                <span>Programme</span>
                <strong>{profile.programme}</strong>
              </div>
              <div>
                <span>Department</span>
                <strong>{profile.department}</strong>
              </div>
              <div>
                <span>Campus</span>
                <strong>{profile.campus}</strong>
              </div>
              <div>
                <span>Year of study</span>
                <strong>{profile.yearOfStudy}</strong>
              </div>
              <div>
                <span>Admission year</span>
                <strong>{profile.admissionYear}</strong>
              </div>
            </div>

            <div className="profile-academic-notice">
              <BookOpen size={16} />
              Academic details are read-only in this student prototype.
            </div>
          </section>
        </div>

        <aside className="profile-side-column">
          <section className="profile-card profile-completion-card">
            <div className="profile-card-heading">
              <div>
                <h2>Profile Completion</h2>
                <p>Completeness of your account information.</p>
              </div>
            </div>

            <div className="profile-progress-circle">
              <svg viewBox="0 0 120 120" role="img" aria-label={`Profile ${completion}% complete`}>
                <circle
                  cx="60"
                  cy="60"
                  r="49"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="9"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="49"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={`${completion * 3.078} 307.8`}
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div>
                <strong>{completion}%</strong>
                <span>Complete</span>
              </div>
            </div>

            <div className="profile-completion-note">
              <CheckCircle2 size={16} />
              {completion === 100
                ? 'All profile fields are filled.'
                : 'Complete your profile information.'}
            </div>
          </section>

          <section className="profile-card">
            <div className="profile-card-heading">
              <div>
                <h2>Account Security</h2>
                <p>Security information for this demo account.</p>
              </div>

              <div className="profile-section-icon">
                <ShieldCheck size={20} />
              </div>
            </div>

            <div className="profile-security-item">
              <div className="profile-security-icon">
                <LockKeyhole size={17} />
              </div>
              <div>
                <strong>Password</strong>
                <span>Managed by the authentication service</span>
              </div>
              <BadgeCheck size={16} className="profile-security-check" />
            </div>

            <div className="profile-security-item">
              <div className="profile-security-icon">
                <AtSign size={17} />
              </div>
              <div>
                <strong>Email address</strong>
                <span>{profile.email}</span>
              </div>
            </div>

            <div className="profile-two-factor">
              <div>
                <strong>Two-factor authentication</strong>
                <span>Demonstration setting only</span>
              </div>

              <button
                type="button"
                className={`profile-toggle ${twoFactorEnabled ? 'is-enabled' : ''}`}
                role="switch"
                aria-checked={twoFactorEnabled}
                onClick={() => setTwoFactorEnabled((enabled) => !enabled)}
              >
                <span />
              </button>
            </div>

            <p className="profile-security-disclaimer">
              Password changes and real two-factor authentication must be
              implemented by a secure backend authentication service.
            </p>
          </section>

          <section className="profile-card profile-campus-card">
            <MapPin size={19} />
            <div>
              <strong>Student Portal</strong>
              <span>University academic services</span>
              <small>Sample student environment</small>
            </div>
          </section>
        </aside>
      </div>

      <p className="profile-disclaimer">
        Prototype notice: Profile edits and security preferences are stored
        only in this page's temporary application state.
      </p>
    </section>
  )
}
