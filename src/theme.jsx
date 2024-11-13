import React, { useState } from 'react'
import { Zap, Sun } from 'lucide-react'
import './index.scss'
import Tooltip from '@mui/material/Tooltip'

const Theme = () => {
  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <div>
      <Tooltip title="Changer de thème" placement="top">
        <button onClick={toggleTheme} className="btnTheme">
          <Sun />
        </button>
      </Tooltip>
    </div>
  )
}

export default Theme
