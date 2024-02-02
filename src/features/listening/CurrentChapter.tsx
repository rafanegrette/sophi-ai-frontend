import { useState } from "react";
import { Pagination } from "@mui/material";
import { Chapter } from "../../models/Chapter";
import { CurrentPage } from "./CurrentPage";
import { BookWriteState } from "../../models/BookWriteState";

interface ChapterProps {
    chapter: Chapter;
    bookWriteState: BookWriteState;
}
export function CurrentChapter({chapter, bookWriteState}: ChapterProps) {
    const [ currentPage, setCurrentPage ] = useState(0);
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value - 1);
    }
    return (
        <div className="chapter-container">
            <div className="page-content">
                {
                    chapter.id.valueOf() <= bookWriteState.chapterId ? 
                    <CurrentPage page={chapter.pages[currentPage]} bookWriteState={bookWriteState}/> :
                    <div></div>
                }
                
            </div>
            
            <div className="page-pagination">
                <Pagination count={chapter.pages.length} 
                            siblingCount={chapter.pages.length}
                            page={currentPage} 
                            onChange={handlePageChange}/>
            </div>

        </div>
    );
}