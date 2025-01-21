# Catálogo de Chopeiras - Frontend

Sistema de catálogo de produtos especializado em chopeiras, com painel administrativo para gerenciamento de produtos, categorias e promoções.

## Tecnologias Utilizadas

- Next.js 13
- React 18
- TypeScript
- Tailwind CSS
- React Query
- Next Auth
- React Hook Form
- Axios
- React Toastify
- Swiper

## Funcionalidades

### Área Pública
- Catálogo de produtos com filtros e busca
- Visualização detalhada de produtos
- Contato via WhatsApp
- Promoções em destaque
- Produtos em destaque
- Categorias de produtos

### Painel Administrativo
- Gerenciamento de produtos
  - Listagem com busca e paginação
  - Criação e edição com upload de imagens
  - Exclusão de produtos
- Gerenciamento de categorias
  - Listagem com busca
  - Criação e edição com imagem
  - Exclusão de categorias
- Gerenciamento de promoções
  - Listagem de promoções ativas e inativas
  - Criação com seleção de produtos ou categorias
  - Definição de período e percentual de desconto
  - Edição e exclusão de promoções

## Pré-requisitos

- Node.js 18+
- NPM ou Yarn

## Configuração

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/chopeiras-catalog-frontend.git
cd chopeiras-catalog-frontend
```

2. Instale as dependências
```bash
npm install
# ou
yarn
```

3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

4. Inicie o servidor de desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000).

## Build para Produção

```bash
npm run build
npm start
# ou
yarn build
yarn start
```

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── pages/         # Páginas da aplicação
  │   ├── admin/     # Páginas do painel administrativo
  │   ├── auth/      # Páginas de autenticação
  │   └── products/  # Páginas de produtos
  ├── styles/        # Estilos globais
  └── utils/         # Funções utilitárias
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
