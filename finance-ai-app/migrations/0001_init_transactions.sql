-- D1 Migration File: 0001_init_transactions.sql

CREATE TABLE IF NOT EXISTS Transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    user_id TEXT NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    category TEXT,
    date TEXT NOT NULL,
    note TEXT
);

CREATE INDEX idx_user_date ON Transactions (user_id, date);