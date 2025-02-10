import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ARTICLES } from "../constants";
import { Article } from "../data/models";
interface UpdateArticleState {
    updatedArticle: Article | null;
    loading: boolean;
    error: string | null;
}

const initialState: UpdateArticleState = {
    updatedArticle: null,
    loading: false,
    error: null,
};

export const updateArticle = createAsyncThunk<
    Article,
    { originalTitle: string; updatedArticle: Omit<Article, 'date'> & { date: string } }
>(
    'updateArticle/updateArticle',
    async ({ originalTitle, updatedArticle }) => {
        const encodedTitle = encodeURIComponent(originalTitle);
        const response = await axios.put(`${API_ARTICLES}/${encodedTitle}`, updatedArticle);
        const article = response.data;
        article.date = new Date(article.date);
        return article;
    }
);

const updateArticleSlice = createSlice({
    name: 'updateArticle',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateArticle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateArticle.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedArticle = action.payload;
            })
            .addCase(updateArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update article';
            });
    },
});

export default updateArticleSlice.reducer;