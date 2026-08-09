/**
 * `/start`: the five things worth building first, and the ten behind them.
 *
 * This page answers one question, and it is the only page allowed to:
 * *what do I build first?* Every other surface links here instead of
 * re-answering it, per the ownership table in `website.md` section 4.
 *
 * ### How the copy in this file is written, and why
 *
 * Every `scene` opens on a specific moment with a specific person in it, before
 * any feature is named. That is not a style preference. People do not act on
 * categories, they act on situations they recognise, and a reader who has
 * pictured their own group chat before reading the word "bot" has already
 * decided the thing is worth building. Rewritten 2026-08-09 for exactly this:
 * the first version led with what each thing *was*, which is the order a
 * product catalogue uses and the reverse of the order a person decides in.
 *
 * ⚠️ `budgetMinutes` is a budget, not a measurement. It is what the build is
 * being scoped to. When a build ships, its record moves to `builds.ts` with a
 * real `minutes` measured off the clock. The two fields are deliberately named
 * differently so nobody can copy a budget into a measurement by autocomplete.
 *
 * Every title is boring and hyper-specific on purpose. `website.md` section 3:
 * novelty is worth nothing here and search specificity is worth everything.
 * "WhatsApp bot that sends your class timetable every morning" is a page
 * somebody can find. "AI assistant" is not.
 *
 * All fifteen come from the topic bank in `content.md` section 6, which sets
 * the one rule they have to pass first: a real person in India would actually
 * use it. No todo apps, no weather apps, no clones of American SaaS.
 */

export type Starter = {
  /** Reserved for `/builds/[slug]`. A published URL never changes, so this does not. */
  slug: string;
  /** The H1 of the build page this becomes. Names the search phrase. */
  title: string;
  /**
   * The moment this exists for. A situation, not a description.
   *
   * Two or three short sentences, present tense, with somebody in them. It has
   * to be recognisable before it is understood.
   */
  scene: string;
  /** What the thing does, once the scene has earned the sentence. */
  does: string;
  /** Scoped, not measured. Rendered as a budget everywhere it appears. */
  budgetMinutes: number;
  tools: readonly string[];
  /** What exists at the end of the evening. Concrete, checkable, tonight. */
  tonight: string;
};

export const STARTERS: readonly Starter[] = [
  {
    slug: "whatsapp-class-timetable-bot",
    title: "WhatsApp bot that sends your class timetable every morning",
    scene:
      "Every Sunday night, somebody in your section asks which classes are on tomorrow. Somebody else screenshots the timetable. By Wednesday it is buried under four hundred messages and the question gets asked again.",
    does: "Reads one spreadsheet and posts tomorrow's classes to the group at 9pm. Nobody has to ask.",
    budgetMinutes: 90,
    tools: ["Lovable", "Google Sheets"],
    tonight:
      "A live URL, a connected sheet, and one message your group actually receives tonight.",
  },
  {
    slug: "college-club-attendance-tracker",
    title: "Attendance tracker for one college club",
    scene:
      "Your club secretary keeps attendance in a WhatsApp message they edit after every meeting. In March, somebody asks who came in February. Nobody can answer, because the earlier versions of that message no longer exist.",
    does: "A phone-sized page where names get tapped, and a record that survives being asked about later.",
    budgetMinutes: 75,
    tools: ["Bolt", "Supabase"],
    tonight:
      "A working form, a database with real rows in it, and a link one person uses tomorrow.",
  },
  {
    slug: "syllabus-pdf-to-question-bank",
    title: "Syllabus PDF turned into a question bank",
    scene:
      "Three weeks before end-sems, somebody in your year opens the syllabus PDF and starts typing questions into a Word file. They share it. It gets forwarded two hundred times in a night.",
    does: "Takes the unit-wise syllabus and returns practice questions per unit, ranked by how often that topic has appeared.",
    budgetMinutes: 120,
    tools: ["Claude", "Lovable"],
    tonight:
      "A page that eats a PDF and returns questions, plus an honest note about which units it handles badly.",
  },
  {
    slug: "fee-receipt-reader-spreadsheet",
    title: "Fee receipt reader that fills a spreadsheet",
    scene:
      "Somewhere right now, a mess committee treasurer has a folder of two hundred receipt photos open and a spreadsheet beside it. They are on receipt forty-one. It is 11pm.",
    does: "Point it at the folder. It pulls amount, date and reference number into rows you can total.",
    budgetMinutes: 150,
    tools: ["Replit", "Google Sheets"],
    tonight:
      "Twenty receipts read, twenty rows filled, and a count of how many it got wrong. The count is the interesting part.",
  },
  {
    slug: "hostel-lost-and-found-board",
    title: "Lost and found board for one hostel",
    scene:
      "Somebody has lost a charger. Somebody else found one two days ago and has forgotten. Four hundred people share a group chat and neither message will ever meet the other.",
    does: "Post what you lost, post what you found, and the two finally end up on the same page.",
    budgetMinutes: 60,
    tools: ["Lovable", "Supabase"],
    tonight:
      "A posting form, a live list, and the shortest path from nothing to something forty people use this week.",
  },
] as const;

/**
 * The rest of the bank, carried by the ticker on `/start`.
 *
 * Five get argued for; ten get named. Naming them is not decoration: the most
 * common way to fail at this step is picking nothing, because nothing occurred
 * to you, and ten more specific things occurring to you is the fix.
 */
export const MORE_IDEAS: readonly string[] = [
  "Which elective should I take, decided from last year's marks",
  "Local shop order form with live stock counts",
  "Study group scheduler that reads everyone's free hours",
  "Expense tracker that reads UPI screenshots",
  "Portfolio site built from a GitHub username",
  "Cricket score bot for a group chat",
  "Auto-summariser for a 400-message WhatsApp group",
  "Second-hand book marketplace for one campus",
  "Anonymous feedback box for one class",
  "Notes answer bot for one subject",
] as const;

/**
 * The three tests, and the reason this page is not a quiz.
 *
 * A quiz implies the answer depends on the person. It does not. A good first
 * build is a small useful thing somebody will use this week, and these are how
 * you check that before spending an evening on it.
 *
 * `fails` names a counterexample rather than restating the test, because the
 * counterexample is the part people recognise themselves in. Everybody has
 * started the todo app.
 */
export const PICK_TESTS: readonly {
  test: string;
  detail: string;
  fails: string;
}[] = [
  {
    test: "Somebody uses it on Monday",
    detail:
      "Say the name out loud. If no name comes, it is a portfolio piece, and portfolio pieces are the ones that sit at 80% forever.",
    fails: "A todo app. Nobody has ever been waiting for your todo app.",
  },
  {
    test: "It finishes in one evening",
    detail:
      "Under four hours, deploy included. Past that you are betting on a second evening, and the second evening has a way of not arriving.",
    fails:
      "A social network. Not harder, just longer, and longer is what actually kills it.",
  },
  {
    /* "It stays free forever" until 2026-08-09, which promised something about
       five companies' pricing that nobody here controls. The test is the same;
       the claim is now about the build rather than about the tools' future. */
    test: "It runs on a free tier",
    detail:
      "₹0 to build and ₹0 to run on what the tools give away today. Anything that starts costing money in month two is something you quietly take offline in month three.",
    fails:
      "Anything calling a paid model on every visit. That is a case study, not a first build.",
  },
] as const;

/** "3h 20m", "45m". Same formatter shape as `builds.ts`, on purpose. */
export function formatBudget(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
