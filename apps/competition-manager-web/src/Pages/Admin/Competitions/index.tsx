import { getCompetitions } from '@/api';
import { ListCompetitions, Loading } from '@/Components';
import { CircleButton } from '@/Components/CircleButton';
import { MaxWidth } from '@/Components/MaxWidth';
import { useRoles } from '@/hooks';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { CreatePopup } from './CreatePopup';

const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = new Date();
tomorrow.setHours(23, 59, 59, 999);

export const AdminCompetitions = () => {
    const { t } = useTranslation();

    const {
        data: competitions,
        isLoading,
        isError,
    } = useQuery('admin-competitions', () =>
        getCompetitions({ isAdmin: true })
    );

    const { isClub } = useRoles();

    const items = [{ label: t('upcoming') }, { label: t('past') }];

    const [activeTab, setActiveTab] = useState(0);

    const [isCreatePopupVisible, setIsCreatePopupVisible] = useState(false);

    if (isLoading) return <Loading />;
    if (isError) throw new Error('Error fetching competitions');
    if (!competitions)
        throw new Error('Unexpected error: competitions is undefined');

    return (
        <MaxWidth>
            <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                centered
            >
                {items.map((item, index) => (
                    <Tab key={index} label={item.label} />
                ))}
            </Tabs>

            <ListCompetitions
                competitions={competitions.filter((competition) =>
                    !activeTab
                        ? competition.date.getTime() >= today.getTime()
                        : competition.date.getTime() < tomorrow.getTime()
                )}
                isPast={activeTab === 1}
                link="/admin/competitions"
            />

            {isClub && (
                <>
                    <CircleButton
                        size="4rem"
                        sx={{
                            position: 'fixed',
                            bottom: '1rem',
                            right: '1rem',
                        }}
                        variant="contained"
                        color="secondary"
                        onClick={() => setIsCreatePopupVisible(true)}
                    >
                        <FontAwesomeIcon icon={faPlus} size="3x" />
                    </CircleButton>
                    {isCreatePopupVisible && (
                        <CreatePopup
                            isVisible={isCreatePopupVisible}
                            onClose={() => setIsCreatePopupVisible(false)}
                        />
                    )}
                </>
            )}
        </MaxWidth>
    );
};
