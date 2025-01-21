import { useQuery } from 'react-query';
import Layout from '../components/Layout/Layout';
import ProductGrid from '../components/Products/ProductGrid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import axios from 'axios';

export default function Home() {
  const { data: featuredProducts, isLoading: isLoadingProducts } = useQuery('featuredProducts', 
    () => axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products?featured=true`).then(res => res.data)
  );

  const { data: categories, isLoading: isLoadingCategories } = useQuery('categories', 
    () => axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`).then(res => res.data)
  );

  const { data: promotions, isLoading: isLoadingPromotions } = useQuery('activePromotions', 
    () => axios.get(`${process.env.NEXT_PUBLIC_API_URL}/promotions/active`).then(res => res.data)
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-8 lg:mb-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Chopeiras de Qualidade para seu Negócio
              </h1>
              <p className="text-lg sm:text-xl mb-8 text-primary-100">
                Encontre a chopeira ideal para seu estabelecimento. Qualidade, durabilidade e suporte técnico especializado.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#produtos"
                  className="inline-block bg-white text-primary-900 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  Ver Produtos
                </a>
                <a
                  href="#contato"
                  className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-900 transition-colors"
                >
                  Fale Conosco
                </a>
              </div>
            </div>
            <div className="relative h-64 lg:h-auto">
              <img
                src="/images/hero-chopeira.jpg"
                alt="Chopeira Profissional"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      {!isLoadingPromotions && promotions?.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Promoções em Destaque</h2>
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              autoplay={{ delay: 5000 }}
              pagination={{ clickable: true }}
              className="pb-12"
            >
              {promotions.map((promotion) => (
                <SwiperSlide key={promotion._id}>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="text-2xl font-bold text-red-600 mb-2">
                      -{promotion.discountPercentage}%
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{promotion.name}</h3>
                    <p className="text-gray-600 mb-4">{promotion.description}</p>
                    <div className="text-sm text-gray-500">
                      Válido até {new Date(promotion.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section id="produtos" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Produtos em Destaque</h2>
          {isLoadingProducts || isLoadingCategories ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            </div>
          ) : (
            <ProductGrid
              products={featuredProducts}
              categories={categories}
            />
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">Entrega e instalação em todo o Brasil</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Garantia Estendida</h3>
              <p className="text-gray-600">Produtos com garantia e qualidade</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Suporte Técnico</h3>
              <p className="text-gray-600">Assistência técnica especializada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Entre em Contato</h2>
                <p className="text-gray-600 mb-8">
                  Tire suas dúvidas, solicite um orçamento ou agende uma visita técnica.
                </p>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">WhatsApp</h4>
                    <a href="https://wa.me/5511999999999" className="text-primary-600 hover:text-primary-700">
                      (11) 99999-9999
                    </a>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                    <a href="mailto:contato@chopeiras.com" className="text-primary-600 hover:text-primary-700">
                      contato@chopeiras.com
                    </a>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Horário de Atendimento</h4>
                    <p className="text-gray-600">Segunda a Sexta: 9h às 18h</p>
                  </div>
                </div>
              </div>
              <div className="relative h-64 lg:h-auto">
                <img
                  src="/images/contact.jpg"
                  alt="Atendimento"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
