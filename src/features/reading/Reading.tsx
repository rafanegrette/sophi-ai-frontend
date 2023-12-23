import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setChapterNo, setPageNo } from './state-book-slice';
import { LinearProgress, List, ListItemButton, ListItemText, Pagination } from "@mui/material";
import Popover, {PopoverProps} from '@mui/material/Popover';

import Grid from "@mui/material/Grid";
import { useState, useEffect } from 'react';
import { Book } from "../../models/Book";
import { useParams  } from 'react-router-dom';
import { useFetchBookQuery } from '../reading/reading-api-slice';
import { useFetchSentenceAudioMapQuery, SentenceAudioUrl } from './signedUrls/signed-urls-api-slice';
import { useTranscriptedMutation } from './wavtovec/voice-to-text-api-slice';
import VolumeUpTwoToneIcon from '@mui/icons-material/VolumeUpTwoTone';
import KeyboardVoiceTwoToneIcon from '@mui/icons-material/KeyboardVoiceTwoTone';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
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
    const [ textSelected, setTextSelected] = useState<HTMLSpanElement | null>(null);
    const [ transcriptedText, setTranscriptedText] = useState("");
    const [ transcriptedTextSophi, setTranscriptedTextSophi ] = useState<String>("");
    //const [ popOverAnchorEl, setPopOverAnchorEl] = useState<HTMLSpanElement | null>(null);
    const [ clickY, setClickY] = useState(0);
    const [ anchorEl, setAnchorEl ] = useState<PopoverProps['anchorEl']>(null);
    const [ popOverIsOpen, setPopOverIsOpen] = useState(false);
    const { data = initialState, isFetching: isFetchingBook, 
                isUninitialized: isUninitializedBook } = useFetchBookQuery(bookId, {skip});
    const stateBook = useAppSelector((state) => state.stateBook);
    const { data: audioUrls = new Map(), isFetching: isFetchingAudioUrls } = 
        useFetchSentenceAudioMapQuery(data.id + "/" + data.chapters[stateBook.currentChapterNo].id + "/" + stateBook.currentPageNo + "/", { skip: isFetchingBook || isUninitializedBook});

    const [ transcript, {isLoading: isLoadingTranscript} ] = useTranscriptedMutation();

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
        const selection = event.currentTarget;
        setClickY(event.clientY);

        //setPopOverAnchorEl(event.currentTarget);
        setTextSelected(event.currentTarget);
        const signedUrl = audioUrls.get(idSentence)?.audioUrl || "not url";
        setCurrentAudioUrl(signedUrl);

        const getBoundingClientRect = () => {
            return selection.getBoundingClientRect();
        }
        setPopOverIsOpen(true);
        setAnchorEl({getBoundingClientRect, nodeType: 1});
        
    }

    const idPopOver = Boolean(popOverIsOpen) ? 'virtual-element-popover' : undefined;

    const popOverHandleClose = () => {
        setPopOverIsOpen(false);
    }

    //const popOverIsOpen = Boolean(popOverAnchorEl);

    const playSelectedSentence = (pathSentence: string) => {
        let audio = new Audio();
        audio.src = currentAudioUrl;
        audio.load();
        audio.play();
/*
        fetch(currentAudioUrl)
            .then(response => response.blob())
            .then(blob => {
                transcript(blob)
                            .unwrap()
                            .then(text => setTranscriptedTextSophi(text.text))
                })
            .catch(err => console.error("error trying to play sophi audio. {}", err));
        */
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
        transcript({'audioFile': blob, 'originalText': textSelected?.textContent + ""})
            .unwrap()
            .then(resultText => setTranscriptedText(resultText.result));
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
            <Grid xs={12} md={12}>
                    <div >
                        <div >
                            <Grid container spacing={2}>
                                <Grid xs={12}>
                                    <div className="bookTitle">
                                        {book.title}
                                    </div>
                                </Grid>
                                <Grid xs={2}>
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
                                </Grid>
                                <Grid xs={10}>
                                    
                                    <Grid xs={12}>
                                        { 
                                            book.chapters[stateBook.currentChapterNo].pages[stateBook.currentPageNo -1].paragraphs.map((paragraph) => (
                                                <div key={paragraph.id} className="paragraph">
                                                    {
                                                        paragraph.sentences.map((sentence) => (
                                                            <div className="borderSentence">
                                                                <span key={sentence.id} 
                                                                    className={ textSelected !== null && sentence.text.trim().replace(/\n/g, '') === (textSelected.textContent + "").trim().replace(/\n/g, '') ? "selected-sentence" : "sentence"}
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
                                            id={idPopOver}
                                            open={popOverIsOpen}
                                            anchorEl={anchorEl}
                                            disableScrollLock={true}
                                            onClose={popOverHandleClose}
                                            anchorOrigin={clickY > window.innerHeight / 2 ? 
                                                            {vertical: 'top', horizontal: 'center'} 
                                                            :
                                                            {vertical: 'bottom', horizontal: 'center'} 
                                                        }
                                            transformOrigin={clickY > window.innerHeight / 2 ? 
                                                            {vertical: 'bottom', horizontal: 'center'} 
                                                            :
                                                            {vertical: 'top', horizontal: 'center'} 
                                            }
                                        >
                                            <div className="reading-control-panel" style={{
                                                padding: '20px'
                                            }}>
                                                <div className="reading-control-panel-speaker">
                                                    <a className="reading-control-panel-speaker-link" onClick={() => playSelectedSentence("hello")}>
                                                        <VolumeUpTwoToneIcon/>
                                                    </a>
                                                    { transcriptedTextSophi }
                                                </div>
                                                {isLoadingTranscript ? 
                                                    (<LinearProgress color="inherit" />)
                                                    :
                                                    (
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
                                                                    <Markdown 
                                                                        remarkPlugins={[remarkGfm]}
                                                                        rehypePlugins={[rehypeRaw]}>   
                                                                        {transcriptedText}
                                                                    </Markdown>                                                                
                                                                </div>
                                                            )
                                                            :
                                                            (<div></div>)
                                                        }
                                                        
                                                    </div>
                                                    )
                                                }

                                                
                                            </div>
                                        </Popover>
                                    </Grid>
                                </Grid>
                                <Grid xs={2}>
                                </Grid>
                                <Grid xs={10} className="bookPaginator">
                                    <div >
                                        <Pagination count={book.chapters[stateBook.currentChapterNo].pages.length} 
                                                    siblingCount={book.chapters[stateBook.currentChapterNo].pages.length}
                                                    page={stateBook.currentPageNo} 
                                                    onChange={handlePageChange}/>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Grid>
        </div>
    );
}