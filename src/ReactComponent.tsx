import { useState } from 'react'
import { Container } from "react-bootstrap";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './ReactComponent.css'

function ReactComponent() {
    const [count, setCount] = useState(0)

    return (
        <Container>
            <Container>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </Container>
            <h1>Vite + React</h1>
            <Container>
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </Container>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </Container>
  );
}

export default ReactComponent;