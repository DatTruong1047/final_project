FROM node:23

# Đặt thư mục làm việc trong container
WORKDIR /src

# Cài đặt gói cần thiết cho môi trường
RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Sao chép và cài đặt dependencies trước (giúp cache tốt hơn)
COPY package*.json ./
RUN npm install --force

# Sao chép toàn bộ mã nguồn còn lại
COPY . .

# Mở cổng ứng dụng
EXPOSE 3000

# Lệnh chạy ứng dụng
CMD ["npm", "run", "dev"]
