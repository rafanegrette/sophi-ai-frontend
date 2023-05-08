import { List, ListItemButton, ListItemText, Pagination } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useState, useEffect } from 'react';
import { Book } from "../../models/Book";
import { useParams  } from 'react-router-dom';
import { useFetchBookQuery } from '../reading/reading-api-slice';
const style = {
    width: '100%',
    maxWidth: 100,
    bgcolor: 'background.paper'
};

const initialState: Book = {
    title: 'Placeholder Title',
    contentTable: [
        {
            index: 0,
            title: 'Chapter placeholder'
        }
    ],
    chapters: [
        {
            title: 'Chapter holder',
            pages: [
                {
                    number: 0,
                    paragraphs:[
                        {
                            id: 0,
                            sentences:[
                                {
                                    id: 0,
                                    text: ""
                                }
                            ]
                        }
                    ]
                }
                
            ]
        }
    ]
}
export function Reading() {
    const {bookId = "-"} = useParams();
    const [ skip, setSkip] = useState(true);
    const { data = initialState, isFetching} = useFetchBookQuery(bookId, {skip});
    const book: Book =  data;


    const handleSelectChapterClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number
    )=> {

    };

    const handlePageChange = ()  => {

    };

    useEffect(() => {
        if (bookId !== "-") {
            setSkip(false);
        }
    }, [bookId]);


    return (
        <div className="reading-framework">
            <h2>Welcome to reading</h2>
            <Grid2 xs={12} md={12}>
                    <div className="previewBackground">
                        <div className="previewBook">
                            <Grid2 container spacing={2}>
                                <Grid2 xs={12}>
                                    <div className="bookTitle">
                                        {bookId}
                                    </div>
                                    
                                </Grid2>
                                <Grid2 xs={2}>
                                    <List sx={style} component="nav" aria-label="book indexes">
                                        { 
                                            book.contentTable.map((indexContent) => (
                                                <ListItemButton 
                                                    selected = {0 === indexContent.index}
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
                                <Grid2 xs={10} className="currentPage">
                                    
                                    <Grid2 xs={12}>
                                        { 
                                            book.chapters[0].pages[0].paragraphs.map((paragraph) => (
                                                <div className="paragraph" key={paragraph.id}>
                                                    {
                                                        paragraph.sentences.map((sentence) => (
                                                            <div className="borderSentence">
                                                                <span className="sentence" key={sentence.id}>
                                                                    {sentence.text}&nbsp;
                                                                </span>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            ))
                                        }
                                        
                                    </Grid2>

                                </Grid2>
                                <Grid2 xs={2}>
                                </Grid2>
                                <Grid2 xs={10} className="bookPaginator">
                                    <div >
                                        <Pagination count={book.chapters[0].pages.length} page={0} onChange={handlePageChange}/>
                                    </div>
                                </Grid2>
                            </Grid2>
                        </div>
                    </div>
                </Grid2>
        </div>
    );
}