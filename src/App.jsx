/* eslint-disable react/react-in-jsx-scope */

import './App.css'
import PageEleve from './page/PageEleve'
import Home from './page/accueil'
import Connexion from './page/connexion'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Inscription from './page/inscription'
import Erreur from './page/erreur/index'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/" element={<Home />} />
        <Route path="/eleve/:id" element={<PageEleve />} />
        <Route path="/*" element={<Erreur />} />
      </Routes>
    </Router>
  )
}

export default App
