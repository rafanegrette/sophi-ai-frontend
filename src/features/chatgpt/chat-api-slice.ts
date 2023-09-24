import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Message {
    role: string,
    content: string
}

export const chatApiSlice = createApi({
    reducerPath: 'apiChatGpt',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api/v1/sophi',
        prepareHeaders(headers) {
            headers.set('Accept', '*/*')
            headers.set('Content-Type', 'application/json')
        }
    }),
    endpoints(builder) {
        return {
            chatSend: builder.query<void, Message[]>({
                query: (messages: Message[]) => {
                    return {
                        url: '/talk',
                        method: 'POST',
                        body: messages
                    }
                }
            })
        }
    }
});

export const { useChatSendQuery } = chatApiSlice;