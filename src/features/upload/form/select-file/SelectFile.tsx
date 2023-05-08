import { Button } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { ChangeEvent, useState } from "react";
import { attach } from "../form-slice";
import { useAppDispatch } from "../../../../app/hooks";
export function SelectFile() {
    const dispatch = useAppDispatch();
    const [file, setFile] = useState<File>();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            let reader = new FileReader();
            
            reader.onload = function () {
                if (reader.result) {
                    let body = reader.result.toString();
                    dispatch(attach(body.split(',')[1]));
                }
            }

            reader.readAsDataURL(e.target.files[0]);
            
        }
    }

    return (
        <Grid2 container xs={12}>
        <Grid2 xs={12} md={12}>
            <p className="form-subheader">Upload Your PDF Content</p>
        </Grid2>
        <Grid2 xs={12} sm={2} md={4} className="control-description">
            <p>Select your PDF</p>
        </Grid2>
        <Grid2 container>
            <Grid2>
                <Button
                    variant="outlined" 
                    component="label">
                    Choose File
                    <input 
                        onChange={handleFileChange}
                        accept="application/pdf"
                        type="file"
                        hidden
                    />
                </Button>
            </Grid2>
            <Grid2>
                <div>
                    {
                        file && `${file.name} - ${file.type}`
                    }
                </div>
            </Grid2>
        </Grid2>
    </Grid2>
    );
}