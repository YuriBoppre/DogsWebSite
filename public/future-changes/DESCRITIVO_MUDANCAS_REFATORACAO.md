# Changelog - Refatoração Dogs

## Resumo das Mudanças Implementadas

### ✅ Fase 1: Fundação (Completa)

#### 1. Configuração de Ferramentas
- ✅ **ESLint**: Configurado `.eslintrc.json` com regras para React
- ✅ **Prettier**: Configurado `.prettierrc` para formatação consistente
- ✅ **PropTypes**: Instalado e implementado nos componentes principais

#### 2. Arquitetura e Estrutura

- Criando variáveis centralizadas, rotas da plicação, paginação, mensagens de erro e validações;
- Service para os dados locais, com métodos: `getToken()`, `setToken()`, `removeToken()`, `hasToken()`;
- Conficurações de ambiente e retorno da API;
- Funções de tratamento de erros: `handleApiError()`, `isResponseOk()`, `extractErrorMessage()`

**Configuração:**
```
.eslintrc.json                       # Configuração ESLint
.prettierrc                          # Configuração Prettier
```

---

## Problemas Resolvidos

1. Criado um service para o localStorage, pois estava acessando diretamente;
2. Adicionado tratamento de erros padronizados;
3. ESlint + Prettier configurados no projeto, fazendo com que tenha um controle maior;
4. Substuído os "Magic Numbers" por constantes nomeadas e objetivas;
5. URL movida pra variável de ambiente;
6. Adicionado PropTypes nos componentes principais do projeto;

---

## Melhorias de Código

### Legibilidade, Manutenibilidade e Testabilidade

- Nomes de variáveis mais descritos, fazendo com que consiga entender exatamente a função. Implementado uma formatação padronizada para deixar a separação das responsavilidades claras e objetivas.
- Lógica de salvar dados locais foram isoladas em um serviço próprio, além de tratativas padrozinadas dos erros internos e externos da api.
- Funções isoladas para facilitar testes unitários, possibilitando mocks de maneira simples.
