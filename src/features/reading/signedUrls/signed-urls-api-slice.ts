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
            const response = await fetch(url, args ? {...args, redirect: "manual"} : {redirect: "manual"});
            if(response.type === "opaqueredirect") {
                const redirectUrl = response.headers.get('location') || response.url;
                document.location = redirectUrl;
            }
            return response;
        }
    }),
    tagTypes: ['GetBookState'],
    
    endpoints(builder) {
        return {
            fetchSentenceAudioMap: builder.query<Map<string, SentenceAudioUrl>, string>({
                query(pagePath) {
                    return `?pagePath=${pagePath}`;
                },
                transformResponse: (response: SentenceAudioUrl[]) => {
                    return new Map(response.map(i => [i.idSentence, i]));
                },
                providesTags: ['GetBookState']
            }),
            invalidateSentenceAudio: builder.mutation<void, string>({
                queryFn: () => ({data: undefined}),
                invalidatesTags: ['GetBookState']
            })
        }
    }
});


export const { useFetchSentenceAudioMapQuery, useInvalidateSentenceAudioMutation } = signedUrlsApiSlice;