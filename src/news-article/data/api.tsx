import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Humanize from 'humanize-plus';
import { generate as randomWords } from 'random-words';
import { API_ARTICLES } from '../constants';
import { isDate } from 'util/types';

const mock = new MockAdapter(axios, { delayResponse: 1000 });

const generateRandomArticle = () => ({
    title: Humanize.titleCase(randomWords({ min: 2, max: 10, join: ' ' })),
    summary: Humanize.capitalize(randomWords({ min: 20, max: 100, join: ' ' })),
    date: new Date(Date.now() - Math.floor(Math.random() * 10e8)),
    publisher: Humanize.capitalizeAll(randomWords({ min: 1, max: 3, join: ' ' }))
});

let articles = Array.from({ length: 16 }, generateRandomArticle);

if (process.env.NODE_ENV === 'development') {
    mock.onGet(API_ARTICLES).timeoutOnce();
    mock.onPost(API_ARTICLES).networkErrorOnce();
    mock.onDelete(new RegExp(`${API_ARTICLES}/.+`)).networkErrorOnce();
    mock.onPut(new RegExp(`${API_ARTICLES}/.+`)).networkErrorOnce();
}

mock.onGet(API_ARTICLES).reply((config) => {
    const { title, summary, dateFrom, dateTo, publisher } = config.params || {};
    let filteredArticles = articles;

    if (title) {
        filteredArticles = filteredArticles.filter(article =>
            article.title.toLowerCase().includes(title.toLowerCase())
        );
    }

    if (summary) {
        filteredArticles = filteredArticles.filter(article =>
            article.summary.toLowerCase().includes(summary.toLowerCase())
        );
    }

    if (Date.parse(dateFrom)) {
        filteredArticles = filteredArticles.filter(article =>
            new Date(article.date) >= new Date(Date.parse(dateFrom))
        );
    }

    if (Date.parse(dateTo)) {
        filteredArticles = filteredArticles.filter(article =>
            new Date(article.date) >= new Date(Date.parse(dateTo))
        );
    }

    if (publisher) {
        filteredArticles = filteredArticles.filter(article =>
            article.publisher.toLowerCase().includes(publisher.toLowerCase())
        );
    }
    
    filteredArticles.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
         
        if (dateA !== dateB) {
            return dateB - dateA;
        }
         
        const publisherComparison = a.publisher.localeCompare(b.publisher);
        if (publisherComparison !== 0) {
            return publisherComparison;
        }
         
        return a.title.localeCompare(b.title);
    });

    return [200, filteredArticles];
});

mock.onPost(API_ARTICLES)
    .reply((config) => {
        const newArticle = JSON.parse(config.data);
        articles.push({ ...newArticle, date: newArticle.date });
        return [201, newArticle];
    });

mock.onDelete(new RegExp(`${API_ARTICLES}/.+`)).reply((config) => {
    const urlParts = config.url!.split('/');
    const encodedTitle = urlParts[urlParts.length - 1];
    const title = decodeURIComponent(encodedTitle);
    articles = articles.filter((article) => article.title !== title);
    return [200];
});

mock.onPut(new RegExp(`${API_ARTICLES}/.+`)).reply((config) => {
    const urlParts = config.url!.split('/');
    const encodedTitle = urlParts[urlParts.length - 1];
    const originalTitle = decodeURIComponent(encodedTitle);
    const updatedData = JSON.parse(config.data);
    let found = false;
    articles = articles.map((article) => {
        if (article.title === originalTitle) {
            found = true;
            return { ...updatedData, date: updatedData.date };
        }
        return article;
    });
    if (found) {
        const updatedArticle = articles.find((a) => a.title === updatedData.title);
        return [200, updatedArticle];
    } else {
        return [404];
    }
});

export default mock;