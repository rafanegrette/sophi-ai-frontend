import { useState, useEffect } from "react";

import { BookUserState } from "../../models/BookUserState";
import { Page } from "../../models/Page";
import { CurrentParagraphReading } from "./CurrentParagraphReading";



interface PageProps {
    page: Page;
    bookReadState: BookUserState;
}

export function CurrentPageReading({page,  bookReadState} : PageProps) {


    return (
        <div>
            {
                page.number <= bookReadState.pageNo ?
                page.paragraphs.map((paragraph) => (
                    <CurrentParagraphReading
                        paragraph={paragraph}
                        pageNo={page.number}
                        bookReadState={bookReadState}
                        />
                ))
                :
                <div></div>
            }

            
        </div>
        
    
    );
}