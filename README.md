# Rodar o Mockup no Mac (passo a passo para leigos)

Este guia é para **abrir o app no navegador** (tipo um site) no seu MacBook.

Você vai:
1) instalar (ou conferir) o Node  
2) criar um projetinho React  
3) colocar o arquivo do mockup dentro dele  
4) rodar e abrir o link no Chrome/Safari

---

## ✅ Antes de começar (2 checagens rápidas)

### 1) Você tem o arquivo do mockup?
Você precisa ter o arquivo **`EHR-mockup.jsx`** no seu computador (Downloads/Área de Trabalho/etc).

### 2) Você tem Node.js instalado?
Abra o **Terminal** (Finder → Aplicativos → Utilitários → Terminal) e digite:

```bash
node -v
npm -v
```

- Se aparecerem números (ex.: `v20.x.x`), está ok ✅  
- Se aparecer “command not found”, instale **Node.js (LTS)** e volte aqui.

---

## Parte A — Criar o projeto (só na primeira vez)

### Passo 1) Ir para a Área de Trabalho
No Terminal, copie e cole:

```bash
cd ~/Desktop
```

### Passo 2) Criar o projeto React (Vite)
Copie e cole:

```bash
npm create vite@latest ehr-mockup -- --template react
```

Quando ele perguntar coisas, escolha assim:
- **Use Vite 8 beta?** → **No**
- **Install with npm and start now?** → **Yes**

### Passo 3) Entrar na pasta do projeto
Copie e cole:

```bash
cd ehr-mockup
```

### Passo 4) Instalar dependências do projeto
Copie e cole:

```bash
npm install
```

### Passo 5) Instalar a biblioteca de gráficos (recharts)
Copie e cole:

```bash
npm install recharts
```

> Importante: **este comando precisa ser rodado dentro da pasta `ehr-mockup`** (passo 3).

---

## Parte B — Colocar o mockup dentro do projeto

### Passo 6) Copiar o arquivo `EHR-mockup.jsx` para a pasta `src`
Abra o Finder e faça assim:

1. Abra a pasta: **Área de Trabalho → `ehr-mockup` → `src`**
2. Arraste o arquivo **`EHR-mockup.jsx`** para dentro dessa pasta `src`

No final, o caminho deve ficar:
- `~/Desktop/ehr-mockup/src/EHR-mockup.jsx`

### Passo 7) Fazer o projeto “mostrar” o mockup
Abra o arquivo:
- `~/Desktop/ehr-mockup/src/App.jsx`

Apague tudo que tiver lá dentro e cole **exatamente** isto:

```jsx
import EHRApp from "./EHR-mockup.jsx";

export default function App() {
  return <EHRApp />;
}
```

Salve o arquivo.

---

## Parte C — Rodar e ver funcionando

### Passo 8) Iniciar o app
Volte para o Terminal e rode:

```bash
npm run dev
```

Você vai ver algo parecido com:

- `Local: http://localhost:5173/`

**Abra esse link no navegador** (Chrome ou Safari).

> Se ele mostrar `5174` ou outro número, tudo bem — use o link que aparecer.

---

## Como fechar o app
No Terminal (onde está rodando), aperte:

- `CTRL + C`

---

## Como abrir de novo (em outro dia)
Abra o Terminal e rode:

```bash
cd ~/Desktop/ehr-mockup
npm run dev
```

Abra o link `http://localhost:5173/` (ou o que aparecer).

---

## Problemas comuns (e como resolver)

### 1) “zsh: permission denied: /Users/.../ehr-mockup”
Você tentou **executar a pasta** como se fosse um programa.  
O certo é **entrar na pasta**:

```bash
cd ~/Desktop/ehr-mockup
```

### 2) “Port 5173 is in use, trying another one...”
Já existe outro app rodando nessa porta.  
Use o link novo que aparecer (ex.: `http://localhost:5174/`)  
ou feche o outro terminal com `CTRL + C`.

### 3) “Failed to resolve import 'recharts'”
O `recharts` não está instalado **dentro do projeto**. Faça:

```bash
cd ~/Desktop/ehr-mockup
npm install recharts
npm run dev
```

Se ainda falhar, faça “reset”:

```bash
cd ~/Desktop/ehr-mockup
rm -rf node_modules package-lock.json
npm install
npm install recharts
npm run dev
```

### 4) Tela branca / erro de componente duplicado (EHRApp)
Isso acontece se o `App.jsx` ficou diferente.  
Garanta que `src/App.jsx` está **igual** ao do Passo 7.

---

## Checklist final (pra saber se está tudo certo)

- Existe a pasta: `~/Desktop/ehr-mockup`
- Existe o arquivo: `~/Desktop/ehr-mockup/src/EHR-mockup.jsx`
- O arquivo `~/Desktop/ehr-mockup/src/App.jsx` tem o código do Passo 7
- No Terminal, você está dentro da pasta do projeto antes de rodar:
  ```bash
  cd ~/Desktop/ehr-mockup
  ```

Pronto ✅
