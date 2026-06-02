# SGS — Sistema de Gestão de Solicitações

Sistema para gerenciamento de solicitações, permitindo cadastro, listagem com filtros, detalhamento e controle de fluxo de status.

---

## Tecnologias Utilizadas

### Backend
- **Java 17**
- **Spring Boot 3.5.14**
- **Spring Data JPA** — abstração da camada de persistência
- **Spring Validation** — validação de dados de entrada
- **PostgreSQL** — banco de dados relacional
- **Flyway** — versionamento e migração do banco de dados
- **Maven** — gerenciamento de dependências

### Frontend
- **Angular 21.2.13**
- **Angular Material** — componentes visuais
- **ngx-mask** — máscara de input para campos monetários
- **TypeScript**
- **SCSS**

---

## Decisões Técnicas

- **Flyway** foi escolhido para versionamento do banco de dados, garantindo rastreabilidade e reprodutibilidade do schema em qualquer ambiente.
- **Native Query com JOIN** foi utilizada na listagem de solicitações para permitir filtros dinâmicos combinados (status, categoria e período) com performance adequada.
- **Histórico de status** foi implementado para rastrear todas as transições de cada solicitação, permitindo auditoria completa do fluxo.
- **Cache via HttpInterceptor** foi implementado no frontend para endpoints de dados estáticos (`/categorias` e `/solicitantes`), reduzindo requisições desnecessárias ao backend durante a sessão.
- **Transições de status** são validadas no backend seguindo o fluxo: `SOLICITADO → LIBERADO → APROVADO → CANCELADO` e `SOLICITADO/LIBERADO → REJEITADO`. Estados finais (`REJEITADO` e `CANCELADO`) bloqueiam qualquer alteração.
- **ChangeDetectionStrategy.OnPush** foi adotado nos componentes Angular para otimizar o ciclo de detecção de mudanças.

---

## Pré-requisitos

- Java 17+
- Maven 3.8+
- PostgreSQL 14+
- Node.js 18+
- Angular CLI 21.2.13+

---

## Como Rodar o Projeto

### Backend

**1.** Clone o repositório:
```bash
git clone https://github.com/joseagjunior/SGS.git
```

**2.** Crie o banco de dados no PostgreSQL:
```sql
CREATE DATABASE sgs;
```

**3.** Configure as credenciais no `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/sgs
spring.datasource.username=postgres
spring.datasource.password=sua_senha
```

**4.** Execute o projeto — o Flyway aplicará as migrations automaticamente:
```bash
mvn spring-boot:run
```

O backend estará disponível em `http://localhost:8080`.

### Frontend

**1.** Clone o repositório:
```bash
git clone https://github.com/joseagjunior/SGS-Client.git
```

**2.** Instale as dependências:
```bash
npm install
```

**3.** Rode o projeto:
```bash
ng serve
```

O frontend estará disponível em `http://localhost:4200`.

---

## Scripts SQL

### DDL

```sql
CREATE TABLE solicitante (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf_cnpj VARCHAR(18) UNIQUE NOT NULL
);

CREATE TABLE categoria (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE solicitacao (
    id BIGSERIAL PRIMARY KEY,
    solicitante_id BIGINT NOT NULL REFERENCES solicitante(id),
    categoria_id BIGINT NOT NULL REFERENCES categoria(id),
    descricao TEXT,
    valor NUMERIC(15,2) NOT NULL,
    data_solicitacao DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SOLICITADO'
);

CREATE TABLE historico_solicitacao (
    id BIGSERIAL PRIMARY KEY,
    solicitacao_id BIGINT NOT NULL REFERENCES solicitacao(id),
    status_anterior VARCHAR(20),
    status_novo VARCHAR(20) NOT NULL,
    data_alteracao TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### DML

```sql
INSERT INTO solicitante (nome, cpf_cnpj) VALUES
    ('João Silva', '123.456.789-00'),
    ('Maria Oliveira', '987.654.321-00'),
    ('Empresa ABC Ltda', '12.345.678/0001-90'),
    ('Carlos Souza', '111.222.333-44'),
    ('Tech Solutions SA', '98.765.432/0001-10');

INSERT INTO categoria (nome) VALUES
    ('Serviços'),
    ('Material'),
    ('Transporte'),
    ('Tecnologia'),
    ('Infraestrutura');
```

---

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/solicitacoes` | Cadastrar solicitação |
| GET | `/solicitacoes` | Listar com filtros |
| GET | `/solicitacoes/{id}` | Detalhar solicitação |
| PATCH | `/solicitacoes/{id}/status` | Atualizar status |
| GET | `/solicitacoes/{id}/historico` | Histórico de status |
| GET | `/categorias` | Listar categorias |
| GET | `/solicitantes` | Listar solicitantes |

### Exemplos de requisição

**Cadastrar solicitação:**
```json
POST /solicitacoes
{
    "solicitanteId": 1,
    "categoriaId": 2,
    "descricao": "Compra de materiais de escritório",
    "valor": 1500.00
}
```

**Atualizar status:**
```json
PATCH /solicitacoes/1/status
{
    "status": "LIBERADO"
}
```

**Listar com filtros:**
```
GET /solicitacoes?status=SOLICITADO&categoriaId=1&dataInicio=2026-01-01&dataFim=2026-12-31
```

---

## Fluxo de Status

```
SOLICITADO ──→ LIBERADO ──→ APROVADO ──→ CANCELADO (final)
     │              │
     └──────────────┴──→ REJEITADO (final)
```

Estados finais `REJEITADO` e `CANCELADO` não permitem mais alterações.