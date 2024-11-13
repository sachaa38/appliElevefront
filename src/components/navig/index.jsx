/* eslint-disable react/react-in-jsx-scope */
import './style.scss'
import Deconnexion from '../../components/deconnexion'
import { Smile } from 'lucide-react'
import { useState, useEffect } from 'react'
import Theme from '../../theme'
function Navig() {
  const [student, setStudent] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/eleve`, {
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
        setStudent(data)
      } catch (error) {
        console.error('Une erreur est survenue', error)
      }
    }

    fetchData()
  }, [])

  const getStudentTotalCourses = (students) => {
    // Rassembler tous les cours planifiés avec les informations des élèves
    const allTotalCourses = students.flatMap((student) => ({
      totalCours: student.totalClasses,
      planifCours: student.scheduledClasses,
      faitCours: student.completedClasses,
    }))

    // Trier tous les cours par date de début
    return allTotalCourses
  }
  const dataCourse = getStudentTotalCourses(student)
  const sumTotalCours = dataCourse.reduce(
    (acc, curr) => acc + curr.totalCours,
    0,
  )

  const sumPlanifCours = dataCourse.reduce(
    (acc, curr) => acc + curr.planifCours,
    0,
  )

  const sumFaitCours = dataCourse.reduce((acc, curr) => acc + curr.faitCours, 0)

  return (
    <nav className="nav">
      <h2>
        Bienvenue <Smile size={60} />
      </h2>
      <div className="navSpanStats">
        <span id="CoursSpanNav">
          Total des cours <span id="sumCoursNav">{sumTotalCours}</span>
        </span>
        <span id="CoursSpanNav">
          Cours réalisés<span id="sumCoursNav">{sumFaitCours}</span>
        </span>
        <span id="CoursSpanNav">
          Cours planifiés<span id="sumCoursNav">{sumPlanifCours}</span>
        </span>
        <Theme />
      </div>
      <Deconnexion />
    </nav>
  )
}

export default Navig
