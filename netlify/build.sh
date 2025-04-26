#!/bin/bash

# Instala as dependências
npm install

# Executa o build
npm run build

# Garante que o arquivo _redirects está presente
echo "/* /index.html 200" > dist/_redirects

# Garante que o arquivo 404.html está presente
cp dist/index.html dist/404.html 