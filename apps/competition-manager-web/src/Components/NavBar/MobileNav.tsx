
import { Link } from "react-router-dom";

import {Box, Button, Divider, Drawer, IconButton, List, ListItem } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import { DRAWER_WIDTH } from "../../utils/constants";

import { NavBarProps } from ".";
import { LanguageSelector } from "./LanguageSelector";

type MobileNavProps = NavBarProps & {
    isMobileOpen: boolean;
    handleDrawerToggle: () => void;
};

export const MobileNav: React.FC<MobileNavProps> = ({ items, isMobileOpen, handleDrawerToggle }) => {
    return (
        <Drawer
            anchor="left"
            open={isMobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
                keepMounted: true,
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
                <LanguageSelector />
                <IconButton onClick={handleDrawerToggle} color="inherit">
                    <FontAwesomeIcon icon={faChevronLeft} size="xs" />
                </IconButton>
            </Box>
            <Divider />
            <List sx={{ width: DRAWER_WIDTH }}>
                {items.map((item) => (
                    <Link key={item.label} to={item.href} onClick={handleDrawerToggle} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <ListItem key={item.label}>
                            <Button 
                                color="inherit" 
                                startIcon={item.icon && <FontAwesomeIcon icon={item.icon} />} 
                                sx={{ 
                                    textTransform: 'none', 
                                    fontSize: '1.2rem', 
                                    width: '100%',
                                    justifyContent: 'flex-start'
                                }}
                            >
                                {item.label}
                            </Button>
                        </ListItem>
                    </Link>
                ))}
            </List>
        </Drawer>
    );
}



