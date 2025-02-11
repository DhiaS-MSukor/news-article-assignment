import TextareaAutosize from 'react-textarea-autosize';
import React, { JSX, RefAttributes, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { useNavigate, useParams } from "react-router";
import { Article } from "../../../data/models";
import { Form, Button, Card, Stack, Container, ToastContainer, Toast, Tooltip, TooltipProps, OverlayTrigger } from "react-bootstrap";
import { addArticle } from "../../../reducers/addArticle";
import { updateArticle } from "../../../reducers/updateArticle";
import { ArrowClockwise, ArrowLeft, ArrowLeftCircle, ArrowLeftCircleFill } from 'react-bootstrap-icons';

interface RouteParams extends Record<string, string | undefined> {
    originalTitle?: string;
}

function ArticleFormPage() {
    const { originalTitle } = useParams<RouteParams>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const articles = useSelector((state: RootState) => state.articles.fetchArticles.articles);
    const isEditing = !!originalTitle;
    const articleToEdit: Article | undefined = isEditing
        ? articles.find((a) => a.title === originalTitle)
        : undefined;

    const [title, setTitle] = useState(articleToEdit ? articleToEdit.title : '');
    const [summary, setSummary] = useState(articleToEdit ? articleToEdit.summary : '');
    const [date, setDate] = useState(articleToEdit ? articleToEdit.date.toISOString().split('T')[0] : '');
    const [publisher, setPublisher] = useState(articleToEdit ? articleToEdit.publisher : '');
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState<string>();
    const [successMessage, setSuccessMessage] = useState<string>();
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [showMessageToast, setShowMessageToast] = useState(false);

    useEffect(() => {
        if (isEditing && articleToEdit) {
            setTitle(articleToEdit.title);
            setSummary(articleToEdit.summary);
            setDate(articleToEdit.date.toISOString().split('T')[0]);
            setPublisher(articleToEdit.publisher);
        }
    }, [isEditing, articleToEdit]);

    const renderTooltip = (props: JSX.IntrinsicAttributes & TooltipProps & RefAttributes<HTMLDivElement>) => (
        <Tooltip id="button-tooltip" {...props}>
            Go Back
        </Tooltip>
    );

    const handleGoBack = () => navigate('/');

    const clearForm = () => {
        setTitle('');
        setSummary('');
        setDate('');
        setPublisher('');
        setValidated(false);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;

        e.preventDefault();

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        setValidated(true);

        if (!title || !summary || !date || !publisher) return;
        if (isEditing && originalTitle) {
            dispatch(updateArticle({ originalTitle, updatedArticle: { title, summary, date, publisher } }))
                .unwrap()
                .then(
                    () => navigate('/'),
                    e => {
                        setError(e.message);
                        setShowErrorToast(true);
                    });
        } else {
            dispatch(addArticle({ title, summary, date, publisher }))
                .unwrap()
                .then(
                    () => {
                        clearForm();
                        setSuccessMessage('New article added');
                        setShowMessageToast(true);
                    },
                    e => {
                        setError(e.message);
                        setShowErrorToast(true);
                    });
        }
    };

    return (
        <Container>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Card className="">
                    <Card.Header>
                        <Stack direction="horizontal" gap={3}>
                            <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 100, hide: 500 }}
                                overlay={renderTooltip}
                            >
                                <Button variant='outline-secondary' onClick={handleGoBack}>
                                    <ArrowLeft />
                                </Button>
                            </OverlayTrigger>
                            <h1>{isEditing ? 'Edit Article' : 'Add Article'}</h1>
                        </Stack>
                    </Card.Header>
                    <Card.Body>
                        <Form.Floating className="mt-2">
                            <Form.Control required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter article title" />
                            <Form.Label>Title</Form.Label>
                            <Form.Control.Feedback type="invalid">
                                Please provide the article title.
                            </Form.Control.Feedback>
                        </Form.Floating>
                        <Form.Floating className="mt-2">
                            <Form.Control required as={TextareaAutosize} rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Enter article summary" />
                            <Form.Label>Summary</Form.Label>
                            <Form.Control.Feedback type="invalid">
                                Please provide the article summary.
                            </Form.Control.Feedback>
                        </Form.Floating>
                        <Form.Floating className="mt-2">
                            <Form.Control required type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                            <Form.Label>Date</Form.Label>
                            <Form.Control.Feedback type="invalid">
                                Please provide the article date.
                            </Form.Control.Feedback>
                        </Form.Floating>
                        <Form.Floating className="mt-2">
                            <Form.Control required type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} placeholder="Enter publisher" />
                            <Form.Label>Publisher</Form.Label>
                            <Form.Control.Feedback type="invalid">
                                Please provide the article's publisher.
                            </Form.Control.Feedback>
                        </Form.Floating>
                    </Card.Body>
                    <Card.Footer>
                        <Stack direction='horizontal'>
                            <Container />
                            <Button variant="primary" type="submit">
                                {isEditing ? 'Update Article' : 'Add Article'}
                            </Button>
                        </Stack>
                    </Card.Footer>
                </Card>
            </Form>
            <ToastContainer position="bottom-start" className="p-3">
                <Toast show={showErrorToast} onClose={() => setShowErrorToast(false)} delay={5000} autohide bg="danger">
                    <Toast.Header>
                        <strong className="me-auto">Error</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">{error}</Toast.Body>
                </Toast>
                <Toast show={showMessageToast} onClose={() => setShowMessageToast(false)} delay={5000} autohide bg="success">
                    <Toast.Header>
                        <strong className="me-auto">Success</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">{successMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
};

export default ArticleFormPage;
