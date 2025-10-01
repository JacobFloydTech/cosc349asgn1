# Assignment 1

## ⚙️ Structure:

This project is built using 3 Vagrant virtual machines, managed by the root Vagrant file, and relies on the 3 shell scripts to properly configure them

### 🕸️ Website:

The frontend VM is built mainly using React, an extremely popular frontend framework for UIs, and is run using Vite, which runs as a server and allows for hosting as well as plugins such as tailwindcss, a css library that involves combining CSS directly into the JSX.

### ⚡ API:

Runs using Express, a popular light-weight and reliable JS framework for small, centralized web services. This is the program that handles requests to the database, signing in (using jsonwebtoken module), and generation of the summary using Gemini.

### 🗄️ Database :

The final Vagrant machine runs a mySQL database, which contains two tables: User and Website, where there is a FK relationship of User being able to be tied to many Websites.

### How to run:

Aftering cloning the repo to your local machine, move to the root folder of the project (Where the Vagrant file is) and run the command 'vagrant up'. This command may take a while, as both the frontend and API vm require dependencies such as JS and other modules, and Chromium for puppeteer. This project requires both for the computer to be capable of virtualization, and have both VirtualBox & Vagrant installed.

# Assignment 2

Here, two of the VM's become obselete, as they have been recreated in the cloud. The databaseVM has been converted to AWS RDS and MySQL, and all of the endpoints of the API have been split out into seperate Lambda functions, where the each of the files in the folder awsLambdaFunctions represents the index.mjs file of each function. Note in the report I go into a lot more detail about how to set up these.
