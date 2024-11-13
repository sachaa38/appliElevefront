/* eslint-disable react/react-in-jsx-scope */
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import './style.scss'

function Deconnexion() {
  const navigate = useNavigate()

  const handleLogOut = () => {
    localStorage.removeItem('token')
    navigate('/connexion')
  }

  return (
    <Button
      className="buttonDeco"
      onClick={handleLogOut}
      label="Déconnexion"
      severity="danger"
      raised
    />
  )
}

export default Deconnexion
