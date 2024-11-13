import { Route, Routes, BrowserRouter } from 'react-router-dom'
import './App.css'

import { Box, createTheme, ThemeProvider, Toolbar } from "@mui/material"
import { faHome, faCalendarDays } from '@fortawesome/free-solid-svg-icons'

import { useAutoLogin } from './hooks'

import { NavBar } from './Components/NavBar'
import { Account } from './Pages/Account'

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
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ff7043',
        },
      },
    },
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

const darkTheme = createTheme(lightTheme, {
  palette: {
    mode: 'dark',
    background: {
      default: '#001F3F', // pas sur
      paper: '#184c85',
    },
    text: {
      primary: '#ffffff',
      secondary: '#ffffff',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#001F3F',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#001F3F', // or #184c85
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
      <ThemeProvider theme={darkTheme}>
        <BrowserRouter>
            <NavBar items={navItems} />
            <Toolbar />
            <Routes>
              <Route path="/" element={<h1>Home</h1>} />
              <Route path="/competitions" element={<h1>Competitions</h1>} />
              <Route path="/account" element={<Account />} />
              <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Box>
  )
}

export default App
