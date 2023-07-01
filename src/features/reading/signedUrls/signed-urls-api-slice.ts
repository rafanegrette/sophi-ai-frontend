import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface SentenceAudioUrl {
    idSentence : string;
    audioUrl : string;
}

export const signedUrlsApiSlice = createApi({
    reducerPath: 'apiSignedAudioUls',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api/signed-urls/',
        prepareHeaders(headers) {
            headers.set('Accept', 'application/json');
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