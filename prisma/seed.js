const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const cleanText = (value) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const hashString = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const priceMap = {
  Sandwiches: 1.4,
  Bowls: 1.6,
  Desserts: 1.0,
  Drinks: 0.45,
  "Extra Sauce": 0.25,
  Sides: 0.6,
  Kids: 0.9,
  Combo: 2.5,
  Gathering: 6.0
};

const buildPrice = (name, category) => {
  const base = priceMap[category] || 1.2;
  const bump = (hashString(name) % 40) / 100;
  return Number((base + bump).toFixed(3));
};

async function main() {
  const filePath = path.join(process.cwd(), "Product_Details.json");
  const raw = fs.readFileSync(filePath, "utf8").trim();
  const data = JSON.parse(`[${raw}]`);

  for (const item of data) {
    const name = item.name.trim();
    const description = cleanText(item.description || "");
    const categoryName = (item.categoriesArray || "Specials").trim();
    const categorySlug = slugify(categoryName);

    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: { name: categoryName },
      create: { name: categoryName, slug: categorySlug }
    });

    const itemSlug = slugify(name);
    await prisma.menuItem.upsert({
      where: { slug: itemSlug },
      update: {
        name,
        description,
        image: item.image || null,
        categoryId: category.id
      },
      create: {
        name,
        slug: itemSlug,
        description,
        image: item.image || null,
        price: buildPrice(name, categoryName),
        categoryId: category.id
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
