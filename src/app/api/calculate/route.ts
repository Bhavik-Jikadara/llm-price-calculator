import { NextResponse } from "next/server";

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
    "gpt-3.5-turbo": { input: 0.0004, output: 0.0008 },
    "gpt-3.5-turbo-16k": { input: 0.0006, output: 0.0012 },
    "gpt-4": { input: 0.03, output: 0.06 },
    "gpt-4-32k": { input: 0.06, output: 0.12 },
    "gpt-4-turbo": { input: 0.01, output: 0.02 },
    "dall-e-3": { input: 0.02, output: 0.04 },
    "whisper-1": { input: 0.0006, output: 0.0012 },
    "whisper-1-large": { input: 0.0012, output: 0.0024 }
  },
  anthropic: {
    "claude-1": { input: 0.008, output: 0.02 },
    "claude-2": { input: 0.01, output: 0.03 },
    "claude-3-haiku": { input: 0.002, output: 0.005 },
    "claude-3-sonnet": { input: 0.01, output: 0.04 },
    "claude-3-opus": { input: 0.02, output: 0.08 },
    "claude-instant-1": { input: 0.002, output: 0.005 },
    "claude-2-xl": { input: 0.015, output: 0.045 },
    "claude-2-xxl": { input: 0.025, output: 0.075 }
  },
  google: {
    "gemini-1": { input: 0.0008, output: 0.0012 },
    "gemini-1-pro": { input: 0.002, output: 0.004 },
    "gemini-1.5-pro": { input: 0.004, output: 0.008 },
    "palm-2": { input: 0.002, output: 0.004 },
    "palm-3": { input: 0.004, output: 0.008 },
    "palm-3-xl": { input: 0.008, output: 0.016 }
  },
  meta: {
    "llama-2-7b": { input: 0.0, output: 0.0 },
    "llama-2-13b": { input: 0.0, output: 0.0 },
    "llama-2-70b": { input: 0.0, output: 0.0 },
    "llama-2-70b-chat": { input: 0.0, output: 0.0 },
    "llama-3-33b": { input: 0.001, output: 0.002 },
    "llama-3-65b": { input: 0.002, output: 0.004 }
  },
  cohere: {
    "command-light": { input: 0.0012, output: 0.0024 },
    "command": { input: 0.0024, output: 0.0048 },
    "command-nightly": { input: 0.0048, output: 0.0096 },
    "command-light-nightly": { input: 0.0024, output: 0.0048 },
    "command-pro": { input: 0.0036, output: 0.0072 },
    "command-pro-nightly": { input: 0.0072, output: 0.0144 }
  },
  mistral: {
    "mistral-tiny": { input: 0.0012, output: 0.0024 },
    "mistral-small": { input: 0.0024, output: 0.0048 },
    "mistral-medium": { input: 0.0048, output: 0.0096 },
    "mistral-large": { input: 0.0096, output: 0.0192 },
    "mistral-xl": { input: 0.0144, output: 0.0288 },
    "mistral-xxl": { input: 0.0192, output: 0.0384 }
  },
  stability: {
    "stable-diffusion-xl": { input: 0.01, output: 0.02 },
    "stable-diffusion-xl-turbo": { input: 0.005, output: 0.01 },
    "stable-diffusion-2": { input: 0.015, output: 0.03 },
    "stable-diffusion-2-turbo": { input: 0.0075, output: 0.015 }
  }
};

type RequestBody = {
  tokens: number;
  model: string;
  provider: string;
};

export async function POST(req: Request) {
  try {
    const { tokens, model, provider }: RequestBody = await req.json();

    if (!pricing[provider]) {
      return NextResponse.json({ error: `Provider '${provider}' not found` }, { status: 400 });
    }

    const modelPricing = pricing[provider][model];
    if (!modelPricing) {
      return NextResponse.json({ error: `Model '${model}' not found` }, { status: 400 });
    }

    const cost = (tokens * (modelPricing.input + modelPricing.output)) / 1000;
    return NextResponse.json({ provider, model, tokens, cost });
  } catch {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }
}
