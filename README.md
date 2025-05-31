# Curadoria Ágil

Este é um projeto [Next.js](https://nextjs.org) iniciado com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Configuração do Ambiente de Desenvolvimento

Este projeto utiliza `pnpm` como gerenciador de pacotes.

### 1. Instalar pnpm

Se você ainda não tem o `pnpm` instalado, você pode instalá-lo globalmente via npm (que vem com o Node.js):

```bash
npm install -g pnpm
```

Para outras formas de instalação, consulte a [documentação oficial do pnpm](https://pnpm.io/installation).

### 2. Instalar Dependências

Após clonar o repositório, navegue até a pasta do projeto e instale as dependências:

```bash
pnpm install
```

## Getting Started (Como Iniciar)

Após a configuração e instalação das dependências, execute o servidor de desenvolvimento:

```bash
pnpm dev
# ou se preferir outros gerenciadores (embora pnpm seja o padrão do projeto):
# npm run dev
# yarn dev
# bun dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

Você pode começar a editar a aplicação modificando os arquivos na pasta `src/app/`. As páginas são atualizadas automaticamente conforme você edita os arquivos.

Este projeto utiliza [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) para otimizar e carregar automaticamente [Geist](https://vercel.com/font), uma nova família de fontes da Vercel.

## Estrutura do Projeto e Páginas

Aqui está uma visão geral das principais páginas da aplicação e suas funcionalidades:

### 1. Página Inicial (`/`)
   - **Arquivo**: `src/app/page.tsx`
   - **Descrição**: Página de entrada da aplicação. Contém o formulário de login para usuários existentes e links para criação de conta.
   - **Componentes Principais**:
     - `LoginForm` (ou similar para o formulário de login)
     - `PrimaryButton`, `SecondaryButton`
     - `Toast` (para notificações)
   - **Estrutura de Dados (Firebase Firestore)**:
     - Esta página utiliza primariamente o **Firebase Authentication** para login (`signInWithEmailAndPassword`).
     - Não interage diretamente com o Firestore para leitura ou escrita de dados de coleções específicas nesta página.
     - **Dados de Entrada (Formulário)**:
       ```json
       {
         "email": "string",
         "password": "string"
       }
       ```
     - **Local Storage (Opcional - "Lembrar de mim")**:
       ```json
       {
         "rememberedUser": {
           "email": "string",
           "password": "string", // Considerar implicações de segurança
           "timestamp": "number"
         }
       }
       ```
   - **Arquivo**: `src/app/page.tsx`
   - **Descrição**: Página de entrada da aplicação. Contém o formulário de login para usuários existentes e links para criação de conta.
   - **Componentes Principais**:
     - `LoginForm` (ou similar para o formulário de login)
     - `PrimaryButton`, `SecondaryButton`
     - `Toast` (para notificações)

### 2. Criação de Conta (`/create-account`)
   - **Arquivo**: `src/app/create-account/page.tsx`
   - **Descrição**: Permite que novos usuários se registrem na plataforma.
   - **Componentes Principais**:
     - `CreateAccountForm` (ou similar)
     - `StyledFormInput`
     - `PrimaryButton`, `SecondaryButton`
   - **Estrutura de Dados (Firebase Firestore)**:
     - Utiliza o **Firebase Authentication** para criar novos usuários (`createUserWithEmailAndPassword`).
     - **Dados de Entrada (Formulário)**:
       ```json
       {
         "name": "string",
         "email": "string",
         "password": "string"
       }
       ```
     - **Interação Firestore (Intencionada)**: Após a criação do usuário no Auth, dados adicionais como o nome do usuário são tipicamente armazenados na coleção `users` no Firestore.
     - **Coleção `users` (Exemplo de Documento `users/{uid}`)**:
       ```json
       {
         "uid": "string", // ID do usuário (do Firebase Auth)
         "name": "string", // Nome completo do usuário
         "email": "string", // Email do usuário
         "createdAt": "Timestamp" // Data de criação da conta
       }
       ```
   - **Arquivo**: `src/app/create-account/page.tsx`
   - **Descrição**: Permite que novos usuários se registrem na plataforma.
   - **Componentes Principais**:
     - `CreateAccountForm` (ou similar)
     - `StyledFormInput`
     - `PrimaryButton`, `SecondaryButton`

### 3. Página Principal do Usuário (`/home`)
   - **Arquivo**: `src/app/home/page.tsx`
   - **Descrição**: Dashboard principal do usuário após o login. Exibe uma lista de contratos para gerenciamento.
   - **Componentes Principais**:
     - `ContractList` (ou similar para listar contratos)
     - `Header` / `Navbar`
     - `Button`
     - `ContractFormModal` (para criar/editar contratos)
   - **Estrutura de Dados (Firebase Firestore)**:
     - **Leitura**: Coleção `contratos`.
     - **Escrita**: Criação e atualização de documentos na coleção `contratos` (via `ContractFormModal`).
     - **Coleção `contratos` (Documento `contratos/{contractId}`)**:
       ```json
       {
         "id": "string", // ID do documento Firestore
         "title": "string", // Título do contrato
         "text": "string", // Descrição ou texto adicional
         "color": "string", // Cor (hex) para o card do contrato
         "dataInicio": "string", // Data de início (formato "YYYY-MM-DD")
         "dataFinal": "string", // Data de término (formato "YYYY-MM-DD")
         "empresa": "string", // Nome da empresa
         "responsavel": "string", // Responsável pelo contrato
         "status": "string", // Status (ex: "Ativo", "Concluído")
         "userId": "string", // (Opcional) ID do usuário proprietário
         "createdAt": "Timestamp", // Data de criação
         "updatedAt": "Timestamp" // Data da última atualização
       }
       ```
   - **Arquivo**: `src/app/home/page.tsx`
   - **Descrição**: Dashboard principal do usuário após o login. Pode exibir uma lista de contratos ou um resumo geral das atividades.
   - **Componentes Principais**:
     - `ContractList` (ou similar para listar contratos)
     - `Header` / `Navbar`
     - `Button`

### 4. Detalhes do Contrato (`/contrato/:id`)
   - **Arquivo**: `src/app/contrato/[id]/page.tsx`
   - **Descrição**: Exibe informações detalhadas sobre um contrato específico, identificado pelo `:id`. Lista os projetos associados a este contrato.
   - **Componentes Principais Utilizados**:
     - `ProjectTable` (para listar projetos)
     - `PrimaryButton`, `SecondaryButton` (para ações como "Adicionar Projeto")
     - `Breadcrumb`
   - **Estrutura de Dados (Firebase Firestore)**:
     - **Leitura**: Documento específico da coleção `contratos` e documentos da coleção `projetos` filtrados pelo contrato pai.
     - **Exclusão**: Documentos da coleção `projetos`.
     - **Coleção `contratos` (Documento `contratos/{contractId}`)**: (Estrutura conforme definido na página `/home`)
     - **Coleção `projetos` (Documento `projetos/{projectId}`)**:
       ```json
       {
         "parent": "DocumentReference", // Referência ao 'contratos/{contractId}'
         "title": "string", // Título do projeto
         "description": "string", // Descrição do projeto
         "startDate": "string", // Data de início (formato "YYYY-MM-DD")
         "endDate": "string", // Data de término (formato "YYYY-MM-DD")
         "dailyTime": "string", // Horário da daily (formato "HH:MM")
         "status": "string", // Status (ex: "Planejado", "Em Andamento")
         "userId": "string", // (Opcional) ID do usuário proprietário
         "createdAt": "Timestamp",
         "updatedAt": "Timestamp"
       }
       ```
   - **Arquivo**: `src/app/contrato/[id]/page.tsx`
   - **Descrição**: Exibe informações detalhadas sobre um contrato específico, identificado pelo `:id`. Lista os projetos associados a este contrato.
   - **Componentes Principais Utilizados**:
     - `ProjectTable` (para listar projetos)
     - `PrimaryButton`, `SecondaryButton` (para ações como "Adicionar Projeto")
     - `Breadcrumb`

### 5. Novo Projeto (`/contrato/:id/novo`)
   - **Arquivo**: `src/app/contrato/[id]/novo/page.tsx`
   - **Descrição**: Formulário para criação de um novo projeto dentro de um contrato específico. Utiliza um `Stepper` para guiar o usuário pelo processo de criação do projeto e da primeira sprint ("Sprint 0").
   - **Componentes Principais Utilizados**:
     - `Stepper`
     - `ProjectForm`
     - `SprintForm`
     - `StyledFormInput`
     - `PrimaryButton`, `SecondaryButton`
   - **Estrutura de Dados (Firebase Firestore)**:
     - **Escrita**: Criação de novos documentos nas coleções `projetos` e `sprints`.
     - **Coleção `projetos` (Documento `projetos/{newProjectId}`)**: (Estrutura conforme definido na página `/contrato/:id`)
       - O campo `parent` será uma `DocumentReference` para `contratos/{id}`.
     - **Coleção `sprints` (Documento `sprints/{newSprintId}`)**:
       ```json
       {
         "projectId": "string", // ID do projeto pai
         "projectRef": "DocumentReference", // Referência ao 'projetos/{newProjectId}'
         "sprintNumber": 0, // Ou "numero", para a Sprint 0
         "title": "string", // Título/Meta da Sprint 0
         "startDate": "string", // Data de início (formato "YYYY-MM-DD")
         "endDate": "string", // Data de término (formato "YYYY-MM-DD")
         "status": "string", // Status inicial (ex: "Planejada")
         "sprintAtual": true, // Marcada como sprint atual ao criar
         "userId": "string", // (Opcional) ID do usuário
         "createdAt": "Timestamp",
         "updatedAt": "Timestamp"
       }
       ```
   - **Arquivo**: `src/app/contrato/[id]/novo/page.tsx`
   - **Descrição**: Formulário para criação de um novo projeto dentro de um contrato específico. Utiliza um `Stepper` para guiar o usuário pelo processo de criação do projeto e, opcionalmente, da primeira sprint.
   - **Componentes Principais Utilizados**:
     - `Stepper`
     - `ProjectForm`
     - `SprintForm`
     - `StyledFormInput`
     - `PrimaryButton`, `SecondaryButton`

### 6. Detalhes do Projeto (`/contrato/:id/projeto/:projectId`)
   - **Arquivo**: `src/app/contrato/[id]/projeto/[projectId]/page.tsx`
   - **Descrição**: Exibe informações detalhadas sobre um projeto específico, incluindo suas sprints. Permite a edição dos detalhes do projeto através de um modal e a criação/edição de novas sprints.
   - **Componentes Principais Utilizados**:
     - `EditProjectFormModal` (para editar detalhes do projeto)
     - `SprintCard` (para exibir resumos das sprints)
     - `SprintFormModal` (para adicionar/editar sprints)
     - `PrimaryButton`, `SecondaryButton`
     - `Breadcrumb`
   - **Estrutura de Dados (Firebase Firestore)**:
     - **Leitura**: Documento específico da coleção `projetos`, documento do contrato pai (`contratos`) para obter o nome, e documentos da coleção `sprints` filtrados pelo projeto.
     - **Escrita/Atualização**: Atualização do documento do projeto (via `EditProjectFormModal`) e criação/atualização de documentos na coleção `sprints` (via `SprintFormModal`).
     - **Coleção `projetos` (Documento `projetos/{projectId}`)**: (Estrutura conforme definido na página `/contrato/:id`)
     - **Coleção `contratos` (Documento `contratos/{id}`)**: (Estrutura conforme definido na página `/home`)
     - **Coleção `sprints` (Documento `sprints/{sprintId}`)**: (Estrutura conforme definido na página `/contrato/:id/novo`, com a adição de que `sprintAtual` pode ser `true` ou `false` para sprints subsequentes)
   - **Arquivo**: `src/app/contrato/[id]/projeto/[projectId]/page.tsx`
   - **Descrição**: Exibe informações detalhadas sobre um projeto específico, incluindo suas sprints. Permite a edição dos detalhes do projeto através de um modal e a criação/edição de novas sprints.
   - **Componentes Principais Utilizados**:
     - `EditProjectFormModal` (para editar detalhes do projeto)
     - `SprintCard` (para exibir resumos das sprints)
     - `SprintFormModal` (para adicionar/editar sprints)
     - `PrimaryButton`, `SecondaryButton`
     - `Breadcrumb`

### 7. Detalhes da Sprint (`/contrato/:id/projeto/:projectId/sprint/:sprintId`)
   - **Arquivo**: `src/app/contrato/[id]/projeto/[projectId]/sprint/[sprintId]/page.tsx`
   - **Descrição**: Página central para o gerenciamento de uma sprint. Exibe e permite a edição dos dados de Planejamento (Planning), Revisão (Review) e Retrospectiva (Retrospective) da sprint.
   - **Componentes Principais Utilizados**:
     - `SprintFormModal` (para editar detalhes da sprint como datas e meta)
     - `PlanningDataCard`, `PlanningFormModal` (para gerenciar o planejamento da sprint)
     - `ReviewDataCard`, `ReviewFormModal` (para gerenciar a revisão da sprint)
     - `RetrospectiveDataCard`, `RetrospectiveFormModal` (para gerenciar a retrospectiva da sprint)
     - `Breadcrumb`
     - `PrimaryButton`, `SecondaryButton`
   - **Estrutura de Dados (Firebase Firestore)**:
     - **Leitura**: Documento principal da sprint da coleção `sprints`, e documentos das subcoleções `planning`, `review`, e `retrospective`.
     - **Escrita/Atualização**: Atualização do documento principal da sprint e criação/atualização dos documentos nas subcoleções.
     - **Coleção `sprints` (Documento `sprints/{sprintId}`)**: (Estrutura conforme definido anteriormente)
       - **Subcoleção `planning` (Documento `sprints/{sprintId}/planning/main`)**:
         ```json
         {
           "objetivoSprint": "string",
           "capacidadeTime": "number", // ou string
           "itensPlanejados": "array", // de strings ou objetos { descricao, pontos, responsavel }
           "riscos": "string",
           "observacoes": "string",
           "updatedAt": "Timestamp"
         }
         ```
       - **Subcoleção `review` (Documento `sprints/{sprintId}/review/main`)**:
         ```json
         {
           "itensEntregues": "array", // de strings ou objetos { descricao, status }
           "itensNaoEntregues": "array", // de strings ou objetos { descricao, motivo }
           "feedbackStakeholders": "string",
           "metricasDesempenho": "string",
           "decisoesProximaSprint": "string",
           "observacoes": "string",
           "updatedAt": "Timestamp"
         }
         ```
       - **Subcoleção `retrospective` (Documento `sprints/{sprintId}/retrospective/main`)**:
         ```json
         {
           "pontosPositivos": "string",
           "pontosNegativos": "string",
           "melhorias": "string", // Ações de melhoria
           "agradecimentos": "string",
           "observacoes": "string",
           "updatedAt": "Timestamp"
         }
         ```
   - **Arquivo**: `src/app/contrato/[id]/projeto/[projectId]/sprint/[sprintId]/page.tsx`
   - **Descrição**: Página central para o gerenciamento de uma sprint. Exibe e permite a edição dos dados de Planejamento (Planning), Revisão (Review) e Retrospectiva (Retrospective) da sprint.
   - **Componentes Principais Utilizados**:
     - `SprintFormModal` (para editar detalhes da sprint como datas e meta)
     - `PlanningDataCard`, `PlanningFormModal` (para gerenciar o planejamento da sprint)
     - `ReviewDataCard`, `ReviewFormModal` (para gerenciar a revisão da sprint)
     - `RetrospectiveDataCard`, `RetrospectiveFormModal` (para gerenciar a retrospectiva da sprint)
     - `Breadcrumb`
     - `PrimaryButton`, `SecondaryButton`

## Learn More (Saiba Mais)

Para aprender mais sobre Next.js, confira os seguintes recursos:

- [Next.js Documentation](https://nextjs.org/docs) - aprenda sobre os recursos e a API do Next.js.
- [Learn Next.js](https://nextjs.org/learn) - um tutorial interativo de Next.js.

Você pode conferir o [repositório Next.js no GitHub](https://github.com/vercel/next.js) - seu feedback e contribuições são bem-vindos!

## Deploy on Vercel (Implantar na Vercel)

A maneira mais fácil de implantar sua aplicação Next.js é usando a [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) dos criadores do Next.js.

Confira nossa [documentação de implantação do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.
