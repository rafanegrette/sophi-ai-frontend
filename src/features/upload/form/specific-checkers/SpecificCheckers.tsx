import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { FormControlLabel, FormGroup, Switch, Checkbox } from "@mui/material";
import { setFixTitleHP1 } from "../form-slice";
import { useAppDispatch } from "../../../../app/hooks";
import { useState } from 'react';

export function SpecificCheckers () {
    const dispatch = useAppDispatch();

    const [checked, setChecked] = useState(false);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        dispatch(setFixTitleHP1(event.target.checked));
    };

    return (
        <Grid2 container xs={12}>
            <Grid2 xs={12} md={10}>
                <p className="form-subheader">Specific Checkers</p>
            </Grid2>
            <Grid2 xs={12} sm={8}>
                <div className="form-specific-checkers">
                    <FormGroup>
                        <FormControlLabel 
                            control={<Checkbox
                                        checked={checked}
                                        onChange={handleChange}/>} 
                            label="First Page Character Mess up"/>
                    </FormGroup>
                </div>
            </Grid2>
        </Grid2>
    )
}