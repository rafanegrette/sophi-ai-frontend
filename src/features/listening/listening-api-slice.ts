import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BookUserState } from "../../models/BookUserState";

interface ListeningSentenceRequest {
    bookId: string,
    userText: string,
    bookText: string
}

interface ListeningSentenceResponse {
    accepted: boolean,
    result: string
}

export const listeningApiSlice = createApi({
    reducerPath: 'apiListening',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_HOST}/api/listening`,
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
            increaseState: builder.mutation<ListeningSentenceResponse ,ListeningSentenceRequest>({
                query: (listeningSentence: ListeningSentenceRequest) => {
                    return {
                        url: '',
                        method: 'POST',
                        body: listeningSentence
                    }
                },
                invalidatesTags: ['GetBookState']
            })
        }
    }
});

export const { useFetchBookStateQuery, useIncreaseStateMutation } = listeningApiSlice;