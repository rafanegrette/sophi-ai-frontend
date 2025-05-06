import { useEffect, useState } from 'react';
import { Message } from '../messages/message';
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import KeyboardVoiceTwoToneIcon from '@mui/icons-material/KeyboardVoiceTwoTone';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import VolumeUpTwoToneIcon from '@mui/icons-material/VolumeUpTwoTone';
import SendIcon from '@mui/icons-material/Send';
import { useChatSendMutation } from './chat-api-slice';
import './Chat.scss';


interface Props {
    assistantDescription: string
}
export function Chat(props: Props) {

    const [ chatSend, {isLoading: isLoadingBotResponse}] = useChatSendMutation();
    const [ userAudioUrl, setUserAudioUrl ] = useState("");
    const [ botAudioUrl, setBotAudioUrl ] = useState("");
    const [ mediaRecorder, setMediaRecorder ] = useState<any>(null);
    const [ recording, setRecording ] = useState<Boolean>(false);
    const [ stream, setStream ] = useState<MediaStream | null>(null);
    const [ recordedChunks, setRecordedChunks ] = useState<any[]>([]);

    const messagesDefault : Message[] = [
       
    ];
    const [ userMessage, setUserMessage ] = useState("");
    const [ chatMessage, setChatMessage ] = useState("");


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
        const userAudioUrlBlob = URL.createObjectURL(blob);
        setUserAudioUrl(userAudioUrlBlob);
        chatSend({'content': blob, 'conversationId': "122"})
            .unwrap()
            .then(result => {
                setChatMessage(result.botText);
                setUserMessage(result.userText);   

                
                if (result.botSpeech) {
                    const audioUrl = `data:audio/webm;codecs=opus;base64,${result.botSpeech}`;

                    setBotAudioUrl(audioUrl);

                    const audio = new Audio(audioUrl);
                    audio.play();
                };
            });
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

    const playBotAudio = () => {
        if(botAudioUrl) {
            const audio = new Audio(botAudioUrl);
            audio.play();
        }
    }

    const playUserAudio = () => {
        if(userAudioUrl) {
            const audio = new Audio(userAudioUrl);
            audio.play();
        }
    }

    return (
        <div className="chat-full-page">
            <div className="chat-header">proxy to chat gpt</div>
            <div className="chat-content">
                 <div className="chat-messages">
                    {userMessage && (
                        <div className="message user-message">
                            <div className="message-content user-question">{userMessage}</div>
                            {userAudioUrl && (
                                <a className="" onClick={() => playUserAudio()}>
                                    <VolumeUpTwoToneIcon/>
                                </a>
                            )}
                        </div>
                    )}
                    {chatMessage && (
                        <div className="message bot-message">
                            <div className="message-content gpt-response">{chatMessage}</div>
                            {botAudioUrl && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={playBotAudio}
                                    startIcon={<VolumeUpTwoToneIcon/>}
                                >Play
                                </Button>
                            )}
                        </div>
                    )}
                </div>
                <div className="chat-input">
                    
                    <a className="chat-input-microphone" onClick={() => startStopMicrophone()}>
                        {recording ? (
                            <StopCircleIcon/>
                        ) : (
                            <KeyboardVoiceTwoToneIcon/>
                        ) }
                    </a>
                </div>
            </div>
        </div>
    );
}