# Creating your .env file

In order to keep our credentials and keys secure, you need to make a .env file.

In the root backend folder, create a new file and name it .env

Structure your .env folder like so:

DEBUG=True  
DB_NAME=YOUR_DB_NAME  
DB_USER=YOUR_USER  
DB_USER_PASSWORD=YOUR_PASSWORD  
DB_HOST=YOUR_HOST  
DB_PORT=YOUR_PORT  
ACCESS_TOKEN=YOUR_ACCESS_TOKEN  
GOOGLE_TOKEN=YOUR_GOOGLE_TOKEN  

# Installing other libraries

django
mysqlclient
python-decouple
requests
django-cors-headers
selenium
beautifulsoup4
apscheduler

# Setting up a Google Account

To use the API, you must set up a google account and put in your card details. Set up an API key for use with the Geocoding API on https://developers.google.com.  
This API Key is YOUR_GOOGLE_TOKEN

# Running Database Schema

Database schemas are located in the folder 'database_schemas'. Run the latest schema (the one with the highest number)

# installing the requirements 

pip install -r requirements.txt
that should add all the relevant packages for the backend
npm i 
that should install all the correct modules for the frontend

# Getting data into the database

Run the routes /api/contractsdemo and /api/updatestations to get the stations and contracts into the database

# Scheduler

The scheduler will only work properly if you use the command 'python manage.py runserver --noreload'.  
Without the --noreload at the end, the scheduler will start twice, causing duplicates to be entered into the database.

# When doing migrations
First run "python manage.py makemigrations" (if there are any new migrations than have been created)
Then run "python manage.py migrate --fake scraping" 
Then run "python manage.py migrate --fake stations"
these commands tells django to ignore the 2 apps (when migrating) scraping and stations because these tables are created within the database script 
Then run "python manage.py migrate" then all tables should be present