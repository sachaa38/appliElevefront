import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputText } from 'primereact/inputtext'
import './style.scss'
import { ArrowRightCircle } from 'lucide-react'

function Connexion() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleClick = () => {
    navigate('/inscription')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const dataUser = {
      email: email,
      password: password,
    }

    // Tu pourrais envoyer ces informations à une API ici

    fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataUser),
    })
      .then((response) => {
        if (!response.ok) {
          alert('Mot de passe ou indentifiant incorrect')
          throw new Error('Erreur lors de la soumission du formulaire')
        }
        return response.json() // Convertit la réponse en JSON
      })
      .then((data) => {
        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', data.userId) // Stocke l'_id
        navigate('/')
        // Traite la réponse du serveur (par exemple, rediriger l'utilisateur)
      })
      .catch((error) => {
        console.error('Erreur:', error)
      })
  }

  return (
    <div>
      <div>
        <div className="landingPage">
          <header className="header">
            <h1>ClassTrack</h1>
            <p>
              Gérez vos cours, suivez les progrès des élèves et simplifiez votre
              expérience d'enseignement.
            </p>
            <button className="ctaButton" onClick={handleClick}>
              Commencer <ArrowRightCircle size={20} />
            </button>
          </header>

          <section className="features">
            <div className="feature">
              <h3>Organisez les leçons</h3>
              <p>
                Planifiez et programmez facilement des leçons pour chaque élève.
              </p>
            </div>
            <div className="feature">
              <h3>Suivez les progrès</h3>
              <p>
                Surveillez les progrès de chaque élève grâce à des notes
                détaillées.
              </p>
            </div>
            <div className="feature">
              <h3>Notes personnalisées</h3>
              <p>
                Gardez des notes individuelles pour chaque élève afin d'adapter
                vos leçons.
              </p>
            </div>
          </section>
          <h2>Connexion</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email :</label>
              <InputText
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Mot de passe :</label>
              <InputText
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autocomplete="current-password"
              />
            </div>
            <button type="submit">Se connecter</button>
          </form>

          <footer className="footer">
            <p>© 2024 ClassTrack. Tous droits réservés.</p>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default Connexion
