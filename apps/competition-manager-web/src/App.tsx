import { Route, Routes, BrowserRouter } from 'react-router-dom'
import './App.css'

import { Box, createTheme, ThemeProvider, Toolbar } from "@mui/material"
import { faHome, faCalendarDays } from '@fortawesome/free-solid-svg-icons'

import { NavBar } from './Components/NavBar'

// must be extract in an other file
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF4141',
    },
    secondary: {
      main: '#005ADF',
    },
  },
})

function App() {

  const navItems = [
    { label: 'Home', href: '/', icon: faHome },
    { label: 'Competitions', href: '/competitions', icon: faCalendarDays },
  ]
  
  return (
    <Box>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
            <NavBar items={navItems} />
            <Toolbar />
            <Routes>
              <Route path="/" element={<h1>Home</h1>} />
              <Route path="/competitions" element={<h1>Competitions</h1>} />
              <Route path="/account" element={<h1>Account</h1>} />
              <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Box>
  )
}

export default App
