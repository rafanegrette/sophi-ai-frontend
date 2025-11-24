import { Grid, FormControlLabel, FormGroup, Switch } from "@mui/material";

export function SentenceSeparator() {
    return (
        <Grid container xs={12}>
            <Grid xs={12} md={10}>
                <p className="form-subheader">Sentence separation</p>
            </Grid>
            <Grid xs={12} sm={4} className="control-description">
                <p>Select characters that breaks sentences</p>
            </Grid>
            <Grid xs={12} sm={8}>
                <div className="form-switches">
                    <FormGroup>
                        <FormControlLabel control={<Switch defaultChecked />} label=". (Period)"/>
                        <FormControlLabel control={<Switch />} label=". (Period)"/>
                        <FormControlLabel control={<Switch />} label="; (Semicolon)"/>
                        <FormControlLabel control={<Switch />} label=": (Colon)"/>
                        <FormControlLabel control={<Switch />} label="? (Question mark)"/>
                    </FormGroup>
                </div>
            </Grid>
        </Grid>

    );
}