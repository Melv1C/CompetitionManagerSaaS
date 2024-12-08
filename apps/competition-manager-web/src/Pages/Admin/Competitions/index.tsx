import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Tabs, Tab } from "@mui/material";
import { ListCompetitions, Loading } from "../../../Components";
import { useEffect, useState } from "react";
import { useRoles } from "../../../hooks";
import { getCompetitionsAdmin } from "../../../api";
import { Competition } from "../../../type";
import { CreatePopup } from "./CreatePopup";

export const AdminCompetitions = () => {

	const { isClub } = useRoles();

	const items = [
		{ label: 'A venir' },
		{ label: 'Passées' },
	]

	const [competitions, setCompetitions] = useState<Competition[]>([]);

	const [activeTab, setActiveTab] = useState(0);

	const [isCreatePopupVisible, setIsCreatePopupVisible] = useState(false);

	useEffect(() => {
		const fetchCompetitions = async () => {
			const competitions = await getCompetitionsAdmin();
			setCompetitions(competitions);
		}

		fetchCompetitions();
	}, []);

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

			{competitions.length === 0 && <Loading />}

			<ListCompetitions 
				competitions={
					competitions.filter(competition => 
					!activeTab
					? competition.date.getTime() > Date.now() 
					: competition.date.getTime() < Date.now())
				} 
				isPast={activeTab === 1} 
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
						onClick={() => setIsCreatePopupVisible(true)}
					>
						<FontAwesomeIcon icon={faPlus} size="3x" />
					</Button>
					{isCreatePopupVisible && <CreatePopup isVisible={isCreatePopupVisible} onClose={() => setIsCreatePopupVisible(false)} />}
				</>
			)}
		</Box>
	)
}
