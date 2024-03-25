import { useState } from "react";
import { BookUserState } from "../../models/BookUserState";
import { Paragraph } from "../../models/Paragraph";
import { CurrentSentenceReading } from "./CurrentSentenceReading";

interface ParagraphProps {
    paragraph: Paragraph;
    pageNo: number;
    bookReadState: BookUserState;
    isParagraphSelected: boolean;
    onParagraphSelect: ()=> void;
}

export function CurrentParagraphReading({paragraph, pageNo, bookReadState, isParagraphSelected, onParagraphSelect}: ParagraphProps) {
    const [ selectedSentenceId, setSelectedSentenceId ] = useState<number>();
    
    const handleSelectSentence = (sentenceId: number) => {
        setSelectedSentenceId(sentenceId);
        onParagraphSelect();
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
                        isSelected={selectedSentenceId === sentence.id && isParagraphSelected}
                        onSelect={() => handleSelectSentence(sentence.id)}/>
                ))
                :
                <div></div>
            }
        </div>
    );
}