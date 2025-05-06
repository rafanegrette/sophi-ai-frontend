

import { BookUserState } from "../../models/BookUserState";
import { Sentence } from "../../models/Sentence";

import "./CurrentSentence.scss";

interface SentenceProps {
    sentence : Sentence;
    paragraphId: number;
    pageNo: number;
    bookWriteState: BookUserState;
}
export function CurrentSentence( {sentence, paragraphId, pageNo, bookWriteState} : SentenceProps) {
    

    return (
      <div className="sentences">
          {(sentence.id < bookWriteState.sentenceId ) || 
          paragraphId < bookWriteState.paragraphId || 
          pageNo < bookWriteState.pageNo ? 
            " " + sentence.text 
            : 
            <div></div>
          }
        
      </div>
    );
}