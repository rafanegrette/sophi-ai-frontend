import { useState, MouseEvent, SyntheticEvent } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Menu, MenuItem, Tab, Tabs } from "@mui/material";
import Fade from '@mui/material/Fade';

import sophiAiLogo from '../../assets/sophi-ai-logo.svg';
import  "./Navigation.scss";
import { useFetchUserQuery } from '../user/user-api-slice';

export function Navigation() {
    const { data: user, isFetching} = useFetchUserQuery();
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
                <img src={sophiAiLogo} className="logoSophi"></img>
                { !!user && 
                    <Tabs value={value} onChange={handleChangeTab}>
                        
                        <Tab label="Home" component={Link} to="/home"/>                         
                        <Tab label="Practice Listening" />
                        <Tab label="Practice Reading" component={Link} to={"books"}/> 
                        <Tab label="Chat GPT" component={Link} to={"chatgpt"}/>
                        <Tab label="Content Management" onClick={handleClick}/>
                    </Tabs>
                }
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
                    <Link to={"contentadmin"}>
                        <MenuItem>Admin Content</MenuItem>
                    </Link>
                </Menu>
                <Tabs value="false">
                    <div className="right hide-on-med-and-down">
                        <Link hidden = {!!user} to={`${import.meta.env.VITE_BACKEND_HOST}/api/login`}>
                            <Tab label="Log-in"/>
                        </Link>                        
                        <Link hidden= {!user} to={`${import.meta.env.VITE_BACKEND_HOST}/api/logout`}>
                            Welcome {user?.name}
                            <Tab label="log-out"/> 
                        </Link>
                    </div>
                </Tabs>
            </div>
            <div id="content">
                <Outlet/>
            </div>
        </div>
    );
}