/* eslint-disable react/react-in-jsx-scope */
import { useNavigate } from 'react-router-dom'
import Eleve from '../../components/eleve'
import './style.scss'
import Navig from '../../components/navig'
import React, { useState, useEffect } from 'react'

function PageEleve() {
  const navig = useNavigate()

  const handleBack = () => {
    navig('/')
  }

  return (
    <div>
      <div className="divEleveCalendrier">
        <button className="monBouton" onClick={handleBack}>
          Retour
        </button>
        <Eleve />
      </div>
    </div>
  )
}

export default PageEleve
