import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const deleteBookApiSlice = createApi( {
    reducerPath: 'apiDeleteBook',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api/books',
        prepareHeaders(headers) {
            headers.set('Accept', 'application/json')
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