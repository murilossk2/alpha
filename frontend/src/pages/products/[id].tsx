import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Layout from '../../components/Layout/Layout';
import ProductGallery from '../../components/Products/ProductGallery';
import ProductPrice from '../../components/Products/ProductPrice';
import { TagIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;

  const { data: product, isLoading } = useQuery(
    ['product', id],
    () => axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`).then(res => res.data),
    {
      enabled: !!id
    }
  );

  const handleWhatsAppClick = () => {
    const message = `Olá! Gostaria de saber mais sobre o produto: ${product.name}`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Produto não encontrado</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product Gallery */}
          <div className="mb-8 lg:mb-0">
            <ProductGallery images={product.images} />
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-8">
              <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <a href="/products" className="text-gray-400 hover:text-gray-500">
                      Produtos
                    </a>
                  </li>
                  <li>
                    <span className="text-gray-400 mx-2">/</span>
                    <a href={`/categories/${product.category._id}`} className="text-gray-400 hover:text-gray-500">
                      {product.category.name}
                    </a>
                  </li>
                </ol>
              </nav>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {product.promotion ? (
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    {product.promotion.discountPercentage}% OFF
                  </span>
                </div>
              ) : null}

              <div className="mb-6">
                <ProductPrice price={product.price} promotion={product.promotion} />
              </div>

              <div className="prose prose-blue max-w-none mb-8">
                <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>

              {product.tags && product.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                      >
                        <TagIcon className="h-4 w-4 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-6 mb-8">
                <div className="flex items-center">
                  <TruckIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-600">Entrega em todo Brasil</span>
                </div>
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-600">Garantia de 12 meses</span>
                </div>
              </div>

              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 text-white py-3 px-8 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                Solicitar Orçamento
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
