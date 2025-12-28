export interface Report {
    id: string;
    name: string;
    repoUrl: string;
    status: 'pending' | 'analyzing' | 'verified' | 'flagged';
    confidence: number;
    createdAt: string;
    action?: string; // Add optional action for activity derivation
}

export interface BackendReport {
    _id: string;
    projectId: {
        _id: string;
        repoName: string;
        repoUrl: string;
        status: string;
    };
    confidenceScore: number;
    createdAt: string;
    // ... other fields
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}
