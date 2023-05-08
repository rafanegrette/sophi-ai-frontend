import { Grid } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Form } from "./form/Form";
import { Preview } from "./preview/Preview";

export function Upload() {

    return (
        <div>
            <Grid2 container spacing={3}>
                <Grid2 sm={12} md={5}>
                    <Form/>
                </Grid2>
                <Grid2 sm={12} md={7}>
                    <Preview/>
                </Grid2>
            </Grid2>
        </div>
    );
}