import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";

import { useInvalidateSentenceAudioMutation } from './signedUrls/signed-urls-api-slice';

import { BookUserState } from "../../models/BookUserState";
import { Chapter } from "../../models/Chapter";
import { CurrentPageReading } from "./CurrentPageReading";

interface ChapterProps {
    chapter: Chapter;
    bookReadState: BookUserState;
    onChapterChange: () => void;
}

export function CurrentChapterReading({chapter, bookReadState, onChapterChange}: ChapterProps) {
    const [ currentPageNo, setCurrentPageNo ] = useState(bookReadState.pageNo);
    const [invalidateSentenceAudio] = useInvalidateSentenceAudioMutation();

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number)  => {
        //dispatch(setCurrentPageNo(value));
        setCurrentPageNo(value);
        invalidateSentenceAudio(bookReadState.bookId + "/" + bookReadState.chapterId + "/" + value + "/");
          
    };

    useEffect(() => {
        setCurrentPageNo(bookReadState.pageNo);
    }, [bookReadState]);

    

    // first load
    useEffect(() => {
        if (bookReadState === undefined || bookReadState.pageNo === undefined) {
            setCurrentPageNo(1);
         }
    }, [onChapterChange]);


    return(
        <Grid xs={12}>
            { 
                chapter.id.valueOf() <= bookReadState.chapterId ?
                <CurrentPageReading 
                    page={chapter.pages.find(page => page.number === currentPageNo) || {number : 0, paragraphs: []}}
                    chapterId={chapter.id}
                    bookReadState={bookReadState}
                    />
                :
                <div></div>
                
            }
            
        
            <Grid xs={10} className="bookPaginator">
                <div >
                    <Pagination count={chapter.pages.length} 
                                siblingCount={chapter.pages.length}
                                page={currentPageNo} 
                                onChange={handlePageChange}/>
                </div>
            </Grid>
        </Grid>
    );
}