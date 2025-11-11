# DogsWebSite

DogsWebSite é uma rede social para pets onde usuários podem criar perfis, postar fotos, curtir, comentar e acompanhar estatísticas do próprio perfil. O objetivo é oferecer uma experiência simples e agradável para quem gosta de compartilhar momentos dos seus animais de estimação.

## Principais funcionalidades

- Postar fotos e descrições
- Curtir e comentar publicações
- Visualizar perfil de usuário com estatísticas e gráficos
- Modal de visualização de fotos e interação (comentários)

## Tecnologias

- React
- react-router-dom
- Victory

## Instalação (local)

Recomenda-se ter o Node.js instalado (versão 14+ ou compatível). No diretório do projeto, execute:

```powershell
npm install
```

Scripts importantes disponíveis (via `package.json`):

```powershell
npm start    # Executa a aplicação em modo de desenvolvimento
npm run build # Gera a build de produção na pasta build
npm test     # Executa os testes
```

## Estrutura básica do projeto

- `public/` - arquivos estáticos (index.html, manifest)
- `src/` - código fonte React (componentes, hooks, serviços, etc.)
- `src/Components` - componentes reutilizáveis e páginas
- `src/services` - serviços (ex.: StorageService)
- `src/utils` e `src/Hooks` - utilitários e hooks personalizados

## Usuários relacionados ao projeto

- Autor / Owner do repositório: YuriBoppre (GitHub: YuriBoppre)
- Contrib: Alex Farias (Github: Alex-Farias) e Matheus Araldi (Github: Araldi42) 
- Branch de desenvolvimento atual: `develop_RefactoryToCleanCode`

## Observações

Este README foi simplificado para refletir rapidamente o projeto. Para detalhes de arquitetura e decisões de refatoração, confira os arquivos `ANALISE_REFATORACAO.md` e `DESCRITIVO_MUDANCAS_REFATORACAO.md` na raiz do repositório.
