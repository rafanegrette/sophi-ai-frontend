import { Button, Grid, Input, Typography } from "@mui/material";
import  "./form.scss";
import { SelectFile } from "./select-file/SelectFile";
import { SelectParagraph } from "./select-paragraph/SelectParagraph";
import { SentenceSeparator } from "./sentence-separator/SentenceSeparator";
import { BookLabel } from "./book-label/BookLabel";
import { ActionButtons } from "./action-buttons/ActionButtons";
import { SpecificCheckers } from "./specific-checkers/SpecificCheckers";
import { ThresholdParagraph } from "./threshold-paragraph/ThresholdParagraph";

export function Form() {
    return (
        <div className="upload-form">
            <Grid container spacing={1}>
                <Grid xs={12} md={12}>
                    <Typography variant="h6" component="h4">
                        Upload Control
                    </Typography>
                </Grid>

                <SelectFile/>
                <BookLabel/>
                
                <SelectParagraph/>
                <ThresholdParagraph/>

                <SpecificCheckers/>
                <ActionButtons/>
            </Grid>
            
        </div>
    )
}