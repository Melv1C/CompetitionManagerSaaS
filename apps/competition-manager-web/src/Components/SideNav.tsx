import { Dispatch, SetStateAction } from "react";
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

    return (
        <Drawer 
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
                                gap: '0.5rem',
                            }}
                        >
                            <ListItemIcon 
                                sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    width: '2rem', 
                                    minWidth: '2rem',
                                    height: '2rem' 
                                }}
                            >
                                <FontAwesomeIcon icon={icon} color="white" size="lg" />
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
                    <FontAwesomeIcon icon={isMenuOpen ? faChevronLeft : faChevronRight} />
                </IconButton>
            </Box>
        </Drawer>
    )
}
