/**
 * `/answers`: one question per page, from `website.md` section 3.
 *
 * Slugs are short keyphrases, not the full sentence: the question is the H1,
 * the slug is what people type. Ordering here is the publish order.
 *
 * ⚠️ Per the ownership table in `website.md` section 4, questions that collide
 * with `/tools` or `/start` are deliberately absent from this list: those
 * intents are owned elsewhere and an answer page would cannibalise them.
 */

export type Answer = {
  slug: string;
  /** The H1, verbatim. */
  question: string;
};

export const ANSWERS: readonly Answer[] = [
  { slug: "build-an-app-without-coding", question: "Can you build an app without knowing how to code?" },
  { slug: "what-is-vibe-coding", question: "What is vibe coding?" },
  { slug: "how-long-to-build-an-app-with-ai", question: "How long does it take to build an app with AI?" },
  { slug: "cost-to-build-an-app-with-ai-india", question: "How much does it cost to build an app with AI in India?" },
  { slug: "is-ai-generated-code-safe", question: "Is AI-generated code safe to use?" },
  { slug: "what-ai-cannot-build-yet", question: "What can't AI build yet?" },
  { slug: "cs-degree-to-build-software", question: "Do you need a computer science degree to build software?" },
  { slug: "deploy-an-app-built-with-ai", question: "How do you deploy an app you built with AI?" },
  { slug: "are-no-code-apps-real-apps", question: "Are no-code apps real apps?" },
  { slug: "spot-wrong-ai-generated-code", question: "How do you know if AI-generated code is wrong?" },
  { slug: "no-code-vs-vibe-coding", question: "What's the difference between no-code and vibe coding?" },
  { slug: "employers-on-ai-built-projects", question: "What do employers think of AI-built projects?" },
] as const;

export function featuredAnswers(count: number): readonly Answer[] {
  return ANSWERS.slice(0, count);
}
