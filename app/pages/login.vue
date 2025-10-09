<script setup>
import { vMaska } from "maska/vue"
// import CryptoJS from 'crypto-js'
import { ref } from 'vue'
import { createClient } from "@supabase/supabase-js";


const supaStore = useSupabaseClient();
const SUPABASE_URL = supaStore.supabaseUrl;
const SUPABASE_KEY = supaStore.supabaseKey;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const loading = ref(false);
const cpf = ref('');
const secretKey = 'C3tech203010@'


// const decryptPassword = (encryptedPassword) => {
//   const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey)
//   return bytes.toString(CryptoJS.enc.Utf8)
// }

const cleanCpf = (cpf) => cpf.replace(/\D/g, '');

// Estado para controlar qual formulário está ativo
const isLoginForm = ref(true);
// const entrarNow = ref(true);

// Estados para os campos do formulário
const loginForm = ref({
  email: '',
  password: ''
})

// Função para alternar entre os formulários
const toggleForm = () => {
  isLoginForm.value = !isLoginForm.value
}

// Funções para submeter os formulários
const handleLogin = async () => {
  loading.value = true;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginForm.value.email,
      password: loginForm.value.password,
    });
    if (error) throw error;
    navigateTo('/dashboard');
    console.log('Login successful:', data);
  } catch (error) {
    console.error('Login error:', error);
  } finally {
    loading.value = false;
  }
}

const loginCliente = async () => {
  try {
    loading.value = true
    const cleanedCpf = cleanCpf(cpf.value)
    
    // 1. Busca usuário pelo CPF
    const { data: userData, error: userError } = await supabase
      .from('users_sorteio_qrcode')
      .select('email, password')
      .eq('cpf', cleanedCpf)
      .single()

    if (userError) throw new Error('Erro ao buscar usuário')
    if (!userData) throw new Error('CPF não cadastrado')

    const encryptedPassword = userData.password
    const originalPassword = decryptPassword(encryptedPassword)
    console.log('Senha original:', originalPassword)
    // 2. Faz login automático com os dados do usuário
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: originalPassword
    });

    console.log('data aa', data)

    if (error) throw error

    navigateTo('/cliente');
    // testToastify();


  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

function testToastify() {
  useToastify("Login com sucesso !", {
    autoClose: 2000,
    position: ToastifyOption.POSITION.TOP_RIGHT,
  });
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="logo-container">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-J2M4IIsPAPbrwxntzNvO8BZKVArlAU.png" alt="Drogaria Popular do Pará" class="logo">
      </div>
      
      <!-- Formulário de Login -->
      <form v-if="isLoginForm" @submit.prevent="handleLogin" class="auth-form">
        <h2>Login</h2>
        
        <div class="form-group">
          <label for="login-email">Email</label>
          <input 
            id="login-email" 
            type="email" 
            v-model="loginForm.email" 
            placeholder="Seu email" 
            required
          >
        </div>
        
        <div class="form-group">
          <label for="login-password">Senha</label>
          <input 
            id="login-password" 
            type="password" 
            v-model="loginForm.password" 
            placeholder="Sua senha" 
            required
          >
        </div>
        
        <button type="submit" class="btn-primary">
          {{ loading ? 'Acessando...' : 'Acessar' }}
        </button>
        
        <p class="toggle-text">
          Login como cliente ? 
          <a href="#" @click.prevent="toggleForm">Acesso Cliente</a>
        </p>
      </form>
      
      <!-- Formulário de Cadastro -->
      <form v-else @submit.prevent="loginCliente" class="auth-form">
        <h2>Login como cliente</h2>
        
        <div class="form-group">
          <label for="register-cpf">CPF</label>
          <input 
            id="register-cpf" 
            type="text" 
            v-model="cpf" 
            placeholder="000.000.000-00"
            v-maska="'###.###.###-##'"
            maxlength="14"
            required
            :disabled="loading"
          >
        </div>
        
        <button type="submit" class="btn-primary">
          {{ loading ? 'Acessando...' : 'Acessar' }}
        </button>
        
        <p class="toggle-text">
          Realizar login padrão ? 
          <a href="#" @click.prevent="toggleForm">Acesso padrão</a>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 450px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 30px;
}

.logo-container {
  display: flex;
  justify-content: center;
}

.logo {
  max-width: 200px;
  height: auto;
}

.auth-form h2 {
  text-align: center;
  color: #003399;
  margin-bottom: 24px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #003399;
  outline: none;
}

.btn-primary {
  width: 100%;
  background-color: #e30613;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.btn-primary:hover {
  background-color: #c00;
}

.toggle-text {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.toggle-text a {
  color: #003399;
  text-decoration: none;
  font-weight: 500;
}

.toggle-text a:hover {
  text-decoration: underline;
}
</style>