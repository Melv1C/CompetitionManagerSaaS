import './i18n'

import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Outlet } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { useTranslation } from 'react-i18next';

import './App.css'
import { Box, createTheme, ThemeProvider } from "@mui/material"
import { faHome, faCalendarDays, faRankingStar } from '@fortawesome/free-solid-svg-icons'

import { useAutoLogin } from './hooks'

import { NavBar } from './Components'

import { Account } from './Pages/Account'
import { AdminCompetitions } from './Pages/Admin/Competitions'
import { AdminCompetition } from './Pages/Admin/Competition'
import { Competitions } from './Pages/Competitions'
import { Competition } from './Pages/Competition'
import { SuperAdmin } from './Pages/SuperAdmin'
import { ErrorFallback } from './Components';
import { Results } from './Pages/Results';
import { ProtectedRoute } from './Components/ProtectedRoute';
import { Role } from '@competition-manager/schemas';
import { Home } from './Pages/Home';


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

    const { t } = useTranslation()

    const navItems = [
        { label: t('navigation:home'), href: '/', icon: faHome },
        { label: t('glossary:competitions'), href: '/competitions', icon: faCalendarDays },
        { label: t('glossary:results'), href: '/results', icon: faRankingStar },
    ]
    
    const router = createBrowserRouter(
        createRoutesFromElements([
            <Route element={
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <NavBar items={navItems} />
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <Outlet />
                    </ErrorBoundary>
                </ErrorBoundary>
            }>
                <Route path="/" element={<h1>{<Home />}</h1>} />
                <Route path="/competitions" element={<Competitions />} />
                <Route path="/competitions/:eid/*" element={<Competition />} />
                <Route path="/results" element={<Results />} />
                <Route path="/account" element={
                    <ProtectedRoute requiredRole={Role.UNCONFIRMED_USER} redirectPath="/">
                        <Account />
                    </ProtectedRoute>}
                />
                <Route path="/admin/competitions" element={
                    <ProtectedRoute requiredRole={Role.ADMIN} redirectPath="/">
                        <AdminCompetitions />
                    </ProtectedRoute>}
                />
                <Route path="/admin/competitions/:eid/*" element={
                    <ProtectedRoute requiredRole={Role.ADMIN} redirectPath="/">
                        <AdminCompetition />
                    </ProtectedRoute>}
                />
                <Route path="/superadmin/*" element={
                    <ProtectedRoute requiredRole={Role.SUPERADMIN} redirectPath="/">
                        <SuperAdmin />
                    </ProtectedRoute>}
                />
                <Route path="*" element={<h1>Not Found</h1>} />
            </Route>
        ])
    )

    useAutoLogin()

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={lightTheme}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                            <RouterProvider router={router} />
                        </Box>
                    </LocalizationProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    )
}

export default App
