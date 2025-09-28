import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface SentenceReference {
    idFull: string,
    text: string
}
export const regenerateAudioApiSlice = createApi({
    reducerPath: 'apiRegenarateAudio',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_HOST}/api/regenerate-audio`,
        prepareHeaders(headers) {
            headers.set('Accept', 'application/json');
        },
        redirect: 'follow',
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
    endpoints(builder) {
        return {
            regenerateAudio: builder.mutation<void, SentenceReference> ({
                query: (sentenceReference: SentenceReference) => {
                    return {
                        url: '',
                        method: 'POST',
                        body: sentenceReference
                    }
                }
            })
        }
    }
});

export const { useRegenerateAudioMutation } = regenerateAudioApiSlice;