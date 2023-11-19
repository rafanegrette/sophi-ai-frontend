import { Alert, AlertTitle, Backdrop, Button, CircularProgress, Snackbar } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { useUploadPreviewMutation, useSaveBookMutation } from '../form-api-slice';
import { resetForm } from '../form-slice';
import { resetPreview } from '../../../previewBook/state-preview-book-slice';
import { load, resetState } from '../../../previewBook/preview-book-slice';
import { useEffect, useState } from "react";

export function ActionButtons() {
    const dispatch = useAppDispatch();
    
    const form = useAppSelector((state) => state.form);
    const currentBook = useAppSelector((state) => state.previewBook);
    const [previewDisabled, setPreviewDisabled ] = useState(true);
    const [ uploadPreview, { isLoading: isLoadingPreview } ] = useUploadPreviewMutation();
    const [ saveBook, {isLoading, isSuccess} ] = useSaveBookMutation();
    const [successMessage, setSuccessMessage] = useState(false);

    const handlePreview = () => {
        uploadPreview(form).unwrap().then(book => {
            dispatch(load(book));
        });
    }

    const handleSave = () => {
        saveBook(currentBook)
            .then(() => dispatch(resetPreview()))
            .then(() => dispatch(resetState()))
            .then(() => dispatch(resetForm()));
    };

    const handleCloseProcessing = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
    }

    const handleCloseSave = (event?: React.SyntheticEvent | Event, reason?: string) => {
        handleCloseProcessing(event, reason);
        setSuccessMessage(false);
    }

    useEffect(() => {
        if(form.file.size === 2) {
            setPreviewDisabled(true);
        } else {
            setPreviewDisabled(false);
        }
        setSuccessMessage(isSuccess);
    }, [form.file, isSuccess]);

    return (
        <Grid2 container xs={12}>
            <Snackbar open={isLoading} autoHideDuration={6000} onClose={(handleCloseProcessing)}>
                <Alert onClose={handleCloseProcessing} severity="info" sx={{ width: '100%' }}>
                    The book was send to process, review the Reading list
                </Alert>
            </Snackbar>
            <Snackbar open={successMessage} autoHideDuration={6000} onClose={handleCloseSave}>
                <Alert onClose={handleCloseSave} severity="success" sx={{ width: '100%' }}>
                    The book was saved successfully
                </Alert>
            </Snackbar>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoadingPreview}
                >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid2 xs={12} md={12}>
                <p className="form-subheader"> - </p>
            </Grid2>
            <Grid2 xs={12} md={12} >
                <Button
                    disabled = {currentBook.title === '' && !isLoading}
                    size="large"
                    variant="contained" 
                    component="label"
                    onClick={handleSave}>
                    Save
                </Button>
                <Button
                    disabled = {previewDisabled && !isLoading}
                    size="large"
                    variant="contained" 
                    component="label"
                    onClick={handlePreview}>
                    Preview
                </Button>
            </Grid2>
        </Grid2>
    );
}