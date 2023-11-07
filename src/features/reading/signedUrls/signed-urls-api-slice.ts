import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface SentenceAudioUrl {
    idSentence : string;
    audioUrl : string;
}

export const signedUrlsApiSlice = createApi({
    reducerPath: 'apiSignedAudioUls',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_HOST}/api/signed-urls/`,
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
            fetchSentenceAudioMap: builder.query<Map<string, SentenceAudioUrl>, string>({
                query(pagePath) {
                    return `?pagePath=${pagePath}`;
                },
                transformResponse: (response: SentenceAudioUrl[]) => {
                    return new Map(response.map(i => [i.idSentence, i]));
                }
            })
        }
    }
});


export const { useFetchSentenceAudioMapQuery } = signedUrlsApiSlice;