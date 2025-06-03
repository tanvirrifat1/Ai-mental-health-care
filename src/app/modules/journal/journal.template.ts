// Function to generate HTML string from journal data
export function generateJournalHTML(journalData: any) {
  // Ensure journalData has required fields, provide defaults if missing
  const {
    title = 'Untitled Journal',
    description = [],
    date = new Date().toISOString().split('T')[0],
    type = 'Daily Journal',
    userId = 'Unknown',
  } = journalData;

  // Format date for display
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // HTML template string
  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Journal Entry</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      line-height: 1.6;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
    }
    h1 {
      color: #333;
      text-align: center;
    }
    .journal-meta {
      margin-bottom: 20px;
      color: #555;
    }
    .journal-meta p {
      margin: 5px 0;
    }
    .description {
      margin-top: 20px;
    }
    .description p {
      margin: 10px 0;
      padding: 10px;
      background-color: #f9f9f9;
      border-left: 4px solid #007bff;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Journal Entry</h1>
    <div class="journal-meta">
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Type:</strong> ${type}</p>
      <p><strong>User ID:</strong> ${userId}</p>
    </div>
    <div class="description">
      <h2>Description</h2>
      ${
        description.length > 0
          ? description.map((desc: string) => `<p>${desc}</p>`).join('')
          : '<p>No description provided.</p>'
      }
    </div>
  </div>
</body>
</html>
  `;

  return htmlTemplate;
}
