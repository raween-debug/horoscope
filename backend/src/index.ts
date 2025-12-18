import express from 'express';
import cors from 'cors';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import guidanceRoutes from './routes/guidance';
import questRoutes from './routes/quests';
import taskRoutes from './routes/tasks';
import goalRoutes from './routes/goals';
import journalRoutes from './routes/journal';
import calendarRoutes from './routes/calendar';
import compatibilityRoutes from './routes/compatibility';
import userRoutes from './routes/user';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/guidance', guidanceRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/compatibility', compatibilityRoutes);
app.use('/api/user', userRoutes);

// Error handling
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
});

export default app;
