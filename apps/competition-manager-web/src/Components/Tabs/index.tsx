import React, { useState } from 'react';
import { Tab, Tabs as MuiTabs } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

type NavItemProps = {
    label: string;
    href?: string;
    icon?: IconDefinition;
};

type TabsProps = {
    items: NavItemProps[];
};


export const Tabs: React.FC<TabsProps> = ({ items }) => {

    const [value, setValue] = useState(0);

    return (
        <MuiTabs value={value} onChange={(_, newValue) => setValue(newValue)}>
            {items.map((item, index) => (
                <Tab 
                    key={index} 
                    label={item.label} 
                    icon={item.icon && <FontAwesomeIcon icon={item.icon} />}
                />
            ))}
        </MuiTabs>

    )
}
