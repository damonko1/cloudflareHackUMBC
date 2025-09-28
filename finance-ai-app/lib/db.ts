// finance-ai-app/lib/env.d.ts (Create this file if it doesn't exist)
// This defines the environment variables available in your Pages Functions

interface Env {
    // The binding name you set in wrangler.toml: [[d1_databases]] binding = "DB"
    DB: D1Database; 
}

// You may need to modify the global Request handler type to include Env
// The exact method depends on your Next.js/Pages setup, but typically you access via the context or environment.