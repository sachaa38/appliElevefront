/* eslint-disable react/react-in-jsx-scope */
import Error from '../../components/erreur'
import { Link } from 'react-router-dom'
import './style.scss'

function Erreur() {
  return (
    <div className="divErrorPage">
      <Error />
      <Link to="/" className="linkError">
        Retourner à la page d'accueil
      </Link>
    </div>
  )
}

export default Erreur
