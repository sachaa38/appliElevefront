/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/jsx-key */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { fr, ru } from 'date-fns/locale'
import './style.scss'

function Planning() {
  const [students, setStudents] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/eleve`, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(
            "Une erreur s'est produite lors de la récupération des données.",
          )
        }

        const data = await response.json()
        setStudents(data)
      } catch (error) {
        console.error('Une erreur est survenue', error)
      }
    }

    fetchData()
  }, [])

  const getStudentCoursesByDate = (students) => {
    // Rassembler tous les cours planifiés avec les informations des élèves
    const allCourses = students.flatMap((student) =>
      (student.plannedCourses || []).map((course) => ({
        firstName: student.firstName,
        lastName: student.lastName,
        start: course.start,
        id: student._id,
        completed: course.completed,
      })),
    )

    // Trier tous les cours par date de début
    return allCourses.sort((a, b) => new Date(a.start) - new Date(b.start))
  }

  const sortedStudentCourses = getStudentCoursesByDate(students)

  return (
    <div className="divPlanning">
      <h1>Planning</h1>
      <div className="divPlannedDate">
        {sortedStudentCourses.map((student, index) => (
          <div key={index}>
            {!student.completed && (
              <Link to={`/eleve/${student.id}`}>
                <span className="spanNomPrenomPlanning">
                  {student.firstName} {student.lastName}
                </span>
                {` Le ${format(new Date(student.start), 'EEEE dd MMMM à HH:mm', { locale: fr })}`}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Planning
