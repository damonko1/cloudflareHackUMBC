import { type NextRequest, NextResponse } from "next/server";
const USER_ID = "DUMMY_USER_ID"

function parseCsv(csvText: string) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return []; 

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const records = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const record: Record<string, string | number> = {};

        // Map values to headers
        headers.forEach((header, index) => {
            if (values[index]) {
                // Special handling for amount
                record[header] = header === 'amount' ? Number.parseFloat(values[index]) : values[index];
            }
        });

        // Ensure minimum valid structure
        if (record.amount && record.type && record.date) {
            records.push(record);
        }
    }
    return records;
}

export async function POST(request: NextRequest, context: { env: Env }) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const text = await file.text();
        const records = parseCsv(text); 

        if (records.length === 0) {
            return NextResponse.json({ error: "No valid transactions found in the file" }, { status: 400 });
        }

        const db = context.env.DB;
        const USER_ID = "DUMMY_USER_ID"; 

        // array of prepared statements 
        const statements = records.map((tx) => {
            // define the statement for each record
            return db.prepare(
                `INSERT INTO Transactions (user_id, amount, type, description, category, date, note)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`
            ).bind(
                USER_ID,
                tx.amount,
                tx.type,
                tx.description || 'No description',
                tx.category || 'Uncategorized',
                tx.date,
                tx.notes || null
            );
        });
        const batchResult = await db.batch(statements); 
        return NextResponse.json({ 
            message: `${records.length} transactions uploaded successfully.`,
            results: batchResult 
        });
    } catch (error) {
        console.error("Error uploading transactions:", error);
        return NextResponse.json({ error: "Failed to upload transactions" }, { status: 500 });
    }
}