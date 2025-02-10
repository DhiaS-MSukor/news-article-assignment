import { combineReducers } from '@reduxjs/toolkit';
import fetchArticles from './fetchArticles';
import addArticles from './addArticle';
import deleteArticles from './deleteArticle';
import updateArticle from './updateArticle';

const rootReducer = combineReducers({
    fetchArticles: fetchArticles,
    addArticle: addArticles,
    deleteArticle: deleteArticles,
    updateArticle: updateArticle,
});

export default rootReducer;