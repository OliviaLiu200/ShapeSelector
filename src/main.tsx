import { render } from 'preact';
import { historyManager } from './historyManager';
import './index.css';

import * as State from './state';

import Toolbar from './Toolbar';
import ShapeList from './ShapeList';
import StatusBar from './StatusBar';
import ShapeEditor from './ShapeEditor';
import { useEffect } from 'preact/hooks';

export default function App() {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.key === 'z' &&
                (event.ctrlKey || event.metaKey) &&
                !event.shiftKey
            ) {
                historyManager.undo();
                event.preventDefault();
            } else if (
                event.shiftKey &&
                (event.ctrlKey || event.metaKey) &&
                event.key === 'Z'
            ) {
                historyManager.redo();
                event.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div id="app">
            <div id="left-side">
                <Toolbar />
                <ShapeList />
                <StatusBar />
            </div>
            <div id="right-side">
                <ShapeEditor />
            </div>
        </div>
    );
}

render(<App />, document.querySelector('div#app') as Element);
