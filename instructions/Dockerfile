# Stage 1: Build HTML with Pandoc
FROM pandoc/core:latest AS builder

WORKDIR /work

# Copia o README.md e o template para o container builder
COPY ./README.md .
COPY ./instructions/template.html .

# Gera o index.html a partir do README.md usando o template
RUN pandoc README.md -o index.html --template=template.html

# Stage 2: Nginx para servir o HTML
FROM nginx:alpine

# Copia o HTML gerado e a imagem para o nginx
COPY ./assets/ /usr/share/nginx/html/assets/
COPY --from=builder /work/index.html /usr/share/nginx/html/index.html
