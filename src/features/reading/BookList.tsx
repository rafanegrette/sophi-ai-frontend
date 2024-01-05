import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import BookIcon from '@mui/icons-material/Book';
import { Link } from 'react-router-dom';
import { useFetchTitlesQuery } from "./reading-api-slice";

import "./BookList.scss"

export function BookList() {

    const { data = [], isFetching } = useFetchTitlesQuery(true);

    return (
        <div className="titles-framework">
            <p>Here you will practice pronunciation selecting a phrase of your reading clic the mic icon and read, clic the stop icon when you finish a neural translation service will be use to compare your reading against the text</p>
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
                                <Link to={"../books/" + title.id} key={title.id}>
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