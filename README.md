# 💰 Poupê

App de controle de gastos simples, bonito e direto ao ponto para organizar seu dinheiro.

---

## 🚀 O que o app faz

-   **🔐 Login e Perfil**: Criação de conta com e-mail/senha e foto direto do celular.
-   **📊 Dashboard**: Mostra quanto você ganha (Salário) e quanto gasta, calculando o que sobrou.
-   **📈 Gráficos**: Gráficos de barras para ver qual categoria está consumindo mais.
-   **📅 Histórico**: Dá para navegar entre os meses e ver para onde foi cada centavo.
-   **📱 Design Bonito**: Visual escuro com glassmorphism, fluído no celular.

---

## 🛠️ Tecnologias

-   **Frontend**: Next.js (React 19)
-   **Estilos**: Tailwind CSS + Framer Motion
-   **Banco de Dados & Auth**: Supabase (PostgreSQL)
-   **Estado**: Zustand

---

## ⚙️ Como rodar o projeto

### 1. Clonar repositório
```bash
git clone https://github.com/wesleycaiadev/Poup-.git
cd Poup-
```

### 2. Instalar
```bash
npm install
```

### 3. Configurar `.env.local`
Crie um `.env.local` na raiz com suas chaves do Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

### 4. Iniciar
```bash
npm run dev
```
Acesse `http://localhost:3000`.

---

## 📄 Licença

MIT. Use e modifique como quiser!
