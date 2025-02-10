import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ARTICLES } from "../constants"; 
interface DeleteArticleState {
    deletedTitle: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: DeleteArticleState = {
    deletedTitle: null,
    loading: false,
    error: null,
};

export const deleteArticle = createAsyncThunk<string, string>(
    'articles/deleteArticle',
    async (title: string) => {
        const encodedTitle = encodeURIComponent(title);
        await axios.delete(`${API_ARTICLES}/${encodedTitle}`);
        return title;
    }
);

const articlesSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteArticle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.loading = false;
                state.deletedTitle = action.payload;
            })
            .addCase(deleteArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load articles';
            });
    },
});

export default articlesSlice.reducer;