<script setup>
import { vMaska } from "maska/vue"
import { ref } from 'vue'

// Usar o composable de autenticação
const { login, loginWithCpf, isPWA } = useAuth()

const loading = ref(false)
const error = ref('')
const cpf = ref('')

// Estado para controlar qual formulário está ativo
const isLoginForm = ref(true)

// Estados para os campos do formulário
const loginForm = ref({
  email: '',
  password: ''
})

// Função para alternar entre os formulários
const toggleForm = () => {
  isLoginForm.value = !isLoginForm.value
  error.value = ''
}

// Login padrão com email e senha
const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const { data, error: loginError } = await login(
      loginForm.value.email,
      loginForm.value.password
    )
    
    if (loginError) {
      error.value = loginError.message || 'Erro ao fazer login'
      return
    }
    
    if (data?.user) {
      console.log('✅ Login realizado com sucesso')
      
      // Mostrar mensagem especial para PWA
      if (isPWA.value) {
        console.log('📱 Sessão será mantida no PWA!')
      }
      
      await navigateTo('/dashboard')
    }
  } catch (err) {
    error.value = err.message || 'Erro inesperado ao fazer login'
  } finally {
    loading.value = false
  }
}

// Login com CPF
const loginCliente = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const { data, error: loginError } = await loginWithCpf(cpf.value)
    
    if (loginError) {
      error.value = loginError.message || 'CPF não encontrado ou inválido'
      return
    }
    
    if (data?.user) {
      console.log('✅ Login com CPF realizado com sucesso')
      
      // Mostrar mensagem especial para PWA
      if (isPWA.value) {
        console.log('📱 Sessão será mantida no PWA!')
      }
      
      await navigateTo('/cliente')
    }
  } catch (err) {
    error.value = err.message || 'Erro inesperado ao fazer login com CPF'
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