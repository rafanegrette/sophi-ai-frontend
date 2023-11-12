import { Button, Input, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
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
            <Grid2 container spacing={1}>
                <Grid2 xs={12} md={12}>
                    <Typography variant="h6" component="h4">
                        Upload Control
                    </Typography>
                </Grid2>

                <SelectFile/>
                <BookLabel/>
                
                <SelectParagraph/>
                <ThresholdParagraph/>

                <SpecificCheckers/>
                <ActionButtons/>
            </Grid2>
            
        </div>
    )
}