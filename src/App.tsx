import ArticleFormPage from './news-article/components/pages/ArticleFormPage';
import DisplayArticlesPage from './news-article/components/pages/DisplayArticlesPage';
import {  ROUTE_ARTICLE_EDIT, ROUTE_ARTICLE_NEW } from './news-article/constants';
import { Routes, Route } from 'react-router'; 

function App() { 
    return (
        <>
            <Routes>
                <Route path="/">
                    <Route index element={<DisplayArticlesPage />} />
                    <Route path={`${ROUTE_ARTICLE_NEW}`} element={<ArticleFormPage />} />
                    <Route path={`${ROUTE_ARTICLE_EDIT}/:originalTitle`} element={<ArticleFormPage />} />
                </Route>
            </Routes> 
        </>
    )
}

export default App
