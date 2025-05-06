import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserMessage } from "../messages/user-message";
import { BotMessage } from "../messages/bot-message";

export const chatApiSlice = createApi({
    reducerPath: 'apiChatGpt',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_HOST}/api`,
        prepareHeaders(headers) {
            headers.set('Accept', 'application/json')
        },
        redirect: 'follow',
        credentials: 'include',
        fetchFn: async(url, args) => {
            const response = await fetch(url, {...args, redirect: "manual"});
            if(response.type === "opaqueredirect") {
                document.location = response.url;
            }
            return response;
        }
    }),
    endpoints(builder) {
        return {
            chatSend: builder.mutation<BotMessage, UserMessage>({
                query: (userMessage: UserMessage) => {
                    const formRequest = new FormData();
                    formRequest.append('file', userMessage.content);
                    formRequest.append('conversationId', userMessage.conversationId);
                    return {
                        url: '/conversation',
                        method: 'POST',
                        body: formRequest
                    }
                }
            })
        }
    }
});

export const { useChatSendMutation } = chatApiSlice;