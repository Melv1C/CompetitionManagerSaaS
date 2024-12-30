import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Outlet } from 'react-router-dom'
import './App.css'

import { Box, createTheme, ThemeProvider } from "@mui/material"
import { faHome, faCalendarDays } from '@fortawesome/free-solid-svg-icons'

import { useAutoLogin } from './hooks'

import { NavBar } from './Components'
import { Account } from './Pages/Account'
import { AdminCompetitions } from './Pages/Admin/Competitions'
import { AdminCompetition } from './Pages/Admin/Competition'
import Competitions from './Pages/Competitions'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { QueryClient, QueryClientProvider } from 'react-query'
import { SuperAdmin } from './Pages/SuperAdmin'

// must be extract in an other file
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#184c85',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff7043',
      contrastText: '#ffffff',
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#184c85',
          color: '#ffffff',
        },
      },
    },

  },
})

// Create a client
const queryClient = new QueryClient()

function App() {

  const navItems = [
    { label: 'Home', href: '/', icon: faHome },
    { label: 'Competitions', href: '/competitions', icon: faCalendarDays },
  ]

  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route element={<><NavBar items={navItems} /><Outlet /></>} >
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/competitions" element={<Competitions />} />
        <Route path="/account" element={<Account />} />
        <Route path="/admin/competitions" element={<AdminCompetitions />} />
        <Route path="/admin/competitions/:eid/*" element={<AdminCompetition />} />
        <Route path="/superadmin/*" element={<SuperAdmin />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Route>
    ])
  )

  useAutoLogin()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <RouterProvider router={router} />
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
