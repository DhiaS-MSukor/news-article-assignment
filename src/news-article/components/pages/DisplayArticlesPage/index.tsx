import DataLoader from "../../miscs/DataLoader";
import ArticleCard from "./ArticleCard";
import ArticleListHeader from "./ArticleListHeader";
import { fetchArticles } from "../../../reducers/fetchArticles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import NuPagination, { usePagination } from "../../miscs/NuPagination";
import {
    Card,
    CardBody,
    CardFooter,
    Col,
    Container,
    Form,
    Row,
    Stack,
    Toast,
    ToastContainer
} from "react-bootstrap";

function DisplayArticlesPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { articles, loading, error: fetchError } = useSelector(
        (state: RootState) => state.articles.fetchArticles
    );
    const { error: deleteError } = useSelector(
        (state: RootState) => state.articles.deleteArticle
    );
    const [showToast, setShowToast] = useState(false);
    const [error, setError] = useState<string>();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [publisher, setPublisher] = useState('');

    function loadArticles() {
        return dispatch(fetchArticles({ title, dateFrom, dateTo, publisher, summary }));
    }

    useEffect(() => {
        loadArticles();
    }, [dispatch, title, dateFrom, dateTo, publisher, summary]);

    useEffect(() => {
        if (deleteError) {
            setError(deleteError);
            setShowToast(true);
        }
    }, [deleteError]);

    useEffect(() => {
        if (fetchError) {
            setError(`${fetchError}. Refreshing in 5 seconds`);
            setShowToast(true);

            const timer = setTimeout(loadArticles, 5000);
            return () => clearTimeout(timer);
        }
    }, [fetchError, dispatch]);

    let pagination = usePagination(articles);

    return <Container>
        <Card>
            <Card.Header>
                <ArticleListHeader />
            </Card.Header>
            <CardBody>
                <Stack gap={3}>
                    <Card>
                        <Card.Header>
                            <strong>Filters</strong>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Form.Floating className="mt-2">
                                        <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter article title" />
                                        <Form.Label>Title</Form.Label>
                                    </Form.Floating>
                                </Col>
                                <Col>
                                    <Form.Floating className="mt-2">
                                        <Form.Control type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} placeholder="Enter publisher" />
                                        <Form.Label>Publisher</Form.Label>
                                    </Form.Floating>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Floating className="mt-2">
                                        <Form.Control type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                                        <Form.Label>From Date</Form.Label>
                                    </Form.Floating>
                                </Col>
                                <Col>
                                    <Form.Floating className="mt-2">
                                        <Form.Control type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                                        <Form.Label>To Date</Form.Label>
                                    </Form.Floating>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Floating className="mt-2">
                                        <Form.Control type="text" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Enter article summary" />
                                        <Form.Label>Summary</Form.Label>
                                    </Form.Floating>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <DataLoader loading={loading} error={fetchError} loadingMessage='Loading articles...'>
                        <Stack gap={3}>
                            {pagination.paginatedItems.map((article, index) => (
                                <ArticleCard key={index} article={article} />
                            ))}
                        </Stack>
                    </DataLoader>
                </Stack>
            </CardBody>
            <CardFooter>
                <Stack direction="horizontal">
                    <Container className="me-auto" />
                    <NuPagination pagination={pagination} />
                    <Container className="ms-auto" />
                </Stack>
            </CardFooter>
        </Card>
        <ToastContainer position="bottom-start" className="p-3">
            <Toast show={showToast} onClose={() => setShowToast(false)} delay={5000} autohide bg="danger">
                <Toast.Header>
                    <strong className="me-auto">Error</strong>
                </Toast.Header>
                <Toast.Body className="text-white">{error}</Toast.Body>
            </Toast>
        </ToastContainer>
    </Container>
}

export default DisplayArticlesPage;