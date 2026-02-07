import { SectionHeading } from "@/components/SectionHeading";
import { MenuExplorer } from "@/components/MenuExplorer";
import { MobileMenu } from "@/components/MobileMenu";
import { prisma } from "@/lib/prisma";
import {
  getCategoriesFromItems,
  toCardProduct
} from "@/lib/menu-helpers";

import { Suspense } from "react";

export default async function MenuPage() {
  const items = await prisma.menuItem.findMany({
    where: { active: true },
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });
  const categories = getCategoriesFromItems(items);
  const cards = items.map((item) => toCardProduct(item));

  return (
    <Suspense fallback={<div>Loading menu...</div>}>
      <div>
        <div className="md:hidden">
          <MobileMenu items={cards} categories={categories} />
        </div>
        <div className="hidden md:block section">
          <div className="container-padded flex flex-col gap-8">
            <SectionHeading
              eyebrow="Menu"
              title="Build your perfect order"
              description="Choose from bright bowls, signature sandwiches, and housemade sauces."
            />
            <MenuExplorer items={cards} categories={categories} />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
