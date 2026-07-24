 🏦 LigraBank

> *"Where your investment yields a little more"* / *"Onde seu investimento rende um pouco mais"*

O **LigraBank** é uma plataforma web educacional de educação financeira desenvolvida para ambientes escolares (focada em turmas do SESI/SP). O sistema permite que professores gerenciem uma economia escolar baseada na moeda virtual **Little Moneys (LM$)**, simulem conceitos econômicos reais (como inflação e deflação) e recompensem o engajamento e o bom desempenho dos alunos.

---

## 🚀 Funcionalidades Principais

### 👩‍🏫 Área do Professor (Teacher Dashboard)
* **Controle de Economia (Inflação/Deflação):** Ajuste de um índice econômico (ex: 0.5x a 2.0x) que atualiza automaticamente e em tempo real os preços da loja para os alunos.
* **Gestão de Alunos:**
  * Cadastro individual e exclusão permanente de alunos do banco de dados.
  * Creditar e debitar moedas (*Little Moneys*) com registro de motivo no extrato.
  * Redefinição rápida de senhas dos alunos para a senha padrão (`123`).
  * **Importação Inteligente de CSV:** Leitura de planilhas com detecção automática de separadores (vírgula ou ponto e vírgula), colunas (`nome`, `email`, `grupo`/`turma`) e validação de e-mails corporativos `@portalsesisp.org.br`.
* **Filtro por Turma:** Organização e filtragem dinâmica dos alunos por turma (ex: `9A`, `9B`).
* **Gerenciamento da Loja:** Criação de itens/recompensas com preços base.
* **Central de Solicitações:** Aprovação ou rejeição de compras feitas pelos alunos (com reembolso automático em caso de rejeição).

### 👨‍🎓 Área do Aluno (Student Dashboard)
* **Visualização de Saldo:** Acompanhamento do saldo atual em *Little Moneys* (LM$).
* **Lojinha de Recompensas:** Compra de itens disponibilizados pelo professor, com cálculo automático de preço inflacionado/deflacionado.
* **Histórico de Transações:** Extrato detalhado com entradas (créditos) e saídas (débitos).
* **Meus Itens:** Painel de acompanhamento de solicitações pendentes e itens adquiridos/confirmados pelo professor.
* **Alteração de Senha:** Opção para o próprio aluno personalizar a sua senha de acesso.

### 🌐 Geral & Interface
* **Suporte Bilingue:** Alternância simples entre **Inglês** (padrão) e **Português** via botão dedicado.
* **Design 100% Responsivo:** Interface otimizada tanto para computadores quanto para smartphones (iOS/Android), garantindo leitura perfeita de tabelas em ecrãs pequenos.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:**
  * [HTML5](https://developer.mozilla.org/pt-BR/docs/Web/HTML) (Estrutura em arquivo único)
  * [Tailwind CSS](https://tailwindcss.com/) (Estilização responsiva e moderna)
  * [Lucide Icons](https://lucide.dev/) (Ícones vetoriais)
  * Vanilla JavaScript (ES6+ assíncrono)
* **Backend & Banco de Dados:**
  * [Supabase](https://supabase.com/) (PostgreSQL + API REST em tempo real)
  * `@supabase/supabase-js` (Cliente JS oficial)

---

## 📊 Estrutura do Banco de Dados (Supabase)

Para o funcionamento do aplicativo, as seguintes tabelas devem ser criadas no **Supabase**:

### 1. Tabela `users`
CREATE TABLE loja (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco_base DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE loja (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco_base DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE transacoes (
    id VARCHAR(50) PRIMARY KEY,
    aluno_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    tipo VARCHAR(10) NOT NULL, -- 'credito' ou 'debito'
    valor DECIMAL(10, 2) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE transacoes (
    id VARCHAR(50) PRIMARY KEY,
    aluno_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    tipo VARCHAR(10) NOT NULL, -- 'credito' ou 'debito'
    valor DECIMAL(10, 2) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE solicitacoes_item (
    id VARCHAR(50) PRIMARY KEY,
    aluno_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    item_id VARCHAR(50) REFERENCES loja(id) ON DELETE CASCADE,
    preco_pago DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente', -- 'pendente', 'aprovado', 'rejeitado'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
⚙️ Configuração e Instalação
Obter o Código:

Faça o download ou clone o repositório contendo o arquivo index.html.

Configurar o Supabase:

Crie um projeto gratuito no Supabase.

Acesse o SQL Editor e execute os scripts de criação de tabelas descritos acima.

Vá em Table Editor > selecione as tabelas e desative o RLS (Row Level Security) para ambiente de dev/testes (Disable RLS).

Cadastrar o Professor Inicial:

No SQL Editor do Supabase, insira a conta do professor responsável:
INSERT INTO users (id, role, nome, email, password, saldo)
VALUES ('u_prof1', 'teacher', 'Rafael Angelo', 'rafael.angelo2@portalsesisp.org.br', '123', 0);

Executar a Aplicação:

Abra o arquivo index.html diretamente no seu navegador ou utilize a extensão Live Server do VS Code.

Faça login com as credenciais cadastradas!

📑 Modelo de Planilha para Importação (CSV)
O professor pode cadastrar alunos em massa subindo um arquivo .csv. A planilha deve conter um cabeçalho com as colunas nome, email e grupo (ou turma).

Exemplo (alunos.csv):

id;nome;email;grupo
1;AGATHA SIQUEIRA RIBEIRO;agatha.siqueira@portalsesisp.org.br;9A
2;PEDRO MIGUEL AMORIM;pedro.amorim@portalsesisp.org.br;9A
3;LUCAS SILVA;lucas.silva@portalsesisp.org.br;9B

Observação: Apenas e-mails contendo o domínio @portalsesisp.org.br serão importados.

📄 Licença
Este projeto é voltado para uso educacional e pedagógico.
"""

with open("README.md", "w", encoding="utf-8") as f:
f.write(readme_content)

print("README.md criado com sucesso!")

