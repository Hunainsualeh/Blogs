import type { ArticleSeed } from "./types";
import { unsplash } from "@/lib/images";

const slug = "how-to-evaluate-an-ai-agent-before-you-trust-it-with-real-work";

export const showcaseSeeds: ArticleSeed[] = [
  {
    title: "How to evaluate an AI agent before you trust it with real work",
    excerpt: "A step-by-step framework for testing autonomous AI systems, from defining success to monitoring them in production.",
    category: "tech",
    tags: ["AI Agents", "Evaluation", "Guides"],
    author: "noah-kim",
    image: "1488229297570-58520851e868",
    imageAlt: "Streams of light rushing through a dark tunnel of data",
    age: [1, 15],
    updatedAfterDays: 1,
    flags: ["editorsPick"],
    views: 24310,
    intro: "",
    sections: [],
    content: [
      { id: `${slug}-1`, type: "paragraph", content: "AI agents promise to handle multi-step tasks on their own: researching, writing code, filing tickets and updating records. That autonomy is exactly what makes them useful and exactly what makes them risky. Before an agent touches real work, it needs to earn trust the same way a new colleague would, through **observable, repeatable results**." },
      { id: `${slug}-2`, type: "paragraph", content: "This guide walks through a practical evaluation process that teams of any size can adopt. It assumes no specialized tooling, only a willingness to write down what success looks like and measure against it." },
      { id: `${slug}-3`, type: "heading", level: 2, content: "Start by defining the job precisely" },
      { id: `${slug}-4`, type: "paragraph", content: "Vague goals produce vague evaluations. Instead of asking whether an agent is good at customer support, define the exact task: *categorize incoming tickets into one of eight queues and draft a first reply for billing questions*. A narrow definition makes failures easy to spot." },
      { id: `${slug}-5`, type: "list", style: "ordered", items: ["Write a one-sentence description of the task.", "List the tools and data the agent is allowed to use.", "Describe what a correct outcome looks like.", "Identify the mistakes that would be unacceptable."] },
      { id: `${slug}-6`, type: "image", src: unsplash("1635070041078-e363dbe005cb"), alt: "Chalkboard covered with mathematical diagrams and formulas", caption: "Good evaluation starts on paper, long before any code is written.", credit: "Unsplash" },
      { id: `${slug}-7`, type: "heading", level: 2, content: "Build a test set from real examples" },
      { id: `${slug}-8`, type: "paragraph", content: "The most valuable evaluation data comes from your own history. Pull fifty to one hundred real cases, including messy and ambiguous ones, and record the outcome an experienced person would choose." },
      { id: `${slug}-9`, type: "callout", variant: "tip", title: "Include the hard cases", content: "Deliberately add examples that confused people in the past. An agent that handles only the easy cases will look impressive in testing and disappoint in production." },
      { id: `${slug}-10`, type: "heading", level: 3, content: "Score outcomes automatically where possible" },
      { id: `${slug}-11`, type: "paragraph", content: "For tasks with clear answers, a simple script can compare the agent's output with the expected result. For open-ended work, use a rubric and have reviewers grade a sample." },
      { id: `${slug}-12`, type: "code", language: "python", content: "def evaluate(agent, cases):\n    results = []\n    for case in cases:\n        output = agent.run(case.input)\n        results.append({\n            \"id\": case.id,\n            \"passed\": case.check(output),\n            \"steps\": output.step_count,\n        })\n    pass_rate = sum(r[\"passed\"] for r in results) / len(results)\n    return pass_rate, results" },
      { id: `${slug}-13`, type: "quote", content: "The first version of our agent passed every demo and failed a third of real tickets. The test set is what told us the truth.", attribution: "Engineering manager at a software company" },
      { id: `${slug}-14`, type: "heading", level: 2, content: "Limit permissions before expanding them" },
      { id: `${slug}-15`, type: "paragraph", content: "Start with read-only access and human approval for every action. As the agent proves reliable on specific actions, grant autonomy for those actions alone." },
      { id: `${slug}-16`, type: "list", style: "unordered", items: ["Read-only access during initial testing", "Human approval for anything that changes data", "Spending and rate limits on external tools", "Complete logs of every action taken"] },
      { id: `${slug}-17`, type: "callout", variant: "warning", title: "Never skip the audit log", content: "If you cannot reconstruct what an agent did and why, you cannot debug failures or explain them to customers." },
      { id: `${slug}-18`, type: "image", src: unsplash("1527430253228-e93688616381"), alt: "Vintage toy robot standing against a plain wall", caption: "Agents should earn autonomy one capability at a time.", credit: "Unsplash" },
      { id: `${slug}-19`, type: "heading", level: 2, content: "Keep measuring after launch" },
      { id: `${slug}-20`, type: "paragraph", content: "Production traffic always contains surprises. Sample real outputs every week, add new failure cases to your test set and rerun the full suite whenever the model, prompts or tools change." },
      { id: `${slug}-21`, type: "callout", variant: "info", title: "A simple rule", content: "Treat your evaluation suite like automated tests in software. If it is not running regularly, it is not protecting you." },
      { id: `${slug}-22`, type: "divider" },
      { id: `${slug}-23`, type: "heading", level: 2, content: "The bottom line" },
      { id: `${slug}-24`, type: "paragraph", content: "Trust in AI agents should be earned with evidence, not granted on the strength of a demo. A modest investment in clear definitions, real test data and careful permissions turns an impressive prototype into a dependable colleague." },
      { id: `${slug}-25`, type: "link", href: "/category/tech", label: "Explore more Tech coverage", description: "Devices, software and the AI tools changing everyday work." },
    ],
  },
];
