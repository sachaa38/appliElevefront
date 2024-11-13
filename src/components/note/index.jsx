/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from 'react'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputText } from 'primereact/inputtext'
import './style.scss'
import { FilePlus2, X } from 'lucide-react'
import Tooltip from '@mui/material/Tooltip'
import { format } from 'date-fns'
import { fr, ru } from 'date-fns/locale'

function Note({ id }) {
  const [modalNote, setModalNote] = useState(false)
  const [writtenNote, setWrittenNote] = useState([])
  const [value, setValue] = useState('')
  const [valueText, setValueText] = useState('')
  const [datetime24h, setDateTime24h] = useState('')

  const handleNote = () => {
    setModalNote(!modalNote)
  }

  const handleValidateNote = async (e) => {
    e.preventDefault()

    const noteData = {
      title: value,
      date: Date.now(),
      text: valueText,
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/eleve/${id}/note`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          body: JSON.stringify(noteData),
        },
      )

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du cours.")
      }

      const data = await response.json()

      // Fermer la modal après succès
      setValue('')
      setValueText('')
      setModalNote(!modalNote)

      fetchNote()
    } catch (error) {
      console.error('Erreur : ', error)
    }
  }
  // AFFICHER LES COURS
  const fetchNote = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/eleve/${id}/note`,
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

      const sortedNote = data.sort(
        (a, b) => new Date(a.start) - new Date(b.start),
      )

      // Mettre à jour l'état avec le tableau de dates formatées
      setWrittenNote(sortedNote)
    } catch (error) {
      console.error('Erreur : ', error)
    }
  }

  useEffect(() => {
    fetchNote()
  }, [])

  // SUPPRIMER COURS

  const handleDeleteNote = async (noteId) => {
    const confirm = window.confirm(
      'Voulez vous vraiment supprimer cette note ?',
    )

    if (confirm) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/eleve/${id}/note/${noteId}`,
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

        setWrittenNote((prevNote) =>
          prevNote.filter((note) => note._id !== noteId),
        )
      } catch (error) {
        console.error('Erreur lors de la suppression :', error)
      }
    }
  }
  return (
    <div className="divNote">
      <div className="headerNote">
        <h2>Notes</h2>
        <Tooltip title="Ajouter une note" placement="top">
          <button className="btnNote" onClick={handleNote}>
            <FilePlus2 />
          </button>
        </Tooltip>
      </div>
      {modalNote && (
        <form onSubmit={handleValidateNote}>
          <label htmlFor="titleNote">Titre</label>
          <InputText
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxlength="30"
          />
          <div className="textAreaAndButton">
            <label htmlFor="textNote">Texte</label>
            <InputTextarea
              value={valueText}
              onChange={(e) => setValueText(e.target.value)}
              rows={5}
              cols={30}
            />
            <button type="submit">Valider</button>
          </div>
        </form>
      )}
      <div className="contentNote">
        {writtenNote.map((note) => (
          <div key={note._id} className="cardNote">
            <h3>{note.title}</h3>
            <Tooltip title="Supprimer la note" placement="top">
              <button onClick={() => handleDeleteNote(note._id)}>
                <X color="red" size={15} />
              </button>
            </Tooltip>
            <span>
              {`Écrit ${format(new Date(note.date), 'EEEE dd MMMM à HH:mm', {
                locale: fr,
              })}`}
            </span>
            <p>{note.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Note
