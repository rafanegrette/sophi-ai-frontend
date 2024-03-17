import { useState, useEffect } from "react";
import { Pagination } from "@mui/material";
import { Chapter } from "../../models/Chapter";
import { CurrentPage } from "./CurrentPage";
import { BookWriteState } from "../../models/BookWriteState";
import "./CurrentChapter.scss";

interface ChapterProps {
    chapter: Chapter;
    bookWriteState: BookWriteState;
}
export function CurrentChapter({chapter, bookWriteState}: ChapterProps) {
    const [ currentPageNo, setCurrentPageNo ] = useState(1);
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPageNo(value);
    }

    useEffect(() => {
        console.log("bookwritestate: " + bookWriteState.pageNo);
        if (bookWriteState.pageNo == 0)
            setCurrentPageNo(bookWriteState.pageNo + 1 );
        else 
            setCurrentPageNo(bookWriteState.pageNo);
    },[bookWriteState])

    return (
        <div className="chapter-container">

            <div className="page-content">
                {
                    chapter.id.valueOf() <= bookWriteState.chapterId ? 
                    <CurrentPage 
                        page={currentPageNo >= chapter.pages.length ? 
                                            chapter.pages[chapter.pages.length - 1]
                                            : chapter.pages[currentPageNo - 1]
                                            } 
                        bookWriteState={bookWriteState}/> :
                    <div></div>
                }
            </div>
            <div className="page-pagination">
                <Pagination count={chapter.pages.length} 
                            siblingCount={chapter.pages.length}
                            page={currentPageNo} 
                            onChange={handlePageChange}/>
            </div>

        </div>
    );
}