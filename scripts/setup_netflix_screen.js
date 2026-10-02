const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const oscarB64 = fs.readFileSync('/home/ateky/.gemini/antigravity/scratch/oscar_bg_b64.txt', 'utf8').trim();

console.log('HTML length before:', html.length);

// 1. Injetar estilos no <style>
const netflixStyles = `
    /* ============================================================== */
    /* TELA INICIAL: NETFLIX & OSCARS (SELEÇÃO DE PERFIL COM SENHA)  */
    /* ============================================================== */
    #netflixProfileScreen {
      background-color: #030305;
      background-image: linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(5,5,10,0.85) 50%, rgba(0,0,0,0.96) 100%), url('oscar_bg.jpg');
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      background-attachment: fixed;
    }
    .profile-card-glow {
      box-shadow: 0 0 0 2px transparent;
      transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .profile-card-glow:hover {
      box-shadow: 0 0 0 3px #fbbf24, 0 10px 30px -5px rgba(251, 191, 36, 0.45);
      transform: scale(1.05);
    }
    @keyframes netflixFadeIn {
      from { opacity: 0; transform: scale(0.97); }
      to { opacity: 1; transform: scale(1); }
    }
    .netflix-enter {
      animation: netflixFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
`;

if (!html.includes('#netflixProfileScreen')) {
  html = html.replace('</style>', netflixStyles + '\n  </style>');
}

// 2. Extrair logo Ateky existente
const logoMatch = html.match(/src="(data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeIAAAGCCAYAAAA8HcD5[^"]+)"/);
const logoSrc = logoMatch ? logoMatch[1] : '';

// 3. Montar a Tela Inicial Netflix & Oscars
const netflixHtml = `
  <!-- ============================================================== -->
  <!-- TELA INICIAL: NETFLIX & OSCARS (SELEÇÃO DE PERFIL COM SENHA)  -->
  <!-- ============================================================== -->
  <div id="netflixProfileScreen" class="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-black text-white select-none transition-all duration-500">
    
    <!-- TOP HEADER / BRANDING -->
    <header class="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-10">
      <!-- Logo + Oscars Branding -->
      <div class="flex items-center gap-3.5">
        <div class="h-11 w-14 rounded-xl overflow-hidden flex items-center justify-center bg-slate-950 p-1 border border-amber-500/30 shadow-lg shadow-amber-500/10 shrink-0">
          <img src="${logoSrc}" alt="Ateky Internet" class="h-full w-auto object-contain">
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs sm:text-sm font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 uppercase drop-shadow-sm">
              PREMIAÇÕES TRIMESTRAIS
            </span>
            <span class="hidden sm:inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Ateky Awards
            </span>
          </div>
          <div class="text-[11px] text-slate-400 font-bold tracking-wider uppercase">
            Suporte Técnico • Portal de Desempenho
          </div>
        </div>
      </div>

      <!-- Quick status indicator -->
      <div class="flex items-center gap-2 text-xs text-amber-200/90 bg-amber-950/50 border border-amber-500/30 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-sm">
        <i data-lucide="award" class="w-4 h-4 text-amber-400"></i>
        <span class="font-bold">Ciclo Oficial 2026</span>
      </div>
    </header>

    <!-- CENTER PROFILE SELECTION CONTAINER -->
    <main class="flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-5xl mx-auto w-full z-10">
      
      <!-- VIEW 1: PROFILE GRID ("Quem está acessando?") -->
      <div id="netflixProfilesView" class="w-full flex flex-col items-center netflix-enter">
        <!-- Title -->
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight text-center drop-shadow-lg mb-2">
          Quem está acessando?
        </h1>
        <p class="text-slate-300 text-xs sm:text-sm md:text-base text-center max-w-lg mb-8 md:mb-12 font-medium">
          Selecione seu perfil para acessar o painel de premiações, ranking e abastecimento de métricas do Suporte Técnico.
        </p>

        <!-- 4 Profiles Row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 md:gap-8 max-w-4xl w-full justify-items-center">
          
          <!-- Fernando Mateus -->
          <button type="button" onclick="selectNetflixProfile('coord_fernando')" class="group flex flex-col items-center gap-3 cursor-pointer transition transform focus:outline-none">
            <div class="w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-2xl md:rounded-3xl overflow-hidden border-2 border-slate-700/60 group-hover:border-amber-400 group-hover:scale-105 group-hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] transition-all duration-300 relative bg-slate-900 shadow-2xl">
              <img id="netflixAvatar_coord_fernando" src="" alt="Fernando Mateus" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                <span class="text-[10px] text-amber-300 font-black tracking-wider uppercase">Entrar &rarr;</span>
              </div>
            </div>
            <div class="text-center">
              <span class="text-slate-300 group-hover:text-white font-bold text-sm sm:text-base md:text-lg transition-colors block">
                Fernando Mateus
              </span>
              <span class="text-[10px] sm:text-[11px] font-semibold text-brand-300 px-2.5 py-0.5 rounded-full bg-brand-500/20 border border-brand-500/30 mt-1 inline-block">
                Coordenador Geral
              </span>
            </div>
          </button>

          <!-- Michel Santos -->
          <button type="button" onclick="selectNetflixProfile('lider_n2n3')" class="group flex flex-col items-center gap-3 cursor-pointer transition transform focus:outline-none">
            <div class="w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-2xl md:rounded-3xl overflow-hidden border-2 border-slate-700/60 group-hover:border-purple-400 group-hover:scale-105 group-hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] transition-all duration-300 relative bg-slate-900 shadow-2xl">
              <img id="netflixAvatar_lider_n2n3" src="" alt="Michel Santos" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                <span class="text-[10px] text-purple-300 font-black tracking-wider uppercase">Entrar &rarr;</span>
              </div>
            </div>
            <div class="text-center">
              <span class="text-slate-300 group-hover:text-white font-bold text-sm sm:text-base md:text-lg transition-colors block">
                Michel Santos
              </span>
              <span class="text-[10px] sm:text-[11px] font-semibold text-purple-300 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 mt-1 inline-block">
                Líder N2 & N3
              </span>
            </div>
          </button>

          <!-- Antônio Batista -->
          <button type="button" onclick="selectNetflixProfile('lider_antonio')" class="group flex flex-col items-center gap-3 cursor-pointer transition transform focus:outline-none">
            <div class="w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-2xl md:rounded-3xl overflow-hidden border-2 border-slate-700/60 group-hover:border-blue-400 group-hover:scale-105 group-hover:shadow-[0_0_35px_rgba(59,130,246,0.5)] transition-all duration-300 relative bg-slate-900 shadow-2xl">
              <img id="netflixAvatar_lider_antonio" src="" alt="Antônio Batista" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                <span class="text-[10px] text-blue-300 font-black tracking-wider uppercase">Entrar &rarr;</span>
              </div>
            </div>
            <div class="text-center">
              <span class="text-slate-300 group-hover:text-white font-bold text-sm sm:text-base md:text-lg transition-colors block">
                Antônio Batista
              </span>
              <span class="text-[10px] sm:text-[11px] font-semibold text-blue-300 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 mt-1 inline-block">
                Líder N1
              </span>
            </div>
          </button>

          <!-- Visualizador -->
          <button type="button" onclick="selectNetflixProfile('visualizador')" class="group flex flex-col items-center gap-3 cursor-pointer transition transform focus:outline-none">
            <div class="w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-2xl md:rounded-3xl overflow-hidden border-2 border-slate-700/60 group-hover:border-amber-400 group-hover:scale-105 group-hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] transition-all duration-300 relative bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-2xl">
              <div class="flex flex-col items-center gap-2">
                <i data-lucide="eye" class="w-12 h-12 md:w-16 md:h-16 text-white drop-shadow-md"></i>
                <span class="text-[10px] md:text-[11px] font-black uppercase tracking-wider text-amber-950 bg-white/90 px-2.5 py-0.5 rounded-full shadow-xs">
                  Modo Leitura
                </span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                <span class="text-[10px] text-amber-300 font-black tracking-wider uppercase">Consultar &rarr;</span>
              </div>
            </div>
            <div class="text-center">
              <span class="text-slate-300 group-hover:text-white font-bold text-sm sm:text-base md:text-lg transition-colors block">
                Visualizador
              </span>
              <span class="text-[10px] sm:text-[11px] font-semibold text-amber-300 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 mt-1 inline-block">
                Somente Leitura
              </span>
            </div>
          </button>

        </div>

        <!-- Manage Profiles Button -->
        <div class="mt-10 md:mt-14 flex items-center gap-3">
          <button type="button" onclick="openNetflixManageModal()" class="px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white tracking-wider text-xs font-bold uppercase transition hover:bg-white/5 cursor-pointer flex items-center gap-2">
            <i data-lucide="shield-check" class="w-4 h-4 text-slate-400"></i>
            <span>Gerenciar Perfis & Senhas</span>
          </button>
        </div>
      </div>

      <!-- VIEW 2: PASSWORD AUTHENTICATION CARD ("Digite sua senha") -->
      <div id="netflixAuthView" class="hidden w-full max-w-md bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center netflix-enter">
        <!-- Selected Avatar & Name -->
        <div class="relative -mt-16 mb-3">
          <div class="w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl shadow-amber-500/20 bg-slate-950">
            <img id="netflixAuthSelectedAvatar" src="" alt="Avatar" class="w-full h-full object-cover">
          </div>
          <span id="netflixAuthBadge" class="absolute -bottom-2 -right-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-md">
            Admin
          </span>
        </div>

        <h2 id="netflixAuthSelectedName" class="text-xl sm:text-2xl font-black text-white text-center">
          Fernando Mateus
        </h2>
        <p id="netflixAuthSelectedRole" class="text-xs text-slate-400 text-center mb-5">
          Coordenador Geral de Operações
        </p>

        <!-- Form -->
        <form onsubmit="handleNetflixAuthSubmit(event)" class="w-full space-y-4">
          <input type="hidden" id="netflixAuthTargetId" value="">
          
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Senha de Acesso
              </label>
              <span id="netflixAuthScopeHint" class="text-[10px] text-amber-400 font-semibold"></span>
            </div>
            <div class="relative">
              <input 
                type="password" 
                id="netflixAuthPasswordInput" 
                class="w-full bg-slate-950/90 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-white rounded-xl py-3 pl-4 pr-11 text-sm outline-none transition placeholder-slate-500 font-mono"
                placeholder="Digite a senha..."
                required
                autocomplete="current-password"
              >
              <button 
                type="button" 
                onclick="togglePasswordVisibility('netflixAuthPasswordInput', this)" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition p-1 cursor-pointer"
                title="Mostrar/ocultar senha"
              >
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
            </div>
            
            <p id="netflixAuthErrorMsg" class="hidden text-rose-400 text-xs font-bold mt-2 flex items-center gap-1.5">
              <i data-lucide="alert-circle" class="w-3.5 h-3.5 shrink-0"></i>
              <span>Senha incorreta. Verifique e tente novamente.</span>
            </p>
          </div>

          <!-- Quick 1-click for Viewer if applicable -->
          <div id="netflixViewerQuickEnterRow" class="hidden">
            <button 
              type="button" 
              onclick="quickEnterViewer()" 
              class="w-full py-2.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <i data-lucide="eye" class="w-3.5 h-3.5 text-amber-400"></i>
              <span>Entrar no Perfil de Leitura Imediato</span>
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="pt-1 space-y-2">
            <button 
              type="submit" 
              class="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 transition transform active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Entrar no Portal</span>
              <i data-lucide="arrow-right" class="w-4 h-4 text-slate-950"></i>
            </button>
            
            <button 
              type="button" 
              onclick="backToNetflixProfiles()" 
              class="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
            >
              &larr; Escolher outro perfil
            </button>
          </div>

          <!-- Quick Recovery Link -->
          <div class="pt-2 text-center border-t border-slate-800 text-[11px] text-slate-400">
            Esqueceu a senha? 
            <button type="button" onclick="openRecoveryFromNetflix()" class="text-amber-400 hover:underline font-bold ml-1 cursor-pointer">
              Recuperar Senha
            </button>
          </div>
        </form>
      </div>

    </main>

    <!-- BOTTOM FOOTER -->
    <footer class="w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-slate-500 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 z-10">
      <div>Ateky Internet • Sistema de Gestão & Premiação Trimestral</div>
      <div class="text-[11px] text-amber-500/80 font-semibold">Oscar do Suporte Técnico • 1º Trimestre / 2026</div>
    </footer>

  </div>
`;

if (!html.includes('id="netflixProfileScreen"')) {
  // Injetar logo após o <body>
  html = html.replace(/(<body[^>]*>)/i, '$1\n' + netflixHtml);
}

// 4. Injetar o botão "Trocar Perfil" no cabeçalho do portal (header)
const trocarPerfilBtn = `
          <!-- BOTÃO TROCAR PERFIL (NETFLIX) -->
          <button 
            type="button" 
            onclick="showNetflixProfileScreen()" 
            class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer" 
            title="Voltar para a tela inicial de seleção de perfil"
          >
            <i data-lucide="users" class="w-3.5 h-3.5 text-brand-600"></i>
            <span class="hidden sm:inline">Trocar Perfil</span>
          </button>
`;

if (!html.includes('onclick="showNetflixProfileScreen()" class="px-3 py-1.5')) {
  html = html.replace('<div class="relative">', trocarPerfilBtn + '\n          <div class="relative">');
}

// 5. Injetar a lógica JS da tela Netflix
const netflixJs = `
    // ==============================================================
    // LÓGICA DA TELA INICIAL: NETFLIX & OSCARS (SELEÇÃO DE PERFIL)
    // ==============================================================
    const OSCAR_BG_BASE64 = "data:image/jpeg;base64,${oscarB64}";

    function updateNetflixAvatars() {
      if (!ADMINS) return;
      if (ADMINS.coord_fernando && ADMINS.coord_fernando.avatar) {
        const el = document.getElementById('netflixAvatar_coord_fernando');
        if (el) el.src = ADMINS.coord_fernando.avatar;
      }
      if (ADMINS.lider_n2n3 && ADMINS.lider_n2n3.avatar) {
        const el = document.getElementById('netflixAvatar_lider_n2n3');
        if (el) el.src = ADMINS.lider_n2n3.avatar;
      }
      if (ADMINS.lider_antonio && ADMINS.lider_antonio.avatar) {
        const el = document.getElementById('netflixAvatar_lider_antonio');
        if (el) el.src = ADMINS.lider_antonio.avatar;
      }

      // Garantir fallback do fundo se necessário
      const screenEl = document.getElementById('netflixProfileScreen');
      if (screenEl) {
        const testImg = new Image();
        testImg.onerror = () => {
          screenEl.style.backgroundImage = 'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(5,5,10,0.85) 50%, rgba(0,0,0,0.96) 100%), url(' + OSCAR_BG_BASE64 + ')';
        };
        testImg.src = 'oscar_bg.jpg';
      }
    }

    function selectNetflixProfile(userId) {
      const target = ADMINS[userId];
      if (!target) return;

      document.getElementById('netflixAuthTargetId').value = userId;
      document.getElementById('netflixAuthSelectedAvatar').src = target.avatar;
      document.getElementById('netflixAuthSelectedName').textContent = target.name;
      document.getElementById('netflixAuthSelectedRole').textContent = target.role;
      
      const badgeEl = document.getElementById('netflixAuthBadge');
      if (badgeEl) {
        badgeEl.textContent = target.badge || (target.isReadonly ? 'Visualizador' : 'Admin');
        badgeEl.className = target.isReadonly 
          ? "absolute -bottom-2 -right-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-md"
          : "absolute -bottom-2 -right-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-500 text-white shadow-md";
      }

      const hintEl = document.getElementById('netflixAuthScopeHint');
      if (hintEl) {
        hintEl.textContent = target.isReadonly ? 'Acesso Somente Leitura' : 'Acesso de Gestão & Edição';
      }

      // Se for visualizador, exibir opção de entrada rápida
      const quickRow = document.getElementById('netflixViewerQuickEnterRow');
      if (quickRow) {
        if (target.isReadonly) {
          quickRow.classList.remove('hidden');
        } else {
          quickRow.classList.add('hidden');
        }
      }

      const passInput = document.getElementById('netflixAuthPasswordInput');
      passInput.value = '';
      document.getElementById('netflixAuthErrorMsg').classList.add('hidden');

      document.getElementById('netflixProfilesView').classList.add('hidden');
      document.getElementById('netflixAuthView').classList.remove('hidden');

      setTimeout(() => passInput.focus(), 150);
      lucide.createIcons();
    }

    function backToNetflixProfiles() {
      document.getElementById('netflixAuthView').classList.add('hidden');
      document.getElementById('netflixProfilesView').classList.remove('hidden');
      document.getElementById('netflixAuthPasswordInput').value = '';
      document.getElementById('netflixAuthErrorMsg').classList.add('hidden');
      lucide.createIcons();
    }

    function quickEnterViewer() {
      currentAuthUserId = 'visualizador';
      sessionStorage.setItem('ateky_authenticated_user', 'visualizador');
      saveAdminsStorage();
      renderUserProfile();
      renderCollaboratorsTable();
      hideNetflixProfileScreen();
      showToastNotification("Modo Visualizador Ativo", "Acesso liberado para consulta e leitura dos indicadores.", "Ateky Auth");
    }

    function handleNetflixAuthSubmit(e) {
      e.preventDefault();
      const targetUserId = document.getElementById('netflixAuthTargetId').value;
      const pass = document.getElementById('netflixAuthPasswordInput').value;
      const target = ADMINS[targetUserId];

      if (!target) return;

      if (pass.trim() === target.password.trim()) {
        currentAuthUserId = targetUserId;
        sessionStorage.setItem('ateky_authenticated_user', targetUserId);
        saveToStorage();
        saveAdminsStorage();
        savePrizesStorage();
        renderUserProfile();
        renderCollaboratorsTable();
        hideNetflixProfileScreen();
        showToastNotification("Sessão Iniciada", "Bem-vindo(a), " + target.name + " (" + target.role + ")", "Ateky Auth");
      } else {
        document.getElementById('netflixAuthErrorMsg').classList.remove('hidden');
      }
    }

    function hideNetflixProfileScreen() {
      const screen = document.getElementById('netflixProfileScreen');
      if (!screen) return;
      screen.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => {
        screen.classList.add('hidden');
      }, 500);
    }

    function showNetflixProfileScreen(animate = true) {
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
      screen.classList.remove('hidden');
      
      if (animate) {
        screen.classList.remove('opacity-0', 'pointer-events-none');
      } else {
        screen.classList.remove('opacity-0', 'pointer-events-none');
      }
      lucide.createIcons();
    }

    function openNetflixManageModal() {
      // Abre o modal de recuperação / suporte
      openRecoveryModal();
    }

    function openRecoveryFromNetflix() {
      openRecoveryModal();
    }
`;

if (!html.includes('function selectNetflixProfile')) {
  html = html.replace('function promptSwitchProfile(targetUserId) {', netflixJs + '\n\n    function promptSwitchProfile(targetUserId) {');
}

// 6. Atualizar handleLockSession para chamar showNetflixProfileScreen()
html = html.replace(
  /function handleLockSession\(\) \{[\s\S]*?showToastNotification\("Sessão Bloqueada"[\s\S]*?\}/,
  `function handleLockSession() {
      const menu = document.getElementById('profileDropdownMenu');
      if (menu) menu.classList.add('hidden');

      // Salva rigorosamente todos os dados antes de deslogar
      saveToStorage();
      saveAdminsStorage();
      savePrizesStorage();

      sessionStorage.removeItem('ateky_authenticated_user');
      showNetflixProfileScreen();
      showToastNotification("Sessão Bloqueada", "Você foi desconectado. Todas as configurações e métricas permanecem salvas.", "Segurança Ateky");
    }`
);

// 7. Atualizar a inicialização do app para verificar se deve mostrar a tela Netflix
const startupCall = `
    updateNetflixAvatars();
    const hasActiveSession = sessionStorage.getItem('ateky_authenticated_user');
    if (!hasActiveSession) {
      showNetflixProfileScreen(false);
    } else {
      hideNetflixProfileScreen();
    }
`;

if (!html.includes('updateNetflixAvatars();')) {
  html = html.replace('initAuthSystem();', 'initAuthSystem();\n' + startupCall);
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('HTML length after:', html.length);
console.log('Successfully configured Netflix Profile Screen in index.html!');
