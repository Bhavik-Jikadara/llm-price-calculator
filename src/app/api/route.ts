import { NextResponse } from "next/server";
import * as GPT3TokenizerImport from 'gpt3-tokenizer';

type ModelPricing = {
  input: number;
  output: number;
};

type ProviderModels = {
  [key: string]: ModelPricing;
};

type PricingConfig = {
  [key: string]: ProviderModels;
};

const pricing: PricingConfig = {
  openai: {
    "gpt-3.5-turbo": { input: 0.0015, output: 0.003 },
    "gpt-3.5-turbo-16k": { input: 0.002, output: 0.004 },
    "gpt-4": { input: 0.06, output: 0.12 },
    "gpt-4-32k": { input: 0.12, output: 0.24 },
    "gpt-4-turbo": { input: 0.015, output: 0.03 },
    "dall-e-3": { input: 0.03, output: 0.06 },
    "whisper-1": { input: 0.001, output: 0.002 },
    "whisper-1-large": { input: 0.002, output: 0.004 }
  },
  anthropic: {
    "claude-1": { input: 0.01, output: 0.03 },
    "claude-2": { input: 0.015, output: 0.045 },
    "claude-3-haiku": { input: 0.003, output: 0.0075 },
    "claude-3-sonnet": { input: 0.015, output: 0.06 },
    "claude-3-opus": { input: 0.03, output: 0.12 },
    "claude-instant-1": { input: 0.003, output: 0.0075 },
    "claude-2-xl": { input: 0.02, output: 0.06 },
    "claude-2-xxl": { input: 0.03, output: 0.09 }
  },
  google: {
    "gemini-1": { input: 0.001, output: 0.002 },
    "gemini-1-pro": { input: 0.003, output: 0.006 },
    "gemini-1.5-pro": { input: 0.005, output: 0.01 },
    "palm-2": { input: 0.003, output: 0.006 },
    "palm-3": { input: 0.005, output: 0.01 },
    "palm-3-xl": { input: 0.01, output: 0.02 }
  },
  meta: {
    "llama-2-7b": { input: 0.001, output: 0.002 },
    "llama-2-13b": { input: 0.001, output: 0.002 },
    "llama-2-70b": { input: 0.001, output: 0.002 },
    "llama-2-70b-chat": { input: 0.001, output: 0.002 },
    "llama-3-33b": { input: 0.002, output: 0.004 },
    "llama-3-65b": { input: 0.003, output: 0.006 }
  },
  cohere: {
    "command-light": { input: 0.002, output: 0.004 },
    "command": { input: 0.003, output: 0.006 },
    "command-nightly": { input: 0.006, output: 0.012 },
    "command-light-nightly": { input: 0.003, output: 0.006 },
    "command-pro": { input: 0.005, output: 0.01 },
    "command-pro-nightly": { input: 0.01, output: 0.02 }
  },
  mistral: {
    "mistral-tiny": { input: 0.002, output: 0.004 },
    "mistral-small": { input: 0.003, output: 0.006 },
    "mistral-medium": { input: 0.006, output: 0.012 },
    "mistral-large": { input: 0.012, output: 0.024 },
    "mistral-xl": { input: 0.018, output: 0.036 },
    "mistral-xxl": { input: 0.024, output: 0.048 }
  },
  stability: {
    "stable-diffusion-xl": { input: 0.02, output: 0.04 },
    "stable-diffusion-xl-turbo": { input: 0.01, output: 0.02 },
    "stable-diffusion-2": { input: 0.02, output: 0.04 },
    "stable-diffusion-2-turbo": { input: 0.01, output: 0.02 }
  }
};

type RequestBody = {
  text: string;
  model: string;
  provider: string;
};

// Initialize tokenizer
const GPT3Tokenizer = GPT3TokenizerImport.default || GPT3TokenizerImport;
const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });

export async function POST(req: Request) {
  try {
    const { text, model, provider }: RequestBody = await req.json();

    // Calculate real token count
    const encoded = tokenizer.encode(text);
    const tokens = encoded.bpe.length;

    if (!pricing[provider]) {
      return NextResponse.json({ error: `Provider '${provider}' not found` }, { status: 400 });
    }

    const modelPricing = pricing[provider][model];
    if (!modelPricing) {
      return NextResponse.json({ error: `Model '${model}' not found` }, { status: 400 });
    }

    const cost = (tokens * (modelPricing.input + modelPricing.output)) / 1000;
    return NextResponse.json({ provider, model, tokens, cost });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ error: "Invalid request data", details: errorMessage }, { status: 400 });
  }
}
