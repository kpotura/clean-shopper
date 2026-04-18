import { createContext, useContext, useState, useEffect } from 'react'

const THEMES = {
  crimson: 'crimson',
  bhds2:   'BHDS-2',
}

const THEME_KEY = 'clean_shopper_theme'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || THEMES.crimson
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((t) => (t === THEMES.crimson ? THEMES.bhds2 : THEMES.crimson))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
