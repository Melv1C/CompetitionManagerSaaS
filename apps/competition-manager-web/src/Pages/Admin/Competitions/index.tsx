import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tabs, Tab } from "@mui/material";
import { ListCompetitions, Loading } from "../../../Components";
import { useState } from "react";
import { useRoles } from "../../../hooks";
import { CreatePopup } from "./CreatePopup";
import { MaxWidth } from "../../../Components/MaxWidth";
import { getCompetitions } from "../../../api";
import { useQuery } from "react-query";
import { CircleButton } from "../../../Components/CircleButton";
import { useTranslation } from "react-i18next";

export const AdminCompetitions = () => {

	const { t } = useTranslation();

	const { data: competitions, isLoading, isError } = useQuery('admin-competitions', () => getCompetitions({ isAdmin: true }))

	const { isClub } = useRoles();

	const items = [
		{ label: t('upcoming') },
		{ label: t('past') }
	]

	const [activeTab, setActiveTab] = useState(0);

	const [isCreatePopupVisible, setIsCreatePopupVisible] = useState(false);

	if (isLoading) return <Loading />;
	if (isError) throw new Error('Error fetching competitions');
	if (!competitions) throw new Error('Unexpected error: competitions is undefined');

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
				competitions={
					competitions.filter(competition => 
					!activeTab
					? competition.date.getTime() > Date.now() 
					: competition.date.getTime() < Date.now())
				} 
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
							right: '1rem'
						}}
						variant="contained"
						color="secondary"
						onClick={() => setIsCreatePopupVisible(true)}
					>
						<FontAwesomeIcon icon={faPlus} size="3x" />
					</CircleButton>
					{isCreatePopupVisible && <CreatePopup isVisible={isCreatePopupVisible} onClose={() => setIsCreatePopupVisible(false)} />}
				</>
			)}
		</MaxWidth>
	)
}
