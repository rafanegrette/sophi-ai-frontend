import { Input } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { setLabel } from "../form-slice";
import { useAppDispatch } from "../../../../app/hooks";
import React from "react";

export function BookLabel() {
    const dispatch = useAppDispatch();
    const handleAddLabel = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(setLabel(e.target.value));
    return (
        <Grid2 container xs={12}>
        <Grid2 xs={4} sm={2} md={4} className="control-description">
            <p>Book Name:</p>
        </Grid2>
        <Grid2 xs={6} md={6} >
            <Input className="form-button" onChange={handleAddLabel}/>
        </Grid2>
        </Grid2>
    );
}