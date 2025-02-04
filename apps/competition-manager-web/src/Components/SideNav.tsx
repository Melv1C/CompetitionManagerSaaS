import { Dispatch, SetStateAction, useEffect } from "react";
import { Box, Drawer, IconButton, List, ListItemButton, ListItemIcon, Typography } from "@mui/material"
import { CLOSED_SIDENAV_WIDTH, OPEN_SIDENAV_WIDTH } from "../utils/constants";
import { faChevronLeft, faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

type MenuItemProps = {
    items: { 
        text: string, 
        icon: IconDefinition,
        link: string,
    }[];
    isMenuOpen: boolean;
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export const SideNav: React.FC<MenuItemProps> = ({ items, isMenuOpen, setIsMenuOpen }) => {

    const handleDrawerToggle = () => {
        setIsMenuOpen((prev) => !prev);
    }

    // add left margin to the footer to prevent it from being hidden by the sidenav (id="footer")
    useEffect(() => {
        const footer = document.getElementById('footer');
        if (footer) {
            footer.style.marginLeft = isMenuOpen ? OPEN_SIDENAV_WIDTH : CLOSED_SIDENAV_WIDTH;
            footer.style.transition = 'margin-left 0.3s';
        }

        return () => {
            if (footer) {
                footer.style.marginLeft = '0';
            }
        }
    }, [isMenuOpen]);

    return (
        <Drawer 
            id="sidenav-drawer"
            variant="permanent"
            sx={{
                width: isMenuOpen ? OPEN_SIDENAV_WIDTH : CLOSED_SIDENAV_WIDTH,
                '& .MuiDrawer-paper': {
                    zIndex: 1000,
                    width: isMenuOpen ? OPEN_SIDENAV_WIDTH : CLOSED_SIDENAV_WIDTH,
                    overflowX: 'hidden',
                    transition: 'width 0.3s',
                },
                transition: 'width 0.3s',
            }}
        >
            <List sx={{ marginTop: '4rem' }}>
                {items.map(({ text, icon }, index) => (
                    <Link to={items[index].link} key={index} style={{ textDecoration: 'none' }}>
                        <ListItemButton 
                            key={index}
                            sx={{ 
                                color: 'white',
                                justifyContent: 'flex-start',
                                gap: '1rem',
                            }}
                        >
                            <ListItemIcon 
                                sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    width: '1rem', 
                                    minWidth: '1rem',
                                    height: '2rem' 
                                }}
                            >
                                <FontAwesomeIcon icon={icon} color="white" />
                            </ListItemIcon>
                            {isMenuOpen && <Typography variant="h6">{text}</Typography>}
                        </ListItemButton>
                    </Link>
                ))}
            </List>
            <Box 
                sx={{ 
                    flexGrow: 1,
                    display: 'flex', 
                    justifyContent: isMenuOpen ? 'flex-end' : 'center', 
                    alignItems: 'flex-end',
                    padding: '0.5rem' 
                }}
            >
                <IconButton 
                    color="inherit" 
                    onClick={handleDrawerToggle} 
                >
                    <FontAwesomeIcon icon={isMenuOpen ? faChevronLeft : faChevronRight} size="xs" />
                </IconButton>
            </Box>
        </Drawer>
    )
}
