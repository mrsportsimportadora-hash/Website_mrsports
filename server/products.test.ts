import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Crear contexto público para pruebas
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("products router", () => {
  it("should list all products", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.products.list();

    expect(Array.isArray(products)).toBe(true);
    if (products.length > 0) {
      expect(products[0]).toHaveProperty("id");
      expect(products[0]).toHaveProperty("name");
      expect(products[0]).toHaveProperty("price");
      expect(products[0]).toHaveProperty("stock");
      expect(products[0]).toHaveProperty("categoryId");
    }
  });

  it("should get product by id", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Primero obtener la lista de productos
    const products = await caller.products.list();

    if (products.length > 0) {
      const firstProduct = products[0];
      const product = await caller.products.byId({ id: firstProduct.id });

      expect(product).toBeDefined();
      expect(product?.id).toBe(firstProduct.id);
      expect(product?.name).toBe(firstProduct.name);
    }
  });

  it("should filter products by category", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Primero obtener categorías
    const categories = await caller.categories.list();

    if (categories.length > 0) {
      const firstCategory = categories[0];
      const products = await caller.products.byCategory({ categoryId: firstCategory.id });

      expect(Array.isArray(products)).toBe(true);
      // Todos los productos deben pertenecer a la categoría especificada
      products.forEach(product => {
        expect(product.categoryId).toBe(firstCategory.id);
      });
    }
  });
});

describe("categories router", () => {
  it("should list all categories", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const categories = await caller.categories.list();

    expect(Array.isArray(categories)).toBe(true);
    if (categories.length > 0) {
      expect(categories[0]).toHaveProperty("id");
      expect(categories[0]).toHaveProperty("name");
    }
  });

  it("should get category by id", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Primero obtener la lista de categorías
    const categories = await caller.categories.list();

    if (categories.length > 0) {
      const firstCategory = categories[0];
      const category = await caller.categories.byId({ id: firstCategory.id });

      expect(category).toBeDefined();
      expect(category?.id).toBe(firstCategory.id);
      expect(category?.name).toBe(firstCategory.name);
    }
  });
});
