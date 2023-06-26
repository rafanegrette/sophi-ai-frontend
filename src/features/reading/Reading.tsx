import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setChapterNo, setPageNo } from './state-book-slice';
import { List, ListItemButton, ListItemText, Pagination, Popover, TextField } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useState, useEffect } from 'react';
import { Book } from "../../models/Book";
import { useParams  } from 'react-router-dom';
import { useFetchBookQuery } from '../reading/reading-api-slice';
import VolumeUpTwoToneIcon from '@mui/icons-material/VolumeUpTwoTone';
import KeyboardVoiceTwoToneIcon from '@mui/icons-material/KeyboardVoiceTwoTone';

import bookDummyData from './harry-1.json';
import './Reading.scss';

const style = {
    width: '100%',
    maxWidth: 100,
    bgcolor: 'background.black'
};

const initialState: Book =  bookDummyData;

export function Reading() {

    const dispatch = useAppDispatch();
    const { bookId = "-"} = useParams();
    const [ skip, setSkip] = useState(true);
    const [ textSelected, setTextSelected] = useState("");
    const [ popOverAnchorEl, setPopOverAnchorEl] = useState<HTMLSpanElement | null>(null);
    const { data = initialState, isFetching} = useFetchBookQuery(bookId, {skip});
    const book: Book =  data;
    const stateBook = useAppSelector((state) => state.stateBook);

    const handleSelectChapterClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number
    )=> {
        if (index < book.chapters.length) {
            dispatch(setChapterNo(index));
            dispatch(setPageNo(1));
        }
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number)  => {
        dispatch(setPageNo(value));
    };

    useEffect(() => {
        if (bookId !== "-") {
            setSkip(false);
        }
    }, [bookId]);

    /*const handleClickSentence = (event: React.MouseEvent<HTMLSpanElement>) => {
        setPopOverAnchorEl(event.currentTarget);
        setTextSelected(event.currentTarget.innerText);
    }*/

    const handleClickSentence = (event: React.MouseEvent<HTMLSpanElement>, text: string) => {
        console.log(text);
        setPopOverAnchorEl(event.currentTarget);
        setTextSelected(text);
    }

    const popOverHandleClose = () => {
        setPopOverAnchorEl(null);
    }

    const popOverIsOpen = Boolean(popOverAnchorEl);

    const playSelectedSentence = (pathSentence: string) => {
        /*let audio = new Audio();
        audio.src = "https://sophi-books.s3.amazonaws.com/Harry-1/1/2/1/0?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230626T210213Z&X-Amz-SignedHeaders=host&X-Amz-Expires=14400&X-Amz-Credential=AKIA3MMJWPEOEZZ22OX4%2F20230626%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=e551bc9628e2312f6e7c70727d17815c0d21829ae11a9789e3890875859303ef";
        audio.load();
        audio.play();*/
    }

    return (
        <div className="ebook">
            <h5></h5>
            <Grid2 xs={12} md={12}>
                    <div >
                        <div >
                            <Grid2 container spacing={2}>
                                <Grid2 xs={12}>
                                    <div className="bookTitle">
                                        {book.title} {textSelected}
                                    </div>
                                </Grid2>
                                <Grid2 xs={2}>
                                    <List sx={style} component="nav" aria-label="book indexes">
                                        { 
                                            book.contentTable.map((indexContent) => (
                                                <ListItemButton 
                                                    selected = {stateBook.currentChapterNo === indexContent.index}
                                                    key={indexContent.index} 
                                                    sx={{padding:0.4}} 
                                                    onClick = {(event) => handleSelectChapterClick(event, indexContent.index)}
                                                    divider>
                                                    
                                                    <ListItemText primaryTypographyProps={{fontSize: 8}} primary={indexContent.title}/>
                                                </ListItemButton>
                                            ))
                                        }
                                    </List>
                                </Grid2>
                                <Grid2 xs={10}>
                                    
                                    <Grid2 xs={12}>
                                        { 
                                            book.chapters[stateBook.currentChapterNo].pages[stateBook.currentPageNo -1].paragraphs.map((paragraph) => (
                                                <div key={paragraph.id} className="paragraph">
                                                    {
                                                        paragraph.sentences.map((sentence) => (
                                                            <div className="borderSentence">
                                                                <span key={sentence.id} 
                                                                    className={ sentence.text.trim().replace(/\n/g, '') === textSelected.trim().replace(/\n/g, '') ? "selected-sentence" : "sentence"}
                                                                    onClick={(event: React.MouseEvent<HTMLSpanElement>) => handleClickSentence(event, stateBook.currentChapterNo + '/' + stateBook.currentPageNo + '/')}>
                                                                    {sentence.text}&nbsp;
                                                                </span>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            ))
                                        }
                                        
                                        <Popover
                                            id="page-popover"
                                            open={popOverIsOpen}
                                            anchorEl={popOverAnchorEl}
                                            onClose={popOverHandleClose}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'center'
                                            }}
                                            transformOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'center'
                                            }}
                                        >
                                            <div className="reading-control-panel" style={{
                                                padding: '20px'
                                            }}>
                                                <div className="reading-control-panel-speaker">
                                                    <a className="reading-control-panel-speaker-link" onClick={() => playSelectedSentence("hello")}>
                                                        <VolumeUpTwoToneIcon/>
                                                    </a>
                                                </div>
                                                <div className="reading-control-panel-mic">
                                                    <a href="" className="">
                                                        <KeyboardVoiceTwoToneIcon/>
                                                    </a>
                                                    {textSelected}
                                                </div>
                                            </div>
                                        </Popover>
                                    </Grid2>
                                </Grid2>
                                <Grid2 xs={2}>
                                </Grid2>
                                <Grid2 xs={10} className="bookPaginator">
                                    <div >
                                        <Pagination count={book.chapters[stateBook.currentChapterNo].pages.length} page={stateBook.currentPageNo} onChange={handlePageChange}/>
                                    </div>
                                </Grid2>
                            </Grid2>
                        </div>
                    </div>
                </Grid2>
        </div>
    );
}