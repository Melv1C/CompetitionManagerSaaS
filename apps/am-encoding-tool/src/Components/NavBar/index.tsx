import { useState } from 'react';
import { Link } from 'react-router-dom';

import { faBars, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppBar, Box, Button, Toolbar, Tooltip } from '@mui/material';

import { useDeviceSize } from '@/hooks';
import { useTranslation } from 'react-i18next';
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

    const handleDrawerToggle = () => {
        setIsMobileOpen((prev: boolean) => !prev);
    };

    const isBurgerVisible = isMobile || isTablet;

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
                </Toolbar>
            </AppBar>
            <Toolbar />
        </Box>
    );
};
