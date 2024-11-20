/* eslint-disable react/react-in-jsx-scope */
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './style.scss'
import { Calendar } from 'primereact/calendar'
import { InputText } from 'primereact/inputtext'
import { format } from 'date-fns'
import { fr, ru } from 'date-fns/locale'
import Tooltip from '@mui/material/Tooltip'
import Error from '../../components/erreur/index'
import Note from '../note'
import Theme from '../../theme'

import {
  Undo,
  X,
  ClipboardCheck,
  UserRoundX,
  Diff,
  CalendarPlus,
} from 'lucide-react'

function Eleve() {
  const { id } = useParams()
  const navigate = useNavigate() // Pour rediriger après suppression
  const [showModal, setShowModal] = useState(false) // État pour gérer l'ouverture de la modal
  const [newClasses, setNewClasses] = useState(0) // État pour gérer le nombre de cours ajoutés
  const [planModal, setPlanModal] = useState(false)
  const [datetime24h, setDateTime24h] = useState(new Date())
  const [value, setValue] = useState('')
  const [plannedCourses, setPlannedCourses] = useState([])
  const [student, setStudent] = useState([])
  const [affichage, setAffichage] = useState(false)
  const [codeEleve, setCodeEleve] = useState('')
  const [codeAuth, setCodeAuth] = useState('')

  // AFFICHER ELEVE

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('API URL :', import.meta.env.VITE_API_URL) // Devrait afficher l'URL
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/eleve/${id}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          },
        )

        if (!response.ok) {
          throw new Error(
            "Une erreur s'est produite lors de la récupération des données.",
          )
        }

        const data = await response.json()
        setStudent(data) // Stockage des données dans l'état
        // A modifier
        setCodeEleve(student.userId)
      } catch (error) {
        console.error('Une erreur est survenue', error)
      }
    }

    fetchData()
  }, [showModal, planModal, plannedCourses])

  // SUPPRIMER ELEVE

  const handleDelete = async (e) => {
    e.preventDefault()

    const confirm = window.confirm(
      'ATTENTION ! Vous êtes sur le point de supprimer un élève. Voulez vous vraiment supprimer cet élève ?',
    )

    if (confirm) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/eleve/${id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          },
        )

        if (!response.ok) {
          throw new Error(
            "Une erreur s'est produite lors de la suppression de l'étudiant.",
          )
        }

        alert('Étudiant supprimé avec succès !')
        navigate('/') // Redirection après suppression
      } catch (error) {
        console.error('Erreur lors de la suppression :', error)
        alert("Erreur lors de la suppression de l'étudiant.")
      }
    }
  }

  const handleAddCours = () => {
    setShowModal(!showModal)
    setPlanModal(false)
    setNewClasses(0)
  }

  // ACHETER DES COURS

  const handleSubmit = async (e) => {
    e.preventDefault()

    const updatedRemainingClasses = newClasses

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/eleve/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          body: JSON.stringify({ remainingClasses: updatedRemainingClasses }),
        },
      )

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du cours.")
      }

      // const data = await response.json()
      setShowModal(!showModal)
      newClasses(0)

      //handleCloseModal()
    } catch (error) {
      console.error('Erreur : ', error)
    }
  }

  const handleScheduleCours = () => {
    setPlanModal(!planModal)
    setShowModal(false)
  }

  // AJOUTER UN COURS

  const handleValidateCours = async (e) => {
    e.preventDefault()

    const courseData = {
      title: value,
      start: datetime24h,
      end: datetime24h,
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/eleve/${id}/courses`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          body: JSON.stringify(courseData),
        },
      )

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du cours.")
      }

      const data = await response.json()

      // Fermer la modal après succès
      setPlanModal(!planModal)
      setDateTime24h(new Date())
      fetchCourses()
    } catch (error) {
      console.error('Erreur : ', error)
    }
  }
  // AFFICHER LES COURS
  const fetchCourses = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/eleve/${id}/courses`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            Accept: 'application/json',
          },
        },
      )

      if (!response.ok) {
        throw new Error('Erreur lors de la recupération des cours.')
      }

      const data = await response.json()

      const sortedCourses = data.sort(
        (a, b) => new Date(a.start) - new Date(b.start),
      )

      // Mettre à jour l'état avec le tableau de dates formatées
      setPlannedCourses(sortedCourses)
    } catch (error) {
      console.error('Erreur : ', error)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  // SUPPRIMER COURS

  const handleDeleteCours = async (coursId) => {
    const confirm = window.confirm(
      "Voulez vous vraiment supprimer le cours ? Il est conseillé de supprimer un cours seulement si il a été marqué comme fait, sinon il est préferable d'annuler le cours",
    )

    if (confirm) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/eleve/${id}/courses/${coursId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          },
        )

        if (!response.ok) {
          const errorData = await response.json()
          console.error('Erreur lors de la suppression :', errorData.message)
          throw new Error(`Erreur: ${errorData.message}`)
        }

        setPlannedCourses((prevCourses) =>
          prevCourses.filter((cours) => cours._id !== coursId),
        )
      } catch (error) {
        console.error('Erreur lors de la suppression :', error)
      }
    }
  }

  // ANNULER COURS

  const handleCanceledCours = async (coursId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/eleve/${id}/courses/${coursId}/cancel`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erreur lors de la suppression :', errorData.message)
        throw new Error(`Erreur: ${errorData.message}`)
      }

      setPlannedCourses((prevCourses) =>
        prevCourses.filter((cours) => cours._id !== coursId),
      )
    } catch (error) {
      console.error('Erreur lors de la suppression :', error)
    }
  }

  // COURS FAIT

  const handleDoneCours = async (coursId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/eleve/${id}/courses/${coursId}`,
        {
          method: 'PUT', // Utilisez PATCH ou PUT selon vos besoins
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          body: JSON.stringify({ completed: true }), // Indiquez que le cours est complété
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erreur lors de la mise à jour :', errorData.message)
        throw new Error(`Erreur: ${errorData.message}`)
      }

      setPlannedCourses((prevCourses) =>
        prevCourses.map(
          (cours) =>
            cours._id === coursId ? { ...cours, completed: true } : cours, // Met à jour le cours dans l'état
        ),
      )
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error)
    }
  }

  // A modifier + l 55 et l 43 dans connexion

  useEffect(() => {
    const storedCodeAuth = localStorage.getItem('userId')
    setCodeAuth(storedCodeAuth)

    if (codeEleve == storedCodeAuth) {
      setAffichage(true)
    }
  }, [codeEleve, codeAuth]) // Ajout des dépendances

  const [isReady, setIsReady] = useState(false)
  useEffect(() => {
    // Déclencher un délai avant d'afficher le contenu
    const timer = setTimeout(() => setIsReady(true), 80)
    return () => clearTimeout(timer) // Nettoie le délai au démontage
  }, [])

  return (
    <div className="pageEleveContainer">
      {affichage ? (
        isReady ? (
          <>
            <div className="divHeaderEleve">
              <div className="eleveName">
                <h1>{student.firstName}</h1>
                <h2>{student.lastName}</h2>
              </div>
              <div className="navButton">
                <Tooltip title="Supprimer élève" placement="top">
                  <button onClick={handleDelete}>
                    <UserRoundX color="red" size={25} />
                  </button>
                </Tooltip>
                <Tooltip title="Ajouter des cours payés" placement="top">
                  <button onClick={handleAddCours}>
                    <Diff color="white" size={25} />
                  </button>
                </Tooltip>
                <Tooltip title="Planifier un cours" placement="top">
                  <button onClick={handleScheduleCours}>
                    <CalendarPlus color="white" size={25} />
                  </button>
                </Tooltip>

                <Theme />
              </div>
            </div>
            <div className="divClasseEtPlanning">
              <div className="divClassesInfo">
                <div className="eleveCoursDetail">
                  <p>Total des cours</p> <span>{student.totalClasses}</span>
                </div>
                <div
                  className={`eleveCoursDetail ${student.remainingClasses <= 0 ? 'empty' : ''}`}
                >
                  <p>Cours restants achetés</p>{' '}
                  <span>{student.remainingClasses}</span>
                </div>
                <div className="eleveCoursDetail">
                  <p>Cours planifiés</p> <span>{student.scheduledClasses}</span>
                </div>
                <div className="eleveCoursDetail">
                  <p>Cours faits</p> <span>{student.completedClasses}</span>
                </div>
              </div>
              {!showModal && !planModal && (
                <div className="coursPlanned">
                  <h2>Prochains cours</h2>

                  {plannedCourses.length === 0 ? (
                    <span>Il n'y a pas encore de cours planifiés</span>
                  ) : (
                    <div className="divNextCours">
                      {plannedCourses.map((cours) => (
                        <div
                          key={cours._id}
                          className={`divTitleAndDate ${cours.completed ? 'completed' : ''}`}
                        >
                          <p>{cours.title}</p>
                          <span>
                            {format(
                              new Date(cours.start),
                              'EEEE dd MMMM à HH:mm',
                              {
                                locale: fr,
                              },
                            )}
                          </span>
                          <div className="btnPlanning">
                            <Tooltip title="Supprimer le cours" placement="top">
                              <button
                                onClick={() => handleDeleteCours(cours._id)}
                              >
                                <X color="red" size={15} />
                              </button>
                            </Tooltip>
                            {!cours.completed && (
                              <Tooltip title="Annuler le cours" placement="top">
                                <button
                                  onClick={() => handleCanceledCours(cours._id)}
                                >
                                  <Undo color="black" size={15} />
                                </button>
                              </Tooltip>
                            )}
                            {!cours.completed && (
                              <Tooltip
                                title="Marquer le cours comme fait"
                                placement="top"
                              >
                                <button
                                  onClick={() => handleDoneCours(cours._id)}
                                >
                                  <ClipboardCheck color="black" size={15} />
                                </button>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {showModal && (
                <div className="modalAddCours">
                  <div className="modalContent">
                    <h2>Ajouter des cours payés</h2>
                    <form onSubmit={handleSubmit}>
                      <label htmlFor="newClasses">
                        Nombre de cours à ajouter :
                      </label>
                      <input
                        type="number"
                        id="newClasses"
                        value={newClasses}
                        onChange={(e) => setNewClasses(Number(e.target.value))}
                        required
                      />
                      <button type="submit">Ajouter</button>
                    </form>
                  </div>
                </div>
              )}
              {planModal && (
                <div className="modalPlanningCours">
                  <h2>Plannifier un cours</h2>
                  <form onSubmit={handleValidateCours}>
                    <label htmlFor="titleCours">Titre</label>
                    <InputText
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      maxLength="30"
                    />
                    <label htmlFor="dateHeure">Date et heure</label>
                    <div className="CalAndBut">
                      <Calendar
                        id="dateHeure"
                        value={datetime24h}
                        onChange={(e) => setDateTime24h(e.value)}
                        showTime
                        hourFormat="24"
                        dateFormat="dd/mm/yy"
                      />
                      <button type="submit">Valider</button>
                    </div>
                  </form>
                </div>
              )}
              <div className="CompoNote">
                <Note id={id} />
              </div>
            </div>
          </>
        ) : (
          <div className="loading-screen">Chargement...</div>
        )
      ) : (
        <p></p>
      )}
    </div>
  )
}

export default Eleve
