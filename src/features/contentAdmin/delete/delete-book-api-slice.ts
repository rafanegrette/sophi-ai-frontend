import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const deleteBookApiSlice = createApi( {
    reducerPath: 'apiDeleteBook',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api/books',
        prepareHeaders(headers) {
            headers.set('Accept', 'application/json')
        }
    }),
    endpoints(builder) {
        return {
            deleteBook: builder.mutation<void,string>({
                query: (idBook: string) =>{
                    return {
                        url: `/${idBook}`,
                        method: 'DELETE'
                    }
                }
            })
        }
    }
});

export const { useDeleteBookMutation } = deleteBookApiSlice;