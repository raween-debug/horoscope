import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__
    ? 'http://localhost:3000/api'
    : 'https://api.cosmicquest.app/api';

const TOKEN_KEY = '@cosmic_quest_token';

export const setAuthToken = async (token: string) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = async (): Promise<string | null> => {
    return AsyncStorage.getItem(TOKEN_KEY);
};

export const clearAuthToken = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
};

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export const apiClient = {
    async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
        try {
            const token = await getAuthToken();

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                    ...options.headers,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || 'Request failed',
                };
            }

            return data;
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    },

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.fetch<T>(endpoint, { method: 'GET' });
    },

    async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
        return this.fetch<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    },

    async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
        return this.fetch<T>(endpoint, {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    },

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.fetch<T>(endpoint, { method: 'DELETE' });
    },
};

// Auth API
export const authApi = {
    register: (data: { email: string; password: string; name: string; sign: string }) =>
        apiClient.post<{ token: string; user: any; pet: any }>('/auth/register', data),

    login: (data: { email: string; password: string }) =>
        apiClient.post<{ token: string; user: any; pet: any }>('/auth/login', data),

    me: () => apiClient.get<{ user: any; pet: any }>('/auth/me'),
};

// Guidance API
export const guidanceApi = {
    getGuidance: (date?: string) =>
        apiClient.get<{ guidance: any }>(`/guidance${date ? `?date=${date}` : ''}`),

    getHoroscope: (date?: string) =>
        apiClient.get<{ horoscope: any }>(`/guidance/horoscope${date ? `?date=${date}` : ''}`),
};

// Quests API
export const questsApi = {
    generate: (date?: string, timeAvailable?: number) =>
        apiClient.post<{ quests: any[]; generatedAt: string }>('/quests/generate', { date, timeAvailable }),

    getQuests: (date?: string) =>
        apiClient.get<{ quests: any[] }>(`/quests${date ? `?date=${date}` : ''}`),

    complete: (id: string) =>
        apiClient.post<{ quest: any }>(`/quests/${id}/complete`),
};

// Tasks API
export const tasksApi = {
    getAll: () => apiClient.get<{ tasks: any[] }>('/tasks'),

    create: (title: string, isTop3?: boolean) =>
        apiClient.post<{ task: any }>('/tasks', { title, isTop3 }),

    toggle: (id: string) =>
        apiClient.patch<{ task: any }>(`/tasks/${id}/toggle`),

    update: (id: string, data: { title?: string; isTop3?: boolean; order?: number }) =>
        apiClient.patch<{ task: any }>(`/tasks/${id}`, data),

    delete: (id: string) =>
        apiClient.delete<{ message: string }>(`/tasks/${id}`),

    sync: (tasks: any[]) =>
        apiClient.post<{ tasks: any[] }>('/tasks/sync', { tasks }),
};

// Goals API
export const goalsApi = {
    getAll: () => apiClient.get<{ goals: any[] }>('/goals'),

    create: (data: {
        title: string;
        why?: string;
        northStar?: string;
        weeklyMilestone?: string;
        dailyMicroStep?: string;
        fallbackStep?: string;
    }) => apiClient.post<{ goal: any }>('/goals', data),

    get: (id: string) => apiClient.get<{ goal: any }>(`/goals/${id}`),

    update: (id: string, data: { progress?: number; title?: string; [key: string]: any }) =>
        apiClient.patch<{ goal: any }>(`/goals/${id}`, data),

    pause: (id: string) => apiClient.post<{ goal: any }>(`/goals/${id}/pause`),

    resume: (id: string) => apiClient.post<{ goal: any }>(`/goals/${id}/resume`),

    delete: (id: string) => apiClient.delete<{ message: string }>(`/goals/${id}`),
};

// Journal API
export const journalApi = {
    drawTarot: () => apiClient.get<{ card: { name: string; meaning: string } }>('/journal/tarot/draw'),

    getEntries: (month?: number, year?: number) => {
        const params = month && year ? `?month=${month}&year=${year}` : '';
        return apiClient.get<{ entries: any[] }>(`/journal/entries${params}`);
    },

    saveEntry: (data: {
        date: string;
        tarotCard?: string;
        tarotMeaning?: string;
        prompts?: { question: string; answer: string }[];
        mood?: number;
    }) => apiClient.post<{ entry: any }>('/journal/entries', data),

    getSummary: (month: number, year: number) =>
        apiClient.get<{ summary: any }>(`/journal/summary?month=${month}&year=${year}`),
};

// Calendar API
export const calendarApi = {
    getEvents: (month?: number, year?: number) => {
        const params = month && year ? `?month=${month}&year=${year}` : '';
        return apiClient.get<{ events: any[]; moonPhases: any }>(`/calendar/events${params}`);
    },
};

// Compatibility API
export const compatibilityApi = {
    calculate: (name: string, sign: string) =>
        apiClient.post<{ profile: any }>('/compatibility/calculate', { name, sign }),

    getProfiles: () => apiClient.get<{ profiles: any[] }>('/compatibility/profiles'),

    deleteProfile: (id: string) =>
        apiClient.delete<{ message: string }>(`/compatibility/profiles/${id}`),
};

// User API
export const userApi = {
    updateProfile: (data: { name?: string; sign?: string; timePreference?: number }) =>
        apiClient.patch<{ user: any; pet: any }>('/user/profile', data),

    getPet: () => apiClient.get<{ pet: any }>('/user/pet'),

    updatePet: (name: string) => apiClient.patch<{ pet: any }>('/user/pet', { name }),

    feedPet: () => apiClient.post<{ pet: any; evolved?: boolean; message: string }>('/user/pet/feed'),

    getStats: () => apiClient.get<{ stats: any }>('/user/stats'),
};
