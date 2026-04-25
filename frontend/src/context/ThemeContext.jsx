import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    console.log('Initializing theme, saved theme:', savedTheme)
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  useEffect(() => {
    const root = document.documentElement
    console.log('Theme effect running, darkMode:', darkMode)
    if (darkMode) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      console.log('Added dark class to root')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      console.log('Removed dark class from root')
    }
  }, [darkMode])

  const toggleTheme = () => {
    console.log('Toggle theme called, current darkMode:', darkMode)
    setDarkMode(!darkMode)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
