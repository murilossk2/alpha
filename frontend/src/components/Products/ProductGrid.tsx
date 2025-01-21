import { useState } from 'react';
import ProductCard from './ProductCard';
import { FunnelIcon } from '@heroicons/react/24/outline';

interface Product {
  _id: string;
  name: string;
  images: Array<{
    url: string;
    thumbnail: string;
    alt: string;
  }>;
  price: {
    current: number;
    min?: number;
    max?: number;
  };
  promotion?: {
    discountPercentage: number;
  };
  category: {
    _id: string;
    name: string;
  };
  tags: string[];
}

interface ProductGridProps {
  products: Product[];
  categories: Array<{
    _id: string;
    name: string;
  }>;
}

export default function ProductGrid({ products, categories }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = products.filter(product => {
    if (!selectedCategory) return true;
    return product.category._id === selectedCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (selectedSort) {
      case 'price-asc':
        return (a.price.current || 0) - (b.price.current || 0);
      case 'price-desc':
        return (b.price.current || 0) - (a.price.current || 0);
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden flex items-center text-gray-600 hover:text-gray-900"
        >
          <FunnelIcon className="h-5 w-5 mr-2" />
          Filtros
        </button>

        <div className={`w-full sm:w-auto space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4 ${showFilters ? 'block' : 'hidden sm:flex'}`}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full sm:w-auto rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
          >
            <option value="">Todas as Categorias</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="block w-full sm:w-auto rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
          >
            <option value="">Ordenar por</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
            <option value="name-asc">A-Z</option>
            <option value="name-desc">Z-A</option>
          </select>
        </div>

        <p className="text-sm text-gray-500">
          {sortedProducts.length} {sortedProducts.length === 1 ? 'produto' : 'produtos'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum produto encontrado</p>
        </div>
      )}
    </div>
  );
}
