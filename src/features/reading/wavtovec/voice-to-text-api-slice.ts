import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const voiceToTextApiSlice = createApi({
    reducerPath: 'apiVoiceToText',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api/',
        prepareHeaders(headers) {
            headers.set('Accept', 'text/plain');
        }
    }),
    endpoints(builder) {
        return {
            transcripted: builder.mutation<string, Blob>({
                query: (voiceBlob : Blob) => {
                    const request = new FormData();
                    request.append('file', voiceBlob);
                    return {
                        url: '/transcript',
                        method: 'POST',
                        body: request
                    };
                }
            })
        }
    }
});

export const { useTranscriptedMutation } = voiceToTextApiSlice;