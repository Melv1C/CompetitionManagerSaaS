import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
    faBars,
    faRightToBracket,
    faScrewdriverWrench,
    faUserGear,
    IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppBar, Box, Button, IconButton, Toolbar } from '@mui/material';

import { userTokenAtom } from '@/GlobalsStates';
import { useDeviceSize, useRoles } from '@/hooks';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import { AccountCircle } from '../AccountCircle';
import { AuthPopup } from '../AuthPopup';
import { Logo } from '../Logo';
import { LanguageSelector } from './LanguageSelector';
import { MobileNav } from './MobileNav';

type NavItemProps = {
    label: string;
    href: string;
    icon?: IconDefinition;
};

export type NavBarProps = {
    items: NavItemProps[];
};

export const NavBar: React.FC<NavBarProps> = ({ items }) => {
    const { t } = useTranslation('navigation');

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { isMobile, isTablet } = useDeviceSize();
    const [isAuthPopupVisible, setIsAuthPopupVisible] = useState(false);

    const userToken = useAtomValue(userTokenAtom);
    const { isNotLogged, isLogged, isSuperAdmin, isAdmin } = useRoles();

    const handleDrawerToggle = () => {
        setIsMobileOpen((prev) => !prev);
    };

    useEffect(() => {
        setIsAuthPopupVisible(false);
    }, [userToken]);

    const isBurgerVisible = isMobile || isTablet;

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
                        alignItems: 'center',
                    }}
                >
                    {isBurgerVisible && (
                        <>
                            <Button
                                color="inherit"
                                onClick={handleDrawerToggle}
                                sx={{ minWidth: 0 }}
                            >
                                <FontAwesomeIcon icon={faBars} size="2x" />
                            </Button>
                            <MobileNav
                                items={items}
                                isMobileOpen={isMobileOpen}
                                handleDrawerToggle={handleDrawerToggle}
                            />
                        </>
                    )}
                    <Link to="/">
                        <Logo sx={{ height: '3rem' }} />
                    </Link>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '1rem',
                            flexGrow: 1,
                            marginLeft: '1rem',
                        }}
                    >
                        {!isBurgerVisible && (
                            <>
                                {items.map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.href}
                                        style={{
                                            textDecoration: 'none',
                                            color: 'inherit',
                                        }}
                                    >
                                        <Button
                                            variant="text"
                                            color="inherit"
                                            startIcon={
                                                item.icon && (
                                                    <FontAwesomeIcon
                                                        icon={item.icon}
                                                    />
                                                )
                                            }
                                            sx={{
                                                textTransform: 'none',
                                                fontSize: '1.2rem',
                                                padding: '0.5rem 1rem',
                                            }}
                                        >
                                            {item.label}
                                        </Button>
                                    </Link>
                                ))}
                            </>
                        )}
                    </Box>

                    {/* add link to language switcher */}
                    {!isBurgerVisible && <LanguageSelector />}

                    {/* add link to super admin dashboard */}
                    {isSuperAdmin && (
                        <Box>
                            <Link to="/superadmin">
                                <IconButton
                                    sx={{
                                        width: '2.5rem',
                                        height: '2.5rem',
                                        color: 'white',
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faScrewdriverWrench}
                                        style={{ fontSize: '1.25rem' }}
                                    />
                                </IconButton>
                            </Link>
                        </Box>
                    )}

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
                                    <FontAwesomeIcon
                                        icon={faUserGear}
                                        style={{ fontSize: '1.25rem' }}
                                    />
                                </IconButton>
                            </Link>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {isNotLogged && (
                            <>
                                <Button
                                    startIcon={
                                        <FontAwesomeIcon
                                            icon={faRightToBracket}
                                        />
                                    }
                                    color="inherit"
                                    sx={{
                                        textTransform: 'none',
                                        fontSize: isBurgerVisible
                                            ? '1rem'
                                            : '1.2rem',
                                        border: '2px solid white',
                                        padding: '0.2rem 1rem',
                                    }}
                                    onClick={() => setIsAuthPopupVisible(true)}
                                >
                                    {t('login')}
                                </Button>
                                <AuthPopup
                                    isVisible={isAuthPopupVisible}
                                    onClose={() => setIsAuthPopupVisible(false)}
                                />
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
            <Toolbar />
        </Box>
    );
};
