# Análise de Problemas e Estratégia de Refatoração - Dogs

## 1. Descrição do Software

O **Dogs** é uma aplicação web de rede social desenvolvida em React, focada em compartilhamento de fotos de cachorros. O sistema permite que usuários:

- Realizem cadastro e autenticação (login/logout)
- Publiquem fotos com informações sobre seus pets (nome, peso, idade)
- Visualizem um feed infinito de fotos
- Comentem nas fotos de outros usuários
- Visualizem estatísticas de suas postagens
- Acessem perfis de outros usuários
- Excluam suas próprias fotos

### Tecnologias Utilizadas
- **React 18.0.0** - Framework principal
- **React Router DOM** - Gerenciamento de rotas
- **Victory** - Biblioteca para gráficos/estatísticas
- **CSS Modules** - Estilização de componentes

---

## 2. Principais Problemas Detectados (Code Smells)

### 2.1 **Acesso Direto ao localStorage Espalhado pelo Código**
**Severidade: Alta**

**Localização:**
- `src/api.js` (linhas 93, 106, 144)
- `src/UserContext.js` (linhas 20, 46, 59)
- `src/Components/User/UserPhotoPost.js` (linha 32)
- `src/Components/Photo/PhotoCommentsForm.js` (linha 15)

**Problema:**
O acesso direto ao `window.localStorage` está espalhado por diversos arquivos, violando o princípio DRY (Don't Repeat Yourself) e o princípio da responsabilidade única. Isso dificulta:
- Testes unitários (necessita mockar window.localStorage em vários lugares)
- Mudanças futuras no mecanismo de armazenamento
- Manutenção do código

**Exemplo:**
```javascript
// api.js linha 93
Authorization: 'Bearer ' + window.localStorage.getItem('token')
```

---

### 2.2 **Magic Numbers e Strings Hardcoded**
**Severidade: Média**

**Localização:**
- `src/Components/Feed/Feed.js` (linha 17, 20)
- `src/Components/Feed/FeedPhotos.js` (linha 14)
- `src/Hooks/useForm.js` (linhas 9-10)

**Problema:**
Valores literais sem contexto espalhados pelo código.

**Exemplos:**
```javascript
// Feed.js
if (scroll > height * 0.75 && !wait) { // 0.75 é um magic number
  // ...
  setTimeout(() => { wait = false; }, 500); // 500ms sem contexto
}

// FeedPhotos.js
const total = 6, // Por que 6? Deveria ser uma constante nomeada
```

---

### 2.3 **Estilos Inline no Código JSX**
**Severidade: Média**

**Localização:**
- `src/Components/Feed/Feed.js` (linhas 51-56)
- `src/Components/User/UserPhotoPost.js` (linha 69)

**Problema:**
Estilos inline violam a separação de responsabilidades e dificultam a manutenção.

**Exemplo:**
```javascript
<p style={{
  textAlign: "center",
  padding: "2rem 0 4rem 0",
  color: "#888",
}}>
  Não existem mais postagens.
</p>
```

---

### 2.4 **Falta de Tratamento de Erros Adequado**
**Severidade: Alta**

**Localização:**
- `src/UserContext.js` (função `getUser` não tem try/catch)
- `src/Components/Feed/FeedPhotos.js` (função `fetchPhotos` sem tratamento)
- `src/Components/User/UserStats.js` (função `getData` sem tratamento)

**Problema:**
Muitas funções async não possuem tratamento adequado de erros, o que pode causar crashes inesperados.

**Exemplo:**
```javascript
// UserContext.js - função getUser sem try/catch
async function getUser(token) {
  const { url, options } = USER_GET(token),
    response = await fetch(url, options),
    json = await response.json();
  // Se o fetch falhar, não há tratamento
  setData(json);
  setLogin(true);
}
```

---

### 2.5 **Formatação Inconsistente de Código**
**Severidade: Baixa**

**Localização:** Todo o projeto

**Problema:**
- Mistura de declarações de variáveis com vírgulas e separadas
- Inconsistência no uso de aspas simples vs duplas
- Falta de ponto e vírgula em alguns lugares

**Exemplos:**
```javascript
// UserContext.js - múltiplas variáveis em uma linha
const [data, setData] = React.useState(null),
  [login, setLogin] = React.useState(null),
  [loading, setLoading] = React.useState(false),
  [error, setError] = React.useState(null),
  navigate = useNavigate();

// Inconsistência de aspas
import React from "react"; // aspas duplas
import React from 'react'; // aspas simples
```

---

### 2.6 **Falta de PropTypes em Vários Componentes**
**Severidade: Média**

**Localização:**
- Maioria dos componentes (apenas `Feed.js` possui)

**Problema:**
Falta de validação de tipos das props dificulta debugging e documentação.

**Componentes sem PropTypes:**
- `FeedPhotos.js`
- `PhotoContent.js`
- `PhotoComments.js`
- `Input.js`
- `Button.js`
- Entre outros...

---

### 2.7 **Componentes com Múltiplas Responsabilidades**
**Severidade: Alta**

**Localização:**
- `src/UserContext.js` - gerencia autenticação, estado do usuário e navegação
- `src/Components/Feed/Feed.js` - gerencia modal, paginação e scroll infinito

**Problema:**
Viola o princípio da responsabilidade única (Single Responsibility Principle).

---

### 2.8 **Acoplamento Forte com API Externa**
**Severidade: Alta**

**Localização:**
- `src/api.js` - URL hardcoded

**Problema:**
```javascript
export const API_URL = 'https://dogsapi.origamid.dev/json';
```
- Dificulta testes
- Dificulta mudança de ambiente (dev, staging, prod)
- Sem variáveis de ambiente configuradas

---

### 2.9 **Falta de Constantes para Valores Repetidos**
**Severidade: Média**

**Problema:**
- Strings de rotas repetidas
- Nomes de campos de formulário
- Mensagens de erro

**Exemplo:**
```javascript
// Rota "/login" aparece múltiplas vezes
navigate("/login"); // UserContext.js
<Navigate to="/login" /> // ProtectedRoute.js
```

---

### 2.10 **Código Duplicado**
**Severidade: Média**

**Localização:**
- Padrão de uso do hook `useFetch` repetido em vários componentes
- Padrão de estrutura de formulários repetido

**Exemplo:**
```javascript
// Padrão repetido em LoginCreate, UserPhotoPost, etc.
const { loading, error, request } = useFetch();

async function handleSubmit(event) {
  event.preventDefault();
  const { url, options } = API_FUNCTION(data);
  await request(url, options);
}
```

---

### 2.11 **Falta de Testes Unitários**
**Severidade: Crítica**

**Problema:**
O projeto não possui nenhum teste implementado, apesar de ter as bibliotecas de teste instaladas.

---

### 2.12 **Dependências Desatualizadas**
**Severidade: Média**

**Problema:**
- `react-router-dom` usa versão experimental
- Dependências podem ter vulnerabilidades de segurança

```json
"react-router-dom": "^0.0.0-experimental-compat.6"
```

---

### 2.13 **Nomes de Variáveis Não Descritivos**
**Severidade: Baixa**

**Localização:**
- `src/Components/Feed/Feed.js` (variável `wait`)
- `src/Hooks/useFetch.js` (variáveis `response`, `json` sem contexto)
- `src/Components/User/UserPhotoPost.js` (variável `img`)

**Exemplo:**
```javascript
let wait = false; // Deveria ser algo como isThrottling ou isFetchingMore
```

---

### 2.14 **Falta de Comentários e Documentação**
**Severidade: Média**

**Problema:**
- Funções complexas sem JSDoc
- Lógica de negócio sem explicação
- Falta de README adequado

---

### 2.15 **Ausência de Linter Configurado**
**Severidade: Alta**

**Problema:**
Apesar de ter ESLint configurado no `package.json`, não há um arquivo `.eslintrc` com regras personalizadas, e nenhum Prettier configurado para formatação consistente.

---

## 3. Estratégias de Refatoração

### 3.1 **Implementação de Camada de Serviço de Storage**

**Objetivo:** Centralizar acesso ao localStorage

**Implementação:**
```javascript
// src/services/StorageService.js
class StorageService {
  static getToken() {
    return window.localStorage.getItem('token');
  }
  
  static setToken(token) {
    window.localStorage.setItem('token', token);
  }
  
  static removeToken() {
    window.localStorage.removeItem('token');
  }
}
```

**Benefícios:**
- Facilita testes (mock único)
- Centraliza lógica de armazenamento
- Permite mudança fácil de mecanismo de storage

---

### 3.2 **Criação de Arquivo de Constantes**

**Objetivo:** Eliminar magic numbers e strings hardcoded

**Implementação:**
```javascript
// src/constants/index.js
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ACCOUNT: '/conta',
  PHOTO: (id) => `/foto/${id}`,
  PROFILE: (user) => `/perfil/${user}`,
};

export const PAGINATION = {
  PHOTOS_PER_PAGE: 6,
  SCROLL_THRESHOLD: 0.75,
  INFINITE_SCROLL_DELAY: 500,
};

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  // ...
};
```

**Benefícios:**
- Valores com contexto claro
- Facilita manutenção
- Reduz erros de digitação

---

### 3.3 **Configuração de Variáveis de Ambiente**

**Objetivo:** Externalizar configurações

**Implementação:**
```bash
# .env
REACT_APP_API_URL=https://dogsapi.origamid.dev/json
REACT_APP_ENVIRONMENT=development
```

```javascript
// src/config/environment.js
export const config = {
  apiUrl: process.env.REACT_APP_API_URL,
  environment: process.env.REACT_APP_ENVIRONMENT,
};
```

---

### 3.4 **Refatoração do UserContext**

**Objetivo:** Separar responsabilidades

**Implementação:**
- Criar `AuthService` para lógica de autenticação
- Criar `UserService` para operações de usuário
- Manter UserContext apenas para gerenciamento de estado

---

### 3.5 **Implementação de Testes Unitários**

**Objetivo:** Alcançar ~50% de cobertura

**Ferramentas:**
- Jest (já instalado)
- React Testing Library (já instalado)

**Prioridades de Teste:**
1. Hooks customizados (`useForm`, `useFetch`)
2. Componentes de formulário (`Input`, `Button`)
3. Serviços (Storage, Auth)
4. Funções utilitárias

**Exemplo de Teste:**
```javascript
// src/Hooks/__tests__/useForm.test.js
import { renderHook, act } from '@testing-library/react';
import useForm from '../useForm';

describe('useForm', () => {
  it('should validate email correctly', () => {
    const { result } = renderHook(() => useForm('email'));
    
    act(() => {
      result.current.setValue('invalid-email');
    });
    
    expect(result.current.validate()).toBe(false);
    expect(result.current.error).toBeTruthy();
  });
});
```

---

### 3.6 **Configuração de Linter e Prettier**

**Objetivo:** Garantir consistência de código

**Ferramentas a Implementar:**

**ESLint:**
```bash
npm install --save-dev eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks
```

**Prettier:**
```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

**Configuração `.eslintrc.json`:**
```json
{
  "extends": [
    "airbnb",
    "airbnb/hooks",
    "plugin:react/recommended",
    "plugin:prettier/recommended"
  ],
  "rules": {
    "react/prop-types": "warn",
    "no-console": "warn",
    "react/react-in-jsx-scope": "off"
  }
}
```

**Configuração `.prettierrc`:**
```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 80,
  "tabWidth": 2,
  "semi": true
}
```

---

### 3.7 **Implementação de PropTypes/TypeScript**

**Opção 1: PropTypes** (mais rápida)
```javascript
import PropTypes from 'prop-types';

Input.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
};
```

**Opção 2: TypeScript** (mais robusta, mas requer mais trabalho)
- Migração gradual de `.js` para `.tsx`
- Tipagem completa do projeto

**Recomendação:** Começar com PropTypes para implementação rápida.

---

### 3.8 **Refatoração de Estilos Inline**

**Objetivo:** Mover estilos inline para CSS Modules

**Implementação:**
```css
/* Feed.module.css */
.endMessage {
  text-align: center;
  padding: 2rem 0 4rem 0;
  color: #888;
}
```

```javascript
// Feed.js
<p className={styles.endMessage}>
  Não existem mais postagens.
</p>
```

---

### 3.9 **Melhoria no Tratamento de Erros**

**Objetivo:** Tratamento consistente de erros

**Implementação:**
```javascript
// src/utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    // Erro da API
    return error.response.data.message || 'Erro no servidor';
  } else if (error.request) {
    // Sem resposta
    return 'Sem resposta do servidor';
  } else {
    // Outro erro
    return error.message || 'Erro desconhecido';
  }
};
```

---

### 3.10 **Implementação de Interface Fluente**

**Conceito:** API encadeável para construção de queries/formulários

**Exemplo de Implementação:**
```javascript
// src/builders/PhotoQueryBuilder.js
class PhotoQueryBuilder {
  constructor() {
    this.params = {
      page: 1,
      total: 6,
      user: 0,
    };
  }

  forUser(userId) {
    this.params.user = userId;
    return this;
  }

  withPage(page) {
    this.params.page = page;
    return this;
  }

  withTotal(total) {
    this.params.total = total;
    return this;
  }

  build() {
    return PHOTOS_GET(this.params);
  }
}

// Uso:
const query = new PhotoQueryBuilder()
  .forUser(123)
  .withPage(2)
  .withTotal(12)
  .build();
```

**Benefícios:**
- API mais legível
- Validação em cada etapa
- Fácil extensão de funcionalidades

---

### 3.11 **Reorganização da Estrutura de Pastas**

**Estrutura Atual:**
```
src/
  Components/
  Hooks/
  Assets/
```

**Estrutura Proposta:**
```
src/
  components/      # Componentes React
  hooks/          # Custom hooks
  services/       # Lógica de negócio e API
  utils/          # Funções utilitárias
  constants/      # Constantes da aplicação
  types/          # PropTypes ou TypeScript types
  styles/         # Estilos globais
  config/         # Configurações
  __tests__/      # Testes (ou colocados junto aos arquivos)
  assets/         # Imagens, SVGs, etc.
```

---

### 3.12 **Criação de Custom Hooks Adicionais**

**Hooks a Criar:**

1. **useAuth** - Encapsula lógica de autenticação
2. **useLocalStorage** - Abstrai acesso ao localStorage
3. **useInfiniteScroll** - Extrai lógica de scroll infinito do Feed
4. **useModal** - Gerencia estado de modais

---

### 3.13 **Implementação de Loading e Error Boundaries**

**Objetivo:** Melhor experiência do usuário em erros

```javascript
// src/components/ErrorBoundary/ErrorBoundary.js
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

---

## 4. Ferramentas Recomendadas

### 4.1 **Desenvolvimento e Código**

| Ferramenta | Propósito | Prioridade |
|------------|-----------|------------|
| **ESLint** | Análise estática de código | Alta |
| **Prettier** | Formatação de código | Alta |
| **Husky** | Git hooks para validação pré-commit | Média |
| **lint-staged** | Lint apenas em arquivos modificados | Média |
| **EditorConfig** | Configuração consistente entre editores | Baixa |

### 4.2 **Testes**

| Ferramenta | Propósito | Prioridade |
|------------|-----------|------------|
| **Jest** | Framework de testes | Alta |
| **React Testing Library** | Testes de componentes | Alta |
| **@testing-library/user-event** | Simulação de interações | Alta |
| **jest-coverage** | Relatórios de cobertura | Alta |
| **MSW (Mock Service Worker)** | Mock de APIs | Média |

### 4.3 **Qualidade de Código**

| Ferramenta | Propósito | Prioridade |
|------------|-----------|------------|
| **SonarQube/SonarCloud** | Análise de qualidade e code smells | Média |
| **CodeClimate** | Métricas de qualidade | Baixa |
| **Snyk** | Análise de vulnerabilidades | Alta |

### 4.4 **Documentação**

| Ferramenta | Propósito | Prioridade |
|------------|-----------|------------|
| **JSDoc** | Documentação de código | Média |
| **Storybook** | Documentação de componentes | Baixa |

### 4.5 **CI/CD**

| Ferramenta | Propósito | Prioridade |
|------------|-----------|------------|
| **GitHub Actions** | Automação de testes e deploy | Alta |
| **Vercel/Netlify** | Deploy automático | Média |

---

## 5. Plano de Execução (Priorização)

### Fase 1: Fundação (3-4 horas)
1. ✅ Configurar ESLint + Prettier
2. ✅ Criar arquivo de constantes
3. ✅ Implementar StorageService
4. ✅ Criar variáveis de ambiente
5. ✅ Adicionar PropTypes aos componentes principais

### Fase 2: Refatoração Core (4-5 horas)
6. ✅ Refatorar UserContext
7. ✅ Extrair lógica em custom hooks
8. ✅ Melhorar tratamento de erros
9. ✅ Remover estilos inline
10. ✅ Reorganizar estrutura de pastas

### Fase 3: Testes (3-4 horas)
11. ✅ Configurar ambiente de testes
12. ✅ Testar hooks (useForm, useFetch)
13. ✅ Testar componentes principais
14. ✅ Testar serviços
15. ✅ Atingir ~50% de cobertura

### Fase 4: Documentação e Finalização (1-2 horas)
16. ✅ Atualizar README.md
17. ✅ Criar CHANGELOG.md
18. ✅ Documentar interface fluente
19. ✅ Revisar código e aplicar linter

---

## 6. Métricas de Sucesso

### 6.1 **Qualidade de Código**
- ✅ 0 erros de ESLint
- ✅ 0 warnings críticos
- ✅ Todas as variáveis e funções com nomes descritivos
- ✅ Sem código duplicado significativo

### 6.2 **Cobertura de Testes**
- ✅ Mínimo 50% de cobertura geral
- ✅ 70%+ de cobertura em hooks
- ✅ 50%+ de cobertura em componentes principais

### 6.3 **Documentação**
- ✅ README completo com instruções
- ✅ CHANGELOG detalhado
- ✅ Comentários em código complexo
- ✅ PropTypes em todos os componentes

### 6.4 **Arquitetura**
- ✅ Separação clara de responsabilidades
- ✅ Baixo acoplamento entre módulos
- ✅ Alta coesão dentro dos módulos
- ✅ Código facilmente testável

---

## 7. Riscos e Mitigações

### 7.1 **Riscos Identificados**

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Quebrar funcionalidades existentes | Alto | Média | Testes abrangentes antes de cada refatoração |
| Escopo crescer além de 10 horas | Médio | Alta | Priorizar fases 1-3, fase 4 é opcional |
| Conflitos com dependências antigas | Médio | Baixa | Atualizar dependências gradualmente |
| Dificuldade em atingir 50% cobertura | Médio | Média | Focar em testar lógica core, não UI |

---

## 8. Conclusão

O projeto Dogs possui uma base sólida, mas apresenta diversos code smells e oportunidades de melhoria. A estratégia de refatoração proposta:

✅ **Elimina code smells** através de padrões consolidados  
✅ **Melhora testabilidade** com desacoplamento e camada de serviço  
✅ **Aumenta manutenibilidade** com linter, constantes e documentação  
✅ **Segue princípios Clean Code** (DRY, SOLID, KISS)  
✅ **É executável em ~10-12 horas** com entregas incrementais  

A implementação seguirá abordagem incremental, permitindo validação constante e ajustes durante o processo.

---

**Documento criado em:** 21/10/2025  
**Versão:** 1.0  
**Autor:** Equipe de Refatoração Dogs

