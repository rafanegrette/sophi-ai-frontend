import { useState } from "react";
import { BookUserState } from "../../models/BookUserState";
import { Paragraph } from "../../models/Paragraph";
import { CurrentSentenceReading } from "./CurrentSentenceReading";

interface ParagraphProps {
    paragraph: Paragraph;
    pageNo: number;
    chapterId: number;
    bookReadState: BookUserState;
    isParagraphSelected: boolean;
    onParagraphSelect: ()=> void;
}

export function CurrentParagraphReading({paragraph, pageNo, chapterId, bookReadState, isParagraphSelected, onParagraphSelect}: ParagraphProps) {
    const [ selectedSentenceId, setSelectedSentenceId ] = useState<number>();
    
    const handleSelectSentence = (sentenceId: number) => {
        setSelectedSentenceId(sentenceId);
        onParagraphSelect();
    }
    return (
        <div key={paragraph.id} className="paragraph">
            {
                paragraph.id <= bookReadState.paragraphId || pageNo < bookReadState.pageNo || chapterId < bookReadState.chapterId?
                paragraph.sentences.map((sentence) => (
                    <CurrentSentenceReading 
                        sentence={sentence}
                        pageNo={pageNo}
                        paragraphId={paragraph.id}
                        chapterId={chapterId}
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