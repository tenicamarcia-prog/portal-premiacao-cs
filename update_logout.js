const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

console.log('Original length:', html.length);

// 1. Garantir que o z-index da tela de login netflixProfileScreen seja z-[99999]
html = html.replace('id="netflixProfileScreen" class="fixed inset-0 z-50 flex', 'id="netflixProfileScreen" class="fixed inset-0 z-[99999] flex');

// 2. Atualizar o botão no dropdown de perfil para ter o texto claro "Sair (Tela de Login)"
html = html.replace(
  /<button onclick="handleLockSession\(\)" class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-\[11px\] font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition cursor-pointer">[\s\S]*?<\/button>/,
  `<button onclick="handleLockSession()" class="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition cursor-pointer shadow-xs active:scale-95" title="Sair da conta e ir para a tela de login">
                <i data-lucide="log-out" class="w-4 h-4 text-rose-500"></i>
                <span>Sair (Ir para Tela de Login)</span>
              </button>`
);

// 3. Adicionar o botão "Sair" diretamente no cabeçalho visível do portal ao lado de Trocar Perfil
const headerButtons = `
          <!-- BOTÕES DO CABEÇALHO: TROCAR PERFIL & SAIR -->
          <div class="flex items-center gap-1.5">
            <button 
              type="button" 
              onclick="showNetflixProfileScreen()" 
              class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer" 
              title="Voltar para a tela inicial de perfis"
            >
              <i data-lucide="users" class="w-3.5 h-3.5 text-brand-600"></i>
              <span class="hidden md:inline">Trocar Perfil</span>
            </button>
            <button 
              type="button" 
              onclick="handleLockSession()" 
              class="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95" 
              title="Sair da conta e ir para a tela de login"
            >
              <i data-lucide="log-out" class="w-3.5 h-3.5 text-rose-600"></i>
              <span>Sair</span>
            </button>
          </div>
`;

// Substituir o botão anterior pelo grupo de botões com "Sair" explícito
if (html.includes('<!-- BOTÃO TROCAR PERFIL (NETFLIX) -->')) {
  html = html.replace(
    /<!-- BOTÃO TROCAR PERFIL \(NETFLIX\) -->[\s\S]*?<\/button>/,
    headerButtons
  );
} else {
  html = html.replace('<div class="relative">', headerButtons + '\n          <div class="relative">');
}

// 4. Atualizar showNetflixProfileScreen para fechar todos os dialogs e forçar display flex
const newShowNetflixFn = `function showNetflixProfileScreen(animate = true) {
      // Fecha qualquer modal ou dialog aberto
      document.querySelectorAll('dialog').forEach(d => {
        try { d.close(); } catch(e) {}
      });

      const menu = document.getElementById('profileDropdownMenu');
      if (menu) menu.classList.add('hidden');

      // Salva dados ao voltar para a tela inicial
      try {
        saveToStorage();
        saveAdminsStorage();
        savePrizesStorage();
      } catch(e) {}

      updateNetflixAvatars();
      backToNetflixProfiles();

      const screen = document.getElementById('netflixProfileScreen');
      if (!screen) return;
      screen.style.display = 'flex';
      screen.classList.remove('hidden');
      screen.classList.remove('opacity-0', 'pointer-events-none');
      lucide.createIcons();
    }`;

html = html.replace(/function showNetflixProfileScreen\(animate = true\) \{[\s\S]*?lucide\.createIcons\(\);\s*\}/, newShowNetflixFn);

// 5. Atualizar hideNetflixProfileScreen para setar display: none após animação
const newHideNetflixFn = `function hideNetflixProfileScreen() {
      const screen = document.getElementById('netflixProfileScreen');
      if (!screen) return;
      screen.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => {
        screen.classList.add('hidden');
        screen.style.display = 'none';
      }, 400);
    }`;

html = html.replace(/function hideNetflixProfileScreen\(\) \{[\s\S]*?500\);\s*\}/, newHideNetflixFn);

// 6. Atualizar handleLockSession para fechar dialogs e ir direto para showNetflixProfileScreen()
const newHandleLockFn = `function handleLockSession() {
      // Fecha todos os modais abertos
      document.querySelectorAll('dialog').forEach(d => {
        try { d.close(); } catch(e) {}
      });

      const menu = document.getElementById('profileDropdownMenu');
      if (menu) menu.classList.add('hidden');

      // Salva rigorosamente todos os dados antes de deslogar
      saveToStorage();
      saveAdminsStorage();
      savePrizesStorage();

      sessionStorage.removeItem('ateky_authenticated_user');
      showNetflixProfileScreen(true);
      showToastNotification("Sessão Encerrada", "Você saiu da conta e retornou à tela de login.", "Ateky Auth");
    }`;

html = html.replace(/function handleLockSession\(\) \{[\s\S]*?showToastNotification\("Sessão Bloqueada"[\s\S]*?\}/, newHandleLockFn);

// 7. Atualizar a inicialização do app para garantir que se não estiver autenticado, mostre a tela de login
const startupCode = `
    updateNetflixAvatars();
    const hasActiveSession = sessionStorage.getItem('ateky_authenticated_user');
    if (!hasActiveSession) {
      showNetflixProfileScreen(false);
    } else {
      hideNetflixProfileScreen();
    }
`;

if (!html.includes('const hasActiveSession = sessionStorage.getItem')) {
  html = html.replace('lucide.createIcons();\n  \n\n    // ====', 'lucide.createIcons();\n' + startupCode + '\n    // ====');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Updated index.html successfully!');
