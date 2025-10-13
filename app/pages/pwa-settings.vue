<template>
  <div class="pwa-update-page">
    <div class="container">
      <header class="page-header">
        <h1>⚙️ Configurações do App</h1>
        <p>Gerencie as atualizações e informações do seu PWA</p>
      </header>

      <!-- Componente de Configurações -->
      <PwaSettings 
        :show-advanced="true"
        :version="appVersion"
      />

      <!-- Seção de Ajuda -->
      <div class="help-section">
        <h2>❓ Perguntas Frequentes</h2>
        
        <div class="faq-item">
          <h3>Como o app se atualiza?</h3>
          <p>
            O app verifica automaticamente por atualizações a cada minuto quando está aberto.
            Quando uma nova versão estiver disponível, você verá um banner na parte inferior da tela.
          </p>
        </div>

        <div class="faq-item">
          <h3>Preciso desinstalar e reinstalar?</h3>
          <p>
            <strong>Não!</strong> Quando uma atualização estiver disponível, basta clicar em 
            "Atualizar Agora" no banner. O app será atualizado automaticamente sem perder seus dados.
          </p>
        </div>

        <div class="faq-item">
          <h3>O que acontece quando clico em "Atualizar"?</h3>
          <p>
            O app fecha e reabre automaticamente com a nova versão instalada. Todo o processo
            leva apenas alguns segundos e seus dados permanecem salvos.
          </p>
        </div>

        <div class="faq-item">
          <h3>Posso usar o app sem atualizar?</h3>
          <p>
            Sim, você pode continuar usando a versão atual. Porém, recomendamos sempre 
            manter o app atualizado para ter acesso às últimas melhorias e correções de segurança.
          </p>
        </div>

        <div class="faq-item">
          <h3>O app funciona offline?</h3>
          <p>
            Sim! Após a instalação, o app funciona offline. Atualizações serão baixadas
            automaticamente quando você estiver conectado à internet.
          </p>
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="action-buttons">
        <button @click="clearCache" class="btn-secondary">
          🗑️ Limpar Cache
        </button>
        <button @click="goBack" class="btn-primary">
          ← Voltar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const appVersion = ref('1.0.0') // Você pode buscar isso de um arquivo de config

const clearCache = async () => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map(name => caches.delete(name)))
      
      useToastify('Cache limpo com sucesso! Recarregando...', {
        autoClose: 2000,
        type: 'success',
        position: ToastifyOption.POSITION.TOP_CENTER,
      })
      
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error('Erro ao limpar cache:', error)
      useToastify('Erro ao limpar cache', {
        autoClose: 2000,
        type: 'error',
        position: ToastifyOption.POSITION.TOP_CENTER,
      })
    }
  } else {
    useToastify('Cache Storage não suportado', {
      autoClose: 2000,
      type: 'warning',
      position: ToastifyOption.POSITION.TOP_CENTER,
    })
  }
}

const goBack = () => {
  navigateTo('/')
}
</script>
<!-- 
<style scoped>
.pwa-update-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
  padding: 40px 20px;
}

.page-header h1 {
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  font-weight: 700;
}

.page-header p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.help-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin: 30px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.help-section h2 {
  margin: 0 0 24px 0;
  color: #667eea;
  font-size: 1.5rem;
}

.faq-item {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #eee;
}

.faq-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.faq-item h3 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.faq-item p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.faq-item strong {
  color: #667eea;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  min-width: 200px;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: white;
  color: #667eea;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .page-header p {
    font-size: 1rem;
  }

  .help-section {
    padding: 20px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    min-width: auto;
  }
}
</style> -->
