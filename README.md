# Task Attachments

This project demonstrates how to attach multiple file types to tasks for comprehensive analysis using the Astreus AI framework.

## Features

- **Multi-File Attachments**: Support for various file types (code, images, JSON, markdown)
- **Comprehensive Analysis**: Analyze multiple files in a single task
- **Vision Integration**: Process images alongside other file types
- **Structured Metadata**: Rich task metadata for better organization

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Edit the `.env` file and add your API keys

## Running

```bash
npm run dev
```

## Code Explanation

The example creates a comprehensive code review task that analyzes TypeScript code, UI mockups, dependencies, and documentation all in one coordinated analysis.

## Supported File Types

- Code files (TypeScript, JavaScript, Python, etc.)
- Images (PNG, JPG, WebP for UI mockups)
- JSON files (package.json, config files)
- Markdown files (documentation)
- PDF documents
- And more...

## Environment Variables

```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
DB_URL=sqlite://./astreus.db
```

## More Information

- [Astreus AI Documentation](https://astreus.org/docs)
- [Task Features](https://astreus.org/docs/framework/task)
- [GitHub Repository](https://github.com/astreus-ai/astreus)