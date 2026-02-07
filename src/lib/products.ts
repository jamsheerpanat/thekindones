import rawProducts from "@/data/products.json";
import { cleanText, formatPrice, hashString, slugify } from "@/lib/utils";

export type ModifierOption = {
  label: string;
  priceDelta?: number;
};

export type ModifierGroup = {
  name: string;
  required?: boolean;
  options: ModifierOption[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  image?: string;
  price: number;
  rating: number;
  reviews: number;
  calories: number;
  tags: string[];
  modifiers: ModifierGroup[];
};

type RawProduct = {
  image?: string;
  name: string;
  description: string;
  categoriesArray: string;
};

const priceMap: Record<string, number> = {
  Sandwiches: 8.75,
  Bowls: 9.25,
  Desserts: 6.25,
  Drinks: 2.5,
  "Extra Sauce": 1.2,
  Sides: 4.5,
  Kids: 5.95,
  Combo: 12.5,
  Gathering: 34
};

const tagMap: Record<string, string[]> = {
  Sandwiches: ["Signature", "Toasted", "Handcrafted"],
  Bowls: ["Balanced", "Fresh"],
  Desserts: ["Indulgent", "Weekend"],
  Drinks: ["Chilled", "House"],
  "Extra Sauce": ["Housemade", "Add-on"],
  Sides: ["Shareable", "Crispy"],
  Kids: ["Kid Friendly", "Mini"],
  Combo: ["Value", "Chef Pick"],
  Gathering: ["Catering", "Event"],
  Default: ["Seasonal", "Chef Pick"]
};

const modifierPresets: Record<string, ModifierGroup[]> = {
  Sandwiches: [
    {
      name: "Bread",
      required: true,
      options: [
        { label: "Brioche" },
        { label: "Sourdough" },
        { label: "Multigrain" }
      ]
    },
    {
      name: "Cheese",
      options: [
        { label: "No Cheese" },
        { label: "Cheddar", priceDelta: 0.6 },
        { label: "Halloumi", priceDelta: 0.9 },
        { label: "Swiss", priceDelta: 0.8 }
      ]
    },
    {
      name: "Extras",
      options: [
        { label: "Avocado", priceDelta: 1.2 },
        { label: "Hash Brown", priceDelta: 1.0 },
        { label: "Bacon Jam", priceDelta: 1.1 },
        { label: "Chili Flakes" }
      ]
    }
  ],
  Bowls: [
    {
      name: "Base",
      required: true,
      options: [
        { label: "Greek Yogurt" },
        { label: "Mixed Greens" },
        { label: "Warm Grain" }
      ]
    },
    {
      name: "Toppings",
      options: [
        { label: "Granola" },
        { label: "Avocado" },
        { label: "Chili Flakes" },
        { label: "Extra Protein", priceDelta: 2.0 }
      ]
    }
  ],
  Desserts: [
    {
      name: "Finish",
      options: [
        { label: "Maple Syrup" },
        { label: "Whipped Cream" },
        { label: "Berries", priceDelta: 1.5 }
      ]
    }
  ],
  Drinks: [
    {
      name: "Size",
      required: true,
      options: [
        { label: "Small" },
        { label: "Medium", priceDelta: 0.75 },
        { label: "Large", priceDelta: 1.25 }
      ]
    },
    {
      name: "Ice",
      options: [
        { label: "Regular" },
        { label: "Less Ice" },
        { label: "No Ice" }
      ]
    }
  ],
  Sides: [
    {
      name: "Dip",
      options: [
        { label: "House Sauce" },
        { label: "Pesto" },
        { label: "Sriracha Mayo" }
      ]
    }
  ],
  Kids: [
    {
      name: "Drink",
      required: true,
      options: [
        { label: "Water" },
        { label: "Apple Juice" },
        { label: "Kinza Cola" }
      ]
    }
  ],
  Combo: [
    {
      name: "Combo Side",
      required: true,
      options: [
        { label: "French Fries" },
        { label: "Sweet Potato Fries", priceDelta: 0.8 },
        { label: "Side Salad" }
      ]
    },
    {
      name: "Combo Drink",
      required: true,
      options: [
        { label: "Kinza Cola" },
        { label: "Kinza Lemon Zero" },
        { label: "Fresh Lemonade", priceDelta: 1.0 }
      ]
    }
  ],
  Gathering: [
    {
      name: "Serving Size",
      required: true,
      options: [
        { label: "8 People" },
        { label: "12 People", priceDelta: 12 },
        { label: "16 People", priceDelta: 20 }
      ]
    },
    {
      name: "Add-on",
      options: [
        { label: "Extra Sauces", priceDelta: 3 },
        { label: "Dessert Tray", priceDelta: 8 }
      ]
    }
  ],
  Default: [
    {
      name: "Add-on",
      options: [
        { label: "Extra Sauce", priceDelta: 0.5 },
        { label: "Side Salad", priceDelta: 2.0 }
      ]
    }
  ]
};

const normalizeCategory = (value?: string) => value?.trim() || "Specials";

const buildPrice = (name: string, category: string) => {
  const base = priceMap[category] ?? 7.5;
  const bump = (hashString(name) % 90) / 100;
  return Math.round((base + bump) * 100) / 100;
};

const buildRating = (name: string) => {
  const rating = 4 + (hashString(name) % 10) / 10;
  return Math.min(4.9, Math.max(4.1, rating));
};

const buildCalories = (name: string, category: string) => {
  const base = category === "Drinks" ? 40 : category === "Extra Sauce" ? 80 : 280;
  const bump = (hashString(name + category) % 160);
  return base + bump;
};

export const products: Product[] = (rawProducts as RawProduct[]).map((item, index) => {
  const category = normalizeCategory(item.categoriesArray);
  const name = item.name.trim();
  const slug = slugify(name);
  const description = cleanText(item.description || "");
  const tags = tagMap[category] ?? tagMap.Default;
  return {
    id: `prod_${index + 1}`,
    slug,
    name,
    description,
    category,
    image: item.image,
    price: buildPrice(name, category),
    rating: buildRating(name),
    reviews: 40 + (hashString(name) % 260),
    calories: buildCalories(name, category),
    tags,
    modifiers: modifierPresets[category] ?? modifierPresets.Default
  };
});

export const categories = Array.from(new Set(products.map((product) => product.category)));

const categoryOrder = [
  "Sandwiches",
  "Bowls",
  "Combo",
  "Sides",
  "Desserts",
  "Drinks",
  "Kids",
  "Gathering",
  "Extra Sauce"
];

export const sortedCategories = categories.sort((a, b) => {
  const aIndex = categoryOrder.indexOf(a);
  const bIndex = categoryOrder.indexOf(b);
  if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
  if (aIndex === -1) return 1;
  if (bIndex === -1) return -1;
  return aIndex - bIndex;
});

export const featuredProducts = products.filter((product) =>
  ["Sandwiches", "Bowls", "Desserts", "Drinks"].includes(product.category)
);

export const getProductBySlug = (slug: string) =>
  products.find((product) => product.slug === slug);

export const summarizePrice = (product: Product) => {
  const modifierPrices = product.modifiers
    .flatMap((group) => group.options)
    .map((option) => option.priceDelta || 0);
  const maxAddon = Math.max(0, ...modifierPrices);
  return `${formatPrice(product.price)} - ${formatPrice(product.price + maxAddon)}`;
};
