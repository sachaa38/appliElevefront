/* eslint-disable react/react-in-jsx-scope */
import './style.scss'

import BoutonAjoutEleve from '../BoutonAjoutEleve'

function TableauDeBord() {
  return (
    <div className="tableau-de-bord">
      <h1>Liste des élèves</h1>
      <div className="TDBContainer">
        <BoutonAjoutEleve />
      </div>
    </div>
  )
}

export default TableauDeBord
