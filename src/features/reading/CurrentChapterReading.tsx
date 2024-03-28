import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Popover from "@mui/material/Popover";
import { BookUserState } from "../../models/BookUserState";
import { Chapter } from "../../models/Chapter";
import { CurrentPageReading } from "./CurrentPageReading";

interface ChapterProps {
    chapter: Chapter;
    bookReadState: BookUserState;
}

export function CurrentChapterReading({chapter, bookReadState}: ChapterProps) {
    const [ currentPageNo, setCurrentPageNo ] = useState(bookReadState.pageNo);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number)  => {
        //dispatch(setCurrentPageNo(value));
        setCurrentPageNo(value);
    };

    useEffect(() => {
        setCurrentPageNo(bookReadState.pageNo);
    }, [bookReadState]);

    return(
        <Grid xs={12}>
            { 
                chapter.id.valueOf() <= bookReadState.chapterId ?
                <CurrentPageReading 
                    page={currentPageNo >= chapter.pages.length ?
                                        chapter.pages[chapter.pages.length - 1]
                                        : 
                                        chapter.pages[currentPageNo - 1]}
                    bookReadState={bookReadState}
                    />
                :
                <div></div>
                
            }
            
        
            <Grid xs={10} className="bookPaginator">
                <div >
                    <Pagination count={chapter.pages.length} 
                                siblingCount={chapter.pages.length}
                                page={bookReadState.pageNo} 
                                onChange={handlePageChange}/>
                </div>
            </Grid>
        </Grid>
    );
}