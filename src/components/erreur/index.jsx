/* eslint-disable react/react-in-jsx-scope */

import { Rabbit, Bird } from 'lucide-react'
import './style.scss'

function Error() {
  return (
    <div className="divError">
      <h1>La page demandée est introuvable</h1>
      <Bird size={200} />
    </div>
  )
}

export default Error
