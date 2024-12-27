import { useState } from "react";
import { Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, Typography } from "@mui/material"
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
}

export const SideNav: React.FC<MenuItemProps> = ({ items }) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleDrawerToggle = () => {
        setIsMenuOpen((prev) => !prev);
    }

    return (
        <Drawer 
            variant="permanent"
            PaperProps={{ 
                sx: {
                    top: '64px',
                    height: 'calc(100% - 64px)',
                }
            }}
            sx={{
                width: isMenuOpen ? OPEN_SIDENAV_WIDTH : CLOSED_SIDENAV_WIDTH,
                '& .MuiDrawer-paper': {
                    width: isMenuOpen ? OPEN_SIDENAV_WIDTH : CLOSED_SIDENAV_WIDTH,
                    top: '64px',
                    height: 'calc(100% - 64px)',
                    overflowX: 'hidden',
                    transition: 'width 0.3s',
                },
                transition: 'width 0.3s',
            }}
        >
            <Divider />
            <List>
                {items.map(({ text, icon }, index) => (
                    <Link to={items[index].link} key={index}>
                        <ListItemButton 
                            key={index}
                            sx={{ 
                                color: 'white',
                                justifyContent: 'flex-start',
                                gap: '0.5rem',
                            }}
                        >
                            <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '40px', minHeight: '40px' }}>
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
                    gap: '0.5rem', 
                    padding: '1rem' 
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
