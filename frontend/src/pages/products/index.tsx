import { useState } from 'react';
import { useQuery } from 'react-query';
import Layout from '../../components/Layout/Layout';
import ProductGrid from '../../components/Products/ProductGrid';
import axios from 'axios';

export default function Products() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('');

  const { data: productsData, isLoading: isLoadingProducts } = useQuery(
    ['products', page, search, selectedCategory, priceRange, sortBy],
    () => axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      params: {
        page,
        search,
        category: selectedCategory,
        minPrice: priceRange.min || undefined,
        maxPrice: priceRange.max || undefined,
        sortBy,
        limit: 12
      }
    }).then(res => res.data)
  );

  const { data: categories, isLoading: isLoadingCategories } = useQuery('categories',
    () => axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`).then(res => res.data)
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Nossos Produtos</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar produtos..."
                  className="w-full rounded-lg border-gray-300 pl-4 pr-10 focus:border-primary-500 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Todas as Categorias</option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Ordenar por</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="name_asc">Nome (A-Z)</option>
                <option value="name_desc">Nome (Z-A)</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                placeholder="Preço mínimo"
                className="w-32 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
              <span className="text-gray-500">até</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                placeholder="Preço máximo"
                className="w-32 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          {isLoadingProducts || isLoadingCategories ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            </div>
          ) : productsData?.products?.length > 0 ? (
            <>
              <ProductGrid
                products={productsData.products}
                categories={categories || []}
              />

              {/* Pagination */}
              <div className="mt-8 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPage((old) => Math.max(old - 1, 1))}
                    disabled={page === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      page === 1
                        ? 'text-gray-300'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Anterior
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    Página {page} de {productsData.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((old) => Math.min(old + 1, productsData.totalPages))}
                    disabled={page === productsData.totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      page === productsData.totalPages
                        ? 'text-gray-300'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Próxima
                  </button>
                </nav>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum produto encontrado</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
