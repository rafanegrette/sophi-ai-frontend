import {KeyboardEvent, useState, ChangeEvent} from 'react';

import Typography from '@mui/material/Typography';
import VolumeUpTwoToneIcon from '@mui/icons-material/VolumeUpTwoTone';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import { TextField } from '@mui/material';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useFetchSentenceAudioMapQuery } from '../reading/signedUrls/signed-urls-api-slice';
import { useFetchBookStateQuery, useIncreaseStateMutation } from './listening-api-slice';

import { Page } from "../../models/Page";
import { CurrentParagraph } from "./CurrentParagraph";
import { BookWriteState } from '../../models/BookWriteState';
import "./CurrentPage.scss";

interface PageProps {
    page: Page;
    bookWriteState: BookWriteState;
}
export function CurrentPage({page, bookWriteState} : PageProps) {

    const [ skipFetchBookState, setSkipFetchBookState] = useState(true);
    const [ increaseState, {isLoading: isIncreaseState}] = useIncreaseStateMutation();
    const [ resultText, setResultText] = useState({'accepted': false, 'result': ''});
    const [inputUser, setInputUser] = useState('');
    const { data: audioUrls = new Map(), isFetching: isFetchingAudioUrls } = 
                useFetchSentenceAudioMapQuery(bookWriteState.bookId + "/" + bookWriteState.chapterId + "/" + bookWriteState.pageNo 
                + "/" + bookWriteState.paragraphId + "/" + bookWriteState.sentenceId);

    const { data: currentBookState, refetch } = useFetchBookStateQuery(bookWriteState.bookId, {skip: skipFetchBookState});

    const handlePlaySentence = () => {
        let audio = new Audio();
        audio.src = audioUrls.get('/' + bookWriteState.paragraphId + '/' + bookWriteState.sentenceId)?.audioUrl || "not url";
        audio.load();
        audio.play();
        console.log(audioUrls);
    };

    const handlePressEnter = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            increaseState({
                'bookId': bookWriteState.bookId,
                'userText': inputUser,
                'bookText': page.paragraphs.filter(p => p.id == bookWriteState.paragraphId)[0].sentences.filter(s => s.id == bookWriteState.sentenceId)[0].text.toString()
                })
                .unwrap()
                .then(result => {
                    setResultText(result);
                    setSkipFetchBookState(false);
                    if (result.accepted) {
                        refetch();
                        setInputUser("");
                    }
                })
            console.log(inputUser);
        }
    };

    const handleEnterText = (event: ChangeEvent<HTMLInputElement>) => {
        setInputUser(event.target.value);
    };

    return (
            <div>
                {
                    page.number <= bookWriteState.pageNo ?
                    page.paragraphs.map((paragraph) => (
                        <Typography paragraph>
                        <CurrentParagraph paragraph={paragraph} pageNo={page.number} bookWriteState={bookWriteState}/>
                        </Typography>
                    ))
                    :
                    <div></div>
                }

                {
                    resultText.result == '' ? 
                        <div></div>
                        :
                        <div className="result-text">
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                {resultText.result}
                            </Markdown>
                            {
                                resultText.accepted ? 
                                <CheckCircleTwoToneIcon className='okresult'/>
                                :
                                <div></div>
                        }
                        </div>
                }
                <div className="write-section">
                    <a className="listening-icon-speaker" onClick={handlePlaySentence}>
                        <VolumeUpTwoToneIcon />
                    </a>
                    <TextField
                        id="user-text-input-id"
                        label="Write what you heard"
                        variant="standard"
                        value={inputUser}
                        fullWidth
                        multiline
                        onKeyDown={handlePressEnter}
                        onChange={handleEnterText}
                    />
                </div>
            </div>

    );
}