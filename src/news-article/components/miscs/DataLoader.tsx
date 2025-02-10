import { Container } from "react-bootstrap";

interface DataLoaderProps {
    loading: boolean;
    loadingMessage?: string
    error?: string | null;
    children: React.ReactNode;
}

const DataLoader: React.FC<DataLoaderProps> = ({ loading, error, loadingMessage = 'Loading...', children }) => {
    if (loading) {
        return (
            <Container>
                <p>{loadingMessage}</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <p>{error}</p>
            </Container>
        );
    }

    return <Container>{children}</Container>;
};

export default DataLoader;