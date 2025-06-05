import { faHome } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { NavBar } from './Components/NavBar';
import { Home } from './pages/Home';
import { Truc } from './pages/Truc';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CompetitionDashBoard } from './pages/CompetitionDashBoard';

const queryClient = new QueryClient();

function App() {
    const navItems = [{ label: 'Home', href: '/', icon: faHome }];

    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <NavBar items={navItems} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/truc" element={<Truc />} />
                    <Route path="/competition/:competitionEid" element={<CompetitionDashBoard />} />
                </Routes>
            </QueryClientProvider>
        </BrowserRouter>
    );
}

export default App;
