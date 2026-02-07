import type { ModifierGroup } from "@/lib/products";
import { hashString } from "@/lib/utils";

import type { Decimal } from "@prisma/client/runtime/library";

export type MenuItemRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string | null;
  price: number | string | Decimal;
  category?: { name: string; slug: string } | null;
};

export type CardProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string | null;
  price: number;
  category: string;
  tags?: string[];
  rating?: number;
  reviews?: number;
};

export type DetailProduct = CardProduct & {
  modifiers: ModifierGroup[];
  calories: number;
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

const normalizeCategory = (value?: string | null) => value?.trim() || "Specials";

const buildRating = (name: string) => {
  const rating = 4 + (hashString(name) % 10) / 10;
  return Math.min(4.9, Math.max(4.1, rating));
};

const buildCalories = (name: string, category: string) => {
  const base = category === "Drinks" ? 40 : category === "Extra Sauce" ? 80 : 280;
  const bump = hashString(name + category) % 160;
  return base + bump;
};

const buildReviews = (name: string) => 40 + (hashString(name) % 260);

export const toCardProduct = (item: MenuItemRecord): CardProduct => {
  const categoryName = normalizeCategory(item.category?.name);
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    image: item.image || undefined,
    price: Number(item.price),
    category: categoryName,
    tags: tagMap[categoryName] ?? tagMap.Default,
    rating: buildRating(item.name),
    reviews: buildReviews(item.name)
  };
};

export const toDetailProduct = (item: MenuItemRecord): DetailProduct => {
  const categoryName = normalizeCategory(item.category?.name);
  return {
    ...toCardProduct(item),
    modifiers: modifierPresets[categoryName] ?? modifierPresets.Default,
    calories: buildCalories(item.name, categoryName)
  };
};

export const getCategoriesFromItems = (items: MenuItemRecord[]) => {
  const categories = Array.from(
    new Set(items.map((item) => normalizeCategory(item.category?.name)))
  );
  const order = [
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
  return categories.sort((a, b) => {
    const aIndex = order.indexOf(a);
    const bIndex = order.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
};
