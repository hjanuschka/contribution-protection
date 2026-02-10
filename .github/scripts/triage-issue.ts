#!/usr/bin/env npx tsx
/**
 * AI-powered issue triage using pi-core SDK
 */

import { createAgentSession, SessionManager, SettingsManager } from "@mariozechner/pi-coding-agent";

interface TriageResult {
  classification: "support" | "bug" | "feature" | "unclear";
  confidence: "high" | "medium" | "low";
  reason: string;
  suggestedAction: "close" | "keep" | "needs_info";
}

function getDefaultPrompt(title: string, body: string, extraInstructions: string): string {
  return `You are a GitHub issue triage assistant. Analyze this issue and classify it.

## Issue Title
${title}

## Issue Body
${body || "(empty)"}

## Classification Rules

**SUPPORT** - Close and redirect:
- "How do I..." / "How to..." questions
- Configuration/setup help requests
- Usage questions without any bug evidence
- Requests for tutorials or examples
- "It doesn't work" without error details or reproduction steps

**BUG** - Keep open:
- Has error messages, stack traces, or logs
- Includes steps to reproduce
- Reports unexpected behavior with evidence
- Mentions regression (worked before, now broken)
- Includes version info and reproduction details

**FEATURE** - Keep open:
- Requests new functionality
- Suggests improvements
- "Would be nice if..."

**UNCLEAR** - Need more info:
- Too vague to classify
- Could be bug or support, needs clarification

${extraInstructions ? `## Additional Instructions\n${extraInstructions}\n` : ""}
## Response Format
Respond with ONLY valid JSON (no markdown, no explanation):
{
  "classification": "support" | "bug" | "feature" | "unclear",
  "confidence": "high" | "medium" | "low",
  "reason": "brief explanation (1-2 sentences)",
  "suggestedAction": "close" | "keep" | "needs_info"
}`;
}

async function triageIssue(title: string, body: string): Promise<TriageResult> {
  const { session } = await createAgentSession({
    sessionManager: SessionManager.inMemory(),
    settingsManager: SettingsManager.inMemory({ compaction: { enabled: false } }),
    tools: [],
  });

  // Use custom prompt if provided, otherwise use default
  const customPrompt = process.env.CUSTOM_PROMPT?.trim();
  const extraInstructions = process.env.EXTRA_INSTRUCTIONS?.trim() || "";
  
  let prompt: string;
  if (customPrompt) {
    // Replace placeholders in custom prompt
    prompt = customPrompt
      .replace(/\{\{title\}\}/g, title)
      .replace(/\{\{body\}\}/g, body || "(empty)")
      .replace(/\{\{extra_instructions\}\}/g, extraInstructions);
  } else {
    prompt = getDefaultPrompt(title, body, extraInstructions);
  }

  let response = "";
  session.subscribe((event) => {
    if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
      response += event.assistantMessageEvent.delta;
    }
  });

  await session.prompt(prompt);
  session.dispose();

  // Parse the JSON response
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in response: " + response);
  }
  return JSON.parse(jsonMatch[0]) as TriageResult;
}

// Main execution
async function main() {
  const title = process.env.ISSUE_TITLE || "";
  const body = process.env.ISSUE_BODY || "";

  if (!title) {
    console.error("ISSUE_TITLE environment variable is required");
    process.exit(1);
  }

  try {
    const result = await triageIssue(title, body);
    
    console.log(`\n--- Triage Result ---`);
    console.log(`Classification: ${result.classification}`);
    console.log(`Confidence: ${result.confidence}`);
    console.log(`Reason: ${result.reason}`);
    console.log(`Action: ${result.suggestedAction}`);
    
    // Set outputs for GitHub Actions
    const outputFile = process.env.GITHUB_OUTPUT;
    if (outputFile) {
      const fs = await import("fs");
      fs.appendFileSync(outputFile, `classification=${result.classification}\n`);
      fs.appendFileSync(outputFile, `confidence=${result.confidence}\n`);
      fs.appendFileSync(outputFile, `reason=${result.reason}\n`);
      fs.appendFileSync(outputFile, `action=${result.suggestedAction}\n`);
    }
    
    process.exit(0);
  } catch (e) {
    console.error("Triage failed:", e);
    process.exit(1);
  }
}

main();
