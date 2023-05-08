import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export function SentenceSeparator() {
    return (
        <Grid2 container xs={12}>
            <Grid2 xs={12} md={10}>
                <p className="form-subheader">Sentence separation</p>
            </Grid2>
            <Grid2 xs={12} sm={4} className="control-description">
                <p>Select characters that breaks sentences</p>
            </Grid2>
            <Grid2 xs={12} sm={8}>
                <div className="form-switches">
                    <FormGroup>
                        <FormControlLabel control={<Switch defaultChecked />} label=". (Period)"/>
                        <FormControlLabel control={<Switch />} label=". (Period)"/>
                        <FormControlLabel control={<Switch />} label="; (Semicolon)"/>
                        <FormControlLabel control={<Switch />} label=": (Colon)"/>
                        <FormControlLabel control={<Switch />} label="? (Question mark)"/>
                    </FormGroup>
                </div>
            </Grid2>
        </Grid2>

    );
}