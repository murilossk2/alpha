import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import AdminLayout from '../../../components/Admin/AdminLayout';
import axios from 'axios';

interface PromotionForm {
  name: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  products: string[];
  categories: string[];
}

export default function CreatePromotion() {
  const router = useRouter();
  const { data: session } = useSession();
  const { register, handleSubmit, formState: { errors } } = useForm<PromotionForm>();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Buscar produtos
  const { data: products } = useQuery('products', async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      params: { limit: 100 }, // Buscar mais produtos para seleção
    });
    return response.data;
  });

  // Buscar categorias
  const { data: categories } = useQuery('categories', async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
    return response.data;
  });

  const handleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const handleCategorySelection = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const onSubmit = async (data: PromotionForm) => {
    try {
      const promotionData = {
        ...data,
        discountPercentage: Number(data.discountPercentage),
        products: selectedProducts,
        categories: selectedCategories,
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/promotions`,
        promotionData,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      toast.success('Promoção criada com sucesso!');
      router.push('/admin/promotions');
    } catch (error) {
      toast.error('Erro ao criar promoção');
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Nova Promoção
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-8 divide-y divide-gray-200">
            <div>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome
                  </label>
                  <div className="mt-1">
                    <input
                      {...register('name', { required: 'Nome é obrigatório' })}
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <div className="mt-1">
                    <textarea
                      {...register('description', { required: 'Descrição é obrigatória' })}
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700">
                    Desconto (%)
                  </label>
                  <div className="mt-1">
                    <input
                      {...register('discountPercentage', {
                        required: 'Desconto é obrigatório',
                        min: { value: 0, message: 'Desconto deve ser maior que 0' },
                        max: { value: 100, message: 'Desconto deve ser menor que 100' }
                      })}
                      type="number"
                      step="0.01"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.discountPercentage && (
                      <p className="mt-1 text-sm text-red-600">{errors.discountPercentage.message}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Data de Início
                  </label>
                  <div className="mt-1">
                    <input
                      {...register('startDate', { required: 'Data de início é obrigatória' })}
                      type="datetime-local"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    Data de Término
                  </label>
                  <div className="mt-1">
                    <input
                      {...register('endDate', { required: 'Data de término é obrigatória' })}
                      type="datetime-local"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categorias Aplicáveis
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories?.items?.map((category) => (
                      <div key={category._id} className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category._id)}
                            onChange={() => handleCategorySelection(category._id)}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label className="font-medium text-gray-700">
                            {category.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Produtos Aplicáveis
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products?.items?.map((product) => (
                      <div key={product._id} className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product._id)}
                            onChange={() => handleProductSelection(product._id)}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label className="font-medium text-gray-700">
                            {product.name}
                          </label>
                          <p className="text-gray-500">{product.category.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Salvar
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
