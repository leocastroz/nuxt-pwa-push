<script setup>
import { vMaska } from "maska/vue"
import { ref } from 'vue'
// import { useSupabaseClient } from '@supabase/auth-helpers-vue2'
import { useRouter } from 'vue-router';

const supabase = useSupabaseClient()
const router = useRouter();
const loading = ref(false);
const numeroTelefone = ref('');
const changeModal = ref('login'); // 'login', 'register', 'forget'
const showPassword = ref(false);
const cleanNumero = (numeroTelefone) => numeroTelefone.replace(/\D/g, '');
const loginForm = ref({
  email: '',
  password: ''
})


const handleChange = async (event) => {
    changeModal.value = event
}

const handleLogin = async () => {
  loading.value = true;
  const cleanedNumero = cleanNumero(numeroTelefone.value)
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanedNumero + '@gmail.com',
      password: loginForm.value.password,
    });
    if (error) throw error;
    const role = data.user?.user_metadata?.role
    router.push(role === 'admin' ? '/dashboard' : '/cliente');
  } catch (error) {
    console.error('Login error:', error);
    useToastify("Dados incorretos!", {
      autoClose: 2000,
      theme: "light",
      type: "error",
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
  } finally {
    loading.value = false;
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
}
</script>

<template>
  <div class="login-container">
    <div class="login-content">
      <div class="brand-section">
        <img class="logo-circle" src="../../public/icons/icon-96x96.png" width="50">
        <h1 class="brand-title">To De Carona</h1>
        <p class="brand-subtitle">Seu trajeto com conforto e segurança</p>
      </div>

      <form v-if="changeModal === 'login'" @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="phone-number" class="form-label">Número de telefone</label>
          <div class="input-wrapper">
            <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 3C2 2.44772 2.44772 2 3 2H5.15287C5.64171 2 6.0589 2.35341 6.13927 2.8356L6.87858 7.27147C6.95075 7.70451 6.73206 8.13397 6.3394 8.3303L4.79126 9.10437C5.90756 11.8783 8.12168 14.0924 10.8956 15.2087L11.6697 13.6606C11.866 13.2679 12.2955 13.0492 12.7285 13.1214L17.1644 13.8607C17.6466 13.9411 18 14.3583 18 14.8471V17C18 17.5523 17.5523 18 17 18H15C7.8203 18 2 12.1797 2 5V3Z" fill="currentColor"/>
            </svg>
            <input 
              id="phone-number" 
              type="tel" 
              v-model="numeroTelefone" 
              placeholder="(94) 9 9999-9999" 
              v-maska="'(##) # ####-####'"
              maxlength="16"
              autocomplete="tel"
              class="form-input"
              required
            >
          </div>
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">Senha</label>
          <div class="input-wrapper">
            <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 9V7C5 4.23858 7.23858 2 10 2C12.7614 2 15 4.23858 15 7V9C16.1046 9 17 9.89543 17 11V16C17 17.1046 16.1046 18 15 18H5C3.89543 18 3 17.1046 3 16V11C3 9.89543 3.89543 9 5 9ZM13 7V9H7V7C7 5.34315 8.34315 4 10 4C11.6569 4 13 5.34315 13 7Z" fill="currentColor"/>
            </svg>
            <input 
              id="password" 
              :type="showPassword ? 'text' : 'password'" 
              v-model="loginForm.password" 
              placeholder="Digite sua senha" 
              autocomplete="current-password"
              class="form-input"
              required
            >
            <button 
              type="button" 
              class="password-toggle"
              @click="togglePasswordVisibility"
              aria-label="Mostrar senha"
            >
              <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4C5 4 1.73 7.11 1 10C1.73 12.89 5 16 10 16C15 16 18.27 12.89 19 10C18.27 7.11 15 4 10 4ZM10 14C7.79 14 6 12.21 6 10C6 7.79 7.79 6 10 6C12.21 6 14 7.79 14 10C14 12.21 12.21 14 10 14ZM10 8C8.9 8 8 8.9 8 10C8 11.1 8.9 12 10 12C11.1 12 12 11.1 12 10C12 8.9 11.1 8 10 8Z" fill="currentColor"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 2.5L17.5 17.5M9.363 5.365C9.568 5.338 9.782 5.323 10 5.323C14.418 5.323 17.618 8.177 18.364 10C18.126 10.698 17.782 11.345 17.345 11.927M6.636 6.636C4.582 7.891 3.073 9.727 2.636 10C3.382 11.823 6.582 14.677 11 14.677C12.236 14.677 13.382 14.427 14.364 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div style="display: flex;align-items: center;justify-content: space-between;">
          <button type="button" class="forgot-password" @click="handleChange('forget')">
            Esqueceu sua senha?
          </button>

          <button type="button" class="forgot-password" @click="handleChange('register')">
            Cadastrar agora &#10095;
          </button>
        </div>
       
        
        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="!loading">Entrar &#10095;</span>
          <span v-else class="loading-spinner">
            <svg class="spinner" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="50.265" stroke-dashoffset="12.566"/>
            </svg>
            Entrando...
          </span>
        </button>
      </form>


      <form v-if="changeModal === 'register'" @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="phone-number" class="form-label">Informe o número para resgaste</label>
          <div class="input-wrapper">
            <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 3C2 2.44772 2.44772 2 3 2H5.15287C5.64171 2 6.0589 2.35341 6.13927 2.8356L6.87858 7.27147C6.95075 7.70451 6.73206 8.13397 6.3394 8.3303L4.79126 9.10437C5.90756 11.8783 8.12168 14.0924 10.8956 15.2087L11.6697 13.6606C11.866 13.2679 12.2955 13.0492 12.7285 13.1214L17.1644 13.8607C17.6466 13.9411 18 14.3583 18 14.8471V17C18 17.5523 17.5523 18 17 18H15C7.8203 18 2 12.1797 2 5V3Z" fill="currentColor"/>
            </svg>
            <input 
              id="phone-number" 
              type="tel" 
              v-model="numeroTelefone" 
              placeholder="(94) 9 9999-9999" 
              v-maska="'(##) # ####-####'"
              maxlength="16"
              autocomplete="tel"
              class="form-input"
              required
            >
          </div>
        </div>

        <button type="button" class="forgot-password" @click="handleChange('login')">
          &#10094; Realizar login
        </button>
        
        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="!loading">Cadastrar &#10095;</span>
          <span v-else class="loading-spinner">
            <svg class="spinner" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="50.265" stroke-dashoffset="12.566"/>
            </svg>
            Enviando...
          </span>
        </button>
      </form>

      <form v-if="changeModal === 'forget'" @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="phone-number" class="form-label">Informe o número para resgaste</label>
          <div class="input-wrapper">
            <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 3C2 2.44772 2.44772 2 3 2H5.15287C5.64171 2 6.0589 2.35341 6.13927 2.8356L6.87858 7.27147C6.95075 7.70451 6.73206 8.13397 6.3394 8.3303L4.79126 9.10437C5.90756 11.8783 8.12168 14.0924 10.8956 15.2087L11.6697 13.6606C11.866 13.2679 12.2955 13.0492 12.7285 13.1214L17.1644 13.8607C17.6466 13.9411 18 14.3583 18 14.8471V17C18 17.5523 17.5523 18 17 18H15C7.8203 18 2 12.1797 2 5V3Z" fill="currentColor"/>
            </svg>
            <input 
              id="phone-number" 
              type="tel" 
              v-model="numeroTelefone" 
              placeholder="(94) 9 9999-9999" 
              v-maska="'(##) # ####-####'"
              maxlength="16"
              autocomplete="tel"
              class="form-input"
              required
            >
          </div>
        </div>

        <button type="button" class="forgot-password" @click="handleChange('login')">
          &#10094; Realizar login
        </button>
        
        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="!loading">Restaurar &#10095;</span>
          <span v-else class="loading-spinner">
            <svg class="spinner" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="50.265" stroke-dashoffset="12.566"/>
            </svg>
            Enviando...
          </span>
        </button>
      </form>
        

        
      <!-- <div class="footer-section">
        <p class="footer-text">
          Não tem uma conta? 
          <button type="button" class="link-button">Cadastre-se</button>
        </p>
      </div> -->
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

.login-container {
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  background: linear-gradient(180deg, #49DEFF 0%, #0C4F65 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: env(safe-area-inset-top, 20px) env(safe-area-inset-right, 20px) env(safe-area-inset-bottom, 20px) env(safe-area-inset-left, 20px);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
}

.login-content {
  width: 100%;
  max-width: 440px;
  padding: 32px 24px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.brand-section {
  text-align: center;
  margin-bottom: 20px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.brand-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.brand-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  font-weight: 400;
}

/* Form */
.login-form {
  background: white;
  border-radius: 24px;
  padding: 32px 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #0C4F65;
  margin-bottom: 8px;
  letter-spacing: -0.2px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #9ca3af;
  pointer-events: none;
  z-index: 1;
}

.form-input {
  width: 100%;
  height: 52px;
  padding: 0 16px 0 48px;
  font-size: 16px;
  color: #1a1a1a;
  background: #f7f8fa;
  border: 2px solid transparent;
  border-radius: 14px;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-input:focus {
  background: white;
  border-color: #0C4F65;
  /* box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1); */
}

.password-toggle {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  min-width: 44px;
  min-height: 44px;
}

.password-toggle:hover {
  color: #0C4F65;
}

.password-toggle:active {
  transform: scale(0.95);
}

.forgot-password {
  background: none;
  border: none;
  color: #0C4F65;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 0;
  cursor: pointer;
  margin-bottom: 24px;
  transition: opacity 0.2s ease;
  font-family: inherit;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.forgot-password:hover {
  opacity: 0.8;
}

.forgot-password:active {
  opacity: 0.6;
}

.btn-primary {
  width: 100%;
  height: 56px;
  min-height: 56px;
  background: linear-gradient(180deg, #49DEFF 0%, #0C4F65 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  letter-spacing: -0.2px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Footer */
.footer-section {
  text-align: center;
  margin-top: 32px;
}

.footer-text {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.link-button {
  background: none;
  border: none;
  color: white;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 15px;
  text-decoration: underline;
  transition: opacity 0.2s ease;
  font-family: inherit;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}

.link-button:hover {
  opacity: 0.8;
}

.link-button:active {
  opacity: 0.6;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .login-content {
    padding: 24px 16px;
  }

  .login-form {
    padding: 24px 20px;
  }

  .brand-title {
    font-size: 28px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .login-container {
    background: linear-gradient(180deg, #49DEFF 0%, #0C4F65 100%);
  }
}
</style>