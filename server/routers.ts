import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getProducts, getProductById, getCategories, getCategoryById, getProductsByCategory } from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Productos
  products: router({
    list: publicProcedure.query(async () => {
      return getProducts();
    }),
    byId: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getProductById(input.id);
    }),
    byCategory: publicProcedure.input(z.object({ categoryId: z.number() })).query(async ({ input }) => {
      return getProductsByCategory(input.categoryId);
    }),
  }),

  // Categorías
  categories: router({
    list: publicProcedure.query(async () => {
      return getCategories();
    }),
    byId: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getCategoryById(input.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
