import { useEffect, useState } from 'react';

export function Truc() {
    const [results, setResults] = useState<any[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    return (
        <>
            <h1>Test</h1>
            {/* <button onClick={async () => {
                const result = await window.localDb.connectDb();
                if (result.success) {
                    setIsConnected(true);
                    const data = await window.localDb.getResults();
                    setResults(data);
                } else {
                    console.error('Connection failed:', 'error' in result ? result.error : 'Unknown error');
                }
            }}>Connect</button> */}

            <input type="text" id="queryInput" placeholder="Enter SQL query" />
            <button onClick={async () => {
                const query = (document.getElementById('queryInput') as HTMLInputElement)?.value || '';
                const result = await window.localDb.executeQuery(query);
                if ('error' in result) {
                    console.error('Query execution failed:', result.error);
                } else {
                    setResults(result);
                }
            }}>
                Execute Query
            </button>
            {results.map((result, index) => (
                <div key={index}>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            ))}
        </>
    );
}
