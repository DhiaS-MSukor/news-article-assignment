import axios from 'axios';
import { Article } from '../data/models';
import { API_ARTICLES } from '../constants';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import '../data/api';

export interface ArticlesState {
    articles: Article[];
    loading: boolean;
    error: string | null;
}

export interface ArticlesFilter {
    title: string;
    summary: string;
    dateFrom: string;
    dateTo: string;
    publisher: string;
}

const initialState: ArticlesState = {
    articles: [],
    loading: false,
    error: null,
};

export const fetchArticles = createAsyncThunk<Article[], Partial<ArticlesFilter> | void>(
    'articles/fetchArticles',
    async (articleFilter = {}) => {
        const response = await axios.get(API_ARTICLES, { params: articleFilter });
        const articlesData = response.data.map((item: any) => ({
            ...item,
            date: item.date ? new Date(item.date) : undefined,
        }));
        return articlesData;
    }
);

const articlesSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArticles.fulfilled, (state, action) => {
                state.loading = false;
                state.articles = action.payload;
            })
            .addCase(fetchArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load articles';
            });
    },
});

export default articlesSlice.reducer;