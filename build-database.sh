apt-get update -y
apt-get install -y mysql-server
sed -i "s/^bind-address.*/bind-address = 0.0.0.0/" /etc/mysql/mysql.conf.d/mysqld.cnf
systemctl restart mysql
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'rootpassword'; FLUSH PRIVILEGES;"
mysql -uroot -prootpassword -e "CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED WITH caching_sha2_password BY 'rootpassword'; \
                                GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION; \
                                FLUSH PRIVILEGES;
                                DROP DATABASE IF EXISTS COSC349;
                                CREATE DATABASE COSC349;
                                USE COSC349;
                                CREATE TABLE IF NOT EXISTS User (
                                  username VARCHAR(255) UNIQUE PRIMARY KEY,
                                  password VARCHAR(255)
                                );
                                CREATE TABLE IF NOT EXISTS Website (
                                  link VARCHAR(255) PRIMARY KEY,
                                  name VARCHAR(255),
                                  summary TEXT,
                                  uploader VARCHAR(255),
                                  favicon VARCHAR(255),
                                  FOREIGN KEY (uploader) REFERENCES User(username)
                                );
                                INSERT INTO User VALUES ('test', ('\$2b\$10\$Vd3VA8Ik2x4fnXSZ0zF5MO7/9JVZcC/w7y3fSEA7RTKqdsI3zJiFm'));
                                INSERT INTO Website VALUES ('https://aws.amazon.com', 'Cloud Computing Services - Amazon Web Services (AWS)', 'The website is about Amazon Web Services (AWS), which provides a comprehensive and broadly adopted cloud platform that offers a wide range of cloud capabilities, including AI, data services, compute instances, storage, databases, and analytics, all designed to help organizations innovate faster, lower costs, and scale more efficiently. AWS aims to cater to various industries and organization types, providing solutions and services for developers, enterprises, and various business applications, while also providing training, resources, and a global infrastructure to support customers. The website also emphasizes its focus on security, community, and innovation to accelerate transformation.', 'test', 'https://a0.awsstatic.com/libra-css/images/site/fav/favicon.ico');
                                INSERT INTO Website VALUES ('https://nodejs.org/', 'Node.js — Run JavaScript Everywhere','Node.js® is a free, open-source, cross-platform JavaScript runtime environment that allows developers to build a variety of applications including servers, web apps, command-line tools, and scripts. The platform offers resources for learning and provides code examples such as creating an HTTP server, writing tests, reading and hashing files, utilizing streams pipelines, and working with threads. Node.js offers both the latest LTS and latest release versions for download.','test','https://nodejs.org/static/images/favicons/favicon.png');
                                INSERT INTO Website VALUES ('https://www.mozillafoundation.org/en/', 'Welcome to Mozilla Foundation - Mozilla Foundation','Mozilla is a non-profit organization dedicated to building a better internet by making good tech the norm, fostering collaboration, and championing innovative ideas. They focus on empowering individuals through tech education, advocating for a more open and accessible internet, and mobilizing a global community to shape the future of technology for the public good, as evidenced by their Mozilla Festival and community initiatives. Mozilla also seeks donations and newsletter sign-ups to further their mission.','test','https://assets.mofoprod.net/static/foundation_cms/_images/favicon.bb5d7d637881.png');
                                
                                "