import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, ShoppingCart, Zap } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Obtener categorías y productos
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.list.useQuery();
  const { data: products, isLoading: productsLoading } = trpc.products.list.useQuery();

  // Filtrar productos por categoría si está seleccionada
  const filteredProducts = selectedCategory
    ? products?.filter(p => p.categoryId === selectedCategory)
    : products;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-12 w-12" />
            <h1 className="text-2xl font-bold text-slate-900">{APP_TITLE}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Carrito
            </Button>
            {isAuthenticated ? (
              <div className="text-sm text-slate-600">
                {user?.name || "Usuario"}
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Bienvenido a MR Sport</h2>
          <p className="text-xl text-blue-100 mb-8">
            Tu tienda especializada en productos de Pole Dance de la más alta calidad
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary">
              Explorar Catálogo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => window.open('https://wa.me/56912345678?text=Hola%20MR%20Sport%2C%20me%20gustaría%20conocer%20más%20sobre%20sus%20productos', '_blank')}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contactar por WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-1">
        {/* Categorías */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-slate-900">Categorías</h3>
          {categoriesLoading ? (
            <div className="text-center py-8 text-slate-500">Cargando categorías...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="h-auto py-4"
              >
                Todos los Productos
              </Button>
              {categories?.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="h-auto py-4"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}
        </section>

        {/* Productos */}
        <section>
          <h3 className="text-2xl font-bold mb-6 text-slate-900">
            {selectedCategory ? "Productos de la Categoría" : "Catálogo de Productos"}
          </h3>
          {productsLoading ? (
            <div className="text-center py-12 text-slate-500">Cargando productos...</div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    )}
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>{product.provider}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(product.price)}
                      </span>
                      <span className={`text-sm font-semibold ${
                        product.stock > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
                      </span>
                    </div>
                    {(product.reviewsCount ?? 0) > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-slate-600">
                          {product.rating} ({product.reviewsCount} reseñas)
                        </span>
                      </div>
                    )}
                    <Button
                      className="w-full"
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Agregar al Carrito
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              No hay productos disponibles en esta categoría
            </div>
          )}
        </section>
      </main>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/56912345678?text=Hola%20MR%20Sport%2C%20me%20gustaría%20conocer%20más%20sobre%20sus%20productos"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-50"
        title="Contactar por WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Sobre MR Sport</h4>
              <p className="text-slate-400 text-sm">
                Tu tienda especializada en productos de Pole Dance de la más alta calidad.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <p className="text-slate-400 text-sm">
                WhatsApp: +56 9 1234 5678<br />
                Email: info@mrsport.cl
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Envíos</h4>
              <p className="text-slate-400 text-sm">
                Enviamos a todo Chile con Starken Express
              </p>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2025 MR Sport. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
