import { useState, useEffect } from "react";

import { BookUserState } from "../../models/BookUserState";
import { Page } from "../../models/Page";
import { CurrentParagraphReading } from "./CurrentParagraphReading";



interface PageProps {
    page: Page;
    bookReadState: BookUserState;
    chapterId: number
}

export function CurrentPageReading({page,  bookReadState, chapterId} : PageProps) {
    const [ selectedParagraphId, setSelectedParagraphId ] = useState<number>();
    const handleSelectParagraph = ( pararaphId: number) => {
        setSelectedParagraphId(pararaphId);
    }
    return (
        <div>
            {
                page !== undefined && (page.number <= bookReadState.pageNo || chapterId < bookReadState.chapterId) ?
                page.paragraphs.map((paragraph) => (
                    <CurrentParagraphReading
                        paragraph={paragraph}
                        pageNo={page.number}
                        bookReadState={bookReadState}
                        chapterId={chapterId}
                        isParagraphSelected={selectedParagraphId === paragraph.id}
                        onParagraphSelect={() => handleSelectParagraph(paragraph.id)}
                        />
                ))
                :
                <div></div>
            }

            {
                page !== undefined && page.number < bookReadState.pageNo || bookReadState.finished?
                <div className="book-finished-ok"></div>
                :
                <div></div>
            }
        </div>
        
    
    );
}