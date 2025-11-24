import { Grid } from "@mui/material";
import { Form } from "./form/Form";
import { Preview } from "./preview/Preview";

export function Upload() {

    return (
        <div>
            <Grid container spacing={3}>
                <Grid sm={12} md={5}>
                    <Form/>
                </Grid>
                <Grid sm={12} md={7}>
                    <Preview/>
                </Grid>
            </Grid>
        </div>
    );
}