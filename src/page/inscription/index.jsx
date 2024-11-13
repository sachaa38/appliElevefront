import React, { useState } from 'react'
import './style.scss'
import { InputText } from 'primereact/inputtext'
import { useNavigate } from 'react-router-dom'

function Inscription() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    const dataUser = {
      email: email,
      password: password,
    }
    // Tu pourrais envoyer ces informations à une API ici

    fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataUser),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de la soumission du formulaire')
        }
        return response.json() // Convertit la réponse en JSON
      })
      .then((data) => {
        alert("Ouf ! Votre inscription s'est bien passée")
        navigate('/connexion')
      })
      .catch((error) => {
        console.error('Erreur:', error)
        alert("Oups ! L'inscription n'a pas pu se faire.")
      })
  }

  return (
    <div>
      <h2>Inscription</h2>
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
          />
        </div>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  )
}

export default Inscription
