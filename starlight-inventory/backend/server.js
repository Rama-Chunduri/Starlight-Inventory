import { google } from 'googleapis';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const auth = new google.auth.GoogleAuth({
  //email: 'starlight-cardiovascular@starlight-traveler-automation.iam.gserviceaccount.com',
  //subject: 'starlightcardiovascular@gmail.com',
  keyFile: './starlight-traveler-automation-c0c4f33a432c.json', // path to your downloaded JSON
  scopes: ['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive'],
  clientOptions: {
    subject: 'starlightcardiovascular@gmail.com' // your user account
  }
});

app.post('/generate-doc', async (req, res) => {
  const { templateId, replacements } = req.body; 

  try {
    const authClient = await auth.getClient();
    const docs = google.docs({ version: 'v1', auth: authClient });
    const drive = google.drive({ version: 'v3', auth: authClient });

    const filesListRes = await drive.files.list({
        fields: 'files(id, name)',
        q: "'me' in owners",
    });
    console.log(filesListRes.data.files);


    // 1. Make a copy of the template
    const copyResponse = await drive.files.copy({
      fileId: templateId,
      requestBody: {
        name: `Generated Document - ${Date.now()}`,
      },
    });

    const documentId = copyResponse.data.id;

    // 2. Replace placeholders
    const requests = Object.entries(replacements).map(([key, value]) => ({
      replaceAllText: {
        containsText: { text: key, matchCase: true },
        replaceText: value,
      },
    }));

    await docs.documents.batchUpdate({
      documentId,
      requestBody: { requests },
    });

    res.json({ documentId, docUrl: `https://docs.google.com/document/d/${documentId}/edit` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating document' });

  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});