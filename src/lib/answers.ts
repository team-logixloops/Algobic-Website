/**
 * `/answers`: the AEO and GEO surface.
 *
 * One question per entry, encyclopedia tone, declarative sentences. Every
 * `answer` below is 40 to 60 words, which is the length that gets extracted
 * whole by an answer engine rather than truncated mid-clause, and every one is
 * written to survive being quoted with no page around it.
 *
 * ### Why the answers are here rather than only on their own pages
 *
 * `website.md` section 3 specifies one page per question, and that is still the
 * plan: these slugs are reserved for `/answers/[question]` and the URLs will
 * not change. None of those pages is written. The hub therefore carries the
 * short answer inline today, which is a real tradeoff and is recorded rather
 * than glossed:
 *
 * - **Against:** section 5 says "one question per page, don't bundle", and a
 *   hub answering twelve questions is a bundle.
 * - **For:** the alternative ships twelve question headings with nothing under
 *   them, which is thin content pointing at pages that do not exist, and it
 *   gives answer engines nothing to extract for a year.
 *
 * The resolution is that the inline answer is deliberately the *short* one. It
 * is the 40-to-60-word block and nothing else: no detail, no worked example, no
 * links to builds. When a question's own page ships, that page carries the same
 * block plus everything under it, the hub entry becomes a link, and the hub
 * stops competing because it never held the long version.
 *
 * ⚠️ Per the ownership table in `website.md` section 4, questions that collide
 * with `/tools` or `/start` are deliberately absent: "what should a non-engineer
 * build first" belongs to `/start`, "best AI app builder for beginners" and
 * "can students in India use these free" belong to `/tools`. An answer page for
 * any of them would cannibalise the owner.
 *
 * The `answer` strings are also what goes into the `FAQPage` block, verbatim.
 * Markup that says something the visible page does not is the one structured
 * data mistake that carries a manual penalty rather than an indifferent shrug,
 * so they are read from here rather than retyped.
 */

export type Answer = {
  /** Short keyphrase, not the sentence. The question is the H1; this is what people type. */
  slug: string;
  /** The H1 of the page this becomes, verbatim. */
  question: string;
  /** 40 to 60 words, declarative. Count them before editing. */
  answer: string;
  /** Whether `/answers/[slug]` resolves today. Opt-in, same rule as `nav.ts`. */
  live?: true;
};

export const ANSWERS: readonly Answer[] = [
  {
    slug: "build-an-app-without-coding",
    question: "Can you build an app without knowing how to code?",
    answer:
      "Yes. AI app builders like Lovable, Bolt and Replit turn a written description into a working app, and you steer them in plain English. You still need judgment: what to build, whether the result actually works, and where it breaks. That part nobody has automated. Coding is optional now. Checking is not.",
  },
  {
    slug: "what-is-vibe-coding",
    question: "What is vibe coding?",
    answer:
      "Vibe coding is describing what you want in plain language, letting an AI model write the code, and judging the result by whether it runs rather than by reading every line. Andrej Karpathy named it in February 2025. It is fast, and it is exactly why checking the output matters more than it used to.",
  },
  {
    slug: "how-long-to-build-an-app-with-ai",
    question: "How long does it take to build an app with AI?",
    answer:
      "A small, single-purpose app takes one to four hours end to end, including deploying it. The generating part is often twenty minutes. The rest is what nobody films: fixing what the model got wrong, connecting a database, and getting a live URL that still works tomorrow morning.",
  },
  {
    slug: "cost-to-build-an-app-with-ai-india",
    question: "How much does it cost to build an app with AI in India?",
    answer:
      "₹0 for a first build, if you stay inside free tiers. Lovable, Bolt, Replit and Supabase all ship one, and a small app fits inside it. Cost starts when you need always-on hosting, a higher message limit, or a custom domain. Every build published here is ₹0 to build and ₹0 to keep running.",
  },
  {
    slug: "is-ai-generated-code-safe",
    question: "Is AI-generated code safe to use?",
    answer:
      "Not automatically. Models write code that runs and is still unsafe: API keys left in the frontend, a database with no access rules, forms that accept anything typed into them. The generating is not the risk. Shipping it unread is. Check what touches user data and what is publicly reachable.",
  },
  {
    slug: "what-ai-cannot-build-yet",
    question: "What can't AI build yet?",
    answer:
      "Anything needing a decision nobody wrote down. Models are strong where there are millions of public examples and weak on your specific constraints: a payment flow matching one bank's rules, real concurrency, anything where being subtly wrong is expensive. It also cannot tell you whether the thing is worth building.",
  },
  {
    slug: "cs-degree-to-build-software",
    question: "Do you need a computer science degree to build software?",
    answer:
      "No. You need a working machine, an internet connection, and something specific you want to exist. A degree teaches the theory underneath the tools, and the tools no longer require it. What a degree still buys is a hiring signal, and one live URL with real users buys a comparable one faster.",
  },
  {
    slug: "deploy-an-app-built-with-ai",
    question: "How do you deploy an app you built with AI?",
    answer:
      "Most AI app builders deploy for you: one button, and you get a URL on their subdomain. Anything built locally goes to Vercel, Netlify or Replit, connected to a GitHub repo and deployed on push. Deploying is the easy half. Staying reachable, on a tier that does not sleep, is the half that fails.",
  },
  {
    slug: "are-no-code-apps-real-apps",
    question: "Are no-code apps real apps?",
    answer:
      "Yes, by the only test that matters: somebody can open the URL and use it. A no-code app runs on the same hosting, stores data in the same kind of database, and breaks in the same ways. The real limits are depth and cost at scale, not legitimacy.",
  },
  {
    slug: "spot-wrong-ai-generated-code",
    question: "How do you know if AI-generated code is wrong?",
    answer:
      "It runs and the result is still wrong. The tells: data that saves but never comes back, a call to a method that does not exist, hardcoded values where a variable belongs. Use the thing like a stranger would, then check what it actually wrote to the database.",
  },
  {
    slug: "no-code-vs-vibe-coding",
    question: "What's the difference between no-code and vibe coding?",
    answer:
      "No-code assembles an app from prebuilt blocks in a visual editor, and you stay inside what the platform supports. Vibe coding generates real code from a description, so you can go anywhere the language goes and you inherit real bugs. No-code has a ceiling. Vibe coding has a floor you can fall through.",
  },
  {
    slug: "employers-on-ai-built-projects",
    question: "What do employers think of AI-built projects?",
    answer:
      "They care whether it works and whether you can explain it. A live URL with real users beats a certificate. What loses points is not the AI, it is not knowing your own project: where the data lives, why it broke, what you changed. Bring the failures, not only the demo.",
  },
] as const;

export function featuredAnswers(count: number): readonly Answer[] {
  return ANSWERS.slice(0, count);
}

/** How many of the twelve have their own page today. Rendered as the honest count. */
export function publishedAnswers(): number {
  return ANSWERS.filter((answer) => answer.live).length;
}
