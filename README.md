# Painel Corretor

Ferramenta de cotação de planos de saúde para corretores. Permite criar, gerenciar e compartilhar cotações comparativas de operadoras de saúde para clientes PF, PME e Adesão.

## Funcionalidades

- **Wizard de cotação em 5 etapas** — Identificação → Perfil → Vidas → Preferências → Resultados
- **Comparativo de planos** — Grid comparativo com cards por operadora, preço mensal e detalhamento por vida
- **Detalhamento de plano** — Coparticipação, rede credenciada, faixas etárias e breakdown de preços
- **Compartilhamento** — Envio por WhatsApp, e-mail ou impressão de proposta
- **Pesquisa ANS** — Consulta de operadoras registradas na ANS
- **Persistência local** — Cotações salvas no `localStorage` do navegador, sem necessidade de backend

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI | React 19 + Vanilla CSS + Tailwind CSS v4 |
| Formulários | React Hook Form |
| Ícones | React Icons |
| Tipografia | Inter (corpo) · Plus Jakarta Sans (títulos) |
| Linguagem | TypeScript |
| Persistência | `localStorage` via `LocalQuotationRepository` |

## Estrutura do Projeto

```
src/
├── app/                        # Rotas (Next.js App Router)
│   ├── page.tsx                # Dashboard principal
│   ├── cotacoes/
│   │   ├── page.tsx            # Listagem de cotações
│   │   ├── criar/page.tsx      # Nova cotação (wizard)
│   │   └── [id]/page.tsx       # Edição / resultados de cotação
│   ├── busca-ans/              # Pesquisa de operadoras ANS
│   └── configuracoes/          # Configurações do corretor
│
├── domains/                    # Lógica de negócio por domínio
│   ├── quotation/
│   │   ├── types.ts            # Modelos: Quotation, Life, OperatorResult…
│   │   ├── calculator.ts       # Engine de cálculo de preços por faixa etária
│   │   ├── service.ts          # Regras de negócio (criar, finalizar cotação)
│   │   ├── repository.ts       # Interface + impl. localStorage
│   │   ├── hooks/              # useQuotation (estado do wizard)
│   │   └── components/         # QuotationList, QuotationResults, Steps…
│   ├── operator/
│   │   ├── types.ts            # Modelo Operator
│   │   └── service.ts          # Catálogo de operadoras disponíveis
│   └── shared/
│       └── components/         # DashboardLayout, navegação lateral
│
└── components/
    └── ui/                     # Design system: Button, Input, Select, Skeleton…
```

## Modelos de dados principais

```typescript
// Modalidades de cotação
type QuotationMode = "PF" | "PME" | "ADESAO";

// Ciclo de vida de uma cotação
type QuotationStatus = "draft" | "in_progress" | "completed" | "archived";

// Uma vida cadastrada na cotação
interface Life {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  age: number;
  price: number;
}

// Resultado por operadora
interface OperatorResult {
  operatorId: string;
  operatorName: string;
  totalPrice: number;
  livesPrices: { lifeId: string; price: number }[];
}
```

## Como rodar

**Pré-requisitos:** Node.js 18+

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

```bash
# Build de produção
npm run build
npm start

# Lint
npm run lint
```

## Persistência de dados

As cotações são armazenadas no `localStorage` do navegador sob a chave `painel_corretor_quotations`. Não há banco de dados ou API externa — ideal para uso local ou como ponto de partida para integração com um backend.

> Para migrar para um backend, basta implementar a interface `QuotationRepository` com chamadas HTTP e substituir a instância exportada em `repository.ts`.
