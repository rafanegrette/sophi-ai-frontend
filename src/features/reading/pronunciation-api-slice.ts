import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BookUserState } from "../../models/BookUserState";
import { PronunciationRequest } from "./model/PronunciationRequest";
import { PronunciationResponse } from "./model/PronunciationResponse";





export const pronunciationApiSlice = createApi({
    reducerPath: 'apiPronunciation',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_HOST}/api/pronunciation`,
        prepareHeaders(headers) {
            headers.set('Accept', 'application/json');
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
    tagTypes: ['GetBookState'],
    endpoints(builder) {
        return {
            fetchBookState: builder.query<BookUserState, string>({
                query(bookId) {
                    return `/${bookId}`;
                },
                providesTags: ['GetBookState']
            }),
            evalTranscript: builder.mutation<PronunciationResponse, PronunciationRequest>({
                query: (pronunciationRequest: PronunciationRequest) => {
                    const formRequest = new FormData();
                    formRequest.append('file', pronunciationRequest.audioFile);
                    formRequest.append('sentence', pronunciationRequest.originalText);
                    formRequest.append('idBook', pronunciationRequest.idBook);
                    return {
                        url: '',
                        method: 'POST',
                        body: formRequest
                    };
                }
            }),
            increaseState: builder.mutation<void, string> ({
                query: (bookId) => {
                    return {
                        url: `/${bookId}/increaseState`,
                        method: 'POST'
                    }
                },
                invalidatesTags: ['GetBookState']
            })
        }
    }
});

export const { useFetchBookStateQuery, useEvalTranscriptMutation, useIncreaseStateMutation } = pronunciationApiSlice;
