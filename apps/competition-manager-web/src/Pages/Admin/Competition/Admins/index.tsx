import {
    Alert,
    Box,
    Button,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
// Import directly from the project files since path aliases might not be configured in this editor
import { createAdmin } from '@/api/admin';
import { competitionAtom, userTokenAtom } from '@/GlobalsStates';
import {
    Access,
    Admin,
    Admin$,
    CreateAdmin$,
    Email$,
} from '@competition-manager/schemas';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import { removeAdmin } from '@/api/admin/removeAdmin';

export const Admins = () => {
    const { t } = useTranslation();
    const competition = useAtomValue(competitionAtom);
    const userToken = useAtomValue(userTokenAtom);
    const [admins, setAdmins] = useState<Admin[]>(competition?.admins || []);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [selectedAccess, setSelectedAccess] = useState<Access[]>([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
        setNewAdminEmail('');
        setEmailError('');
        setSelectedAccess([]);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
    };

    const validateEmail = (email: string) => {
        try {
            Email$.parse(email);
            setEmailError('');
            return true;
        } catch (error) {
            setEmailError(
                t('validation.invalidEmail', 'Invalid email address')
            );
            return false;
        }
    };

    const handleEmailChange = (email: string) => {
        setNewAdminEmail(email);
        if (email) validateEmail(email);
    };

    const handleAccessToggle = (access: Access) => {
        setSelectedAccess((prev) =>
            prev.includes(access)
                ? prev.filter((a) => a !== access)
                : [...prev, access]
        );
    };

    const handleAddAdmin = async () => {
        if (!validateEmail(newAdminEmail) || selectedAccess.length === 0) {
            if (selectedAccess.length === 0) {
                setSnackbar({
                    open: true,
                    message: t(
                        'validation.selectAccess',
                        'Please select at least one access right'
                    ),
                    severity: 'error',
                });
            }
            return;
        }

        const response = await createAdmin(
            competition!.eid,
            CreateAdmin$.parse({
                email: newAdminEmail,
                access: selectedAccess,
            })
        );
        if (response instanceof Error) {
            switch (response.message) {
                case 'User not found':
                    setSnackbar({
                        open: true,
                        message: t(
                            'error.addAdminEmail',
                            'No user found with this email'
                        ),
                        severity: 'error',
                    });
                    return;
                case 'User is already an admin':
                    setSnackbar({
                        open: true,
                        message: t(
                            'error.addAdminAlreadyAdmin',
                            'This user is already an admin'
                        ),
                        severity: 'error',
                    });
                    return;
                default:
                    console.error(response);
                    setSnackbar({
                        open: true,
                        message: t('error.addAdmin', 'Failed to add admin'),
                        severity: 'error',
                    });
                    return;
            }
        } else {
            setAdmins((prev) => [...prev, Admin$.parse(response)]);
            setOpenAddDialog(false);
            return;
        }
    };

    const handleRemoveAdmin = async (adminId: number) => {
        try {
            await removeAdmin(
                competition!.eid,
                adminId
            );
            setAdmins((prev) => prev.filter((admin) => admin.id !== adminId));

            setSnackbar({
                open: true,
                message: t(
                    'success.adminRemoved',
                    'Admin removed successfully'
                ),
                severity: 'success',
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: t('error.removeAdmin', 'Failed to remove admin'),
                severity: 'error',
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const getAccessLabel = (access: Access) => {
        switch (access) {
            case Access.OWNER:
                return t('admin.access.owner', 'Owner');
            case Access.INSCRIPTIONS:
                return t('admin.access.inscriptions', 'Inscriptions');
            case Access.COMPETITIONS:
                return t('admin.access.competitions', 'Competitions');
            case Access.CONFIRMATIONS:
                return t('admin.access.confirmations', 'Confirmations');
            case Access.RESULTS:
                return t('admin.access.results', 'Results');
            default:
                return access;
        }
    };

    const isAdminCompet = () => {
        if (userToken == "NOT_LOGGED") return false;
        const admin = competition?.admins.find(
            (admin) => admin.user.id === userToken?.id
        );
        if (admin && (admin.access.includes(Access.COMPETITIONS) || admin.access.includes(Access.OWNER))) {
            return true;
        }
        return false;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                }}
            >
                <Typography variant="h5" component="h1">
                    {t('admin.competitionAdmins', 'Competition Admins')}
                </Typography>
                {isAdminCompet() && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenAddDialog}
                    >
                        {t('admin.addAdmin', 'Add Admin')}
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('admin.name', 'Name')}</TableCell>
                            <TableCell>{t('admin.email', 'Email')}</TableCell>
                            <TableCell>{t('admin.access', 'Access')}</TableCell>
                            <TableCell>
                                {t('admin.actions', 'Actions')}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {admins.map((admin) => (
                            <TableRow key={admin.id}>
                                <TableCell>{`${admin.user.email}`}</TableCell>
                                <TableCell>{admin.user.email}</TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 1,
                                        }}
                                    >
                                        {admin.access.map((access) => (
                                            <Chip
                                                key={access}
                                                label={getAccessLabel(access)}
                                                size="small"
                                                color={
                                                    access === Access.OWNER
                                                        ? 'secondary'
                                                        : 'primary'
                                                }
                                            />
                                        ))}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {/* Only allow editing non-owner admins, and only if current user is owner */}
                                    {isAdminCompet() &&
                                        !admin.access.includes(
                                            Access.OWNER
                                        ) && (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: 1,
                                                }}
                                            >
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        // TODO
                                                        alert("TODO")
                                                    }}
                                                >
                                                    {t('actions.edit', 'Edit')}
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() =>
                                                        handleRemoveAdmin(
                                                            admin.id
                                                        )
                                                    }
                                                >
                                                    {t(
                                                        'actions.remove',
                                                        'Remove'
                                                    )}
                                                </Button>
                                            </Box>
                                        )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Admin Dialog */}
            <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
                <DialogTitle>{t('admin.addAdmin', 'Add Admin')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t(
                            'admin.addAdminDescription',
                            'Enter the email of the user you want to add as an admin. The user must already have an account.'
                        )}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label={t('admin.email', 'Email Address')}
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={newAdminEmail}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        error={Boolean(emailError)}
                        helperText={emailError}
                        sx={{ mb: 2, mt: 2 }}
                    />
                    <Typography variant="subtitle2" gutterBottom>
                        {t('admin.selectAccess', 'Select Access Rights')}
                    </Typography>
                    <FormGroup>
                        {Object.values(Access)
                            .filter((access) => access !== Access.OWNER) // Only owner can add owners
                            .map((access) => (
                                <FormControlLabel
                                    key={access}
                                    control={
                                        <Checkbox
                                            checked={selectedAccess.includes(
                                                access
                                            )}
                                            onChange={() =>
                                                handleAccessToggle(access)
                                            }
                                        />
                                    }
                                    label={getAccessLabel(access)}
                                />
                            ))}
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddDialog}>
                        {t('actions.cancel', 'Cancel')}
                    </Button>
                    <Button
                        onClick={handleAddAdmin}
                        variant="contained"
                        disabled={
                            !newAdminEmail ||
                            Boolean(emailError) ||
                            selectedAccess.length === 0
                        }
                    >
                        {t('actions.add', 'Add')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Feedback Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};
