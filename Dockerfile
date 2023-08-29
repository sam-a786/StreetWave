# Use an official Python runtime as a parent image
FROM alpine:3.17

# Expose port 8000 for the Django application
EXPOSE 8000
EXPOSE 3306

# https://stackoverflow.com/questions/62663167/dockerizing-react-in-production-mode-fatal-error-ineffective-mark-compacts-nea
ENV GENERATE_SOURCEMAP=false

RUN apk update
# Install necessary packages
RUN apk add --no-cache python3 py3-pip sudo openrc mariadb mariadb-client mariadb-connector-c-dev python3-dev

WORKDIR /app

# Install the build-base library which some python clients use for C code
RUN apk add build-base

# Copy the requirements file into the container at /app
COPY requirements.txt /app/

# Install any needed packages specified in requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container at /app
COPY . .

# Install Node.js and npm
RUN apk add --update nodejs npm

# Change working directory to frontend
WORKDIR /app/frontend

# Install frontend dependencies
RUN npm install

# Build the frontend
RUN npm run buildlocal

# Change working directory back to /app
WORKDIR /app

# Copy the database schema file into the container at /app
COPY database_schemas/streetwave_schema.sql /app/

# Environment variables for
RUN echo "DEBUG=True" >> /app/backend/.env && \
    echo "DB_NAME=streetwave_db" >> /app/backend/.env && \
    echo "DB_USER=root" >> /app/backend/.env && \
    echo "DB_USER_PASSWORD=" >> /app/backend/.env && \
    echo "DB_HOST=localhost" >> /app/backend/.env && \
    echo "DB_PORT=3306" >> /app/backend/.env

RUN mkdir -p /var/run/mysql && \
    chown -R mysql:root /var/lib/mysql && \
    chmod 777 -R /var/lib/mysql && \
    mkdir -p /var/run/mysqld && \
    chown -R mysql:root /var/run/mysqld && \
    chmod 777 -R /var/run/mysqld

RUN rc-update add mariadb default

RUN /usr/bin/mysql_install_db --user=mysql --datadir=/var/lib/mysql

CMD ["/bin/sh", "-c", "/usr/bin/mysqld_safe --user=mysql --datadir=/var/lib/mysql & sleep 5 && mysql -u root < /app/streetwave_schema.sql && python backend/manage.py makemigrations && python backend/manage.py migrate --fake stations && python backend/manage.py migrate --fake scraping && python backend/manage.py migrate && python backend/manage.py runserver 0.0.0.0:8000"]
