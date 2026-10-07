import type { CategorySlug } from "@/types/category";

export type InlineImageSeed = {
  id: string;
  alt: string;
  caption: string;
};

export type CategoryContentPool = {
  paragraphs: string[];
  quotes: { content: string; attribution: string }[];
  watch: string[];
  tips: { title: string; content: string }[];
  closers: string[];
  images: InlineImageSeed[];
  code?: { language: string; content: string }[];
};

export const contentPools: Record<CategorySlug, CategoryContentPool> = {
  tech: {
    paragraphs: [
      "Hardware cycles have slowed, and that has changed what counts as an upgrade. Year-over-year improvements in processors and displays are real but incremental, which shifts attention to battery life, repairability and how long a device will receive software support.",
      "Chip design is where the most interesting competition now happens. Custom silicon lets device makers tune performance for the workloads they care about, from on-device AI to video encoding, rather than relying on general-purpose parts.",
      "Supply chains remain fragile. Component shortages have eased since their peak, but manufacturers continue to diversify production and hold larger inventories as insurance against disruption.",
      "Repairability has moved from niche concern to regulatory requirement in several markets. Designs that once relied on glue and proprietary screws are slowly giving way to modular batteries and published service manuals.",
      "Pricing tells its own story. Flagship devices continue to creep upward, while the mid-range has become dramatically better, leaving many buyers wondering what the extra money actually buys.",
      "Software support windows have become a selling point. Longer update commitments extend the useful life of a device and reduce electronic waste, but they also put pressure on manufacturers to maintain older hardware.",
    ],
    quotes: [
      { content: "People used to upgrade because the old device felt slow. Now they upgrade because the battery is tired or the updates stopped.", attribution: "Product manager at a consumer electronics retailer" },
      { content: "The most important spec on a phone today is how many years it will be supported.", attribution: "Independent repair technician" },
      { content: "Custom silicon is less about raw speed and more about doing specific things very efficiently.", attribution: "Semiconductor analyst" },
    ],
    watch: [
      "Longer software support commitments across price tiers",
      "Dedicated AI accelerators in mainstream laptops",
      "Repairability scores appearing on product packaging",
      "Mid-range phones adopting flagship camera sensors",
      "Wider adoption of modular, replaceable batteries",
      "New display technologies reaching affordable devices",
    ],
    tips: [
      { title: "Buying advice", content: "Before upgrading, check the remaining software support window for your current device and the cost of a battery replacement. Both often matter more than benchmark scores." },
      { title: "Why it matters", content: "Devices that last longer reduce cost for buyers and waste for everyone. Support policies are now as important as hardware specifications." },
    ],
    closers: [
      "The era of dramatic annual leaps in consumer hardware is largely over. What replaces it is a more thoughtful market where longevity, efficiency and support policies decide which products are worth buying.",
      "For buyers, that is good news. The best device is increasingly the one that will still feel capable and receive updates several years from now.",
    ],
    images: [
      { id: "1550751827-4bd374c3f58b", alt: "Close view of a circuit board illuminated with blue light", caption: "Custom silicon now differentiates devices more than industrial design." },
      { id: "1558346490-a72e53ae2d4f", alt: "Engineer working on an electronics prototype with colored wires", caption: "Prototyping remains a hands-on process even as design tools improve." },
      { id: "1556656793-08538906a9f8", alt: "Several smartphones arranged face down on a pale blue surface", caption: "Phone designs have converged, putting the focus on cameras and battery life." },
      { id: "1581091226825-a6a2a5aee158", alt: "Engineer working at a computer in an industrial lab", caption: "Hardware testing labs are expanding to cover durability and repair." },
    ],
    code: [
      { language: "python", content: "def run_agent(task, tools, max_steps=8):\n    history = []\n    for step in range(max_steps):\n        action = model.plan(task, history, tools)\n        if action.requires_approval:\n            action = request_human_review(action)\n        result = tools.execute(action)\n        history.append((action, result))\n        if result.is_final:\n            return result\n    raise TimeoutError(\"Agent exceeded step budget\")" },
      { language: "python", content: "from dataclasses import dataclass\n\n@dataclass\nclass EvalCase:\n    prompt: str\n    expected: str\n\ndef score(cases, generate):\n    passed = sum(generate(c.prompt).strip() == c.expected for c in cases)\n    return passed / len(cases)" },
    ],
  },
  business: {
    paragraphs: [
      "Technology companies are being judged on profitability again. After years in which growth excused almost any level of spending, investors are rewarding disciplined cost control and predictable cash flow.",
      "Interest rates continue to shape strategy. Higher borrowing costs have slowed acquisitions, pushed companies to prioritize core products and made long-term bets harder to justify to shareholders.",
      "Regulators on several continents are scrutinizing market power more closely. Competition cases now examine app stores, advertising technology and cloud contracts, with remedies that could reshape business models.",
      "Payments and financial infrastructure have become a battleground. Companies that control how money moves gain valuable data and recurring revenue, which explains the intense competition in this space.",
      "Small and mid-sized businesses are adopting software faster than ever. Subscription tools for accounting, scheduling and customer service have become affordable enough to replace spreadsheets and paper processes.",
      "Leadership turnover has accelerated. Boards are bringing in executives with operational experience rather than visionary founders, reflecting a broader shift toward efficiency.",
    ],
    quotes: [
      { content: "Growth at all costs is over. Now the question is growth at what cost.", attribution: "Portfolio manager at a technology-focused fund" },
      { content: "Every company is a software company until the cloud bill arrives.", attribution: "Chief financial officer at a mid-market SaaS firm" },
      { content: "Regulation is now a product requirement, not a legal afterthought.", attribution: "Competition lawyer" },
    ],
    watch: [
      "Quarterly guidance on AI infrastructure spending",
      "Competition rulings affecting app store fees",
      "Small business adoption of embedded finance",
      "Return of technology IPOs after a slow period",
      "Cost-cutting through automation in back-office work",
      "Cross-border payment regulation",
    ],
    tips: [
      { title: "Why it matters", content: "The strategies of large technology companies affect prices, jobs and the products available to everyone else in the economy." },
      { title: "Reading the numbers", content: "Look past headline revenue to operating margin and free cash flow. They reveal whether growth is sustainable or simply expensive." },
    ],
    closers: [
      "The business of technology is entering a more mature phase. That means fewer moonshots and more careful capital allocation, but also more durable companies on the other side.",
      "For workers and customers, the shift toward profitability brings both stability and pressure. How companies balance the two will define the next several years.",
    ],
    images: [
      { id: "1462206092226-f46025ffe607", alt: "Glass office towers seen from street level against a blue sky", caption: "Corporate headquarters are being resized as hybrid work becomes permanent." },
      { id: "1454165804606-c3d57bc86b40", alt: "Business documents and a laptop on a desk during a meeting", caption: "Financial planning has become more conservative across the technology sector." },
      { id: "1579532537598-459ecdaf39cc", alt: "Close view of a printed business newspaper", caption: "Markets continue to react sharply to guidance from large technology companies." },
      { id: "1600880292203-757bb62b4baf", alt: "Two colleagues celebrating with a high five in a bright office", caption: "Mid-sized companies are adopting new software faster than large enterprises." },
    ],
  },
  "digital-marketing": {
    paragraphs: [
      "Search is changing faster than at any point in the past decade. AI-generated answers, richer results and new discovery surfaces mean fewer clicks for many queries, forcing publishers and brands to rethink what success looks like.",
      "Privacy changes have made measurement harder. With fewer third-party signals available, marketers are leaning on first-party data, modeled attribution and controlled experiments to understand what works.",
      "Short-form video continues to dominate attention, but it rewards consistency more than virality. Brands that publish steadily and engage with comments tend to outperform those chasing occasional hits.",
      "Email has quietly become one of the most valuable channels again. An owned audience is insulated from algorithm changes, and well-crafted newsletters often deliver better returns than paid social.",
      "Content quality matters more as volume explodes. When anyone can generate an article in seconds, original reporting, real expertise and clear opinion become the differentiators.",
      "Marketing teams are reorganizing around fewer, more capable tools. Consolidated platforms reduce the cost and complexity of stitching together dozens of separate services.",
    ],
    quotes: [
      { content: "If your strategy depends entirely on someone else's algorithm, you do not have a strategy. You have a dependency.", attribution: "Head of growth at a direct-to-consumer brand" },
      { content: "The brands winning in search are the ones that actually know something their competitors do not.", attribution: "SEO consultant" },
      { content: "Measurement got harder, which forced us to get better at running honest experiments.", attribution: "Marketing analytics lead" },
    ],
    watch: [
      "AI answers changing click-through rates in search",
      "First-party data strategies replacing third-party cookies",
      "Creator partnerships moving from one-off posts to long-term deals",
      "Newsletter platforms adding paid subscriptions and ads",
      "Retail media networks capturing advertising budgets",
      "Brand safety tools for AI-generated content",
    ],
    tips: [
      { title: "Quick win", content: "Audit your top twenty pages by traffic. Update outdated facts, improve titles and add original insight. Refreshing proven content is often faster than creating new pages." },
      { title: "Why it matters", content: "How people discover information online is changing, and the businesses that adapt early will keep the audience others lose." },
    ],
    closers: [
      "Digital marketing has always rewarded those who adapt to platform changes quickly. The difference now is the pace. The fundamentals of useful content and honest measurement remain the safest bet.",
      "Teams that build owned audiences and invest in genuine expertise will be best positioned no matter which platform rises or falls next.",
    ],
    images: [
      { id: "1432888498266-38ffec3eaf0a", alt: "Overhead view of a desk with a phone, sketches and colored pens", caption: "Campaign planning still starts with a sketch and a clear audience." },
      { id: "1563986768494-4dee2763ff3f", alt: "Person using a laptop and smartphone to browse social media", caption: "Most audiences now move between devices during a single session." },
      { id: "1556155092-490a1ba16284", alt: "Hands on a laptop keyboard with a dashboard on screen", caption: "Analytics dashboards have become more modeled and less observed." },
      { id: "1586880244406-556ebe35f282", alt: "Laptop open to a marketing website with bold graphics", caption: "Landing pages are being rebuilt for faster load times and clearer messaging." },
    ],
  },
  fashion: {
    paragraphs: [
      "Fashion moves in cycles, but the pace of those cycles has changed. Social media compresses trends into weeks, while a growing number of shoppers are pushing back by investing in fewer, better pieces that last for years.",
      "Fit matters more than any trend. A well-tailored garment in a classic cut will consistently look better than an expensive piece that does not suit the wearer's proportions.",
      "Sustainability has moved from marketing language to purchasing decision. Resale platforms, repair services and transparent supply chains are changing how many people think about the life of their clothes.",
      "Fabric is where quality becomes visible. Natural fibers, dense weaves and careful finishing tend to age gracefully, while cheaper materials often lose their shape after a handful of washes.",
      "Personal style is less about following rules than about knowing what makes you feel confident. The most stylish people tend to repeat a small number of silhouettes and colors that work for them.",
      "The business of fashion is being reshaped by data. Brands increasingly produce smaller initial runs and restock what sells, reducing waste and markdowns.",
    ],
    quotes: [
      { content: "The most sustainable garment is the one already hanging in your wardrobe.", attribution: "Creative director at a slow fashion label" },
      { content: "Good tailoring can make an affordable jacket look twice its price.", attribution: "Master tailor" },
      { content: "Trends tell you what is new. Style tells people who you are.", attribution: "Fashion stylist" },
    ],
    watch: [
      "Resale and rental growing alongside traditional retail",
      "Brands publishing full supply chain information",
      "Relaxed tailoring replacing strict formalwear",
      "Repair services offered directly by labels",
      "Natural fibers returning to everyday basics",
      "Smaller collections released more frequently",
    ],
    tips: [
      { title: "Style tip", content: "Before buying something new, try to name three outfits you could build with it from clothes you already own. If you cannot, it may not earn its place." },
      { title: "Care note", content: "Washing less often, at lower temperatures and air drying will extend the life of most garments far more than any special product." },
    ],
    closers: [
      "Fashion is at its best when it is personal, considered and built to last. The shift toward quality over quantity is good for wardrobes, wallets and the planet.",
      "Whatever the season brings, the fundamentals remain the same: buy thoughtfully, care for what you own and wear what makes you feel like yourself.",
    ],
    images: [
      { id: "1441986300917-64674bd600d8", alt: "Bright clothing boutique with shelves and hanging garments", caption: "Independent boutiques are leaning into curation and personal service." },
      { id: "1558769132-cb1aea458c5e", alt: "Neutral toned garments hanging on a rail beside dried grasses", caption: "Neutral palettes make it easier to build a versatile wardrobe." },
      { id: "1523381210434-271e8be1f52b", alt: "Row of green t-shirts on wooden hangers", caption: "Well-made basics form the backbone of most wardrobes." },
      { id: "1556905055-8f358a7a47b2", alt: "Flat lay of a knit beanie, denim and a sweater with tulips", caption: "Layering pieces carry outfits across seasons." },
    ],
  },
  health: {
    paragraphs: [
      "Health advice is everywhere, but much of it is contradictory. The most reliable guidance tends to be the least exciting: move regularly, eat mostly whole foods, sleep consistently and stay connected to other people.",
      "Consistency beats intensity. Research repeatedly shows that moderate activity done most days delivers more benefit than occasional bursts of extreme effort followed by long breaks.",
      "Sleep is increasingly recognized as a foundation rather than a luxury. Poor sleep affects mood, appetite, concentration and long-term health in ways that are easy to underestimate.",
      "Nutrition science is complex, but the broad patterns are clear. Diets rich in vegetables, legumes, whole grains and healthy fats are consistently associated with better outcomes.",
      "Mental health is part of physical health. Stress, loneliness and anxiety have measurable effects on the body, and addressing them is as important as any workout plan.",
      "Wearable devices can help people notice patterns in their activity and sleep, but the numbers are best treated as gentle signals rather than precise medical measurements.",
    ],
    quotes: [
      { content: "The best exercise program is the one you will still be doing six months from now.", attribution: "Sports medicine physician" },
      { content: "Most people do not need a perfect diet. They need a few better habits they can keep.", attribution: "Registered dietitian" },
      { content: "Sleep is the cheapest performance enhancer there is.", attribution: "Sleep researcher" },
    ],
    watch: [
      "Strength training recommendations for all ages",
      "Wearables adding more clinically validated features",
      "Greater access to mental health support through primary care",
      "Research on ultra-processed foods",
      "Telehealth becoming a permanent part of care",
      "Workplace programs focused on recovery and rest",
    ],
    tips: [
      { title: "Health note", content: "This article is for general information and is not a substitute for professional medical advice. Speak to a qualified clinician about your own health." },
      { title: "Start small", content: "Pick one habit, such as a ten-minute walk after lunch, and repeat it daily for two weeks before adding anything else." },
    ],
    closers: [
      "Good health rarely comes from dramatic changes. It is built from small, repeatable choices that fit into ordinary life and add up over years.",
      "Start with what feels manageable, notice how your body responds and build from there. Progress counts more than perfection.",
    ],
    images: [
      { id: "1571019613454-1cb2f99b2d8b", alt: "Woman doing a core exercise on a mat in a bright room", caption: "Short bodyweight sessions can be done almost anywhere." },
      { id: "1505751172876-fa1923c5c528", alt: "Black and white close view of a stethoscope", caption: "Regular checkups catch many issues before they become serious." },
      { id: "1498837167922-ddd27525d352", alt: "Trays of fresh vegetables and greens viewed from above", caption: "Variety on the plate tends to mean variety in nutrients." },
      { id: "1518611012118-696072aa579a", alt: "Group fitness class exercising on mats", caption: "Exercising with others makes routines easier to keep." },
    ],
  },
  lifestyle: {
    paragraphs: [
      "The way people live at home has changed. Rooms now serve as offices, gyms and places to unwind, which has made thoughtful design and flexible furniture more valuable than ever.",
      "Small rituals shape the texture of a day. A morning coffee without a screen, an evening walk or a weekly meal with friends can do more for wellbeing than elaborate self-improvement plans.",
      "Minimalism has softened into something more practical. Rather than owning as little as possible, many people are aiming to own things they genuinely use and love.",
      "Friendship takes deliberate effort in adulthood. Busy schedules and moves make it easy to drift apart, which is why regular, low-pressure plans matter so much.",
      "Hobbies are having a renaissance. Gardening, cooking, reading and making things by hand offer a counterweight to screen-heavy work and constant notifications.",
      "Productivity advice is shifting from doing more to doing what matters. Protecting time for rest and relationships is increasingly seen as part of a well-run life.",
    ],
    quotes: [
      { content: "A home should work for the life you actually live, not the one in the catalog.", attribution: "Interior designer" },
      { content: "The best routines are flexible enough to survive a bad week.", attribution: "Behavioral psychologist" },
      { content: "Friendship is built in ordinary moments, not grand gestures.", attribution: "Author and relationship researcher" },
    ],
    watch: [
      "Homes designed around multipurpose rooms",
      "Analog hobbies attracting younger audiences",
      "Shared spaces and community events in cities",
      "Digital wellbeing tools built into phones",
      "Secondhand furniture becoming the first choice",
      "Four-day workweek pilots and their effect on leisure",
    ],
    tips: [
      { title: "Try this", content: "Choose one corner of your home and make it purely for rest: a chair, a lamp and a book. Having a dedicated spot makes it easier to switch off." },
      { title: "Why it matters", content: "The small decisions that shape daily life have a large cumulative effect on happiness and health." },
    ],
    closers: [
      "Living well is less about perfection and more about attention: noticing what brings energy, what drains it and adjusting accordingly.",
      "The best lifestyle advice is the kind that makes ordinary days a little better. Start there and the bigger changes tend to follow.",
    ],
    images: [
      { id: "1484101403633-562f891dc89a", alt: "Light blue sofa with cushions in a bright living room", caption: "Simple, comfortable furniture ages better than trend pieces." },
      { id: "1502672260266-1c1ef2d93688", alt: "Cozy living room with plants, shelves and a gray sofa", caption: "Plants and natural light make small spaces feel larger." },
      { id: "1544716278-ca5e3f4abd8c", alt: "Open book and a cup of coffee on white bedding", caption: "Reading has become a popular way to unplug in the evening." },
      { id: "1509042239860-f550ce710b93", alt: "Two cups of coffee with latte art on a cafe table", caption: "Shared routines help keep friendships strong." },
    ],
  },
  travel: {
    paragraphs: [
      "Travel has rebounded strongly, and with it have come crowds, higher prices and renewed interest in places that feel less discovered. Planning a little differently can make a big difference to the experience.",
      "Timing is one of the most powerful tools a traveler has. Visiting just outside peak season often means lower prices, shorter lines and a more relaxed atmosphere.",
      "Slow travel is gaining popularity. Spending longer in fewer places allows deeper connections with local culture and reduces the stress of constant movement.",
      "Flexibility pays. Travelers willing to shift dates by a few days, use alternative airports or consider nearby destinations frequently find significantly better value.",
      "Responsible tourism is increasingly a priority. Supporting locally owned businesses, respecting local customs and avoiding overcrowded hotspots helps destinations thrive.",
      "Technology has simplified logistics, from digital boarding passes to translation apps, but the best travel moments still tend to come from curiosity and conversation.",
    ],
    quotes: [
      { content: "The best trips leave room for the things you could not have planned.", attribution: "Travel writer and guide" },
      { content: "Shoulder season is the secret most frequent travelers wish they had learned sooner.", attribution: "Independent travel agent" },
      { content: "Eat where the locals eat, and ask them where else you should go.", attribution: "Food tour operator" },
    ],
    watch: [
      "Rail routes replacing short-haul flights",
      "Destinations introducing visitor caps and fees",
      "Digital entry systems at borders",
      "Growth in workations and longer stays",
      "Smaller cities marketing themselves as alternatives",
      "More flexible booking and cancellation policies",
    ],
    tips: [
      { title: "Planning tip", content: "Set fare alerts for your route several months in advance and compare nearby airports. Prices can vary widely for the same trip." },
      { title: "Packing note", content: "Pack for half the trip and plan to do laundry once. Lighter bags make every transfer easier." },
    ],
    closers: [
      "Great travel rarely depends on luxury. It depends on curiosity, a bit of planning and a willingness to let the place surprise you.",
      "Wherever you go next, travel a little slower and look a little closer. The memories tend to be richer for it.",
    ],
    images: [
      { id: "1501785888041-af3ef285b470", alt: "Turquoise alpine lake surrounded by forested mountains", caption: "Mountain lakes are popular escapes outside the summer peak." },
      { id: "1507525428034-b723cf961d3e", alt: "Calm beach with gentle waves at sunrise", caption: "Coastal destinations are quieter and cheaper just after high season." },
      { id: "1530789253388-582c481c54b0", alt: "Traveler photographing hot air balloons over a rocky landscape", caption: "Early mornings reward travelers with the best light and fewer crowds." },
      { id: "1488646953014-85cb44e25828", alt: "Map, camera, notebook and travel gear laid out on a table", caption: "A little planning goes a long way." },
    ],
  },
  education: {
    paragraphs: [
      "Education is changing faster than at any point in a generation. Online platforms, new teaching methods and AI tools are reshaping how students learn and how teachers spend their time.",
      "Strong relationships remain the foundation of learning. Students who feel known and supported by their teachers tend to engage more deeply and persist through difficulty.",
      "Study habits matter more than study hours. Techniques such as spaced repetition and practice testing consistently outperform rereading and highlighting.",
      "Lifelong learning has become an economic necessity. Short courses, certificates and employer training programs help workers adapt as industries evolve.",
      "Access remains uneven. Reliable internet, quiet study spaces and family support are not equally available, and they shape outcomes as much as school quality.",
      "Teachers are reporting heavier workloads and growing expectations. Retaining experienced educators is one of the most important challenges facing school systems.",
    ],
    quotes: [
      { content: "Students remember how a class made them feel long after they forget the details of the lesson.", attribution: "Secondary school teacher" },
      { content: "Testing yourself is not just a way to measure learning. It is one of the best ways to learn.", attribution: "Cognitive scientist" },
      { content: "The most important skill we can teach is how to keep learning.", attribution: "University dean" },
    ],
    watch: [
      "AI tutors and how schools set rules for them",
      "Micro-credentials recognized by employers",
      "Teacher recruitment and retention programs",
      "Smaller class sizes in early grades",
      "Financial aid reforms in higher education",
      "Hybrid learning options for adult students",
    ],
    tips: [
      { title: "Study tip", content: "Close your notes and write down everything you remember about a topic. Then check what you missed. This simple retrieval practice strengthens memory." },
      { title: "For parents", content: "Asking children to explain what they learned today is often more helpful than checking whether homework is finished." },
    ],
    closers: [
      "Education works best when it combines good teaching, supportive relationships and methods grounded in evidence. New tools help most when they serve those fundamentals.",
      "Whether you are a student, parent or lifelong learner, the most valuable habit is curiosity, and it can be practiced at any age.",
    ],
    images: [
      { id: "1497633762265-9d179a990aa6", alt: "Tall stack of colorful hardcover books", caption: "Reading widely remains one of the strongest predictors of success." },
      { id: "1580582932707-520aed937b7b", alt: "Empty classroom with desks facing a chalkboard", caption: "Classroom design is evolving to support collaboration." },
      { id: "1571260899304-425eee4c7efc", alt: "University students in a classroom with notebooks", caption: "Active participation improves understanding and retention." },
      { id: "1481627834876-b7833e8f5570", alt: "Long library aisle lined with wooden bookshelves", caption: "Libraries remain vital study spaces for many students." },
    ],
  },
  "real-estate": {
    paragraphs: [
      "Housing markets are local, even when headlines suggest otherwise. Prices, inventory and demand can vary dramatically between neighborhoods in the same city.",
      "Mortgage rates shape affordability as much as home prices do. A small change in rates can significantly alter monthly payments and how much buyers can borrow.",
      "Renting is not a failure. For many people, renting offers flexibility and lower upfront costs, and it can be the smarter financial decision depending on local prices and plans.",
      "Inspections and due diligence protect buyers from expensive surprises. Structural issues, roofing and plumbing problems are far cheaper to discover before purchase than after.",
      "Location remains the most important factor in long-term value. Access to transport, schools and amenities tends to support demand regardless of market cycles.",
      "Home design preferences have shifted toward flexible spaces, home offices and outdoor areas, influencing both renovation choices and new construction.",
    ],
    quotes: [
      { content: "Buy the home that fits your life for the next five years, not the one that impresses for five minutes.", attribution: "Residential real estate agent" },
      { content: "The monthly payment matters more than the purchase price for most households.", attribution: "Mortgage advisor" },
      { content: "Never skip the inspection, no matter how competitive the market feels.", attribution: "Licensed home inspector" },
    ],
    watch: [
      "Mortgage rate movements and lender competition",
      "New housing supply in growing cities",
      "Rental market regulations",
      "Energy efficiency upgrades and incentives",
      "Remote work influencing where people buy",
      "First-time buyer assistance programs",
    ],
    tips: [
      { title: "Buyer tip", content: "Get pre-approved before you start viewing homes. It clarifies your budget and makes your offer more credible to sellers." },
      { title: "Financial note", content: "Northline does not provide financial advice. Speak with a qualified advisor about mortgages and major property decisions." },
    ],
    closers: [
      "Property decisions are among the largest most people make. Patience, preparation and a clear sense of your own priorities matter more than timing the market perfectly.",
      "Whether buying, selling or renting, the best outcomes come from understanding the numbers and choosing a home that genuinely fits your life.",
    ],
    images: [
      { id: "1600607687939-ce8a6c25118c", alt: "Modern open-plan living room with large windows", caption: "Open layouts remain popular with buyers seeking natural light." },
      { id: "1484154218962-a197022b5858", alt: "Bright white kitchen with an island and pendant lights", caption: "Kitchens are often the most valuable room to renovate." },
      { id: "1605276374104-dee2a0ed3cd6", alt: "Suburban brick home with a double garage", caption: "Suburban demand has stayed strong as remote work persists." },
      { id: "1554995207-c18c203602cb", alt: "Contemporary living room with a leather sofa and plants", caption: "Staging helps buyers imagine themselves in a space." },
    ],
  },
  "food-recipe": {
    paragraphs: [
      "Good cooking starts before the stove is turned on. Reading the recipe fully, preparing ingredients in advance and having the right tools within reach make the whole process calmer.",
      "Seasoning is a skill worth practicing. Salt, acid and fat balance flavors, and tasting as you cook is the most reliable way to get a dish exactly right.",
      "Seasonal ingredients tend to taste better and cost less. Building meals around what is fresh at the market is one of the simplest ways to improve home cooking.",
      "Weeknight cooking does not need to be complicated. A handful of reliable techniques, such as roasting, stir-frying and braising, can produce dozens of different meals.",
      "Baking rewards precision. Weighing ingredients rather than using cups produces far more consistent results, especially with bread and pastry.",
      "Food brings people together. Shared meals strengthen relationships, and cooking for others is one of the most generous things a person can do.",
    ],
    quotes: [
      { content: "Taste everything, all the time. Your tongue is the best tool in the kitchen.", attribution: "Restaurant chef" },
      { content: "A sharp knife is safer than a dull one. Invest there first.", attribution: "Culinary instructor" },
      { content: "The simplest dishes leave nowhere to hide, which is why they teach you the most.", attribution: "Cookbook author" },
    ],
    watch: [
      "Plant-forward menus in mainstream restaurants",
      "Home fermentation and preserving",
      "Regional cuisines gaining wider recognition",
      "Reducing food waste with smarter meal planning",
      "Air fryers and compact appliances",
      "Restaurants offering smaller tasting portions",
    ],
    tips: [
      { title: "Kitchen tip", content: "Salt pasta water generously, it should taste pleasantly seasoned. It is the only chance to season the pasta itself." },
      { title: "Make ahead", content: "Most sauces, soups and stews taste even better the next day, so cook once and enjoy twice." },
    ],
    closers: [
      "Great food does not require complicated techniques or expensive ingredients. It requires attention, a little practice and a willingness to taste and adjust.",
      "Cook it once as written, then make it your own. That is how every good recipe becomes a family favorite.",
    ],
    images: [
      { id: "1466637574441-749b8f19452f", alt: "Cutting board with fresh vegetables, eggs and a knife", caption: "Preparing ingredients first makes cooking calmer and faster." },
      { id: "1546069901-ba9599a7e63c", alt: "Colorful salad bowl with salmon, eggs and vegetables", caption: "Balanced bowls are an easy template for weekday lunches." },
      { id: "1556910103-1c02745aae4d", alt: "Friends cooking together in a home kitchen", caption: "Cooking with others turns dinner into an event." },
      { id: "1555939594-58d7cb561ad1", alt: "Grilled skewers and vegetables on a serving board", caption: "High heat creates the flavor that makes grilled food so appealing." },
    ],
  },
  sports: {
    paragraphs: [
      "Modern sport is shaped by data as much as by talent. Clubs and coaches use detailed tracking to manage workloads, reduce injuries and find small tactical advantages.",
      "Recovery has become a central part of performance. Athletes now treat sleep, nutrition and rest days as seriously as training sessions.",
      "The business of sport continues to grow, driven by global broadcasting, streaming deals and sponsorship. That money brings opportunities and pressures for leagues and athletes alike.",
      "Grassroots participation remains the foundation of every sport. Local clubs, school programs and community facilities create the next generation of players and fans.",
      "Fans are watching differently. Highlights, social clips and second-screen statistics complement live broadcasts, especially for younger audiences.",
      "For amateur athletes, the lessons from elite sport are surprisingly applicable: progress gradually, prioritize recovery and train with a clear purpose.",
    ],
    quotes: [
      { content: "Talent gets you noticed. Consistency keeps you on the team.", attribution: "Professional football coach" },
      { content: "Most injuries come from doing too much too soon, not from doing the wrong exercise.", attribution: "Sports physiotherapist" },
      { content: "The crowd is part of the game. You feel it on every play.", attribution: "Former professional basketball player" },
    ],
    watch: [
      "Streaming platforms bidding for broadcast rights",
      "Growth of women's leagues and attendance records",
      "Wearable tracking in amateur sport",
      "Rule changes aimed at faster, more entertaining games",
      "Investment in community sports facilities",
      "Athlete welfare and scheduling debates",
    ],
    tips: [
      { title: "Training tip", content: "Increase weekly training volume by no more than about ten percent at a time. Gradual progress is the most reliable way to avoid injury." },
      { title: "Why it matters", content: "Sport shapes communities, health and culture far beyond the final score." },
    ],
    closers: [
      "Sport keeps evolving, but its appeal remains the same: drama that cannot be scripted, skill earned through practice and communities that gather to share it.",
      "Whether you play, watch or coach, the best part of sport is that there is always another game and another chance to improve.",
    ],
    images: [
      { id: "1489944440615-453fc2b6a9a9", alt: "Floodlit football stadium filled with fans at night", caption: "Attendance has rebounded strongly across major leagues." },
      { id: "1551958219-acbc608c6377", alt: "Three football training balls on a grass pitch", caption: "Training sessions are increasingly tailored to individual players." },
      { id: "1530549387789-4c1017266635", alt: "Swimmer performing butterfly stroke in a pool", caption: "Swimming remains one of the best low-impact training options." },
      { id: "1535131749006-b7f58c99034b", alt: "Golfer mid-swing on a green course under a cloudy sky", caption: "Golf has seen a surge in new and younger players." },
    ],
  },
};
