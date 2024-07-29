# AppNavigator

Este projeto é um aplicativo de navegação em React Native usando o React Navigation. Ele contém várias páginas, incluindo uma página de login, uma página de câmera, uma página de mapa, uma página de marcador de imagem e uma página de chat.

## Estrutura do Projeto

- **Páginas**:
  - `LoginPage`: Página de login.
  - `CamPage`: Página de câmera.
  - `MapPage`: Página de mapa, com suporte para receber uma imagem capturada.
  - `MarkerPage`: Página de marcador de imagem.
  - `ChatPage`: Página de chat.

## Funcionalidades

- **Navegação entre Páginas**: Utiliza o React Navigation para navegação entre diferentes páginas do aplicativo.
- **Parâmetros Iniciais**: Passa parâmetros iniciais para algumas páginas (por exemplo, `capturedImage` para `MapPage`).
- **Configuração de Cabeçalho**: Esconde ou mostra o cabeçalho da navegação dependendo da página.

## Tecnologias Utilizadas

- **React Native**: Framework principal para construção do aplicativo.
- **React Navigation**: Biblioteca de navegação para aplicativos React Native.

## Pré-requisitos

- Node.js
- npm ou yarn
- Expo CLI (opcional, se estiver usando Expo)

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
