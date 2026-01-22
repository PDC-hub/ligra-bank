# 🍩 Ligra Bank – Sistema de Economia Virtual para Escola

> *"Ah, liberdade econômica! Como eu amo te extorquir... digo, te ensinar!"* – **Sr. Burns**

O **Ligra Bank** é um sistema web educacional que simula uma economia virtual dentro da sala de aula. Com ele, professores podem gerenciar créditos, débitos, turmas e solicitações de alunos — tudo com uma interface temática de *Os Simpsons* e foco total na gestão pedagógica!

Feito com ❤️ por **Rafael (Rafão)**, professor de Ciências da Natureza, Biologia, Programação e Robótica.

---

## 🌟 Funcionalidades

### 👩‍🏫 Para Professores (Miss. Teacher)
- ✅ **Login seguro** com credenciais Microsoft institucionais  
- 👥 **Gerenciamento de turmas**: criar, visualizar e excluir  
- 👤 **Cadastro e exclusão de alunos** com e-mail e apelido (gerados por professores)  
- 💰 **Adição direta de créditos** com descrição detalhada  
- 🛒 **Débito direto de produtos** do cardápio  
- 📋 **Aprovação ou rejeição de solicitações** (compras e créditos)  
- 🔑 **Redefinição de senha de alunos**  
- 🔒 **Configurações de conta** (e-mail e senha do professor)

### 👨‍🎓 Para Alunos
- 💳 **Visualização do saldo** em "Ligras" (L$)  
- 🛍️ **Solicitação de compras** do cardápio temático  
- ➕ **Pedido de créditos** para atividades ou desempenho  
- 📜 **Histórico de transações** e solicitações pendentes

### 🎨 Interface
- Tema visual inspirado em *Springfield*  
- Ícones personalizados do **Sr. Burns**  
- Fonte *Comic Sans* para clima lúdico  
- Feedback visual imediato (ex: "Dados salvos!")  
- Navegação otimizada com controles de rolagem

---

## 🚀 Como Executar

1. Clone o repositório
2. Instale as dependências com `npm install`
3. Execute com `npm start`

---

## ⚙️ Configurações de Autenticação

- **Professores**: Devem usar e-mails institucionais Microsoft (`@professor.educacao.sp.gov.br` ou `@portalsesisp.org.br`)
- **Alunos**: Podem ter e-mails personalizados gerados pelos professores
- Sistema permite alternância entre perfis de aluno e professor
- Botões de escolha de perfil aluno/professor disponíveis na tela de login

---

## 📝 Notas sobre o Desenvolvimento

O sistema foi desenvolvido em React com Tailwind CSS, utilizando ícones do Lucide React. A interface temática de Os Simpsons com o Sr. Burns como personagem central cria um ambiente lúdico para o aprendizado financeiro.

A persistência de dados é feita através de exportação/importação de arquivos JSON, permitindo armazenamento local ou em nuvem (como OneDrive).