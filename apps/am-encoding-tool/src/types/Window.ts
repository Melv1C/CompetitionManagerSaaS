// This file extends the Window interface to add custom properties
declare global {
    interface Window {
        localDb: {
            getResults: () => Promise<any[]>;
            connectDb: () => Promise<{ success: boolean } | { success: boolean; error: string }>;
            executeQuery: (query: string) => Promise<any[] | { error: string }>;
        };
    }
}

export {};
