import { useAppDispatch } from '../../app/hooks';
import { useEffect, useState } from 'react';
import { useChatSendQuery, Message } from './chat-api-slice';
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import SendIcon from '@mui/icons-material/Send';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import './Chat.scss';

export function Chat() {

    const [ userInputText, setUserInputText ] = useState("");
    const [ userTextQuestion, setUserTextQuestion ] = useState("");
    const [gptText, setGptText ] = useState("");
    const [ messageToSend, setMessageToSend ] = useState<Message>({role:'user', content: ''});

    const handleSend = () => {
        const message : Message = {'role': 'user',
                        'content': userInputText};
        setMessageToSend(message);
        setUserTextQuestion(userInputText);
        let lastText : String = '';
        //setSkipSend(false);
        console.log(message);
        fetchEventSource('http://localhost:8080/api/v1/sophi/talk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([message]),
            onmessage(response) {
                console.log(response.data);
                setGptText(lastText + ' ' + response.data);
                lastText = (lastText + ' ' + response.data);
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
                    <div className="user-question">
                        {userTextQuestion}
                    </div>
                    <div className="gpt-response">
                        <h3>{gptText}</h3>
                    </div>
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