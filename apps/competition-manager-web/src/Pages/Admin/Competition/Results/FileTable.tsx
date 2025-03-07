import { Collapse, Table, TableContainer, TableBody, TableCell, TableHead, TableRow, Box, IconButton, Paper, Typography } from "@mui/material";
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { BaseIcon } from "../../../../Components/Icons";
import React from "react";
import { CreateResult } from "@competition-manager/schemas";
import { useTranslation } from "react-i18next";


function Row(props: { row: CreateResult }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    const { t } = useTranslation();
  
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <BaseIcon icon={faChevronUp}/> : <BaseIcon icon={faChevronDown}/>}
                </IconButton>
                </TableCell>
                <TableCell align="center">
                    {row.finalOrder}
                </TableCell>
                <TableCell align="center">
                    {row.bib}
                </TableCell>
                <TableCell align="center">
                    {row.athleteLicense}
                </TableCell>
                <TableCell align="center">
                    {row.initialOrder}
                </TableCell>
                <TableCell align="center">
                    {row.heat}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Details
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                <TableRow>
                                    <TableCell>{t('result:try')}</TableCell>
                                    <TableCell>{t('result:result')}</TableCell>
                                    <TableCell>{t('result:wind')}</TableCell>
                                    <TableCell>{t('result:attempts')}</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {row.details.map((resultDetail) => (
                                    <TableRow key={resultDetail.tryNumber}>
                                        <TableCell component="th" scope="row">
                                            {resultDetail.tryNumber}
                                        </TableCell>
                                        <TableCell>
                                            {resultDetail.value}
                                        </TableCell>
                                        <TableCell>
                                            {resultDetail.wind}
                                        </TableCell>
                                        <TableCell>
                                            {resultDetail.attempts}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
    }
type FileTableProps = {
    rows: CreateResult[]
}

export const FileTable: React.FC<FileTableProps> = ({
    rows
}) => {
    const { t } = useTranslation();
    return (
        <Box>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell align="center">{t('glossary:place')}</TableCell>
                            <TableCell align="center">{t('glossary:bib')}</TableCell>
                            <TableCell align="center">{t('result:license')}</TableCell>
                            <TableCell align="center">{t('result:initialOrder')}</TableCell>
                            <TableCell align="center">{t('result:heat')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <Row key={row.athleteLicense} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}













