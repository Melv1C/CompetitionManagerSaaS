import { Bib } from '@/Components';
import { useDeviceSize } from '@/hooks';
import {
    Id,
    Inscription,
    InscriptionStatus,
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

type SortableInscriptionItemProps = {
    inscription: Inscription;
    isSelected: boolean;
    toggleSelection: (id: Id) => void;
};

export const SortableInscriptionItem: React.FC<
    SortableInscriptionItemProps
> = ({ inscription, isSelected, toggleSelection }) => {
    const { t } = useTranslation();
    const { isMobile } = useDeviceSize();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: inscription.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Box ref={setNodeRef} style={style}>
            <ListItemButton
                onClick={() => toggleSelection(inscription.id)}
                sx={{
                    py: { xs: 2, sm: 1 },
                    px: { xs: 1, sm: 2 },
                    backgroundColor:
                        inscription.status === InscriptionStatus.ACCEPTED
                            ? 'rgba(211, 47, 47, 0.04)'
                            : undefined,
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
                    <FontAwesomeIcon icon={faGripLines} style={{ color: 'inherit' }} />
                </Box>

                <Checkbox
                    edge="start"
                    checked={isSelected}
                    tabIndex={-1}
                    disableRipple
                />

                {!isMobile && (
                    <ListItemAvatar sx={{ minWidth: 'auto', m: 1 }}>
                        <Bib value={inscription.bib} size="sm" />
                    </ListItemAvatar>
                )}

                <ListItemText
                    primary={`${inscription.athlete.firstName} ${inscription.athlete.lastName}`}
                    secondary={
                        isMobile ? (
                            <>
                                {`${inscription.bib} - ${inscription.club?.abbr}`}
                                {inscription.status ===
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
                                {inscription.club?.abbr}
                                {inscription.record?.perf && (
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
