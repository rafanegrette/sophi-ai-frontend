import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import BookIcon from '@mui/icons-material/Book';
import { Link } from 'react-router-dom';
import { useFetchTitlesQuery } from "../reading/reading-api-slice";

import "./ListeningList.scss"

export function ListeningList() {

    const { data = [], isFetching } = useFetchTitlesQuery(true);

    return (
        <div className="titles-framework">
            <p>Here you will clic in the speaker icon listening, and writting what you hear in the input.  </p>
            <h3>List of books</h3>
            <br/>
             <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                <List>
                    {
                        data.map((title) => (
                            <ListItem key={title.id}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <BookIcon/>
                                    </Avatar>
                                </ListItemAvatar>
                                <Link to={"../listening/" + title.id} key={title.id}>
                                    <ListItemText 
                                        primary={title.title} 
                                        key={title.id}
                                        secondary={title.label}/>
                                </Link>
                            </ListItem>
                        ))
                    }
                </List>
            </Box> 

        </div>
    );
}