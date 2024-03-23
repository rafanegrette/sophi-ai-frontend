import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Transcript {
    result : string;
}
interface TranscriptRequest {
    audioFile: Blob,
    originalText: string
}

export const voiceToTextApiSlice = createApi({
    reducerPath: 'apiVoiceToText',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_HOST}/api/`,
        prepareHeaders(headers) {
            headers.set('Accept', 'application/json');
        },
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
            transcripted: builder.mutation<Transcript, TranscriptRequest>({
                query: (transcriptRequest : TranscriptRequest) => {
                    const formRequest = new FormData();
                    formRequest.append('file', transcriptRequest.audioFile);
                    formRequest.append('sentence', transcriptRequest.originalText);
                    return {
                        url: '/pronunciation',
                        method: 'POST',
                        body: formRequest
                    };
                }
            })
        }
    }
});

export const { useTranscriptedMutation } = voiceToTextApiSlice;