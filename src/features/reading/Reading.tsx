import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setChapterNo, setPageNo } from './state-book-slice';
import { List, ListItemButton, ListItemText } from "@mui/material";

import Grid from "@mui/material/Grid";
import { useState, useEffect } from 'react';
import { Book } from "../../models/Book";
import { useParams  } from 'react-router-dom';
import { useFetchBookQuery } from '../reading/reading-api-slice';

import { useFetchBookStateQuery } from './pronunciation-api-slice';

import bookDummyData from './harry-1.json';
import './Reading.scss';
import { BookUserState } from '../../models/BookUserState';
import { CurrentChapterReading } from './CurrentChapterReading';
import { ContentIndex } from '../../models/ContentIndex';

const style = {
    width: '100%',
    maxWidth: 100,
    bgcolor: 'background.black'
};

const initialState: Book =  bookDummyData;
const initialBookState: BookUserState = {
    "bookId": '',
    "chapterId": 0,
    "pageNo": 0,
    "paragraphId": 0,
    "sentenceId": 0,
    "finished": false
  };

export function Reading() {

    const dispatch = useAppDispatch();
    const [currentChapter, setCurrentChapter] = useState(0);
    const [currentPageNo, setCurrentPageNo] = useState(1);
    const { bookId = "-"} = useParams();
    const [ skip, setSkip] = useState(true);
    
    
    const {data: currentBookState = initialBookState} = useFetchBookStateQuery(bookId, {skip});
    
    
    const { data: book = initialState, 
                isFetching: isFetchingBook, 
                isUninitialized: isUninitializedBook, 
                isSuccess: isSuccessFetchingBook } = useFetchBookQuery(bookId, {skip});
    

    const handleSelectChapterClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        contentIndex: ContentIndex
    )=> {
        setCurrentChapter(contentIndex.index);
        onChapterChange();
    };

    const onChapterChange = () => {};

    useEffect(() => {
        if (bookId !== "-") {
            setSkip(false);
        }
    }, [bookId]);


    useEffect(() => {
        var currentChapterId = book.chapters.findIndex(c => c.id === currentBookState.chapterId);
        setCurrentChapter(currentChapterId);
    }, [isSuccessFetchingBook]);

    return (
        <div className="ebook">
            <h5></h5>
            <Grid xs={12} md={12}>
                    <div >
                        <div >
                            <Grid container spacing={2}>
                                <Grid xs={12}>
                                    <div className="bookTitle">
                                        {book.title}
                                    </div>
                                </Grid>
                                <Grid xs={2}>
                                    <List sx={style} component="nav" aria-label="book indexes">
                                        { 
                                            book.contentTable.map((indexContent) => (
                                                <ListItemButton 
                                                    selected = {currentChapter === indexContent.index}
                                                    key={indexContent.index} 
                                                    sx={{padding:0.4}} 
                                                    onClick = {(event) => handleSelectChapterClick(event, indexContent)}
                                                    divider>
                                                    
                                                    <ListItemText primaryTypographyProps={{fontSize: 8}} primary={indexContent.title}/>
                                                </ListItemButton>
                                            ))
                                        }
                                    </List>
                                </Grid>
                                <Grid xs={10}>
                                    <CurrentChapterReading  chapter={book.chapters[currentChapter]} 
                                                            bookReadState={currentBookState}
                                                            onChapterChange={onChapterChange}/>
                                    
                                </Grid>
                                <Grid xs={2}>
                                </Grid>

                            </Grid>
                        </div>
                    </div>
                </Grid>
        </div>
    );
}