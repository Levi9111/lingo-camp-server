import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import router from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(helmet());
// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.get('/', (_, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LingoCamp API | Modern Language Learning</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
        <style>
            :root {
                --primary: #6366f1;
                --secondary: #a855f7;
                --accent: #ec4899;
                --bg: #0f172a;
                --card-bg: rgba(30, 41, 59, 0.7);
                --text: #f8fafc;
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Outfit', sans-serif;
            }

            body {
                background: var(--bg);
                color: var(--text);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                position: relative;
            }

            /* Animated Background */
            .bg-glow {
                position: absolute;
                width: 500px;
                height: 500px;
                background: radial-gradient(circle, var(--primary), transparent 70%);
                filter: blur(80px);
                opacity: 0.15;
                z-index: -1;
                animation: move 20s infinite alternate;
            }

            .bg-glow-2 {
                position: absolute;
                width: 400px;
                height: 400px;
                background: radial-gradient(circle, var(--accent), transparent 70%);
                filter: blur(80px);
                opacity: 0.1;
                z-index: -1;
                animation: move 15s infinite alternate-reverse;
            }

            @keyframes move {
                from { transform: translate(-50%, -50%); }
                to { transform: translate(50%, 50%); }
            }

            .container {
                max-width: 800px;
                padding: 3rem;
                background: var(--card-bg);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 2rem;
                text-align: center;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                animation: fadeIn 1s ease-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            h1 {
                font-size: 4rem;
                font-weight: 800;
                margin-bottom: 1rem;
                background: linear-gradient(to right, var(--primary), var(--secondary), var(--accent));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                letter-spacing: -0.05em;
            }

            p {
                font-size: 1.25rem;
                color: #94a3b8;
                margin-bottom: 2.5rem;
                line-height: 1.6;
            }

            .badge {
                display: inline-block;
                padding: 0.5rem 1rem;
                background: rgba(99, 102, 241, 0.1);
                color: var(--primary);
                border-radius: 9999px;
                font-weight: 600;
                font-size: 0.875rem;
                margin-bottom: 1.5rem;
                border: 1px solid rgba(99, 102, 241, 0.2);
            }

            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2.5rem;
            }

            .stat-card {
                padding: 1.5rem;
                background: rgba(255, 255, 255, 0.03);
                border-radius: 1.25rem;
                border: 1px solid rgba(255, 255, 255, 0.05);
                transition: all 0.3s ease;
            }

            .stat-card:hover {
                background: rgba(255, 255, 255, 0.06);
                transform: translateY(-5px);
                border-color: rgba(99, 102, 241, 0.3);
            }

            .stat-card h3 {
                font-size: 1.5rem;
                margin-bottom: 0.25rem;
                color: var(--text);
            }

            .stat-card span {
                font-size: 0.875rem;
                color: #64748b;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }

            .cta-group {
                display: flex;
                gap: 1rem;
                justify-content: center;
            }

            .btn {
                padding: 0.875rem 2rem;
                border-radius: 1rem;
                font-weight: 600;
                text-decoration: none;
                transition: all 0.3s ease;
            }

            .btn-primary {
                background: var(--primary);
                color: white;
                box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);
            }

            .btn-primary:hover {
                background: #4f46e5;
                transform: scale(1.05);
            }

            .btn-outline {
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: var(--text);
            }

            .btn-outline:hover {
                background: rgba(255, 255, 255, 0.05);
                border-color: rgba(255, 255, 255, 0.2);
            }

            footer {
                margin-top: 3rem;
                font-size: 0.875rem;
                color: #475569;
            }
        </style>
    </head>
    <body>
        <div class="bg-glow"></div>
        <div class="bg-glow-2"></div>

        <div class="container">
            <div class="badge">v2.0.0 Live</div>
            <h1>LingoCamp API</h1>
            <p>The powerful backend engine driving modern language learning experiences. Secure, scalable, and developer-friendly.</p>
            
            <div class="grid">
                <div class="stat-card">
                    <h3>RESTful</h3>
                    <span>Architecture</span>
                </div>
                <div class="stat-card">
                    <h3>JWT</h3>
                    <span>Security</span>
                </div>
                <div class="stat-card">
                    <h3>Stripe</h3>
                    <span>Payments</span>
                </div>
            </div>

            <div class="cta-group">
                <a href="/api/classes" class="btn btn-primary">Explore Classes</a>
                <a href="/api/instructors" class="btn btn-outline">Instructors</a>
            </div>

            <footer>
                &copy; 2024 LingoCamp Legacy Project. All rights reserved.
            </footer>
        </div>
    </body>
    </html>
  `);
});
app.use('/api', router);

app.use(errorHandler);

export default app;
