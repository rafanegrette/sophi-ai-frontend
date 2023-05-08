import { Button, Input, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import  "./form.scss";
import { SelectFile } from "./select-file/SelectFile";
import { SelectParagraph } from "./select-paragraph/SelectParagraph";
import { SentenceSeparator } from "./sentence-separator/SentenceSeparator";
import { FileName } from "./file-name/FileName";
import { ActionButtons } from "./action-buttons/ActionButtons";

export function Form() {
    return (
        <div>
            <Grid2 container spacing={1}>
                <Grid2 xs={12} md={12}>
                    <Typography variant="h6" component="h4">
                        Upload Control
                    </Typography>
                </Grid2>

                <SelectFile/>
                <FileName/>
                <SelectParagraph/>
                <SentenceSeparator/>
                <ActionButtons/>
            </Grid2>
            
        </div>
    )
}