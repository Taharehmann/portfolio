import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from .env and .env.local into process.env for local development
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      {
        name: 'api-contact-dev-server',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/contact' && req.method === 'POST') {
              try {
                let rawBody = '';
                req.on('data', (chunk) => {
                  rawBody += chunk;
                });
                req.on('end', async () => {
                  try {
                    req.body = rawBody ? JSON.parse(rawBody) : {};
                  } catch {
                    req.body = rawBody;
                  }

                  res.status = (code) => {
                    res.statusCode = code;
                    return res;
                  };

                  res.json = (data) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                    return res;
                  };

                  const { default: handler } = await import('./api/contact.js');
                  await handler(req, res);
                });
              } catch (err) {
                console.error('Local API Error:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            } else {
              next();
            }
          });
        },
      },
    ],
  };
});

