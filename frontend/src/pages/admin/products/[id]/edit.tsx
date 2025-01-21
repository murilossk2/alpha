import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import AdminLayout from '../../../../components/Admin/AdminLayout';
import { PhotoIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface ProductForm {
  name: string;
  description: string;
  price: {
    current: number;
    min?: number;
    max?: number;
  };
  category: string;
  tags: string[];
  active: boolean;
}

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductForm>();

  // Buscar dados do produto
  const { data: product, isLoading: isLoadingProduct } = useQuery(
    ['product', id],
    async () => {
      if (id) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
        return response.data;
      }
    },
    {
      enabled: !!id,
      onSuccess: (data) => {
        if (data) {
          reset({
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category._id,
            tags: data.tags,
            active: data.active,
          });
          setExistingImages(data.images || []);
        }
      },
    }
  );

  // Buscar categorias
  const { data: categories } = useQuery('categories', async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
    return response.data;
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(prev => [...prev, ...files]);

      // Criar URLs de preview
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeNewImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageUrl: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}/images`, {
        data: { imageUrl },
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      setExistingImages(prev => prev.filter(img => img !== imageUrl));
      toast.success('Imagem removida com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover imagem');
    }
  };

  const onSubmit = async (data: ProductForm) => {
    try {
      // Criar FormData para envio de arquivos
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', JSON.stringify(data.price));
      formData.append('category', data.category);
      formData.append('tags', JSON.stringify(data.tags));
      formData.append('active', String(data.active));

      // Adicionar novas imagens
      images.forEach(image => {
        formData.append('images', image);
      });

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      toast.success('Produto atualizado com sucesso!');
      router.push('/admin/products');
    } catch (error) {
      toast.error('Erro ao atualizar produto');
      console.error(error);
    }
  };

  if (isLoadingProduct) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Editar Produto
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
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Preço
                  </label>
                  <div className="mt-1">
                    <input
                      {...register('price.current', {
                        required: 'Preço é obrigatório',
                        min: { value: 0, message: 'Preço deve ser maior que 0' }
                      })}
                      type="number"
                      step="0.01"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.price?.current && (
                      <p className="mt-1 text-sm text-red-600">{errors.price.current.message}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Categoria
                  </label>
                  <div className="mt-1">
                    <select
                      {...register('category', { required: 'Categoria é obrigatória' })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories?.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">Imagens Existentes</label>
                  {existingImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      {existingImages.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Imagem ${index + 1}`}
                            className="h-24 w-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(url)}
                            className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1 hover:bg-red-600"
                          >
                            <span className="sr-only">Remover</span>
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <label className="block text-sm font-medium text-gray-700 mt-6">Adicionar Novas Imagens</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="images"
                          className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500"
                        >
                          <span>Upload de imagens</span>
                          <input
                            id="images"
                            name="images"
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                    </div>
                  </div>

                  {/* New Image Previews */}
                  {previewUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1 hover:bg-red-600"
                          >
                            <span className="sr-only">Remover</span>
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-6">
                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        {...register('active')}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="active" className="font-medium text-gray-700">
                        Ativo
                      </label>
                      <p className="text-gray-500">Produto disponível para visualização</p>
                    </div>
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
