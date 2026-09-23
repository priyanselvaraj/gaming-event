package com.gamingevent.platform.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url}")
    private String rawUrl;

    @Value("${spring.datasource.username:}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Value("${spring.datasource.driver-class-name:com.mysql.cj.jdbc.Driver}")
    private String driverClassName;

    @Bean
    @Primary
    public DataSource dataSource() {
        String jdbcUrl = rawUrl != null ? rawUrl.trim() : "";
        String user = username;
        String pass = password;

        // If user pasted Aiven's raw Service URI (starts with mysql://)
        if (jdbcUrl.startsWith("mysql://")) {
            try {
                URI uri = new URI(jdbcUrl);
                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    user = parts[0];
                    pass = parts[1];
                }
                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 3306;
                String path = uri.getPath() != null && !uri.getPath().isEmpty() ? uri.getPath() : "/defaultdb";
                String query = uri.getQuery();
                if (query != null) {
                    query = query.replace("ssl-mode=", "sslMode=");
                    if (!query.contains("allowPublicKeyRetrieval")) {
                        query += "&allowPublicKeyRetrieval=true";
                    }
                } else {
                    query = "sslMode=REQUIRED&allowPublicKeyRetrieval=true";
                }
                jdbcUrl = "jdbc:mysql://" + host + ":" + port + path + "?" + query;
            } catch (Exception e) {
                jdbcUrl = "jdbc:" + jdbcUrl.replace("ssl-mode=", "sslMode=");
            }
        }

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        if (user != null && !user.isBlank()) {
            config.setUsername(user);
        }
        if (pass != null && !pass.isBlank()) {
            config.setPassword(pass);
        }
        config.setDriverClassName(driverClassName);
        return new HikariDataSource(config);
    }
}
