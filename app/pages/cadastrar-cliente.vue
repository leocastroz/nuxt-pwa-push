<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="logo-container">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-J2M4IIsPAPbrwxntzNvO8BZKVArlAU.png" alt="Drogaria Popular do Pará" class="logo">
      </div>
      
      <!-- Formulário de Login -->
      <form @submit.prevent="handleRegister" class="auth-form">
        <h2>Cadastro</h2>
        <div class="form-group">
          <label for="login-email">Seu nome</label>
          <input 
            id="login-email" 
            type="text" 
            v-model="form.nome" 
            placeholder="Seu nome" 
            required
          >
        </div>
        <!-- <div class="form-group">
          <label for="login-email">Seu e-mail</label>
          <input 
            id="login-email" 
            type="email" 
            v-model="form.email" 
            placeholder="Seu email" 
            required
          >
        </div> -->
        <div class="form-group">
          <label for="register-cpf">Seu CPF</label>
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
        <div class="form-group">
            <label for="register-number">Seu numero</label>
            <input 
              id="register-number" 
              type="text" 
              v-model="numeroTelefone" 
              placeholder="(94) 9 9999-9999" 
              v-maska="'(##) # ####-####'"
              maxlength="16"
              autocomplete="off"
              required
            >
        </div>
        <div class="form-group">
          <label for="login-password">Sua senha</label>
          <input 
            id="login-password" 
            type="password" 
            v-model="form.password" 
            placeholder="Sua senha" 
            required
          >
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
          <input 
            id="register-cpf" 
            type="text" 
            v-model="cpf"
            inputmode="numeric"
            pattern="[0-9]*"
            autocomplete="off"
            placeholder="000.000.000-00"
            v-maska="'###.###.###-##'"
            maxlength="14"
            required
            :disabled="loading"
          >
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
import CryptoJS from 'crypto-js'
import { createClient } from "@supabase/supabase-js";
import { useRouter } from 'vue-router';

// const supabase = useSupabaseClient()
const supaStore = useSupabaseClient();
const SUPABASE_URL = supaStore.supabaseUrl;
const SUPABASE_KEY = supaStore.supabaseKey;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const secretKey = 'C3tech203010@'
const loading = ref(false);
const router = useRouter();
const cpf = ref('');
const numeroTelefone = ref('');
// const nome = ref('');
// const email = ref('');
const message = ref('');
const token = ref(router.currentRoute.value.query.token);
const token_id = ref(null);

const form_sorteio = ref({
  token: token,
  status: 'pendente',
});

const form_update_sorteio = ref({
  token: token,
  status: 'lido',
  user_data: {}
});

const form = ref({
  nome: '',
  email: '',
  cpf: '',
  password: ''
})

const encryptPassword = (password) => {
  return CryptoJS.AES.encrypt(password, secretKey).toString()
}

const decryptPassword = (encryptedPassword) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey)
  return bytes.toString(CryptoJS.enc.Utf8)
}

const cleanNumero = (numeroTelefone) => numeroTelefone.replace(/\D/g, '');

const cleanCpf = (cpf) => cpf.replace(/\D/g, '');

const handleRegister = async () => {
  try {
    loading.value = true
    // const cleanedCpf = cleanCpf(form.value.cpf)
    const cleanedCpf = cleanCpf(cpf.value)
    const cleanedNumero = cleanNumero(numeroTelefone.value)
    console.log("NUMERO LIMPO =>", cleanedNumero);
    const encryptedPassword = encryptPassword(form.value.password);


    // 1. Verifica na tabela "t_users" se o CPF já existe
    const { data: existingUser, error: queryError } = await supabase
      .from('t_users')
      .select('*')
      .eq('cpf', cleanedCpf)
      .single();

    // console.log("CPF pesquisado: " + existingUser);
    // console.log("Erro pesquisado: " + JSON.stringify(queryError));


    if (existingUser) {
      // alert("CPF já cadastrado: " + existingUser.cpf);
      // message.value = 'CPF ENCONTRADO ' + existingUser.cpf;
      // console.log('CPF ENCONTRADO: ' + existingUser.cpf);

      // console.log("TOKEN encontrado: " + existingUser.token);
     
      // const { data: record, error: queryError } = await useFetch('/api/token_user', { method: 'GET', params: { token: existingUser.token } });

      const { data: record, error: queryError } = await supabase
      .from('sorteio_qrcode')
      .select('*')
      .eq('token', existingUser.token)
      .single();

      console.log('TOKEN ENCONTRADO !!AAA===', record);
      let findToken = record;

      if (findToken) {
        console.log('FIND TOKEN ===', findToken);
        const { data: dinamo, error: queryError } = await supabase
          .from('sorteio_qrcode')
          .select('id')
          .eq('token', token.value)
          .single();
          
        console.log("DADOS DINAMO: ", dinamo.id);
        
        if (dinamo) {
          const { data, error } = await supabase.from('sorteio_qrcode').update({ id: dinamo.id, token: token.value, status: 'lido', user_data: findToken.user_data }).eq('token', token.value);
          console.log("Dados atualizados dinamo: ", data);
        }

        console.log("CAINDO AQUI !!!", findToken);
        return;
      } else {
        message.value = 'RECORD NÃO ENCONTRADO ' + JSON.stringify(queryError.value);
        return;
      }
      // console.log("Record encontrado: " + JSON.stringify(record.value.record?.id));
      // console.log("Error encontrado: " + queryError.value);


      return;
    } else {
      // alert("CPF não cadastrado: " + queryError.code);
      message.value = 'CPF não cadastrado ' + JSON.stringify(queryError);



      // 1. Primeiro cadastra no Auth do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        // email: form.value.email,
        email: cleanedNumero + '@gmail.com', // Usando o número de telefone como parte do email
        password: form.value.password,
        options: {
          data: {
            nome: form.value.nome,
            cpf: cleanedCpf,
            // pontos: 0,
            role: 'cliente',
            // token: token.value,
            numero: cleanedNumero
          }
        }
      });

      // Se houver erro no cadastro do usuário, exibe mensagem
      if (authError) {
        console.log('Erro ao cadastrar usuário:', authError.code);
        message.value = 'Este email já está cadastrado.';
        const { data: returnEmail, error: returnError } = await supabase
          .from('t_users')
          .select('*')
          .eq('email', form.value.email)
          .single();
        if (returnEmail.email) {
          const { data, error } = await supabase.from('sorteio_qrcode').update({ id: returnEmail.id, token: token.value, status: 'atualizado', email: returnEmail.email, user_data: returnEmail }).eq('email', returnEmail.email);

          if (error) {
            console.error("Erro ao atualizar dados no sorteio_qrcode:", error);
          } else {
            const { data: desktop, error: queryErrordest } = await supabase
              .from('sorteio_qrcode')
              .select('*')
              .eq('status', 'pendente')
              .eq('token', token.value)
              .single();

            if (desktop) {
              const { data, error } = await supabase.from('sorteio_qrcode').delete().eq('id', desktop.id).eq('token', token.value);
            }
          }
        }
      }

      // Se o usuário foi cadastrado com sucesso, atualiza o token e status na tabela sorteio_qrcode
      if (authData) {
        const { data, error } = await supabase.from('t_users').insert([{
          user_id: authData.user?.id,
          nome: form.value.nome,
          email_auth: cleanedNumero + '@gmail.com',
          cpf: cleanedCpf,
          password: encryptedPassword,
        }])
      }
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
});
</script>

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