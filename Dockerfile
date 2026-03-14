# Build stage
FROM node:18 AS build
WORKDIR /app

# نسخ ملفات الـ package
COPY package*.json yarn.lock ./

# تثبيت الحزم باستخدام yarn
RUN yarn install --frozen-lockfile

# نسخ باقي الملفات
COPY . .

# تنفيذ build بالأمر الصحيح
RUN yarn build --configuration production

# Debug: عرض محتويات dist
RUN ls -la /app/dist/

# Production stage
FROM nginx:alpine

# نسخ ملفات الـ build إلى nginx
COPY --from=build /app/dist/Acadmy/ /usr/share/nginx/html

# Debug: التأكد من الملفات داخل nginx
RUN ls -la /usr/share/nginx/html

# نسخ ملف إعداد nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
