<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- <div class="logo-container">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-J2M4IIsPAPbrwxntzNvO8BZKVArlAU.png"
          alt="Drogaria Popular do Pará" class="logo">
      </div> -->

      <!-- Formulário de Login -->
      <form @submit.prevent="handleRegister" class="auth-form">
        <h2>Cadastro</h2>
        <div class="form-group">
          <label for="login-email">Seu nome</label>
          <input id="login-email" type="text" v-model="form.nome" placeholder="Seu nome" required>
        </div>
        <div class="form-group">
          <label for="login-email">Seu e-mail</label>
          <input id="login-email" type="email" v-model="form.email" placeholder="Seu email" required>
        </div>
        <div class="form-group">
          <label for="register-cpf">Seu CPF</label>
          <input id="register-cpf" type="text" v-model="cpf" placeholder="000.000.000-00" v-maska="'###.###.###-##'"
            maxlength="14" required :disabled="loading">
        </div>
        <div class="form-group">
          <label for="login-password">Sua senha</label>
          <input id="login-password" type="password" v-model="form.password" placeholder="Sua senha" required>
        </div>
        <button type="submit" class="btn-primary">
          {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
        </button>
        <pre style="color: red;">{{ message }}</pre>
        <pre style="color: red;">{{ token }}</pre>
      </form>

      <!-- Formulário de Cadastro -->
      <form v-if="false" @submit.prevent="loginCliente" class="auth-form">
        <h2>Login como cliente</h2>

        <div class="form-group">
          <label for="register-cpf">CPF</label>
          <input id="register-cpf" type="text" v-model="cpf" inputmode="numeric" pattern="[0-9]*" autocomplete="off"
            placeholder="000.000.000-00" v-maska="'###.###.###-##'" maxlength="14" required :disabled="loading">
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
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

<script setup>
import { vMaska } from "maska/vue"
import { ref, onMounted } from 'vue';
import { createClient } from "@supabase/supabase-js";
import { useRouter } from 'vue-router';

const supaStore = useSupabaseClient();
const SUPABASE_URL = supaStore.supabaseUrl;
const SUPABASE_KEY = supaStore.supabaseKey;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const loading = ref(false);
const router = useRouter();
const cpf = ref('');

const form = ref({
  nome: '',
  email: '',
  cpf: '',
  password: ''
})

const cleanCpf = (cpf) => cpf.replace(/\D/g, '');
const handleRegister = async () => {
  try {
    loading.value = true
    const cleanedCpf = cleanCpf(cpf.value)

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.value.email,
      password: form.value.password,
      options: {
        data: {
          nome: form.value.nome,
          cpf: cleanedCpf,
          role: 'admin',
        }
      }
    });
  } catch (error) {
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  console.log('Mounted: Register Page');
});
</script>
<!-- 
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
</style> -->