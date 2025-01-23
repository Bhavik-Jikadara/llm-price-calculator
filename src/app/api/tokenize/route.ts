import { NextResponse } from "next/server";
import * as GPT3TokenizerImport from 'gpt3-tokenizer';

// Initialize tokenizer
const GPT3Tokenizer = GPT3TokenizerImport.default || GPT3TokenizerImport;

const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    // Tokenize the text
    const encoded = tokenizer.encode(text);
    
    return NextResponse.json({ 
      tokens: encoded.text.length,
      tokenized: encoded.text 
    });
  } catch (error) {
    console.error("Tokenization error:", error);
    return NextResponse.json({ error: "Failed to calculate tokens" }, { status: 500 });
  }
}
