import { Route, Routes, BrowserRouter } from 'react-router-dom'
import './App.css'

import { Box, createTheme, ThemeProvider, Toolbar } from "@mui/material"
import { faHome, faCalendarDays } from '@fortawesome/free-solid-svg-icons'

import { useAutoLogin } from './hooks'

import { NavBar } from './Components'
import { Account } from './Pages/Account'
import { AdminCompetitions } from './Pages/Admin/Competitions'
import { AdminCompetition } from './Pages/Admin/Competition'
import Competitions from './Pages/Competitions'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'

// must be extract in an other file
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ff7043',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#184c85',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#001F3F',
      secondary: '#546E7A',
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ff7043', // or #FF8C68
          color: '#ffffff',
        },
      },
    },
  },
})

function App() {

  const navItems = [
    { label: 'Home', href: '/', icon: faHome },
    { label: 'Competitions', href: '/competitions', icon: faCalendarDays },
  ]

  useAutoLogin()

  return (
    <Box>
      <ThemeProvider theme={lightTheme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <BrowserRouter>
              <NavBar items={navItems} />
              <Toolbar />
              <Routes>
                <Route path="/" element={<h1>Home</h1>} />
                <Route path="/competitions" element={<Competitions />} />
                <Route path="/account" element={<Account />} />
                <Route path="/admin/competitions" element={<AdminCompetitions />} />
                <Route path="/admin/competitions/:id" element={<AdminCompetition />} />
                <Route path="*" element={<h1>Not Found</h1>} />
              </Routes>
          </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </Box>
  )
}

export default App
