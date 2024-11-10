import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AppBar, Box, Button, IconButton, Toolbar, useMediaQuery } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, IconDefinition, faRightToBracket } from "@fortawesome/free-solid-svg-icons";

import { useUserToken } from "../../GlobalsStates/userToken";

import { MobileNav } from "./MobileNav";
import { AccountCircle } from "../AccountCircle";
import { Logo } from "../Logo";
import { AuthPopup } from "../AuthPopup";

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

    useEffect(() => {
        setIsAuthPopupVisible(false);
    }, [userToken]);

    const handleDrawerToggle = () => {
        setIsMobileOpen((prev) => !prev);
    }

    return (
        <Box sx={{ display: 'flex'}}>
            <AppBar component="nav">
                <Toolbar sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {isMobile && (
                        <Box sx={{ marginRight: '1rem' }}>
                            <Button color="inherit" onClick={handleDrawerToggle} sx={{ minWidth: 0, padding: 0 }}>
                                <FontAwesomeIcon icon={faBars} size="2x" />
                            </Button>
                            <MobileNav items={items} isMobileOpen={isMobileOpen} handleDrawerToggle={handleDrawerToggle} />
                        </Box>
                    )}
                    <Link to="/">
                        <Logo />
                    </Link>
                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: '1rem', flexGrow: 1, marginLeft: '1rem' }}>
                            {items.map((item) => (
                                <Link key={item.label} to={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Button color="inherit" startIcon={item.icon && <FontAwesomeIcon icon={item.icon} />} sx={{ textTransform: 'none', fontSize: '1.2rem' }}>
                                        {item.label}
                                    </Button>
                                </Link>
                            ))}
                        </Box>
                    )}  

                    <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
                        {userToken === '' && (
                            <>
                                <Button 
                                    color="inherit" 
                                    startIcon={<FontAwesomeIcon icon={faRightToBracket} />}
                                    sx={{ 
                                        textTransform: 'none', 
                                        fontSize: '1.2rem',
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

                        {(userToken !== '' && userToken !== null) && (
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

