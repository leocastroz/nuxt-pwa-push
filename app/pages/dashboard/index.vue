<template>
    <div class="dashboard-container">
        <!-- Header -->
        <div class="dashboard-header">
            <div>
                <h1 class="titulo">Dashboard Administrativo</h1>
                <p class="subtitulo">Bem-vindo à sua dashboard!</p>
            </div>
            <div class="datetime-info">
                <div class="datetime-card">
                    <div class="date">{{ currentDate }}</div>
                    <div class="time">{{ currentTime }}</div>
                </div>
            </div>
        </div>

        <!-- Cards de Estatísticas -->
        <div class="stats-grid">
            <div class="stat-card clients">
                <div class="stat-icon">
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <circle
                            cx="9"
                            cy="7"
                            r="4"
                            stroke="currentColor"
                            stroke-width="2"
                        />
                        <path
                            d="m22 21-3-3m0 0a5 5 0 1 0-7-7 5 5 0 0 0 7 7z"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </div>
                <div class="stat-info">
                    <h3>Total de Clientes</h3>
                    <div class="stat-number">{{ ultimosClientes.length }}</div>
                    <div class="stat-change positive">+{{ 0 }} hoje</div>
                </div>
            </div>

            <div class="stat-card products">
                <div class="stat-icon">
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <line
                            x1="3"
                            y1="6"
                            x2="21"
                            y2="6"
                            stroke="currentColor"
                            stroke-width="2"
                        />
                        <path
                            d="M16 10a4 4 0 0 1-8 0"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </div>
                <div class="stat-info">
                    <h3>Produtos Cadastrados</h3>
                    <div class="stat-number">{{ totalProdutos.length }}</div>
                    <div class="stat-change neutral">
                        {{ produtosAtivos }} ativos
                    </div>
                </div>
            </div>

            <div class="stat-card redemptions">
                <div class="stat-icon">
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </div>
                <div class="stat-info">
                    <h3>Total de Resgates</h3>
                    <div class="stat-number">{{ 0 }}</div>
                    <div class="stat-change positive">+{{ 0 }} hoje</div>
                </div>
            </div>

            <div class="stat-card revenue">
                <div class="stat-icon">
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <line
                            x1="12"
                            y1="1"
                            x2="12"
                            y2="23"
                            stroke="currentColor"
                            stroke-width="2"
                        />
                        <path
                            d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                            stroke="currentColor"
                            stroke-width="2"
                        />
                    </svg>
                </div>
                <div class="stat-info">
                    <h3>Valor Total Resgatado</h3>
                    <div class="stat-number">R$ {{ "0,00" }}</div>
                    <div class="stat-change positive">
                        +R$ {{ "0,00" }} hoje
                    </div>
                </div>
            </div>
        </div>

        <!-- Seção de Últimos Clientes -->
        <div class="recent-clients-section">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Últimos Clientes Cadastrados</h2>
                    <p class="section-subtitle">
                        Acompanhe os novos usuários da plataforma
                    </p>
                </div>
                <button class="btn-primary" @click="refreshClients">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M21 3v5h-5"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M3 21v-5h5"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                    Atualizar
                </button>
            </div>

            <div class="clients-grid">
                <div
                    class="client-card"
                    v-for="cliente in paginatedClients"
                    :key="cliente.id"
                >
                    <div class="client-avatar">
                        <img
                            :src="
                                cliente.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(cliente.nome)}&background=30369d&color=fff`
                            "
                            :alt="cliente.nome"
                        />
                        <div
                            class="client-status"
                            :class="cliente.status"
                        ></div>
                    </div>

                    <div class="client-info">
                        <div class="client-header">
                            <h4 class="client-name">{{ cliente.nome }}</h4>
                            <span class="client-id">#{{ cliente.id }}</span>
                        </div>

                        <div class="client-details">
                            <p class="client-email">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    />
                                    <polyline
                                        points="22,6 12,13 2,6"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    />
                                </svg>
                                {{
                                    cliente.email_profile_client
                                        ? cliente.email_profile_client
                                        : "pendente"
                                }}
                            </p>

                            <p class="client-phone">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    />
                                </svg>
                                {{ cliente.contato }}
                            </p>

                            <p class="client-date">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect
                                        x="3"
                                        y="4"
                                        width="18"
                                        height="18"
                                        rx="2"
                                        ry="2"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    />
                                    <line
                                        x1="16"
                                        y1="2"
                                        x2="16"
                                        y2="6"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    />
                                    <line
                                        x1="8"
                                        y1="2"
                                        x2="8"
                                        y2="6"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    />
                                    <line
                                        x1="3"
                                        y1="10"
                                        x2="21"
                                        y2="10"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    />
                                </svg>
                                Cadastrado em -
                                {{ formatDate(cliente.created_at) }}
                            </p>
                            
                            <div class="client-rating">
                                <span class="rating-label">Avaliou com:</span>
                                <div class="star-rating" style="display: flex; gap: 5px; align-items: center;">
                                    <span
                                        v-for="star in cliente.avaliacao"
                                        :key="star"
                                        @click="setRating(star)"
                                        @mouseover="hoverRating = star"
                                        @mouseleave="hoverRating = rating"
                                        style="cursor: pointer; font-size: 10px; color: #FFD700;"
                                    >
                                        <svg
                                            width="15"
                                            height="15"
                                            viewBox="0 0 24 24"
                                            fill="#FFD700"
                                            stroke="#FFA500"
                                            stroke-width="2"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            
                            
                        </div>
                    </div>

                    <!-- <div class="client-actions">
            <button class="btn-action view" @click="viewClient(cliente)" title="Ver detalhes">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <button class="btn-action edit" @click="editClient(cliente)" title="Editar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div> -->
                </div>
            </div>

            <!-- Paginação -->
            <div class="pagination" v-if="totalPages > 1">
                <button
                    class="pagination-btn"
                    :disabled="currentPage === 1"
                    @click="currentPage--"
                >
                    Anterior
                </button>

                <span class="pagination-info">
                    Página {{ currentPage }} de {{ totalPages }}
                </span>

                <button
                    class="pagination-btn"
                    :disabled="currentPage === totalPages"
                    @click="currentPage++"
                >
                    Próxima
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { createClient } from "@supabase/supabase-js";

const supaStore = useSupabaseClient();
const SUPABASE_URL = supaStore.supabaseUrl;
const SUPABASE_KEY = supaStore.supabaseKey;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Middleware e layout do Nuxt
definePageMeta({
    middleware: ["auth"],
    layout: "dashboard",
});

// Estados reativos
const currentDate = ref("");
const currentTime = ref("");
const currentPage = ref(1);
const itemsPerPage = 6;

// Dados simulados - substitua por dados reais da API
const totalClientes = ref(1247);
// const novosCLientesHoje = ref(23)
const totalProdutos = ref([]);
const produtosAtivos = ref(76);
const totalResgates = ref(3456);
const resgatesHoje = ref(12);
const valorTotalResgatado = ref(45678);
const valorResgatadoHoje = ref(1234);
const ultimosClientes = ref([]);

async function getClients() {
    console.log("chamando clientes ativos");
    const { data, error } = await supabase
        .from("users_sorteio_qrcode")
        .select("*");
    if (error) console.error("Error fetching premios:", error);

    if (data) return (ultimosClientes.value = data);
}

// const ultimosClientes = ref([
//   {
//     id: 1001,
//     nome: 'Maria Silva Santos',
//     email: 'maria.silva@email.com',
//     telefone: '(11) 99999-1234',
//     dataCadastro: new Date('2024-01-15T10:30:00'),
//     status: 'online',
//     avatar: null
//   },
//   {
//     id: 1002,
//     nome: 'João Pedro Oliveira',
//     email: 'joao.pedro@email.com',
//     telefone: '(11) 98888-5678',
//     dataCadastro: new Date('2024-01-15T09:15:00'),
//     status: 'offline',
//     avatar: null
//   },
//   {
//     id: 1003,
//     nome: 'Ana Carolina Lima',
//     email: 'ana.carolina@email.com',
//     telefone: '(11) 97777-9012',
//     dataCadastro: new Date('2024-01-14T16:45:00'),
//     status: 'online',
//     avatar: null
//   },
//   {
//     id: 1004,
//     nome: 'Carlos Eduardo Costa',
//     email: 'carlos.eduardo@email.com',
//     telefone: '(11) 96666-3456',
//     dataCadastro: new Date('2024-01-14T14:20:00'),
//     status: 'away',
//     avatar: null
//   },
//   {
//     id: 1005,
//     nome: 'Fernanda Rodrigues',
//     email: 'fernanda.rodrigues@email.com',
//     telefone: '(11) 95555-7890',
//     dataCadastro: new Date('2024-01-14T11:10:00'),
//     status: 'online',
//     avatar: null
//   },
//   {
//     id: 1006,
//     nome: 'Ricardo Almeida',
//     email: 'ricardo.almeida@email.com',
//     telefone: '(11) 94444-2345',
//     dataCadastro: new Date('2024-01-13T15:30:00'),
//     status: 'offline',
//     avatar: null
//   },
//   {
//     id: 1007,
//     nome: 'Juliana Ferreira',
//     email: 'juliana.ferreira@email.com',
//     telefone: '(11) 93333-6789',
//     dataCadastro: new Date('2024-01-13T13:45:00'),
//     status: 'online',
//     avatar: null
//   },
//   {
//     id: 1008,
//     nome: 'Roberto Santos',
//     email: 'roberto.santos@email.com',
//     telefone: '(11) 92222-0123',
//     dataCadastro: new Date('2024-01-13T10:20:00'),
//     status: 'away',
//     avatar: null
//   }
// ])

// Computed properties
const totalPages = computed(() =>
    Math.ceil(ultimosClientes.value.length / itemsPerPage),
);

const paginatedClients = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return ultimosClientes.value.slice(start, end);
});

// Métodos
const updateDateTime = () => {
    const now = new Date();
    currentDate.value = now.toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    currentTime.value = now.toLocaleTimeString("pt-BR");
};

const formatDate = (date) => {
    return new Date(date).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

async function getProducts() {
    const { data, error } = await supabase.from("produtos_sorteio").select("*");
    if (error) return console.error("Error fetching sorteio data:", error);
    if (data) return (totalProdutos.value = data);
}

const refreshClients = async () => {
    // console.log('Atualizando lista de clientes...')
    getClients();
    // Aqui você pode fazer uma chamada para sua API
    // const { data } = await $fetch('/api/clients')
    // ultimosClientes.value = data
};

const viewClient = (cliente) => {
    console.log("Visualizar cliente:", cliente);
    // Implementar navegação ou modal de visualização
    // await navigateTo(`/dashboard/clients/${cliente.id}`)
};

const editClient = (cliente) => {
    console.log("Editar cliente:", cliente);
    // Implementar navegação ou modal de edição
    // await navigateTo(`/dashboard/clients/${cliente.id}/edit`)
};

// Lifecycle hooks
let timeInterval;

onMounted(() => {
    updateDateTime();
    getClients();
    getProducts();
    timeInterval = setInterval(updateDateTime, 1000);
});

onUnmounted(() => {
    if (timeInterval) {
        clearInterval(timeInterval);
    }
});
</script>

<style scoped>
.dashboard-container {
    padding: 30px 20px;
    background-color: #f8fafc;
    min-height: 100vh;
}

/* Header */
.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 20px;
}

.titulo {
    font-size: 1.8rem;
    margin-bottom: 5px;
    color: #30369d;
    font-weight: 700;
}

.subtitulo {
    margin-bottom: 0;
    color: #555;
    font-size: 1rem;
}

.datetime-info {
    text-align: right;
}

.datetime-card {
    background: white;
    padding: 15px 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #30369d;
}

.date {
    font-size: 0.9rem;
    color: #666;
    text-transform: capitalize;
}

.time {
    font-size: 1.2rem;
    font-weight: 600;
    color: #30369d;
    margin-top: 2px;
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.stat-card {
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 20px;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.stat-card.clients .stat-icon {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
}

.stat-card.products .stat-icon {
    background: linear-gradient(135deg, #f093fb, #f5576c);
    color: white;
}

.stat-card.redemptions .stat-icon {
    background: linear-gradient(135deg, #4facfe, #00f2fe);
    color: white;
}

.stat-card.revenue .stat-icon {
    background: linear-gradient(135deg, #43e97b, #38f9d7);
    color: white;
}

.stat-info h3 {
    font-size: 0.9rem;
    color: #666;
    margin: 0 0 8px 0;
    font-weight: 500;
}

.stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 4px;
}

.stat-change {
    font-size: 0.85rem;
    font-weight: 500;
}

.stat-change.positive {
    color: #10b981;
}

.stat-change.negative {
    color: #ef4444;
}

.stat-change.neutral {
    color: #6b7280;
}

/* Recent Clients Section */
.recent-clients-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 25px 30px;
    border-bottom: 1px solid #e5e7eb;
    flex-wrap: wrap;
    gap: 15px;
}

.section-title {
    font-size: 1.4rem;
    color: #30369d;
    margin: 0 0 5px 0;
    font-weight: 600;
}

.section-subtitle {
    color: #666;
    margin: 0;
    font-size: 0.9rem;
}

.btn-primary {
    background-color: #30369d;
    color: white;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.2s ease;
}

.btn-primary:hover {
    background-color: #252a7a;
}

/* Clients Grid */
.clients-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 20px;
    padding: 30px;
}

.client-card {
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    gap: 15px;
    transition: all 0.2s ease;
    position: relative;
}

.client-card:hover {
    border-color: #30369d;
    box-shadow: 0 4px 12px rgba(48, 54, 157, 0.1);
}

.client-avatar {
    position: relative;
    flex-shrink: 0;
}

.client-avatar img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e5e7eb;
}

.client-status {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
}

.client-status.online {
    background-color: #10b981;
}

.client-status.offline {
    background-color: #6b7280;
}

.client-status.away {
    background-color: #f59e0b;
}

.client-info {
    flex: 1;
    min-width: 0;
}

.client-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.client-name {
    font-size: 1rem;
    font-weight: 600;
    color: #1a202c;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.client-id {
    font-size: 0.8rem;
    color: #6b7280;
    background: #e5e7eb;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 500;
}

.client-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.client-details p {
    margin: 0;
    font-size: 0.85rem;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 6px;
}

.client-details svg {
    flex-shrink: 0;
}

.client-rating {
    margin-top: 8px;
}

.rating-label {
    font-size: 0.85rem;
    color: #6b7280;
    display: block;
    margin-bottom: 4px;
}

.star-rating {
    display: flex;
    align-items: center;
    gap: 2px;
}

.star-rating span {
    transition: transform 0.2s ease;
}

.star-rating span:hover {
    transform: scale(1.2);
}

.client-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-self: flex-start;
}

.btn-action {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.btn-action.view {
    background-color: #3b82f6;
    color: white;
}

.btn-action.view:hover {
    background-color: #2563eb;
}

.btn-action.edit {
    background-color: #10b981;
    color: white;
}

.btn-action.edit:hover {
    background-color: #059669;
}

/* Pagination */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    padding: 20px 30px;
    border-top: 1px solid #e5e7eb;
}

.pagination-btn {
    padding: 8px 16px;
    border: 1px solid #d1d5db;
    background: white;
    color: #374151;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
    background-color: #30369d;
    color: white;
    border-color: #30369d;
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination-info {
    color: #6b7280;
    font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
    .dashboard-container {
        padding: 20px 15px;
    }

    .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .datetime-info {
        text-align: left;
        width: 100%;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .section-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .clients-grid {
        grid-template-columns: 1fr;
        padding: 20px;
    }

    .client-card {
        flex-direction: column;
        text-align: center;
    }

    .client-header {
        flex-direction: column;
        gap: 8px;
    }

    .client-actions {
        flex-direction: row;
        justify-content: center;
    }
}
</style>
