import { Input, Grid } from "@mui/material";
import { setLabel } from "../form-slice";
import { useAppDispatch } from "../../../../app/hooks";
import React from "react";

export function BookLabel() {
    const dispatch = useAppDispatch();
    const handleAddLabel = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(setLabel(e.target.value));
    return (
        <Grid container xs={12}>
        <Grid xs={4} sm={2} md={4} className="control-description">
            <p>Book Name:</p>
        </Grid>
        <Grid xs={6} md={6} >
            <Input className="form-button" onChange={handleAddLabel}/>
        </Grid>
        </Grid>
    );
}