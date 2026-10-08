import type { Category } from "@/types/category";

const baseCategories: Omit<Category, "order" | "showOnHome" | "showInNav">[] = [
  {
    slug: "tech",
    name: "Tech",
    shortName: "Tech",
    tagline: "Devices, software and the AI tools changing everyday work.",
    description: "Clear coverage of phones, laptops, chips, software and artificial intelligence, focused on what actually matters to the people using them.",
    topics: ["AI", "Smartphones", "Laptops", "Software", "Chips"],
  },
  {
    slug: "business",
    name: "Business",
    shortName: "Business",
    tagline: "Companies, markets and the money behind them.",
    description: "Reporting and analysis on companies, markets, leadership and the economic forces shaping how people work and spend.",
    topics: ["Markets", "Leadership", "Small Business", "Payments", "Regulation"],
  },
  {
    slug: "fashion",
    name: "Fashion",
    shortName: "Fashion",
    tagline: "Style, craft and the business of what we wear.",
    description: "Trends, wardrobe guides, sustainable style and the designers and brands defining how people dress.",
    topics: ["Trends", "Sustainable Style", "Menswear", "Sneakers", "Wardrobe"],
  },
  {
    slug: "health",
    name: "Health",
    shortName: "Health",
    tagline: "Evidence-based guidance for body and mind.",
    description: "Practical, research-backed reporting on fitness, nutrition, sleep, mental health and the healthcare system.",
    topics: ["Fitness", "Nutrition", "Sleep", "Mental Health", "Healthcare"],
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    shortName: "Marketing",
    tagline: "Search, social and the craft of reaching people.",
    description: "Practical analysis of search, social, email and content strategy for teams building audiences online.",
    topics: ["SEO", "Social Media", "Email", "Analytics", "Content"],
  },
  {
    slug: "lifestyle",
    name: "Lifestyle",
    shortName: "Lifestyle",
    tagline: "Homes, habits and the art of living well.",
    description: "Ideas for better homes, routines, relationships and free time, written with warmth and a practical eye.",
    topics: ["Home", "Wellbeing", "Productivity", "Relationships", "Culture"],
  },
  {
    slug: "travel",
    name: "Travel",
    shortName: "Travel",
    tagline: "Destinations, journeys and smarter ways to go.",
    description: "Destination guides, travel planning advice and stories from the road, from weekend escapes to long-haul adventures.",
    topics: ["Destinations", "Planning", "Budget Travel", "Hotels", "Flights"],
  },
  {
    slug: "education",
    name: "Education",
    shortName: "Education",
    tagline: "How people learn, teach and grow.",
    description: "Coverage of schools, universities, online learning and lifelong skills for students, parents and educators.",
    topics: ["Schools", "Higher Education", "Online Learning", "Study Skills", "Careers"],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    shortName: "Real Estate",
    tagline: "Homes, markets and the decisions behind them.",
    description: "Housing market analysis, buying and renting guides, mortgages and design for anyone navigating property decisions.",
    topics: ["Buying", "Renting", "Mortgages", "Market Trends", "Interiors"],
  },
  {
    slug: "food-recipe",
    name: "Food & Recipe",
    shortName: "Food",
    tagline: "Recipes, kitchen skills and food worth sharing.",
    description: "Reliable recipes, cooking techniques, restaurant culture and seasonal eating from our food desk.",
    topics: ["Recipes", "Quick Meals", "Baking", "Healthy Eating", "Restaurants"],
  },
  {
    slug: "sports",
    name: "Sports",
    shortName: "Sports",
    tagline: "The games, the athletes and the business of sport.",
    description: "Analysis, features and training insight across football, basketball, tennis, running and the wider sports industry.",
    topics: ["Football", "Basketball", "Tennis", "Running", "Training"],
  },
];

export const defaultCategories: Category[] = baseCategories.map((category, index) => ({
  ...category,
  order: index,
  showOnHome: true,
  showInNav: true,
}));

export const categories = defaultCategories;
