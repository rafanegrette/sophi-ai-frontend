import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { SyntheticEvent, useState } from "react";
import { useAppDispatch } from "../../../../app/hooks";
import { setParagraphSeparator } from "../form-slice";
export function SelectParagraph () {
    const dispatch = useAppDispatch();
    const [selectedIndex, setSelectedIndex] = useState("ONE");
    
    const handleListItemClick = (event: SyntheticEvent, index: string) => {
        setSelectedIndex(index);
        dispatch(setParagraphSeparator(index));
    }
    
    return (
        <Grid2 container xs={12}>
        <Grid2 xs={12} sm={2} md={4} className="control-description">
            <p>Select Paragraph Separator</p>
        </Grid2>
        <Grid2 xs={12} sm={8}>
            <div className="list-paragraph-separator">
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            selected={selectedIndex === "ONE"}
                            onClick={(event: SyntheticEvent) => handleListItemClick(event, "ONE")}>
                            <ListItemText primary="Single Jump Line"/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            selected={selectedIndex === "TWO"}
                            onClick={(event: SyntheticEvent) => handleListItemClick(event, "TWO")}>
                            <ListItemText primary="Double Jump Line"/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton 
                            selected={selectedIndex === "THREE"}
                            onClick={(event: SyntheticEvent) => handleListItemClick(event, "THREE")}>
                            <ListItemText primary="Triple Jump Line"/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </div>
        </Grid2>
    </Grid2>
    );
}