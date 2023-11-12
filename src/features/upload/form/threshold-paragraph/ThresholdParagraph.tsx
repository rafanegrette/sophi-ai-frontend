import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Slider } from "@mui/material";
import { useState } from "react";
import { useAppDispatch } from "../../../../app/hooks";
import { setParagraphThreshold } from "../form-slice";

function thresholdUnid (value: number) {
    return `${value} h`;
}

const thresholdMarks = [
    {
        value: 200,
        label: '200 h'
    },
    {
        value: 240,
        label: '240 h'
    },
    {
        value: 300,
        label: '300 h'
    },
    {
        value: 360,
        label: '360 f'
    }
];

export function ThresholdParagraph() {
    const defaultValue = 240;
    const dispatch = useAppDispatch();
    const [value, setValue] = useState<number>(defaultValue);
    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
        dispatch(setParagraphThreshold(newValue as number));
    }


    return (
        <Grid2 container xs={12}>
            <Grid2 xs={12} sm={2} md={4} className="control-description">
                <p>Threshold space between paragraph</p>
            </Grid2>
            <Grid2 xs={8} sm={4} md={6}>
                <Slider
                    aria-label="Always visible"
                    defaultValue={defaultValue}
                    getAriaValueText={thresholdUnid}
                    step={20}
                    marks={thresholdMarks}
                    valueLabelDisplay="on"
                    onChange={handleChange}
                    value={value}
                    min={200}
                    max={360}
                />
            </Grid2>
        </Grid2>
    );
}