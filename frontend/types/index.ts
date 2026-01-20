export interface Project {
    id: string;
    name: string;
    repoName: string;
    repoUrl: string;
    status: 'active' | 'archived' | 'maintenance' | 'pending';
    createdAt: string;
    description?: string;
}

export interface Report {
    id: string;
    name: string;
    repoUrl: string;
    status: 'pending' | 'analyzing' | 'verified' | 'flagged'| 'processing';
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
