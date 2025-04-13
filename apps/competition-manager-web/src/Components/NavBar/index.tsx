import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
    faBars,
    faRightToBracket,
    faScrewdriverWrench,
    faSignOutAlt,
    faUser,
    faUserGear,
    IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    AppBar,
    Box,
    Button,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material';

import { logout } from '@/api';
import { userTokenAtom } from '@/GlobalsStates';
import { useDeviceSize, useRoles } from '@/hooks';
import { useAtom } from 'jotai';
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

    // User account menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const [userToken, setUserToken] = useAtom(userTokenAtom);
    const { isNotLogged, isLogged, isSuperAdmin, isAdmin } = useRoles();

    const handleDrawerToggle = () => {
        setIsMobileOpen((prev) => !prev);
    };

    const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAccountMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setUserToken('NOT_LOGGED');
        logout();
        handleAccountMenuClose();
    };

    useEffect(() => {
        setIsAuthPopupVisible(false);
    }, [userToken]);

    const isBurgerVisible = isMobile || isTablet;

    // Extract email from userToken if available
    const userEmail = typeof userToken === 'object' ? userToken?.email : '';

    return (
        <Box
            sx={{
                display: 'flex',
            }}
        >
            <AppBar
                component="nav"
                elevation={3}
                sx={{
                    backdropFilter: 'blur(8px)',
                }}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        padding: { xs: '0.5rem', md: '0.5rem 1.5rem' },
                    }}
                >
                    {isBurgerVisible && (
                        <>
                            <Tooltip title={t('menu')}>
                                <Button
                                    color="inherit"
                                    onClick={handleDrawerToggle}
                                    sx={{ minWidth: 0 }}
                                >
                                    <FontAwesomeIcon icon={faBars} size="2x" />
                                </Button>
                            </Tooltip>
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
                                                borderRadius: '8px',
                                                '&:hover': {
                                                    backgroundColor:
                                                        'rgba(255, 255, 255, 0.1)',
                                                },
                                            }}
                                        >
                                            {item.label}
                                        </Button>
                                    </Link>
                                ))}
                            </>
                        )}
                    </Box>

                    {/* Language Selector */}
                    {!isBurgerVisible && <LanguageSelector />}

                    {/* Super Admin Dashboard Link */}
                    {isSuperAdmin && (
                        <Box>
                            <Tooltip title={t('superAdminDashboard')}>
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
                            </Tooltip>
                        </Box>
                    )}

                    {/* Admin Dashboard Link */}
                    {isAdmin && (
                        <Box>
                            <Tooltip title={t('adminDashboard')}>
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
                            </Tooltip>
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
                                        borderRadius: '8px',
                                        padding: '0.2rem 1rem',
                                        '&:hover': {
                                            backgroundColor:
                                                'rgba(255, 255, 255, 0.1)',
                                        },
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
                            <>
                                <Tooltip title={t('account')}>
                                    <IconButton
                                        onClick={handleAccountMenuOpen}
                                        aria-controls={
                                            openMenu
                                                ? 'account-menu'
                                                : undefined
                                        }
                                        aria-haspopup="true"
                                        aria-expanded={
                                            openMenu ? 'true' : undefined
                                        }
                                    >
                                        <AccountCircle />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    id="account-menu"
                                    anchorEl={anchorEl}
                                    open={openMenu}
                                    onClose={handleAccountMenuClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'account-button',
                                    }}
                                    transformOrigin={{
                                        horizontal: 'right',
                                        vertical: 'top',
                                    }}
                                    anchorOrigin={{
                                        horizontal: 'right',
                                        vertical: 'bottom',
                                    }}
                                    PaperProps={{
                                        elevation: 3,
                                        sx: {
                                            minWidth: 220,
                                            mt: 0.5,
                                            '& .MuiMenuItem-root': {
                                                px: 2,
                                                py: 1,
                                            },
                                        },
                                    }}
                                >
                                    <Box sx={{ px: 2, py: 1.5 }}>
                                        <Typography variant="body2">
                                            {userEmail}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <MenuItem
                                        component={Link}
                                        to="/account"
                                        onClick={handleAccountMenuClose}
                                    >
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            style={{
                                                marginRight: '10px',
                                                fontSize: '0.9rem',
                                            }}
                                        />
                                        {t('profile')}
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <FontAwesomeIcon
                                            icon={faSignOutAlt}
                                            style={{
                                                marginRight: '10px',
                                                fontSize: '0.9rem',
                                            }}
                                        />
                                        {t('logout')}
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </Box>
    );
};
