import { fetchArticles } from "../../../reducers/fetchArticles";
import { AppDispatch } from "../../../../store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { ROUTE_ARTICLE_NEW } from "../../../constants";
import { Stack, Button, Tooltip, OverlayTrigger, TooltipProps } from "react-bootstrap";
import { PlusCircleFill, ArrowClockwise } from "react-bootstrap-icons";
import { RefAttributes } from "react";
import { JSX } from "react/jsx-runtime";

function ArticleListHeader() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleRefresh = () => {
        dispatch(fetchArticles());
    };

    const handleAdd = () => {
        navigate(`/${ROUTE_ARTICLE_NEW}`);
    };

    const renderTooltip = (props: JSX.IntrinsicAttributes & TooltipProps & RefAttributes<HTMLDivElement>) => (
        <Tooltip id="button-tooltip" {...props}>
            Refresh list
        </Tooltip>
    );

    return (
        <Stack direction="horizontal" gap={3}>
            <h1>News Articles</h1>
            <OverlayTrigger
                placement="bottom"
                delay={{ show: 100, hide: 500 }}
                overlay={renderTooltip}
            >
                <Button variant='outline-secondary' onClick={handleRefresh}>
                    <ArrowClockwise />
                </Button>
            </OverlayTrigger>
            <Button variant='primary' className="ms-auto" onClick={handleAdd}>
                Add New Article
                <PlusCircleFill className="ms-2" />
            </Button>
        </Stack>
    );
}

export default ArticleListHeader;