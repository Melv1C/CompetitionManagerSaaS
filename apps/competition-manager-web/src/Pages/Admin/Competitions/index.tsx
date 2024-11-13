import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Tabs, Tab } from "@mui/material";
import { List } from "./List";
import { useState } from "react";

const getCompetitions = () => {
    return [
        {
            id: 1,
            name: 'Meeting de concours pour tous. Spécial Perche',
            club: 'Club 1',
            address: 'Rue de la Perche, 12345 Ville',
            date: new Date("2024-12-31"),
        },
        {
            id: 2,
            name: 'Competition 2',
            club: 'Club 2',
            address: 'Address 2',
            date: new Date("2025-03-01"),
        },
        {
            id: 3,
            name: 'Competition 3',
            club: 'Club 3',
            address: 'Address 3',
            date: new Date("2025-06-01"),
        },
        {
            id: 4,
            name: 'Competition 4',
            club: 'Club 4',
            address: 'Address 4',
            date: new Date("2025-01-01"),
        },
        {
            id: 5,
            name: 'Competition 5',
            club: 'Club 5',
            address: 'Address 5',
            date: new Date(),
        },
        {
            id: 6,
            name: 'Competition 6',
            club: 'Club 6',
            address: 'Address 6',
            date: new Date("2023-01-01"),
        },
        {
            id: 7,
            name: 'Competition 7',
            club: 'Club 7',
            address: 'Address 7',
            date: new Date("2022-01-01"),
        },
        {
            id: 8,
            name: 'Competition 8',
            club: 'Club 8',
            address: 'Address 8',
            date: new Date("2023-02-01"),
        },
        {
            id: 9,
            name: 'Competition 9',
            club: 'Club 9',
            address: 'Address 9',
            date: new Date("2022-06-01"),
        },
        {
            id: 10,
            name: 'Competition 10',
            club: 'Club 10',
            address: 'Address 10',
            date: new Date("2023-10-01"),
        },
        {
            id: 11,
            name: 'Competition 11',
            club: 'Club 11',
            address: 'Address 11',
            date: new Date(),
        },
        {
            id: 12,
            name: 'Competition 12',
            club: 'Club 12',
            address: 'Address 12',
            date: new Date(),
        },
        {
            id: 13,
            name: 'Competition 13',
            club: 'Club 13',
            address: 'Address 13',
            date: new Date(),
        },
        {
            id: 14,
            name: 'Competition Competition Competition Competition Competition Competition Competition Competition',
            club: 'Club 14',
            address: 'Address 14',
            date: new Date("2023-10-31"),
        },
        {
            id: 15,
            name: 'Competition 15',
            club: 'Club 15',
            address: 'Address 15',
            date: new Date(),
        },
    ]
}


export const AdminCompetitions = () => {

    const items = [
        { label: 'A venir' },
        { label: 'Passées' },
    ]

    const competitions = getCompetitions();

    const [activeTab, setActiveTab] = useState(0);

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >

            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
                {items.map((item, index) => (
                    <Tab key={index} label={item.label} />
                ))}
            </Tabs>


            <List 
                competitions={
                    competitions.filter(competition => 
                    !activeTab
                    ? competition.date.getTime() > Date.now() 
                    : competition.date.getTime() < Date.now())
                } 
                isPast={activeTab === 1} 
            />
            
            <Button 
                sx={{ 
                    position: 'fixed',
                    bottom: '1rem',
                    right: '1rem',
                    borderRadius: '50%',
                    padding: '1rem',
                    width: '4rem',
                    height: '4rem',
                }}
                variant="contained"
                >
                <FontAwesomeIcon icon={faPlus} size="3x" />
            </Button>
        </Box>
    )
}
