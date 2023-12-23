import { useAppDispatch } from '../../../app/hooks';
import { useEffect, useState } from 'react';
import { useChatSendQuery } from './chat-api-slice';
import { Message } from '../messages/message';
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import SendIcon from '@mui/icons-material/Send';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import './Chat.scss';
import { Assistant } from '../assistants/assistant-api-slice';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';


interface Props {
    assistantDescription: string
}
export function Chat(props: Props) {

    const messagesDefault : Message[] = [
        /*{
            role: 'user',
            content: 'Hello, how can I **help you**?'
        },
        {
            role: 'assistant',
            content: 'I am a helpful AI Assistant.'
        }*/
    ];
    const [ userInputText, setUserInputText ] = useState("");
    const [ messages, setMessages] = useState<Message[]>(messagesDefault);
    const [ gptText, setGptText ] = useState("");

    const handleSend = () => {

        const systemMessage: Message = {'role': 'system',
                        'content': props.assistantDescription};
        let lastGptText : string = '';
        const userMessage : Message = {'role': 'user',
        'content': userInputText};
        let defaultGptMessage: Message = {'role': 'assistant',
        'content': ''};
        setMessages(messages => [...messages, userMessage, defaultGptMessage]);
        
        //setSkipSend(false);
        fetchEventSource('http://localhost:8080/api/v1/sophi/talk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([systemMessage, ...messages, userMessage]),
            onmessage(response) {
                console.log(response.data);
                setGptText(lastGptText + ' ' + response.data);
                lastGptText = (lastGptText + ' ' + response.data);
                setMessages(messages => {
                    const lastMessage = messages[messages.length - 1];
                    lastMessage.content = lastGptText;
                    return [...messages.slice(0, -1), lastMessage];
                    
                });
            },
            onclose() {

                console.log("IT CLoses");
            },
            onerror(err) {
                throw err;
            }
        });
    };

    const handleTextChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setUserInputText(e.target.value);
    };

    return (
        <div className="chat-full-page">
            <div className="chat-header">proxy to chat gpt</div>
            <div className="chat-content">
                <div className="chat-messages">
                    {
                        messages.map((message, index) => (
                            
                                <div id={index + ''} className={message.role == "user"? "user-question" : "gpt-response"}>
                                    <b>{message.role == "user"? "You" : "Assistant"}</b>
                                    <br/>
                                    <Markdown 
                                        remarkPlugins={[remarkGfm]}
                                        children={message.content}
                                        components={{
                                            code(props) {
                                              const {children, className, node, ...rest} = props
                                              const match = /language-(\w+)/.exec(className || '')
                                              return match ? (
                                                <SyntaxHighlighter
                                                  {...rest}
                                                  PreTag="div"
                                                  children={String(children).replace(/\n$/, '')}
                                                  language={match[1]}
                                                  style={dark}
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
                        ))
                        
                    }
                </div>
                <div className="chat-input">
                    <TextField
                        id="user-input-chat"
                        label="Write your message"
                        multiline
                        maxRows={5}
                        fullWidth
                        variant="filled"
                        onChange={handleTextChange}
                        />
                    <Button 
                        variant="contained"
                        endIcon={<SendIcon/>}
                        onClick={handleSend}
                        >
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
}