import { useEffect, useState } from 'react';
import { Message } from '../messages/message';
import KeyboardVoiceTwoToneIcon from '@mui/icons-material/KeyboardVoiceTwoTone';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import VolumeUpTwoToneIcon from '@mui/icons-material/VolumeUpTwoTone';
import { useChatSendMutation } from './chat-api-slice';

import Markdown from 'react-markdown';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';


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
    const [ isAudioPlaying, setIsAudioPlaying ] = useState(false);

    const [ userMessage, setUserMessage ] = useState("");
    const [ chatMessage, setChatMessage ] = useState("");

    const [conversationId, setConversationId] = useState("");

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
        chatSend({'content': blob, 'conversationId': conversationId})
            .unwrap()
            .then(result => {
                setChatMessage(result.botText);
                setUserMessage(result.userText);   
                setConversationId(result.conversationId);
                
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
        if(botAudioUrl && !isAudioPlaying) {
            setIsAudioPlaying(true);

            const audio = new Audio(botAudioUrl);
            audio.play();
            audio.onended = () => {
                setIsAudioPlaying(false);
            }

            audio.onerror = () => {
                setIsAudioPlaying(false);
            }
        }
    }

    const playUserAudio = () => {
        if(userAudioUrl && !isAudioPlaying) {
            setIsAudioPlaying(true);

            const audio = new Audio(userAudioUrl);
            audio.play();
            audio.onended = () => {
                setIsAudioPlaying(false);
            }

            audio.onerror = () => {
                setIsAudioPlaying(false);
            }
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
                                <a className="audio-play-button user-play" onClick={() => playUserAudio()}>
                                    <VolumeUpTwoToneIcon/>
                                </a>
                            )}
                        </div>
                    )}
                    {isLoadingBotResponse && (
                        <div className="message bot-message">
                        <div className="message-content gpt-response loading-response">
                            <div className="loading-indicator">
                            <div className="loading-dot"></div>
                            <div className="loading-dot"></div>
                            <div className="loading-dot"></div>
                            </div>
                        </div>
                        </div>
                    )}
                    {chatMessage && !isLoadingBotResponse && (
                        <div className="message bot-message">
                            <div className="message-content gpt-response">
                                <Markdown 
                                    remarkPlugins={[remarkGfm]}
                                    children={chatMessage.replace(/\\n/g, "\n")}
                                    components={{
                                        code(props) {
                                            const {children, className, node, ...rest} = props
                                            const match = /language-(\w+)/.exec(className || '')
                                            return match ? (
                                            <SyntaxHighlighter  
                                                //{...rest}                                            
                                                PreTag="div"
                                                children={String(children).replace(/\n$/, '')}
                                                language={match[1]}
                                                style={dark}
                                                //
                                            />
                                            ) : (
                                            <code {...rest} className={className}>
                                                {children}
                                            </code>
                                            )
                                        }
                                    }}>

                                </Markdown>           
                            
                            </div>
                            {botAudioUrl && (
                              <a className="audio-play-button bot-play" onClick={() => playBotAudio()}>
                              <VolumeUpTwoToneIcon/>
                          </a>
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