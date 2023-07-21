import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setChapterNo, setPageNo } from './state-book-slice';
import { List, ListItemButton, ListItemText, Pagination, Popover, TextField } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useState, useEffect } from 'react';
import { Book } from "../../models/Book";
import { useParams  } from 'react-router-dom';
import { useFetchBookQuery } from '../reading/reading-api-slice';
import { useFetchSentenceAudioMapQuery, SentenceAudioUrl } from './signedUrls/signed-urls-api-slice';
import { useTranscriptedMutation } from './wavtovec/voice-to-text-api-slice';
import VolumeUpTwoToneIcon from '@mui/icons-material/VolumeUpTwoTone';
import KeyboardVoiceTwoToneIcon from '@mui/icons-material/KeyboardVoiceTwoTone';
import StopCircleIcon from '@mui/icons-material/StopCircle';

import bookDummyData from './harry-1.json';
import './Reading.scss';

const style = {
    width: '100%',
    maxWidth: 100,
    bgcolor: 'background.black'
};

const initialState: Book =  bookDummyData;

export function Reading() {

    const dispatch = useAppDispatch();
    const { bookId = "-"} = useParams();
    const [ currentAudioUrl, setCurrentAudioUrl ] = useState("");
    const [ userMicAudioUrl, setUserMicAudioUrl ] = useState("");
    const [ skip, setSkip] = useState(true);
    const [ textSelected, setTextSelected] = useState<string | null>("");
    const [ transcriptedText, setTranscriptedText] = useState("");
    const [ popOverAnchorEl, setPopOverAnchorEl] = useState<HTMLSpanElement | null>(null);
    const { data = initialState, isFetching: isFetchingBook, 
                isUninitialized: isUninitializedBook } = useFetchBookQuery(bookId, {skip});
    const stateBook = useAppSelector((state) => state.stateBook);
    const { data: audioUrls = new Map(), isFetching: isFetchingAudioUrls } = 
        useFetchSentenceAudioMapQuery(data.id + "/" + data.chapters[0].id + "/" + stateBook.currentPageNo + "/", { skip: isFetchingBook || isUninitializedBook});

    const [ transcript ] = useTranscriptedMutation();

    const [ recordedChunks, setRecordedChunks ] = useState<any[]>([]);
    const [ mediaRecorder, setMediaRecorder ] = useState<any>(null);
    const [ recording, setRecording ] = useState<Boolean>(false);
    const [ stream, setStream ] = useState<MediaStream | null>(null);

    const book: Book =  data;
    
    const handleSelectChapterClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number
    )=> {
        if (index < book.chapters.length) {
            dispatch(setChapterNo(index));
            dispatch(setPageNo(1));
        }
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number)  => {
        dispatch(setPageNo(value));
    };

    useEffect(() => {
        if (bookId !== "-") {
            setSkip(false);
        }
    }, [bookId]);

    const handleClickSentence = (event: React.MouseEvent<HTMLSpanElement>, idSentence: string) => {
        console.log(idSentence);
        setPopOverAnchorEl(event.currentTarget);
        setTextSelected(event.currentTarget.textContent);
        const signedUrl = audioUrls.get(idSentence)?.audioUrl || "not url";
        setCurrentAudioUrl(signedUrl);
        console.log(signedUrl);
    }

    const popOverHandleClose = () => {
        setPopOverAnchorEl(null);
    }

    const popOverIsOpen = Boolean(popOverAnchorEl);

    const playSelectedSentence = (pathSentence: string) => {
        let audio = new Audio();
        audio.src = currentAudioUrl;
        audio.load();
        audio.play();
    }

    const playSelf = () => {
        let audio = new Audio();
        audio.src = userMicAudioUrl;
        audio.load();
        audio.play();
    }

    const startStopMicrophone = () => {
        setRecording(!recording);
        if (!recording) {
            startMicrophone();
        } else {
            stopMicrophone();
        }
    }

    const startMicrophone = () => {
        let mediaConstraints = {
            video: false,
            audio: true
        };

        navigator.mediaDevices
                .getUserMedia(mediaConstraints)
                .then(successCallback)
                .catch(errorCallback);
    }

    const stopMicrophone = () => { 
        if (recording) {
            mediaRecorder.stop();
        }

        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }

    const successCallback = (stream : any) => {
        var options = {
            mimeType: 'audio/webm',
            numberOfAudioChannels: 1,
            sampleRate: 16000
        };
        setStream(stream);
        setRecordedChunks([]);
        const mediaRecorderInstance = new MediaRecorder(stream, options);
        mediaRecorderInstance.addEventListener('dataavailable', addData);
        mediaRecorderInstance.addEventListener('stop', stopStream);
        mediaRecorderInstance.start();
        setMediaRecorder(mediaRecorderInstance);
    }

    const stopStream = (e : any) => {
        console.log("stopStream");
        const blob = new Blob(recordedChunks, { type: "audio/webm; codecs=opus" });
        const userAudioUrl = URL.createObjectURL(blob);
        setUserMicAudioUrl(userAudioUrl);
        transcript(blob)
            .unwrap()
            .then(resultText => setTranscriptedText(resultText.text));
        console.log(userAudioUrl);
        console.log(blob);
    }

    const addData = (e: any) => {
        if(e.data.size > 0) 
            recordedChunks.push(e.data);
    };

    const errorCallback = (error : any) => {
        console.log("Big Audio Error");
    }

    return (
        <div className="ebook">
            <h5></h5>
            <Grid2 xs={12} md={12}>
                    <div >
                        <div >
                            <Grid2 container spacing={2}>
                                <Grid2 xs={12}>
                                    <div className="bookTitle">
                                        {book.title}
                                    </div>
                                </Grid2>
                                <Grid2 xs={2}>
                                    <List sx={style} component="nav" aria-label="book indexes">
                                        { 
                                            book.contentTable.map((indexContent) => (
                                                <ListItemButton 
                                                    selected = {stateBook.currentChapterNo === indexContent.index}
                                                    key={indexContent.index} 
                                                    sx={{padding:0.4}} 
                                                    onClick = {(event) => handleSelectChapterClick(event, indexContent.index)}
                                                    divider>
                                                    
                                                    <ListItemText primaryTypographyProps={{fontSize: 8}} primary={indexContent.title}/>
                                                </ListItemButton>
                                            ))
                                        }
                                    </List>
                                </Grid2>
                                <Grid2 xs={10}>
                                    
                                    <Grid2 xs={12}>
                                        { 
                                            book.chapters[stateBook.currentChapterNo].pages[stateBook.currentPageNo -1].paragraphs.map((paragraph) => (
                                                <div key={paragraph.id} className="paragraph">
                                                    {
                                                        paragraph.sentences.map((sentence) => (
                                                            <div className="borderSentence">
                                                                <span key={sentence.id} 
                                                                    className={ textSelected !== null && sentence.text.trim().replace(/\n/g, '') === textSelected.trim().replace(/\n/g, '') ? "selected-sentence" : "sentence"}
                                                                    onClick={(event: React.MouseEvent<HTMLSpanElement>) => handleClickSentence(event, '/' + paragraph.id + '/' + sentence.id)}>
                                                                    {sentence.text}&nbsp;
                                                                </span>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            ))
                                        }
                                        
                                        <Popover
                                            id="page-popover"
                                            open={popOverIsOpen}
                                            anchorEl={popOverAnchorEl}
                                            onClose={popOverHandleClose}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'center'
                                            }}
                                            transformOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'center'
                                            }}
                                        >
                                            <div className="reading-control-panel" style={{
                                                padding: '20px'
                                            }}>
                                                <div className="reading-control-panel-speaker">
                                                    <a className="reading-control-panel-speaker-link" onClick={() => playSelectedSentence("hello")}>
                                                        <VolumeUpTwoToneIcon/>
                                                    </a>
                                                </div>
                                                <div className="reading-control-panel-mic">
                                                    <a className="reading-control-panel-mic-link" onClick={() => startStopMicrophone()}>
                                                        {recording ? (
                                                            <StopCircleIcon/>
                                                        ) : (
                                                            <KeyboardVoiceTwoToneIcon/>
                                                        ) }
                                                    </a>
                                                    {transcriptedText ?  
                                                        (
                                                            <div>
                                                                <a className="reading-control-panel-speaker-link" onClick={() => playSelf()}>
                                                                    <VolumeUpTwoToneIcon/>
                                                                </a>
                                                                {transcriptedText}
                                                            </div>
                                                        )
                                                        :
                                                        (<div></div>)
                                                    }
                                                </div>
                                            </div>
                                        </Popover>
                                    </Grid2>
                                </Grid2>
                                <Grid2 xs={2}>
                                </Grid2>
                                <Grid2 xs={10} className="bookPaginator">
                                    <div >
                                        <Pagination count={book.chapters[stateBook.currentChapterNo].pages.length} 
                                                    siblingCount={book.chapters[stateBook.currentChapterNo].pages.length}
                                                    page={stateBook.currentPageNo} 
                                                    onChange={handlePageChange}/>
                                    </div>
                                </Grid2>
                            </Grid2>
                        </div>
                    </div>
                </Grid2>
        </div>
    );
}