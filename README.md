Project

## ⚙️ Structure:

This project is built using 3 Vagrant virtual machines, managed by the root Vagrant file, and relies on the 3 shell scripts to properly configure them

### 🕸️ Website:

The frontend VM is built mainly using React, an extremely popular frontend framework for UIs, and is run using Vite, which runs as a server and allows for hosting as well as plugins such as tailwindcss, a css library that involves combining CSS directly into the JSX.

### ⚡ API:

Runs using Express, a popular light-weight and reliable JS framework for small, centralized web services. This is the program that handles requests to the database, signing in (using jsonwebtoken module), and generation of the summary using Gemini.

### 🗄️ Database :

The final Vagrant machine runs a mySQL database, which contains two tables: User and Website, where there is a FK relationship of User being able to be tied to many Websites.
