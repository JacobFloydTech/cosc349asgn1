apt-get update -y
apt-get install -y mysql-server
sed -i "s/^bind-address.*/bind-address = 0.0.0.0/" /etc/mysql/mysql.conf.d/mysqld.cnf
systemctl restart mysql
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'rootpassword'; FLUSH PRIVILEGES;"
mysql -uroot -prootpassword -e "CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'rootpassword'; \
                                GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION; \
                                FLUSH PRIVILEGES;
                                CREATE DATABASE IF NOT EXISTS COSC349;
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
                                );"