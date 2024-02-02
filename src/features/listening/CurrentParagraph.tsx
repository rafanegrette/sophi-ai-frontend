import { BookWriteState } from "../../models/BookWriteState";
import { Paragraph } from "../../models/Paragraph";
import { CurrentSentence } from "./CurrentSentence";

interface ParagraphProps {
    paragraph: Paragraph;
    pageNo: number;
    bookWriteState: BookWriteState;
}

export function CurrentParagraph({paragraph, pageNo, bookWriteState}: ParagraphProps) {
    return (
        <div className="paragraph">
            {
                paragraph.id <= bookWriteState.paragraphId || pageNo < bookWriteState.pageNo?
                paragraph.sentences.map(sentence => (
                    <CurrentSentence sentence={sentence} pageNo={pageNo} paragraphId={paragraph.id} bookWriteState={bookWriteState}/>
                ))
                :
                <div></div>
            }
            
        </div>
    );
}