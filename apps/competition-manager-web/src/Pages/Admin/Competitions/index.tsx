import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Tabs, Tab } from "@mui/material";
import { ListCompetitions, Loading } from "../../../Components";
import { useState } from "react";
import { useRoles } from "../../../hooks";
import { CreatePopup } from "./CreatePopup";
import { MaxWidth } from "../../../Components/MaxWidth";
import { getCompetitions } from "../../../api";
import { useQuery } from "react-query";

export const AdminCompetitions = () => {

	const { data: competitions, isLoading } = useQuery('admin-competitions', () => getCompetitions({ isAdmin: true }))

	const { isClub } = useRoles();

	const items = [
		{ label: 'A venir' },
		{ label: 'Passées' },
	]

	const [activeTab, setActiveTab] = useState(0);

	const [isCreatePopupVisible, setIsCreatePopupVisible] = useState(false);

	if (isLoading) return <Loading />;
	if (!competitions) throw new Error('No competitions found');

	return (
		<MaxWidth>
			<Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
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
						color="secondary"
						onClick={() => setIsCreatePopupVisible(true)}
					>
						<FontAwesomeIcon icon={faPlus} size="3x" />
					</Button>
					{isCreatePopupVisible && <CreatePopup isVisible={isCreatePopupVisible} onClose={() => setIsCreatePopupVisible(false)} />}
				</>
			)}
		</MaxWidth>
	)
}
