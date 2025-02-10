import axios from "axios"; 
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ARTICLES } from "../constants";
import { Article } from "../data/models"; 

interface AddArticleState {
    addedArticle: Article | null;
    loading: boolean;
    error: string | null;
}

const initialState: AddArticleState = {
    addedArticle: null,
    loading: false,
    error: null,
};
 
export const addArticle = createAsyncThunk<Article, Omit<Article, 'date'> & { date: string }>(
    'articles/addArticle',
    async (newArticle) => {
        const response = await axios.post(API_ARTICLES, newArticle);
        const article = response.data;
        article.date = new Date(article.date);
        return article;
    }
);


const articlesSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(addArticle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addArticle.fulfilled, (state, action) => {
                state.loading = false;
                state.addedArticle = action.payload;
            })
            .addCase(addArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load articles';
            });
    },
});

export default articlesSlice.reducer;