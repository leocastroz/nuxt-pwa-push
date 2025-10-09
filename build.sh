#!/bin/bash

# Script de build alternativo para Dokploy
set -e

echo "🚀 Iniciando build..."

# Verificar se estamos em produção
if [ "$NODE_ENV" = "production" ]; then
    echo "📦 Modo produção detectado"
    
    # Instalar dependências
    echo "📥 Instalando dependências..."
    npm ci --only=production
    
    # Build da aplicação
    echo "🔨 Fazendo build da aplicação..."
    npm run build
    
    echo "✅ Build concluído com sucesso!"
else
    echo "🔧 Modo desenvolvimento"
    npm install
    npm run build
fi 