import { Button } from "@mui/material";
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
    const [ uploadPreview, book ] = useUploadPreviewMutation();
    const [ saveBook ] = useSaveBookMutation();


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

    useEffect(() => {
        if(form.file.size === 2) {
            setPreviewDisabled(true);
        } else {
            setPreviewDisabled(false);
        }
    }, [form.file]);

    return (
        <Grid2 container xs={12}>
            <Grid2 xs={12} md={12}>
                <p className="form-subheader"> - </p>
            </Grid2>
            <Grid2 xs={12} md={12} >
                <Button
                    disabled = {currentBook.title === ''}
                    size="large"
                    variant="contained" 
                    component="label"
                    onClick={handleSave}>
                    Save
                </Button>
                <Button
                    disabled = {previewDisabled}
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