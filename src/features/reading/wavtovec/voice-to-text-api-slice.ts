import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Transcript {
    text : string;
}
export const voiceToTextApiSlice = createApi({
    reducerPath: 'apiVoiceToText',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_HOST}/api/`,
        prepareHeaders(headers) {
            headers.set('Accept', 'application/json');
        }
    }),
    endpoints(builder) {
        return {
            transcripted: builder.mutation<Transcript, Blob>({
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