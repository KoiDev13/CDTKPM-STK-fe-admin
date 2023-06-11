FROM node:alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:alpine AS react-serve
COPY --from=build /app/build /app
RUN npm install -g serve
EXPOSE 80
CMD ["serve", "-s", "/app", "-l", "80"]
