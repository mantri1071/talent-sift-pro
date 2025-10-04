import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, resumeCount, caseId } = req.body;

  if (!email || !resumeCount || !caseId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 1️⃣ Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // 2️⃣ Prepare row data
    const values = [[
      caseId,
      email,
      resumeCount,
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    ]];

    // 3️⃣ Append to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:D",
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    res.status(200).json({ message: "Logged to Google Sheet ✅" });
  } catch (error) {
    console.error("Error logging to Google Sheets:", error);
    res.status(500).json({ error: "Failed to log data" });
  }
}