# LLM Price Calculator

A modern web application for calculating token usage and costs across various AI language models. Built with Next.js 15 and React.

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Development](#development)
- [API Routes](#api-routes)
- [Deployment](#deployment)

## Features
- 🤖 Support for multiple AI providers:
  - OpenAI (GPT-3.5, GPT-4, DALL-E 3, Whisper)
  - Anthropic (Claude models)
  - Google (Gemini, PaLM)
  - Meta (LLaMA models)
  - Cohere (Command models)
  - Mistral AI
  - Stability AI
- 💰 Real-time cost calculation
- 🔤 Live token counting and visualization
- 📊 Usage analytics and history tracking
- 🎨 Modern UI with dark/light mode
- ⚡️ Responsive design
- 🔄 Live updates and calculations

## Project Structure

```
├── .next/                  # Next.js build output
├── node_modules/          # Project dependencies
├── public/               # Static assets
├── src/                  # Source code
│   ├── app/             # Next.js app directory
│   │   ├── api/         # API routes
│   │   │   ├── calculate/  # Cost calculation endpoint
│   │   │   └── tokenize/   # Text tokenization endpoint
│   │   ├── components/  # React components
│   │   ├── lib/        # Utility functions
│   │   ├── favicon.ico # Site favicon
│   │   ├── globals.css # Global styles
│   │   ├── layout.tsx  # Root layout component
│   │   └── page.tsx    # Main page component
├── .env                 # Environment variables
├── .gitignore          # Git ignore rules
├── eslint.config.mjs   # ESLint configuration
├── next-env.d.ts       # Next.js TypeScript declarations
├── next.config.ts      # Next.js configuration
├── package.json        # Project metadata and dependencies
├── package-lock.json   # Dependency lock file
├── postcss.config.mjs  # PostCSS configuration
├── README.md          # Project documentation
├── tailwind.config.ts # Tailwind CSS configuration
└── tsconfig.json      # TypeScript configuration
```

## Technologies Used
- [Next.js 14](https://nextjs.org/) - React framework
- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Radix UI](https://www.radix-ui.com/) - Headless UI components
- [Recharts](https://recharts.org/) - Data visualization
- [GPT-3 Tokenizer](https://www.npmjs.com/package/gpt3-tokenizer) - Token counting

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
# Add any required API keys or environment variables
```

4. Start the development server:
```bash
npm run dev
```

## Development

The application is structured around several key components:

- `PriceCalculator`: Main component handling the calculator interface
- `TokenVisualizer`: Displays token breakdown
- `UsageChart`: Shows historical usage data
- API routes for token counting and cost calculation

## API Routes

### `/api/calculate`
Calculates costs based on:
- Token count
- Selected model
- Provider pricing

### `/api/tokenize`
Handles text tokenization using GPT-3 tokenizer

## Deployment

Deploy using [Vercel](https://vercel.com):

```bash
vercel
```

## License
[MIT](LICENSE)
