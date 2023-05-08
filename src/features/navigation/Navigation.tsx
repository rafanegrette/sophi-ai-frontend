import { useState, MouseEvent, SyntheticEvent } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Menu, MenuItem, Tab, Tabs } from "@mui/material";
import Fade from '@mui/material/Fade';

import sophiAiLogo from '../../assets/sophi-ai-logo.svg';
import  "./Navigation.scss";
export function Navigation() {
    const [value, setValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    
    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    }

    return (
        <div className="container-frame">
            <div className="menu">
                <Tabs value={value} onChange={handleChangeTab}>
                        <img src={sophiAiLogo} className="logoSophi"></img>
                    <div className="right hide-on-med-and-down">
                        <Link to={"home"}>
                            <Tab label="Home"/> 
                        </Link>
                        <Tab label="Practice Listening"/>
                        <Link to={"books"}>
                            <Tab label="Practice Reading"/> 
                        </Link>
                        <Tab label="Content Management" onClick={handleClick}/>
                    </div>
                </Tabs>
                <Menu
                    id="contentManagementMenu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                >
                    <Link to="upload">
                        <MenuItem>Upload Content</MenuItem>
                    </Link>
                    <MenuItem>Admin Content</MenuItem>
                </Menu>
            </div>
            <div id="content">
                <Outlet/>
            </div>
        </div>
    );
}