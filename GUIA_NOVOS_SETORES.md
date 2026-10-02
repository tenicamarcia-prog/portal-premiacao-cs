# 🚀 Guia de Replicação para Outros Setores (Template Portal Ateky)

Este projeto foi estruturado para servir de **template base** para qualquer outro setor da Ateky (Comercial, Suporte, NOC, Financeiro, Infraestrutura, etc.).

---

## 📁 Estrutura de Arquivos Principais

* **`index.html`**: Contém todo o portal unificado (autenticação, tela de perfis estilo streaming, efeito cinema awards, transição central e dashboard completo).
* **`awards.mp4`**: Vídeo exibido na vinheta de abertura estilo cinema ao selecionar o perfil.
* **`assets/images/`**: Imagens, avatares, logomarcas Ateky e fundos.
* **`vercel.json`**: Configuração pronta para publicação online instantânea na Vercel.

---

## 🔄 Como Criar um Portal para um Novo Setor

### Opção 1: Criar uma Nova Branch neste Repositório
Para manter tudo organizado no mesmo repositório:
```bash
# 1. Crie e mude para a nova branch do setor desejado
git checkout -b setor-comercial
# ou: git checkout -b setor-noc / setor-suporte / setor-financeiro

# 2. Faça as personalizações no index.html e assets
# 3. Envie para o GitHub
git push -u origin setor-comercial
```

### Opção 2: Criar um Novo Repositório no GitHub
Se preferir repositórios separados para cada setor:
```bash
# 1. Duplique a pasta para o novo setor
cp -r pr-mios-cs-atualizado portal-ateky-comercial
cd portal-ateky-comercial

# 2. Conecte ao novo repositório
git remote set-url origin https://github.com/tenicamarcia-prog/portal-ateky-comercial.git
git push -u origin main
```

---

## 🎨 O que Personalizar no `index.html` para o Novo Setor

1. **Perfis dos Colaboradores / Gestores:**
   * Procure por `const PROFILES =` no script do `index.html`.
   * Altere os nomes, avatares, e cargos de acordo com a equipe do novo setor.

2. **Métricas e Indicadores do Dashboard:**
   * Ajuste as metas, tabelas de pontuação e critérios de premiação de acordo com os KPIs do setor (ex: Vendas para Comercial, SLA/TMA para Suporte, Uptime para NOC).

3. **Vídeo de Introdução (`awards.mp4`):**
   * Basta substituir o arquivo `awards.mp4` na raiz do projeto por outro vídeo ou vinheta específica do setor, mantendo o mesmo nome.

---

## 🌐 Publicação no Vercel para o Novo Setor

Para subir o novo setor como um site independente:
```bash
npx vercel --prod
```
Basta definir um novo nome de projeto no assistente (ex: `ateky-portal-comercial`) e o site estará online em poucos segundos.
