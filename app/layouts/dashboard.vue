<template>
  <div v-if="authLoaded" class="dashboard-layout">
    <aside :class="{ collapsed: isCollapsed }" class="sidebar">
      <div class="side-top">
        ACESSO ADMIN
        <!-- role {{ role }} -->
        <!-- <button @click="toggleMenu">
          <span v-if="isCollapsed">open</span>
          <span v-else>close</span>
        </button> -->
      </div>
      <NuxtLink to="/dashboard" :class="{ active: isActive('/dashboard') }">
        <span class="material-icons">dashboard</span>
        <span v-if="!isCollapsed">Dashboard</span>
      </NuxtLink>
      <NuxtLink to="/products" :class="{ active: isActive('/products') }">
        <span class="material-icons">inventory_2</span>
        <span v-if="!isCollapsed">Produto</span>
      </NuxtLink>
      <NuxtLink to="/catalogo" :class="{ active: isActive('/catalogo') }">
        <span class="material-icons">shopping_bag</span>
        <span v-if="!isCollapsed">Catálogo</span>
      </NuxtLink>
      <NuxtLink to="/clients" :class="{ active: isActive('/clients') }">
        <span class="material-icons">group</span>
        <span v-if="!isCollapsed">Clientes</span>
      </NuxtLink>
      <NuxtLink to="/banners" :class="{ active: isActive('/banners') }">
        <span class="material-icons">image</span>
        <span v-if="!isCollapsed">Banners</span>
      </NuxtLink>

      <!-- <NuxtLink to="/brands" :class="{ active: isActive('/brands') }">
        <img src="../assets/images/brand-icon.svg" />
        <span v-if="!isCollapsed">Marcas</span>
      </NuxtLink> -->
      <!-- <NuxtLink to="/sales" :class="{ active: isActive('/sales') }">
        <img src="../assets/images/sales-icon.svg" />
        <span v-if="!isCollapsed">Vendas</span>
      </NuxtLink> -->
      <!-- <NuxtLink to="/newaccess" :class="{ active: isActive('/newaccess') }">
        <img src="../assets/images/newaccess-icon.svg" />
        <span v-if="!isCollapsed">Novo acesso</span>
      </NuxtLink> -->
      <!-- <NuxtLink to="/settings" :class="{ active: isActive('/settings') }">
        <span v-if="!isCollapsed">Configurações</span>
      </NuxtLink> -->
      <!-- <NuxtLink to="/migrate" :class="{ active: isActive('/migrate') }">
        <span>&#9729;</span>
        <span v-if="!isCollapsed">Migrate</span>
      </NuxtLink> -->
      <!-- <NuxtLink
        to="/dashboard/config"
        :class="{ active: isActive('/dashboard/config') }"
      >
        <span>&#9729;</span>
        <span v-if="!isCollapsed">Configurações</span>
      </NuxtLink> -->
      <!-- <NuxtLink to="/payments" :class="{ active: isActive('/payments') }">
        <span>&#9729;</span>
        <span v-if="!isCollapsed">Pagamentos</span>
      </NuxtLink> -->
      <!-- <NuxtLink
        to="/dashboard/options"
        :class="{ active: isActive('/dashboard/options') }"
      >
        <span>&#9729;</span>
        <span v-if="!isCollapsed">Opções</span>
      </NuxtLink> -->
      <button @click="handleLogout" :disabled="isLoading">
        <span v-if="!isLoading">Sair</span>
        <span v-else>Saindo...</span>
      </button>
    </aside>
    <div class="sidebottom">
      <NuxtLink to="/dashboard" :class="{ active: isActive('/dashboard') }">
        <span class="material-icons">dashboard</span>
        Dashboard
      </NuxtLink>
      <NuxtLink to="/products" :class="{ active: isActive('/products') }">
        <span class="material-icons">inventory_2</span>
        Produto
      </NuxtLink>
      <NuxtLink to="/catalogo" :class="{ active: isActive('/catalogo') }">
        <span class="material-icons">shopping_bag</span>
        Catálogo
      </NuxtLink>
      <NuxtLink to="/clients" :class="{ active: isActive('/clients') }">
        <span class="material-icons">group</span>
        Clientes
      </NuxtLink>
      <NuxtLink to="/banners" :class="{ active: isActive('/banners') }">
        <span class="material-icons">image</span>
        Banners
      </NuxtLink>
    </div>

    <main :class="{ forceWidth: isCollapsed }">
      <div class="nav-sec">
        <div v-if="false" class="btn-menu">
          <div @click="toggleMenu">
            <img v-if="isCollapsed" src="../assets/images/set-icon.svg" />
            <img v-else src="../assets/images/set1-icon.svg" />
          </div>
        </div>
        <!-- <img src="../assets/images/drogariapopular.png" /> -->
        <!-- Drogaria Popular Do Para -->

        <div class="nav-sec-icons">
          <NuxtLink to="/notificacoes-adm" class="notications">
            <p>12</p>
            <span class="material-icons">notifications</span>
          </NuxtLink>
          <div @click="menuMobile" class="material-icons menu-mobile-icon">
            menu
          </div>
        </div>

        <!-- <button class="mobile-logout" @click="handleLogout" :disabled="isLoading">
          <span> {{ !isLoading ? "Sair" : "Saindo..." }}</span>
        </button> -->
      </div>

      <!-- Menu Mobile Condicional -->
      <div v-if="isMenuMobile" class="menu-mobile-slide">
        <button
          @click="handleLogout"
          :disabled="isLoading"
          class="menu-mobile-btn"
        >
          <span v-if="!isLoading">Sair</span>
          <span v-else>Saindo...</span>
        </button>

        <!-- Futuramente, adicione aqui mais botões -->
      </div>
      <slot />
    </main>
  </div>
  <div v-else class="loading-auth">
    <div class="spinner"></div>
    <p>Verificando autenticação...</p>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref } from "vue";
import { createClient } from "@supabase/supabase-js";

const supaStore = useSupabaseClient();
const SUPABASE_URL = supaStore.supabaseUrl;
const SUPABASE_KEY = supaStore.supabaseKey;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const isMenuMobile = ref(false);
const isCollapsed = ref(false);
const route = useRoute();
const authLoaded = ref(false);

const role = ref("admin"); // Defina o papel padrão como 'admin'

// Verificação de autenticação
const checkAuth = async () => {
  try {
    // 1. Verifica no localStorage (client-side)
    const authData = localStorage.getItem("sb-api-auth-token");
    const parsedData = JSON.parse(authData);
    console.log("authData", authData);
    console.log("parsedData AAAAA", parsedData);

    // role.value = user.user_metadata.role;
    if (parsedData.user.user_metadata.role) {
      navigateTo("/cliente");
      // navigateTo('/dashboard');
    } else {
      navigateTo("/dashboard");
    }

    if (process.client) {
      if (!authData) throw new Error("Nenhum dado de autenticação encontrado");
      if (!parsedData?.user) throw new Error("Usuário não autenticado");
    }

    // 2. Verifica com o Supabase (opcional, mas recomendado)
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw error || new Error("Usuário não autenticado");
    }

    // Se chegou aqui, está autenticado
    authLoaded.value = true;
  } catch (error) {
    console.error("Erro de autenticação:", error);

    // Limpa os dados inválidos
    if (process.client) {
      localStorage.removeItem("sb-api-auth-token");
    }

    // Redireciona para login
    // navigateTo('/login');
  }
};

function menuMobile() {
  isMenuMobile.value = !isMenuMobile.value;
}

// Verifica a autenticação quando o componente é montado
onMounted(() => {
  checkAuth();
});

function toggleMenu() {
  isCollapsed.value = !isCollapsed.value;
}

const isActive = (path) => {
  return route.path.startsWith(path);
  return navigateTo(path);
};

const isLoading = ref(false);

const handleLogout = async () => {
  console.log("Logout clicked");
  isLoading.value = true;
  try {
    await supabase.auth.signOut();
    localStorage.removeItem("sb-api-auth-token");
    navigateTo("/login");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.loading-auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 1.5rem;
  font-size: 1.1rem;
  color: #333;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 6px solid #e0e0e0;
  border-top: 6px solid #e30614;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.notications {
  background-color: red;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border-radius: 20px;
  color: #fff;
}

.notications p {
  margin: 0;
  font-size: 10px;
  font-weight: bold;
  position: fixed;
  top: 10px;
  right: 25px;
  background-color: #000000;
  padding: 3px;
  border-radius: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.side-top {
  padding: 20px 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e30614;
  color: #f0f0f0;
  font-weight: 600;
  font-size: 1.1rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
}

.btn-menu {
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  background-color: #f0f0f0;
  transition: background-color 0.2s;
}

/* .btn-menu:hover {
  background-color: #e0e0e0;
} */

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 280px;
  min-width: 280px;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.08);
  transition: width 0.3s ease-in-out, min-width 0.3s ease-in-out;
  border-right: 1px solid #e0e0e0;
}

.sidebar a {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  border-radius: 8px;
  font-weight: 500;
  color: #333;
  transition: all 0.2s ease-in-out;
}

.sidebar a:hover {
  /* background-color: #f0f0f0; */
  color: #e30614;
  /* transform: translateX(5px); */
}

.sidebar a .material-icons {
  font-size: 24px;
  color: #333;
  transition: color 0.2s ease-in-out;
}

.sidebar a:hover .material-icons {
  color: #e30614;
}

.sidebar a span:last-child {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.2s ease-in-out;
}

.sidebar.collapsed {
  width: 80px;
  min-width: 80px;
  align-items: center;
}

.sidebar.collapsed a span:last-child {
  opacity: 0;
  visibility: hidden;
  width: 0;
  overflow: hidden;
}

.sidebar a.active {
  background-color: #f0f0f0;
  color: #e30614 !important;
  font-weight: 600;
  box-shadow: inset 3px 0 0 0 #e30614;
}

.sidebar a.active .material-icons {
  color: #e30614;
}

.sidebar button {
  margin-top: auto;
  padding: 12px 20px;
  background-color: #e30614;
  color: #f0f0f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.sidebar button:hover:not(:disabled) {
  background-color: #24298a;
  /* transform: translateY(-2px); */
}

.sidebar button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

main {
  flex-grow: 1;
  padding: 0;
  transition: margin-left 0.3s ease;
  overflow-y: auto;
  height: 100vh;
  background-color: #f8f9fa;
}

/* main.forceWidth {
} */

main::-webkit-scrollbar {
  width: 8px;
}

main::-webkit-scrollbar-track {
  background: #f8f9fa;
}

main::-webkit-scrollbar-thumb {
  background-color: #30369d;
  border-radius: 4px;
  border: 2px solid #f8f9fa;
}

.nav-sec {
  background-color: #30369d;
  padding: 15px 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  color: #fff;
}

.nav-sec img {
  height: 35px;
  object-fit: contain;
}

.nav-sec .perfil {
  display: flex;
  align-items: center;
  padding: 5px 10px;
}

.nav-sec .perfil a {
  text-decoration: none;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: color 0.2s ease-in-out;
}

.nav-sec .perfil a:hover {
  color: #e30614;
}

.nav-sec .perfil .logo {
  border-radius: 50%;
  border: 2px solid #e30614;
  object-fit: cover;
  transition: transform 0.2s ease-in-out;
  width: 40px;
  height: 40px;
}

/* .nav-sec .perfil .logo:hover {
  transform: scale(1.05);
} */

.nav-sec .menu-mobile-icon {
  display: none;
}

.nav-sec-icons {
  display: flex;
  align-items: center;
  gap: 20px;
}

.active {
  background-color: #f0f0f0;
  color: #e30614 !important;
  font-weight: 600;
  box-shadow: inset 3px 0 0 0 #e30614;
}

.sidebottom {
  display: none;
}

.mobile-logout {
  display: none;
}

/* Estilo do menu mobile */
.menu-mobile-slide {
  position: fixed;
  top: 80px;
  right: 0;
  width: 80%;
  width: 90%;
  height: 100vh;
  background-color: #ffffff;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
  z-index: 1100;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  animation: slideInRight 0.3s ease forwards;
}

.menu-mobile-btn {
  background-color: #e30614;
  color: #fff;
  width: 100%;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.menu-mobile-btn:hover:not(:disabled) {
  background-color: #c70410;
}

.menu-mobile-btn:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

.menu-mobile-slide {
  display: none;
}

@keyframes slideInRight {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0%);
    opacity: 1;
  }
}

@media (max-width: 900px) {
  .sidebar {
    display: none;
  }
  .notications p {
    right: 60px;
  }

  .sidebottom {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 10px 0;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    background-color: #f0f0f0;
    box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.2);
    z-index: 1000;
  }

  .sidebottom a {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    gap: 5px;
    padding: 8px 10px;
    border-radius: 8px;
    color: #333;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.2s ease-in-out;
  }

  .sidebottom a .material-icons {
    font-size: 26px;
    width: 26px;
    height: 26px;
    margin-bottom: 3px;
    color: #333;
  }

  /* .sidebottom a:hover {
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-3px);
  } */

  .sidebottom .active {
    background-color: #e30614;
    color: #f0f0f0 !important;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-20px);
  }

  .sidebottom .active .material-icons {
    color: #f0f0f0;
  }

  .sidebottom button {
    padding: 8px 15px;
    background-color: #e30614;
    color: #f0f0f0;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    transition: background-color 0.2s ease-in-out;
  }

  .sidebottom button:hover:not(:disabled) {
    background-color: #c70410;
  }

  main {
    padding-top: 80px;
    padding-bottom: 80px;
    margin-bottom: 0;
    height: auto;
  }

  .nav-sec {
    position: fixed;
    top: -2px;
    bottom: 0;
    left: 0;
    color: #fff;
    width: 100%;
    height: 80px;
    padding: 12px 20px;
    background: #30369d;
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.3);
  }

  .mobile-logout {
    display: block;
    background-color: #e30614;
    color: #fff;
    border: none;
    padding: 8px 15px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }
  .mobile-logout:hover:not(:disabled) {
    background-color: #c70410;
  }

  .mobile-logout:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
  }

  /* para remover aparecer menu mobile em telas menores */
  .menu-mobile-slide {
    display: block;
  }

  .nav-sec .menu-mobile-icon {
    display: block;
  }
}
</style>
