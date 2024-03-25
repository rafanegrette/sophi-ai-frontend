import { useState } from "react";
import { BookUserState } from "../../models/BookUserState";
import { Paragraph } from "../../models/Paragraph";
import { CurrentSentenceReading } from "./CurrentSentenceReading";

interface ParagraphProps {
    paragraph: Paragraph;
    pageNo: number;
    bookReadState: BookUserState;
}

export function CurrentParagraphReading({paragraph, pageNo, bookReadState}: ParagraphProps) {
    const [ selectedSentence, setSelectedSentence ] = useState<number>();
    const handleSelectSentence = (id: number) => {
        setSelectedSentence(id);
    }
    return (
        <div key={paragraph.id} className="paragraph">
            {
                paragraph.id <= bookReadState.paragraphId || pageNo < bookReadState.pageNo ?
                paragraph.sentences.map((sentence) => (
                    <CurrentSentenceReading 
                        sentence={sentence}
                        pageNo={pageNo}
                        paragraphId={paragraph.id}
                        bookReadState={bookReadState}
                        isSelected={selectedSentence === sentence.id}
                        onSelect={() => handleSelectSentence(sentence.id)}/>
                ))
                :
                <div></div>
            }
        </div>
    );
}