import Humanize from 'humanize-plus';
import { Button, Card, Stack } from "react-bootstrap";
import { useNavigate } from "react-router";
import { AppDispatch, RootState } from "../../../../store";
import { useDispatch, useSelector } from "react-redux";
import { deleteArticle } from "../../../reducers/deleteArticle";
import { fetchArticles } from "../../../reducers/fetchArticles";
import { ROUTE_ARTICLE_EDIT } from "../../../constants";
import { Article } from "../../../data/models"; 

interface ArticleCardProps {
    article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleDelete = (title: string) => {
        dispatch(deleteArticle(title))
            .then(() => dispatch(fetchArticles()));
    };

    const handleEdit = (title: string) => {
        navigate(`/${ROUTE_ARTICLE_EDIT}/${encodeURIComponent(title)}`);
    };

    return (
        <Card>
            <Card.Body>
                <Card.Title>{article.title}</Card.Title>
                <Card.Subtitle>Published by {article.publisher}</Card.Subtitle>
                <Card.Text>{article.date.toDateString()}</Card.Text>
                <Card.Text>{Humanize.truncateWords(article.summary, 100) || article.summary}</Card.Text>
            </Card.Body>
            <Card.Footer>
                <Stack direction="horizontal" gap={3} >
                    <Button variant="secondary" className="ms-auto" onClick={() => handleEdit(article.title)}>
                        Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(article.title)}>Delete</Button>
                </Stack>
            </Card.Footer>
        </Card>
    );
}

export default ArticleCard;