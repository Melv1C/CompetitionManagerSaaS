import { Bib } from '@/Components';
import { Inscription, InscriptionStatus } from '@competition-manager/schemas';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Box,
    Button,
    Card,
    CardHeader,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import { KeyboardEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type PopupProps = {
    open: boolean;
    onClose: () => void;
    inscriptions: Inscription[];
    onConfirm: (updatedInscriptions: Inscription[]) => void;
};

export const Popup: React.FC<PopupProps> = ({
    open,
    onClose,
    inscriptions,
    onConfirm,
}) => {
    const { t } = useTranslation();

    const athlete = inscriptions[0]?.athlete;

    const [inscriptionsState, setInscriptionsState] =
        useState<Inscription[]>(inscriptions);

    const isModified = useMemo(() => {
        return (
            JSON.stringify(inscriptions) !== JSON.stringify(inscriptionsState)
        );
    }, [inscriptions, inscriptionsState]);

    const handleCancel = () => {
        onClose();
    };

    const handleConfirm = () => {
        onConfirm(inscriptionsState);
        onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        event.preventDefault();
        event.stopPropagation();

        // Alt + C
        if (event.altKey && event.key === 'c') {
            setInscriptionsState(
                inscriptionsState.map((i) => ({
                    ...i,
                    status: InscriptionStatus.CONFIRMED,
                }))
            );
        }

        // Alt + R
        if (event.altKey && event.key === 'r') {
            setInscriptionsState(
                inscriptionsState.map((i) => ({
                    ...i,
                    status: InscriptionStatus.REMOVED,
                }))
            );
        }

        // Enter
        if (event.key === 'Enter' && isModified) {
            console.log('confirm');
            handleConfirm();
        }
    };

    if (!athlete) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            onKeyDown={handleKeyDown}
        >
            <DialogTitle>{t('glossary:confirmation')}</DialogTitle>
            <DialogContent>
                <Card elevation={0}>
                    <CardHeader
                        title={
                            <Box display="flex" alignItems="center" gap={2}>
                                <Bib value={athlete.bib} size="lg" />
                                <Typography variant="h5">
                                    {athlete.firstName} {athlete.lastName}
                                </Typography>
                            </Box>
                        }
                    />
                    <List>
                        {inscriptionsState.map((i) => (
                            <ListItem
                                key={i.id}
                                secondaryAction={
                                    <Box display="flex" gap={1}>
                                        <Chip
                                            label={t(
                                                `enums:inscriptionStatus.confirmed`
                                            )}
                                            color="success"
                                            variant={
                                                i.status ===
                                                InscriptionStatus.CONFIRMED
                                                    ? 'filled'
                                                    : 'outlined'
                                            }
                                            sx={{ pl: 1 }}
                                            icon={
                                                <FontAwesomeIcon
                                                    icon={faCheck}
                                                />
                                            }
                                            onClick={() =>
                                                setInscriptionsState(
                                                    inscriptionsState.map(
                                                        (inscription) => {
                                                            if (
                                                                inscription.id ===
                                                                i.id
                                                            ) {
                                                                return {
                                                                    ...inscription,
                                                                    status:
                                                                        i.status ===
                                                                        InscriptionStatus.CONFIRMED
                                                                            ? InscriptionStatus.ACCEPTED
                                                                            : InscriptionStatus.CONFIRMED,
                                                                };
                                                            }
                                                            return inscription;
                                                        }
                                                    )
                                                )
                                            }
                                        />
                                        <Chip
                                            label={t(
                                                `enums:inscriptionStatus.removed`
                                            )}
                                            color="error"
                                            variant={
                                                i.status ===
                                                InscriptionStatus.REMOVED
                                                    ? 'filled'
                                                    : 'outlined'
                                            }
                                            sx={{ pl: 1 }}
                                            icon={
                                                <FontAwesomeIcon
                                                    icon={faXmark}
                                                />
                                            }
                                            onClick={() =>
                                                setInscriptionsState(
                                                    inscriptionsState.map(
                                                        (inscription) => {
                                                            if (
                                                                inscription.id ===
                                                                i.id
                                                            ) {
                                                                return {
                                                                    ...inscription,
                                                                    status:
                                                                        i.status ===
                                                                        InscriptionStatus.REMOVED
                                                                            ? InscriptionStatus.ACCEPTED
                                                                            : InscriptionStatus.REMOVED,
                                                                };
                                                            }
                                                            return inscription;
                                                        }
                                                    )
                                                )
                                            }
                                        />
                                    </Box>
                                }
                            >
                                <ListItemText>
                                    {i.competitionEvent.name}
                                </ListItemText>
                            </ListItem>
                        ))}
                    </List>
                    <Box display="flex" justifyContent="flex-end" p={2} gap={1}>
                        <Chip
                            label={
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography variant="body2">
                                        {t('adminCompetition:confirmAll')}
                                    </Typography>
                                    <Box
                                        sx={{
                                            borderRadius: '4px',
                                            border: '2px solid',
                                            borderColor: 'divider',
                                            p: '1px',
                                        }}
                                    >
                                        Alt + C
                                    </Box>
                                </Box>
                            }
                            color="success"
                            variant={
                                inscriptionsState.every(
                                    (i) =>
                                        i.status === InscriptionStatus.CONFIRMED
                                )
                                    ? 'filled'
                                    : 'outlined'
                            }
                            onClick={() =>
                                setInscriptionsState(
                                    inscriptionsState.map((i) => ({
                                        ...i,
                                        status:
                                            i.status ===
                                            InscriptionStatus.CONFIRMED
                                                ? InscriptionStatus.ACCEPTED
                                                : InscriptionStatus.CONFIRMED,
                                    }))
                                )
                            }
                        />
                        <Chip
                            label={
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography variant="body2">
                                        {t('adminCompetition:absent')}
                                    </Typography>
                                    <Box
                                        sx={{
                                            borderRadius: '4px',
                                            border: '2px solid',
                                            borderColor: 'divider',
                                            p: '1px',
                                        }}
                                    >
                                        Alt + R
                                    </Box>
                                </Box>
                            }
                            color="error"
                            variant={
                                inscriptionsState.every(
                                    (i) =>
                                        i.status === InscriptionStatus.REMOVED
                                )
                                    ? 'filled'
                                    : 'outlined'
                            }
                            onClick={() =>
                                setInscriptionsState(
                                    inscriptionsState.map((i) => ({
                                        ...i,
                                        status:
                                            i.status ===
                                            InscriptionStatus.REMOVED
                                                ? InscriptionStatus.ACCEPTED
                                                : InscriptionStatus.REMOVED,
                                    }))
                                )
                            }
                        />
                    </Box>
                </Card>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleCancel}>
                    {t('buttons:cancel')}
                </Button>
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={!isModified}
                >
                    {t('buttons:confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
