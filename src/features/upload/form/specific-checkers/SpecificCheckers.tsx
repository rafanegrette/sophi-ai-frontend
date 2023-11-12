import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { FormControlLabel, FormGroup, Switch, Checkbox } from "@mui/material";
import { setFixTitleHP1, setAddExtraFormat } from "../form-slice";
import { useAppDispatch } from "../../../../app/hooks";
import { useState } from 'react';

export function SpecificCheckers () {
    const dispatch = useAppDispatch();

    const [checkedFixHP1, setCheckedFixHP1] = useState(false);
    const [checkedAddExtra, setCheckedAddExtra] = useState(false);
    
    const handleChangeFixHP1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckedFixHP1(event.target.checked);
        dispatch(setFixTitleHP1(event.target.checked));
    };

    const handleChangeAddExtra = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckedAddExtra(event.target.checked);
        dispatch(setAddExtraFormat(event.target.checked));
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
                                        checked={checkedFixHP1}
                                        onChange={handleChangeFixHP1}/>} 
                            label="First Page Character Mess up"/>
                                                <FormControlLabel 
                            control={<Checkbox
                                        checked={checkedAddExtra}
                                        onChange={handleChangeAddExtra}/>} 
                            label="Add extra characters(jumplines, tabs ..etc.,)"/>
                    </FormGroup>
                </div>
            </Grid2>
        </Grid2>
    )
}