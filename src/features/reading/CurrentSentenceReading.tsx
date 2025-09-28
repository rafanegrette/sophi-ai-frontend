import { useState, useEffect } from "react";

import Popover from "@mui/material/Popover";
import VolumeUpTwoToneIcon from '@mui/icons-material/VolumeUpTwoTone';
import KeyboardVoiceTwoToneIcon from '@mui/icons-material/KeyboardVoiceTwoTone';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import LinearProgress from "@mui/material/LinearProgress";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import CachedIcon from '@mui/icons-material/Cached';

import { BookUserState } from "../../models/BookUserState";
import { Sentence } from "../../models/Sentence";
//import { useTranscriptedMutation } from './wavtovec/voice-to-text-api-slice';
import { useEvalTranscriptMutation, useIncreaseStateMutation } from './pronunciation-api-slice';
import { useFetchSentenceAudioMapQuery } from './signedUrls/signed-urls-api-slice';
import { useRegenerateAudioMutation } from "./regenerate-audio-slice";
import { Alert, Button, Snackbar} from "@mui/material";
import { IconButton, Tooltip } from "@mui/material";
import { PronunciationResponse } from "./model/PronunciationResponse";
import "./CurrentSentenceReading.scss";

interface SentenceProps {
    sentence : Sentence;
    paragraphId: number;
    pageNo: number;
    chapterId: number;
    bookReadState: BookUserState;
    isSelected: boolean;
    onSelect: ()=> void;
}

export function CurrentSentenceReading({sentence, paragraphId, pageNo, chapterId, bookReadState, isSelected, onSelect} : SentenceProps) {

    const [ popOverIsOpen, setPopOverIsOpen] = useState(false);
    const [ clickY, setClickY] = useState(0);
    const [ popOverAnchorEl, setPopOverAnchorEl] = useState<HTMLSpanElement | null>(null);
    const idPopOver = Boolean(popOverIsOpen) ? 'id-element-popover' : undefined;
    const [ transcriptedText, setTranscriptedText] = useState<PronunciationResponse>({'result': "", 'accepted': false});
    const [ transcriptedTextSophi, setTranscriptedTextSophi ] = useState<String>("");
    const [ textSelected, setTextSelected] = useState<HTMLSpanElement | null>(null);
    const [ evalTranscript, {isLoading: isLoadingTranscript} ] = useEvalTranscriptMutation();
    const [ increaseState, {isLoading: isIncreasingState}] = useIncreaseStateMutation();
    const [ regenerateAudio, {isLoading: isSucessRegenerateAudio}] = useRegenerateAudioMutation();

    const [ currentAudioUrl, setCurrentAudioUrl ] = useState("");
    const [ userMicAudioUrl, setUserMicAudioUrl ] = useState("");
    const [ mediaRecorder, setMediaRecorder ] = useState<any>(null);
    const [ recording, setRecording ] = useState<Boolean>(false);
    const [ stream, setStream ] = useState<MediaStream | null>(null);
    const [ recordedChunks, setRecordedChunks ] = useState<any[]>([]);
    

    const { data: audioUrls = new Map(), isFetching: isFetchingAudioUrls } = 
    useFetchSentenceAudioMapQuery(bookReadState.bookId + "/" + bookReadState.chapterId + "/" + pageNo + "/");    

    const handleClickSentence = (event: React.MouseEvent<HTMLSpanElement>, idSentence: string) => {

        setClickY(event.clientY);
        onSelect();
        setPopOverAnchorEl(event.currentTarget);
        setTextSelected(event.currentTarget);
        const signedUrl = audioUrls.get(idSentence)?.audioUrl || "not url";
        setCurrentAudioUrl(signedUrl);
        setPopOverIsOpen(true);
    }

    const handleNextSentence = () => {
        increaseState(bookReadState.bookId);
    }

    const popOverHandleClose = () => {
        setPopOverIsOpen(false);
        setPopOverAnchorEl(null);
    }


    const playSelectedSentence = (pathSentence: string) => {
        let audio = new Audio();
        audio.src = currentAudioUrl;
        audio.load();
        audio.play();
        console.log(currentAudioUrl);
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

    const regenerateAudioFunction = (audioId: string, audioText: String) => {
        regenerateAudio({idFull: audioId, text: audioText.toString() })
        .unwrap();
        console.log("Audio Id: " + audioId + ", Audio text: " + audioText);
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

    const stopStream = (e : any) => {
        console.log("stopStream");
        const blob = new Blob(recordedChunks, { type: "audio/webm; codecs=opus" });
        const userAudioUrl = URL.createObjectURL(blob);
        setUserMicAudioUrl(userAudioUrl);
        evalTranscript({'audioFile': blob, 'originalText': textSelected?.textContent + "", 'idBook': bookReadState.bookId})
            .unwrap()
            .then(result => setTranscriptedText(result));
        console.log(userAudioUrl);
    }

    const addData = (e: any) => {
        if(e.data.size > 0) 
            recordedChunks.push(e.data);
    };

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


    const errorCallback = (error : any) => {
        console.log("Big Audio Error");
    }

    const handleCloseReloadAudio = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
    }

    return (
        <div key={sentence.id} className="borderSentence">
            {
                sentence.id <= bookReadState.sentenceId ||
                paragraphId < bookReadState.paragraphId ||
                pageNo < bookReadState.pageNo ||
                chapterId < bookReadState.chapterId ?
                    <span key={sentence.id} 
                                className={ isSelected ? "selected-sentence" : "sentence"}
                                onClick={(event: React.MouseEvent<HTMLSpanElement>) => handleClickSentence(event, '/' + paragraphId + '/' + sentence.id)}>
                                {sentence.text}&nbsp;
                    </span>
                :
                <div></div>
            }
            <Popover
                id={idPopOver}
                open={popOverIsOpen}
                anchorEl={popOverAnchorEl}
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
                }>
                <div className="reading-control-panel" style={{
                    padding: '20px'
                }}>
                    <div className="reading-control-panel-speaker">
                        <a className="reading-control-panel-speaker-link" onClick={() => playSelectedSentence("hello")}>
                            <VolumeUpTwoToneIcon/>
                        </a>
                        <a className="reading-control-panel-speaker-link" onClick={() => regenerateAudioFunction(bookReadState.bookId + "/" + chapterId + "/" + pageNo + "/" + paragraphId + "/" + sentence.id, sentence.text )}>
                            <CachedIcon/>
                        </a> 
                        <div className="phonetic-text">{sentence.phonetic}</div>
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
                                {transcriptedText.result.length > 0 ?  
                                    (
                                        <div className="reading-control-panel-user">
                                            <a className="reading-control-panel-speaker-link" onClick={() => playSelf()}>
                                                <VolumeUpTwoToneIcon/>
                                            </a>
                                            <Markdown 
                                                remarkPlugins={[remarkGfm]}
                                                rehypePlugins={[rehypeRaw]}>   
                                                {transcriptedText.result + (transcriptedText.accepted ? `&#10003;` : '')}
                                                
                                            </Markdown>
                                            <Tooltip title="Next">
                                                <IconButton 
                                                    color="secondary" 
                                                    aria-label="next sentence"
                                                    onClick={handleNextSentence}
                                                    >
                                                    <KeyboardDoubleArrowRightIcon/>
                                                </IconButton>
                                            </Tooltip>
                                            
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
            <Snackbar open={isSucessRegenerateAudio} autoHideDuration={6000} onClose={handleCloseReloadAudio}>
                <Alert onClose={handleCloseReloadAudio} severity="success" sx={{ width: '100%' }}>
                    Audio reloaded
                </Alert>
            </Snackbar>
        </div>
    );
}