import { Bib } from '@/Components';
import { useDeviceSize } from '@/hooks';
import {
    Athlete as AthleteType,
    Bib as BibType,
    Id,
    Inscription,
    InscriptionStatus,
    License,
} from '@competition-manager/schemas';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    faExclamationTriangle,
    faGripLines,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Box,
    Checkbox,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

// Type definition for our unified Participant type
type Participant = {
    license: License; // Athlete license (used as unique ID)
    bib: BibType; // Athlete bib number
    athlete: AthleteType; // Full athlete data
    inscriptionId?: Id; // Optional inscription ID (missing for external athletes)
    isSelected: boolean; // Whether this participant is selected
};

type SortableParticipantItemProps = {
    participant: Participant;
    toggleSelection: () => void;
    inscription?: Inscription; // Optional - used for showing inscription-specific data
};

export const SortableParticipantItem: React.FC<
    SortableParticipantItemProps
> = ({ participant, toggleSelection, inscription }) => {
    const { t } = useTranslation();
    const { isMobile } = useDeviceSize();

    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: participant.license });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Determine background color based on status (for inscribed athletes)
    const getBackgroundColor = () => {
        if (inscription && inscription.status === InscriptionStatus.ACCEPTED) {
            return 'rgba(211, 47, 47, 0.04)';
        }
        return undefined;
    };

    return (
        <Box ref={setNodeRef} style={style}>
            <ListItemButton
                onClick={toggleSelection}
                sx={{
                    py: { xs: 2, sm: 1 },
                    px: { xs: 1, sm: 2 },
                    backgroundColor: getBackgroundColor(),
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Box
                    className="drag-handle"
                    {...attributes}
                    {...listeners}
                    sx={{
                        cursor: 'grab',
                        color: 'text.secondary',
                        mr: 1,
                        display: 'flex',
                        alignItems: 'center',
                        '&:hover': {
                            color: 'primary.main',
                        },
                        touchAction: 'none',
                        padding: 0.5,
                    }}
                >
                    <FontAwesomeIcon
                        icon={faGripLines}
                        style={{ color: 'inherit' }}
                    />
                </Box>

                <Checkbox
                    edge="start"
                    checked={participant.isSelected}
                    tabIndex={-1}
                    disableRipple
                />

                {!isMobile && (
                    <ListItemAvatar sx={{ minWidth: 'auto', m: 1 }}>
                        <Bib value={participant.bib} size="sm" />
                    </ListItemAvatar>
                )}

                <ListItemText
                    primary={`${participant.athlete.firstName} ${participant.athlete.lastName}`}
                    secondary={
                        isMobile ? (
                            <>
                                {`${participant.bib} - ${participant.athlete.club?.abbr}`}
                                {inscription &&
                                    inscription.status ===
                                        InscriptionStatus.ACCEPTED && (
                                        <Box
                                            component="span"
                                            sx={{
                                                ml: 1,
                                                color: 'warning.main',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faExclamationTriangle}
                                                size="xs"
                                            />
                                        </Box>
                                    )}
                            </>
                        ) : (
                            <>
                                {participant.athlete.club?.abbr}
                                {inscription?.record?.perf && (
                                    <Box
                                        component="span"
                                        sx={{
                                            ml: 1,
                                            color: 'text.secondary',
                                            fontSize: '0.8rem',
                                        }}
                                    >
                                        (PB: {inscription.record.perf})
                                    </Box>
                                )}
                            </>
                        )
                    }
                    primaryTypographyProps={{
                        noWrap: isMobile,
                        sx: { fontWeight: 'medium' },
                    }}
                />

                {!isMobile &&
                    inscription &&
                    inscription.status === InscriptionStatus.ACCEPTED && (
                        <Typography
                            variant="caption"
                            color="warning.main"
                            sx={{ ml: 1 }}
                        >
                            {t('result:notConfirmed')}
                        </Typography>
                    )}
            </ListItemButton>
        </Box>
    );
};
