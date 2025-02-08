import { CreateNews, CreateNews$, Language } from '@competition-manager/schemas';
import { Button, Dialog, DialogContent, DialogTitle, MenuItem, Select, Stack, TextField } from '@mui/material'
import React from 'react'
import { WysiwygEditor } from '../../../Components';
import { useMutation } from 'react-query';
import { createNews } from '../../../api';
import { useSnackbar } from '../../../hooks/useSnackbar';


type PopupProps = {
    open: boolean;
    onClose: () => void;
}

export const Popup: React.FC<PopupProps> = ({ open, onClose }) => {

    const { showSnackbar } = useSnackbar();

    const [news, setNews] = React.useState<CreateNews>(CreateNews$.parse({
        slug: '',
        title: '',
        content: '',
        language: Language.EN,
    }));

    const mutation = useMutation('createNews', () => createNews(news), {
        onSuccess: () => {
            onClose();
        },
        onError: () => {
            showSnackbar('Error creating news', 'error');
        }
    });

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>
                Add News
            </DialogTitle>
            <DialogContent>
                <Stack 
                    sx={{ padding: 2 }}
                    spacing={2} 
                    component="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        mutation.mutate();
                    }}
                >
                    <TextField
                        label="Slug"
                        value={news.slug}
                        onChange={(e) => setNews({ ...news, slug: e.target.value })}
                    />
                    <TextField
                        label="Title"
                        value={news.title}
                        onChange={(e) => setNews({ ...news, title: e.target.value })}
                    />
                    <WysiwygEditor
                        value={news.content}
                        onChange={(content) => setNews({ ...news, content })}
                    />
                    <Select
                        value={news.language}
                        onChange={(e) => setNews({ ...news, language: e.target.value as Language })}
                    >
                        <MenuItem value={Language.FR}>{Language.FR.toUpperCase()}</MenuItem>
                        <MenuItem value={Language.EN}>{Language.EN.toUpperCase()}</MenuItem>
                        <MenuItem value={Language.NL}>{Language.NL.toUpperCase()}</MenuItem>
                    </Select>

                    <Button
                        variant='contained'
                        color='primary'
                        type='submit'
                    >
                        Add
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}
