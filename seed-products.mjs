import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'mr_sport',
});

const categories = [
  { name: 'Geles Adherentes', description: 'Geles de agarre para Pole Dance', icon: '💪' },
  { name: 'Sprays', description: 'Sprays de agarre y limpieza', icon: '🧴' },
  { name: 'Accesorios', description: 'Accesorios para Pole Dance', icon: '🎯' },
];

const products = [
  {
    name: 'ULTRAGRIP GEL ADERENTE 100G - POLE',
    description: 'Gel adherente de sílica que absorbe hasta 10 veces más sudor que el magnésio común',
    price: 7990,
    stock: 8,
    categoryId: 1,
    provider: 'UltraGrip',
    rating: 5.0,
    reviewsCount: 8,
  },
  {
    name: 'ULTRAGRIP GEL ADERENTE 50G',
    description: 'Versión más pequeña del gel adherente, perfecta para llevar',
    price: 4990,
    stock: 8,
    categoryId: 1,
    provider: 'UltraGrip',
    rating: 5.0,
    reviewsCount: 8,
  },
  {
    name: 'ULTRAGRIP ZERO ODOR 120ML',
    description: 'Spray de agarre sin olor, ideal para entrenamientos en espacios cerrados',
    price: 5990,
    stock: 2,
    categoryId: 2,
    provider: 'UltraGrip',
    rating: 5.0,
    reviewsCount: 2,
  },
  {
    name: 'ULTRAGRIP LUVAS PRO 100ML',
    description: 'Producto de agarre profesional para guantes',
    price: 11990,
    stock: 5,
    categoryId: 2,
    provider: 'UltraGrip',
    rating: 5.0,
    reviewsCount: 5,
  },
  {
    name: 'ULTRAGRIP PARA LUVAS 120ML',
    description: 'Spray de agarre especial para luvas de Pole Dance',
    price: 9990,
    stock: 8,
    categoryId: 2,
    provider: 'UltraGrip',
    rating: 5.0,
    reviewsCount: 8,
  },
];

try {
  console.log('Insertando categorías...');
  for (const category of categories) {
    await connection.execute(
      'INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)',
      [category.name, category.description, category.icon]
    );
  }
  console.log('✓ Categorías insertadas');

  console.log('Insertando productos...');
  for (const product of products) {
    await connection.execute(
      'INSERT INTO products (name, description, price, stock, categoryId, provider, rating, reviewsCount, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        product.name,
        product.description,
        product.price,
        product.stock,
        product.categoryId,
        product.provider,
        product.rating,
        product.reviewsCount,
        true,
      ]
    );
  }
  console.log('✓ Productos insertados');

  console.log('\n✓ Datos iniciales cargados exitosamente');
} catch (error) {
  console.error('Error:', error);
} finally {
  await connection.end();
}
