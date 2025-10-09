<template>
  <div>
    <h1>Dashboard Cliente</h1>
    <p>Ultimos premios resgatados!</p>

    <!-- Carousel -->
    <div class="carousel">
      <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div class="carousel-item" v-for="(banner, index) in produtosCatalogo" :key="index">
          <img
            :src="banner.fileName ? `https://api.visaonews.org/storage/v1/object/public/banners/${'667d38d3-b1a8-44b2-b959-6ce45a580173'}/${banner.fileName}` : ''"
            alt="Imagem do Produto">
        </div>
      </div>
      <div v-if="produtosCatalogo.length > 1">
        <button class="carousel-btn prev" @click="prevSlide">‹</button>
        <button class="carousel-btn next" @click="nextSlide">›</button>
      </div>
    </div>


    <div class="info-section">
      <!-- <img src="../../assets/images/menina.png" alt="Menina" width="200" /> -->
      <p>Como acumular pontos ?</p>
      <div class="buttons">
        <button @click="openVideo" class="conferir">
          <span class="material-icons">smart_display</span>
          Conferir video
        </button>
        <button @click="openDescription" class="description">
          <span class="material-icons">description</span>
          Descrições
        </button>
      </div>
    </div>


    <div v-if="videoinfo" class="video-container">
      <button @click="videoinfo = false" class="close-button">X</button>
      <!-- <video src="../../public/videofarmacia.mp4" controls width="600" style="width: 80%;border-radius: 30px;"></video> -->
    </div>


    <div v-if="descriptioninfo" class="video-container">
      <button @click="descriptioninfo = false" class="close-button">X</button>

      <div class="description-content">
        <h2>Como acumular pontos ?</h2>
        <p>Para cada R$ 1,00 gasto em compras na farmácia, você acumula 1 ponto no seu cartão fidelidade. Além disso,
          você pode ganhar pontos extras ao participar de promoções especiais e eventos exclusivos.</p>
        <h3>Benefícios do Programa de Fidelidade:</h3>
        <ul>
          <li>Descontos exclusivos em produtos selecionados.</li>
          <li>Acesso antecipado a promoções e lançamentos.</li>
          <li>Ofertas personalizadas com base nas suas preferências de compra.</li>
          <li>Possibilidade de resgatar pontos por produtos ou serviços na farmácia.</li>
        </ul>
        <p>Não perca a oportunidade de economizar e aproveitar todos os benefícios do nosso programa de fidelidade.
          Comece a acumular pontos hoje mesmo!</p>
      </div>
    </div>

  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  layout: 'dashcliente'
});
import { ref, onMounted, onUnmounted } from 'vue';
import { createClient } from "@supabase/supabase-js";

const supaStore = useSupabaseClient();
const SUPABASE_URL = supaStore.supabaseUrl;
const SUPABASE_KEY = supaStore.supabaseKey;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const produtosCatalogo = ref([]);
const videoinfo = ref(false);
const descriptioninfo = ref(false);



const openVideo = () => {
  videoinfo.value = true;
  console.log('Video opened:', videoinfo.value);
}

const openDescription = () => {
  descriptioninfo.value = true;
  console.log('Description opened:', descriptioninfo.value);
}

const currentSlide = ref(0);

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % produtosCatalogo.value.length;
};

const prevSlide = () => {
  currentSlide.value =
    (currentSlide.value - 1 + produtosCatalogo.value.length) % produtosCatalogo.value.length;
};


let intervalId;


onMounted(() => {
  
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style scoped>
.carousel {
  position: relative;
  overflow: hidden;
  width: 100%;
  margin: auto;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-item {
  min-width: 100%;
  box-sizing: border-box;
}

.carousel-item img {
  width: 100%;
  display: block;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 10;
}

.carousel-btn.prev {
  left: 10px;
}

.carousel-btn.next {
  right: 10px;
}


.video-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001 !important;
  background-color: #17171799;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}


.info-section {
  text-align: center;
  margin-top: 20px;
}

.info-section img {
  mask-image: linear-gradient(to top, transparent 1%, black 20%);
}

.info-section p {
  font-size: 24px;
  color: #30369d;
  font-weight: 700;
}


.info-section .buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.info-section .buttons .conferir {
  background: red;
  display: flex;
  align-items: center;
  color: white;
  border: none;
  padding: 10px 20px;
  gap: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.info-section .buttons .description {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #30369d;
  padding: 10px 20px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #fff;
  color: #ff0000;
  border: none;
  padding: 10px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.description-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  max-height: 80%;
  overflow-y: auto;
  margin: 20px;
}
</style>