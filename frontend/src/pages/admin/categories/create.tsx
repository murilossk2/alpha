import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import AdminLayout from '../../../components/Admin/AdminLayout';
import { PhotoIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface CategoryForm {
  name: string;
  description: string;
  parent?: string;
  order: number;
  slug: string;
}

export default function CreateCategory() {
  const router = useRouter();
  const { data: session } = useSession();
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CategoryForm>();

  // Buscar categorias para seleção de categoria pai
  const { data: categories } = useQuery('categories', async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
    return response.data;
  });

  // Gerar slug automaticamente a partir do nome
  const name = watch('name');
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: CategoryForm) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('slug', generateSlug(data.name));
      formData.append('order', String(data.order));
      if (data.parent) {
        formData.append('parent', data.parent);
      }
      if (image) {
        formData.append('image', image);
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/categories`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      toast.success('Categoria criada com sucesso!');
      router.push('/admin/categories');
    } catch (error) {
      toast.error('Erro ao criar categoria');
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Nova Categoria
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
                      {...register('name', { 
                        required: 'Nome é obrigatório',
                        onChange: (e) => setValue('slug', generateSlug(e.target.value))
                      })}
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

                <div className="sm:col-span-3">
                  <label htmlFor="parent" className="block text-sm font-medium text-gray-700">
                    Categoria Pai (opcional)
                  </label>
                  <div className="mt-1">
                    <select
                      {...register('parent')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="">Selecione uma categoria pai</option>
                      {categories?.items?.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                    Ordem
                  </label>
                  <div className="mt-1">
                    <input
                      {...register('order', {
                        required: 'Ordem é obrigatória',
                        min: { value: 0, message: 'Ordem deve ser maior ou igual a 0' }
                      })}
                      type="number"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.order && (
                      <p className="mt-1 text-sm text-red-600">{errors.order.message}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">Imagem</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {previewUrl ? (
                        <div className="relative">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="mx-auto h-32 w-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImage(null);
                              setPreviewUrl('');
                            }}
                            className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1 hover:bg-red-600"
                          >
                            <span className="sr-only">Remover</span>
                            ×
                          </button>
                        </div>
                      ) : (
                        <>
                          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="image"
                              className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500"
                            >
                              <span>Upload de imagem</span>
                              <input
                                id="image"
                                name="image"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                        </>
                      )}
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
