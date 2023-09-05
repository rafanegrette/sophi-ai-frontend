import { useAppDispatch } from "../../app/hooks";
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFetchTitlesQuery } from "../reading/reading-api-slice";
import { useDeleteBookMutation } from "./delete/delete-book-api-slice";
import { useState } from 'react';

export function Contents() {
    const dispatch = useAppDispatch();
    const [ deleteBook ] = useDeleteBookMutation();
    const [ shouldUpdateBookList, setShouldUpdateBookList ] = useState(false);
    const { data: bookTitles = [], isFetching } = useFetchTitlesQuery(shouldUpdateBookList);
    
    const handleDelete = (bookId : string) => {
        deleteBook(bookId).then(() => {
            setShouldUpdateBookList(!shouldUpdateBookList);
        });
    };
    return (
        <div className="">
            <h3>Contents: </h3>
            <List>
                {
                    bookTitles.map((book) => (
                        <ListItem key = {book.id}
                            secondaryAction= {
                                <IconButton 
                                    edge="end" 
                                    aria-label="delete" 
                                    onClick={() => handleDelete (book.id)}>
                                    <DeleteIcon/>
                                </IconButton>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <AutoStoriesIcon/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                                primary={book.title} 
                                key = {book.id}
                                secondary={`${book.label}, id:{${book.id}}`}/>
                        </ListItem>
                    ))
                }
            </List>
        </div>
    );
}