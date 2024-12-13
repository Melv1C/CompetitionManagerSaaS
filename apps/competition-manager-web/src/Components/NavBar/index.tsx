import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AppBar, Box, Button, IconButton, Toolbar, useMediaQuery } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, IconDefinition, faRightToBracket, faUserGear } from "@fortawesome/free-solid-svg-icons";

import { useUserToken } from "../../GlobalsStates/userToken";

import { MobileNav } from "./MobileNav";
import { AccountCircle } from "../AccountCircle";
import { Logo } from "../Logo";
import { AuthPopup } from "../AuthPopup";
import { useRoles } from "../../hooks";

type NavItemProps = {
    label: string;
    href: string;
    icon?: IconDefinition;
};

export type NavBarProps = {
    items: NavItemProps[];
};

export const NavBar: React.FC<NavBarProps> = ({ items }) => {
  
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:900px)');
    const [isAuthPopupVisible, setIsAuthPopupVisible] = useState(false);

    const [userToken] = useUserToken();
    const { isAdmin, isLogged, isNotLogged } = useRoles();

    useEffect(() => {
        setIsAuthPopupVisible(false);
    }, [userToken]);

    const handleDrawerToggle = () => {
        setIsMobileOpen((prev) => !prev);
    }

    return (
        <Box 
            sx={{ 
                display: 'flex',
            }}
        >
            <AppBar component="nav">
                <Toolbar 
                    sx={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        alignItems: 'center' 
                    }}
                >
                    {isMobile && (
                        <Box sx={{ marginRight: '1rem' }}>
                            <Button 
                                color="inherit" 
                                onClick={handleDrawerToggle} 
                                sx={{ minWidth: 0, padding: 0 }}
                            >
                                <FontAwesomeIcon icon={faBars} size="2x" />
                            </Button>
                            <MobileNav items={items} isMobileOpen={isMobileOpen} handleDrawerToggle={handleDrawerToggle} />
                        </Box>
                    )}
                    <Link to="/">
                        <Logo />
                    </Link>
                    <Box sx={{ display: 'flex', gap: '1rem', flexGrow: 1, marginLeft: '1rem' }}>
                        {!isMobile && (
                            <>
                                {items.map((item) => (
                                    <Link key={item.label} to={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <Button 
                                            color="inherit" 
                                            startIcon={item.icon && <FontAwesomeIcon icon={item.icon} />} 
                                            sx={{ textTransform: 'none', fontSize: '1.2rem' }}
                                        >
                                            {item.label}
                                        </Button>
                                    </Link>
                                ))}
                            </>
                        )}  
                    </Box>

                    {/* add link to admin dashboard */}
                    {isAdmin && (
                        <Box>
                            <Link to="/admin/competitions">
                                <IconButton 
                                    sx={{
                                        width: '2.5rem',
                                        height: '2.5rem',
                                        color: 'white',
                                    }}
                                >
                                    <FontAwesomeIcon icon={faUserGear} style={{ fontSize: '1.25rem' }} />
                                </IconButton>
                            </Link>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {isNotLogged && (
                            <>
                                <Button 
                                    startIcon={<FontAwesomeIcon icon={faRightToBracket} />}
                                    color="inherit"
                                    sx={{ 
                                        textTransform: 'none', 
                                        fontSize: isMobile ? '1rem' : '1.2rem',
                                        border: '2px solid white',
                                        padding: '0.2rem 1rem',
                                    }} 
                                    onClick={() => setIsAuthPopupVisible(true)}
                                >
                                    Sign In
                                </Button>
                                <AuthPopup isVisible={isAuthPopupVisible} onClose={() => setIsAuthPopupVisible(false)} />
                            </>
                        )}

                        {isLogged && (
                            <Link to="/account">
                                <IconButton>
                                    <AccountCircle />
                                </IconButton>
                            </Link>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

