import { version } from '../package.json';
import './i18n';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CacheBuster from 'react-cache-buster';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Outlet,
    Route,
    RouterProvider,
} from 'react-router-dom';

import {
    faCalendarDays,
    faHome,
    faTrophy,
} from '@fortawesome/free-solid-svg-icons';
import { Box, createTheme, ThemeProvider } from '@mui/material';
import './App.css';

import { useAutoLogin } from './hooks';

import { Loading, NavBar } from './Components';

import { NODE_ENV, Role } from '@competition-manager/schemas';
import { ErrorFallback } from './Components';
import { Footer } from './Components/Footer';
import { NewsPopup } from './Components/NewsPopup';
import { ProtectedRoute } from './Components/ProtectedRoute';
import { ConfirmDialogProvider, SnackbarProvider } from './contexts';
import { isNodeEnv } from './env';
import { Account } from './Pages/Account';
import { AdminCompetition } from './Pages/Admin/Competition';
import { AdminCompetitions } from './Pages/Admin/Competitions';
import { Competition } from './Pages/Competition';
import { Competitions } from './Pages/Competitions';
import { FAQ } from './Pages/FAQ';
import { Home } from './Pages/Home';
import { ResetPassword } from './Pages/ResetPassword';
import { SuperAdmin } from './Pages/SuperAdmin';

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
});

// Create a client
const queryClient = new QueryClient();

function App() {
    const { t } = useTranslation();
    useAutoLogin();

    const navItems = [
        { label: t('navigation:home'), href: '/', icon: faHome },
        {
            label: t('navigation:calendar'),
            href: '/competitions',
            icon: faCalendarDays,
        },
        {
            label: t('glossary:results'),
            href: '/competitions?isPast=true',
            icon: faTrophy,
        },
    ];

    const router = createBrowserRouter(
        createRoutesFromElements([
            <Route
                element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <NavBar items={navItems} />
                        <Box
                            display="flex"
                            flexDirection="column"
                            flex={1}
                            sx={{ overflowY: 'auto' }}
                        >
                            <Box flex={1}>
                                <ErrorBoundary
                                    FallbackComponent={ErrorFallback}
                                >
                                    <Outlet />
                                </ErrorBoundary>
                            </Box>
                            <Footer />
                            <NewsPopup />
                        </Box>
                    </ErrorBoundary>
                }
            >
                <Route path="/" element={<h1>{<Home />}</h1>} />
                <Route path="/competitions" element={<Competitions />} />
                <Route
                    path="/competitions/:competitionEid/*"
                    element={<Competition />}
                />
                <Route path="/faq" element={<FAQ />} />
                <Route
                    path="/account"
                    element={
                        <ProtectedRoute
                            requiredRole={Role.UNCONFIRMED_USER}
                            redirectPath="/"
                        >
                            <Account />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/competitions"
                    element={
                        <ProtectedRoute
                            requiredRole={Role.ADMIN}
                            redirectPath="/"
                        >
                            <AdminCompetitions />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/competitions/:competitionEid/*"
                    element={
                        <ProtectedRoute
                            requiredRole={Role.ADMIN}
                            redirectPath="/"
                        >
                            <AdminCompetition />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/superadmin/*"
                    element={
                        <ProtectedRoute
                            requiredRole={Role.SUPERADMIN}
                            redirectPath="/"
                        >
                            <SuperAdmin />
                        </ProtectedRoute>
                    }
                />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<h1>Not Found</h1>} />
            </Route>,
        ])
    );

    return (
        <CacheBuster
            currentVersion={version}
            isEnabled={!isNodeEnv(NODE_ENV.LOCAL)} //If false, the library is disabled.
            loadingComponent={<Loading />} //If not pass, nothing appears at the time of new version check.
        >
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider theme={lightTheme}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <SnackbarProvider>
                                <ConfirmDialogProvider>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        height="100vh"
                                    >
                                        <RouterProvider router={router} />
                                    </Box>
                                </ConfirmDialogProvider>
                            </SnackbarProvider>
                        </LocalizationProvider>
                    </ThemeProvider>
                </QueryClientProvider>
            </ErrorBoundary>
        </CacheBuster>
    );
}

export default App;
