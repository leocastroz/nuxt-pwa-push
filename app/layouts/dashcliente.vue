<template>
  <div v-if="authLoaded" class="dashboard-layout">
    <aside :class="{ collapsed: isCollapsed }" class="sidebar">
      <div class="side-top">
        ACESSO CLIENTE
        <!-- role {{ role }} -->
        <!-- <button @click="toggleMenu">
          <span v-if="isCollapsed">open</span>
          <span v-else>close</span>
        </button> -->
      </div>
      <NuxtLink to="/cliente" :class="{ active: isActive('/cliente') }">
        <span class="material-icons">home</span>
        <span>Viagens</span>
      </NuxtLink>

      <NuxtLink
        to="/premios-retirada"
        :class="{ active: isActive('/premios-retirada') }"
      >
        <span class="material-icons">map</span>
        <span>Mapa</span>
      </NuxtLink>

      <NuxtLink
        to="/premios-roleta"
        :class="{ active: isActive('/premios-roleta') }"
      >
        <span class="material-icons">casino</span>
        <span>Roleta</span>
      </NuxtLink>

      <NuxtLink
        to="/catalogo-cliente"
        :class="{ active: isActive('/catalogo-cliente') }"
      >
        <span class="material-icons">shopping_bag</span>
        <span>Catálogo</span>
      </NuxtLink>
       <NuxtLink
        to="/carteira-cliente"
        :class="{ active: isActive('/carteira-cliente') }"
      >
        <span class="material-icons">map</span>
        <span>Carteira de pontos</span>
      </NuxtLink>
      <!-- <NuxtLink to="/cliente" :class="{ active: isActive('/cliente') }">
        <img src="../assets/images/dashboard-icon.svg" />
        <span v-if="!isCollapsed">Dashboard cliente</span>
      </NuxtLink>
      <NuxtLink to="/premios" :class="{ active: isActive('/premios') }">
        <img src="../assets/images/dashboard-icon.svg" />
        <span v-if="!isCollapsed">Premios</span>
      </NuxtLink> -->

      <!-- <button @click="testToastify">Click me</button> -->

      <!-- <NuxtLink to="/products" :class="{ active: isActive('/products') }">
        <img src="../assets/images/box-icon.svg" />
        <span v-if="!isCollapsed">Produto</span>
      </NuxtLink>
      <NuxtLink to="/clients" :class="{ active: isActive('/clients') }">
        <img src="../assets/images/peoples-icon.svg" />
        <span v-if="!isCollapsed">Clientes</span>
      </NuxtLink>
      <NuxtLink to="/brands" :class="{ active: isActive('/brands') }">
        <img src="../assets/images/brand-icon.svg" />
        <span v-if="!isCollapsed">Marcas</span>
      </NuxtLink>
      <NuxtLink to="/banners" :class="{ active: isActive('/banners') }">
        <img src="../assets/images/banner-icon.svg" />
        <span v-if="!isCollapsed">Banners</span>
      </NuxtLink>
      <NuxtLink to="/sales" :class="{ active: isActive('/sales') }">
        <img src="../assets/images/sales-icon.svg" />
        <span v-if="!isCollapsed">Vendas</span>
      </NuxtLink>
      <NuxtLink to="/newaccess" :class="{ active: isActive('/newaccess') }">
        <img src="../assets/images/newaccess-icon.svg" />
        <span v-if="!isCollapsed">Novo acesso</span>
      </NuxtLink>
      <NuxtLink to="/settings" :class="{ active: isActive('/settings') }">
        <span v-if="!isCollapsed">Configurações</span>
      </NuxtLink>
      <NuxtLink to="/migrate" :class="{ active: isActive('/migrate') }">
        <span>&#9729;</span>
        <span v-if="!isCollapsed">Migrate</span>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/config"
        :class="{ active: isActive('/dashboard/config') }"
      >
        <span>&#9729;</span>
        <span v-if="!isCollapsed">Configurações</span>
      </NuxtLink>
      <NuxtLink to="/payments" :class="{ active: isActive('/payments') }">
        <span>&#9729;</span>
        <span v-if="!isCollapsed">Pagamentos</span>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/options"
        :class="{ active: isActive('/dashboard/options') }"
      >
        <span>&#9729;</span>
        <span v-if="!isCollapsed">Opções</span>
      </NuxtLink> -->
      <LogoutButton />
    </aside>

    <aside :class="{ collapsed: isCollapsed }" class="sidebottom">
      <NuxtLink to="/cliente" :class="{ active: isActive('/cliente') }">
        <span class="material-icons">home</span>
        <span>Viagens</span>
      </NuxtLink>
      
      <NuxtLink
        to="/mapa-cliente"
        :class="{ active: isActive('/mapa-cliente') }"
      >
        <span class="material-icons">map</span>
        <span>Mapa</span>
      </NuxtLink>
      <!-- <NuxtLink
        to="/premios-roleta"
        :class="{ active: isActive('/premios-roleta') }"
      >
        <span class="material-icons">casino</span>
        <span>Roleta</span>
      </NuxtLink> -->
      <!-- <NuxtLink
        to="/catalogo-cliente"
        :class="{ active: isActive('/catalogo-cliente') }"
      >
        <span class="material-icons">shopping_bag</span>
        <span>Catálogo</span>
      </NuxtLink> -->

      <NuxtLink
        to="/carteira-cliente"
        :class="{ active: isActive('/afiliado-cliente') }"
      >
        <span class="material-icons">people</span>
        <span>Afiliado</span>
      </NuxtLink>

    

      <!-- <NuxtLink to="/cliente" :class="{ active: isActive('/cliente') }">
        <img src="../assets/images/dashboard-icon.svg" />
        <span v-if="!isCollapsed">Dashboard cliente</span>
      </NuxtLink>
      <NuxtLink to="/premios" :class="{ active: isActive('/premios') }">
        <img src="../assets/images/dashboard-icon.svg" />
        <span v-if="!isCollapsed">Premios</span>
      </NuxtLink> -->

      <!-- <button @click="testToastify">Click me</button> -->

      <!-- <NuxtLink to="/products" :class="{ active: isActive('/products') }">
        <img src="../assets/images/box-icon.svg" />
        <span v-if="!isCollapsed">Produto</span>
      </NuxtLink>
      <NuxtLink to="/clients" :class="{ active: isActive('/clients') }">
        <img src="../assets/images/peoples-icon.svg" />
        <span v-if="!isCollapsed">Clientes</span>
      </NuxtLink>
      <NuxtLink to="/brands" :class="{ active: isActive('/brands') }">
        <img src="../assets/images/brand-icon.svg" />
        <span v-if="!isCollapsed">Marcas</span>
      </NuxtLink>
      <NuxtLink to="/banners" :class="{ active: isActive('/banners') }">
        <img src="../assets/images/banner-icon.svg" />
        <span v-if="!isCollapsed">Banners</span>
      </NuxtLink>
      <NuxtLink to="/sales" :class="{ active: isActive('/sales') }">
        <img src="../assets/images/sales-icon.svg" />
        <span v-if="!isCollapsed">Vendas</span>
      </NuxtLink>
      <NuxtLink to="/newaccess" :class="{ active: isActive('/newaccess') }">
        <img src="../assets/images/newaccess-icon.svg" />
        <span v-if="!isCollapsed">Novo acesso</span>
      </NuxtLink>
      <NuxtLink to="/settings" :class="{ active: isActive('/settings') }">
        <span v-if="!isCollapsed">Configurações</span>
      </NuxtLink>
      <NuxtLink to="/migrate" :class="{ active: isActive('/migrate') }">
        <span>&#9729;</span>
        <span v-if="!isCollapsed">Migrate</span>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/config"
        :class="{ active: isActive('/dashboard/config') }"
      >
        <span>&#9729;</span>
        <span v-if="!isCollapsed">Configurações</span>
      </NuxtLink>
      <NuxtLink to="/payments" :class="{ active: isActive('/payments') }">
        <span>&#9729;</span>
        <span v-if="!isCollapsed">Pagamentos</span>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/options"
        :class="{ active: isActive('/dashboard/options') }"
      >
        <span>&#9729;</span>
        <span v-if="!isCollapsed">Opções</span>
      </NuxtLink> -->
      <!-- <LogoutButton /> -->
    </aside>

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

        <div class="perfil">
          <UserBadge />
        </div>
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
import LogoutButton from '~/components/LogoutButton.vue'
import UserBadge from '~/components/UserBadge.vue'

const supabase = useSupabaseClient();

const isCollapsed = ref(false);
const route = useRoute();
const authLoaded = ref(false);

const cliente = ref(null);

const role = ref("cliente"); // Defina o papel padrão como 'admin'

// Verificação de autenticação
const checkAuth = async () => {
  try {
    // 1. Verifica no localStorage (client-side)
    const authData = localStorage.getItem("sb-api-auth-token");
    const parsedData = JSON.parse(authData);

    console.log("parsedData CLIENTE!", parsedData);
    cliente.value = parsedData.user;
    // role.value = user.user_metadata.role;
    if (parsedData.user.user_metadata.role) {
      navigateTo("/cliente");
      // navigateTo('/dashboard');
    } else {
      navigateTo("/dashboard");
    }

    if (process.client) {
      ("sb-api-auth-token");
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

    role.value = user.user_metadata.role;
    if (user.user_metadata.role !== 'admin') {
      navigateTo('/cliente');
      // navigateTo('/dashboard');
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

function testToastify() {
  useToastify("Wow so easy !", {
    autoClose: 2000,
    theme: "light",
    type: "success",
    position: ToastifyOption.POSITION.TOP_RIGHT,
  });
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

.btn-menu:hover {
  background-color: #e0e0e0;
}

.sidebottom {
  display: none;
}

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
  background-color: #f0f0f0;
  color: #e30614;
  transform: translateX(5px);
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
  transform: translateY(-2px);
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
  /* padding: 15px 30px; */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
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

.nav-sec .perfil .logo:hover {
  transform: scale(1.05);
}

.nav-sec .logo:hover {
  transform: scale(1.05);
}

.active {
  background-color: #f0f0f0;
  color: #e30614 !important;
  font-weight: 600;
  box-shadow: inset 3px 0 0 0 #e30614;
}

@media (max-width: 900px) {
  .sidebar {
    display: none;
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

  .sidebottom a:hover {
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-3px);
  }

  .sidebottom .active {
    background-color: #e30614;
    color: #f0f0f0 !important;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-5px);
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
    padding-top: 80px; /* Altura do .nav-sec */
    padding-bottom: 80px; /* Altura do .sidebottom */
    margin-bottom: 0;
    height: auto;
  }

  .nav-sec {
    position: fixed;
    /* top: -2px; */
    bottom: 0;
    left: 0;
    color: #fff;
    width: 100%;
    height: 80px;
    /* padding: 12px 20px; */
    background: #49DEFF;
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.3);
  }
}
</style>
