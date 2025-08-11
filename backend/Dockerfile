FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

COPY docker-entrypoint.sh /entrypoint.sh

RUN sed -i 's/\r$//' /entrypoint.sh

ENTRYPOINT ["sh", "/entrypoint.sh"]