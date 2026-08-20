CREATE DATABASE IF NOT EXISTS chronos_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE chronos_db;

-- ============================================================
-- Tablas base (sin dependencias)
-- ============================================================

CREATE TABLE rol (
  id_rol       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre_rol   VARCHAR(30)  NOT NULL,
  PRIMARY KEY (id_rol),
  UNIQUE KEY nombre_rol (nombre_rol)
) ENGINE=InnoDB;

CREATE TABLE sede (
  id_sede    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre     VARCHAR(100) NOT NULL,
  ubicacion  VARCHAR(200) NOT NULL,
  telefono   VARCHAR(20)  DEFAULT NULL,
  PRIMARY KEY (id_sede)
) ENGINE=InnoDB;

CREATE TABLE estado_actividad (
  id_estado       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre_estado   VARCHAR(30)  NOT NULL,
  PRIMARY KEY (id_estado),
  UNIQUE KEY nombre_estado (nombre_estado)
) ENGINE=InnoDB;

CREATE TABLE turno (
  id_turno                 INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre_turno             VARCHAR(30)  NOT NULL,
  hora_inicio_programada   TIME         NOT NULL,
  hora_fin_programada      TIME         NOT NULL,
  horas_jornada            DECIMAL(4,2) NOT NULL,
  PRIMARY KEY (id_turno)
) ENGINE=InnoDB;

-- ============================================================
-- Tablas con dependencias
-- ============================================================

CREATE TABLE usuario (
  id_usuario       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre           VARCHAR(100) NOT NULL,
  correo           VARCHAR(150) NOT NULL,
  contrasena       VARCHAR(255) NOT NULL,
  estado_usuario   TINYINT(1)   NOT NULL DEFAULT 1,
  id_rol           INT UNSIGNED NOT NULL,
  id_sede          INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY correo (correo),
  CONSTRAINT fk_usuario_rol  FOREIGN KEY (id_rol)  REFERENCES rol (id_rol)      ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_usuario_sede FOREIGN KEY (id_sede) REFERENCES sede (id_sede)    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE actividad (
  id_actividad     INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  nombre           VARCHAR(100)  NOT NULL,
  descripcion      TEXT          NOT NULL,
  fecha_creacion   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_limite     DATE          NOT NULL,
  tiempo_estimado  DECIMAL(5,2)  DEFAULT NULL,
  id_estado        INT UNSIGNED  NOT NULL,
  id_usuario       INT UNSIGNED  NOT NULL,
  id_sede          INT UNSIGNED  NOT NULL,
  PRIMARY KEY (id_actividad),
  CONSTRAINT fk_actividad_estado  FOREIGN KEY (id_estado)  REFERENCES estado_actividad (id_estado) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_actividad_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)         ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_actividad_sede    FOREIGN KEY (id_sede)    REFERENCES sede (id_sede)               ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE registro_hora (
  id_registro   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  fecha         DATE         NOT NULL,
  hora_entrada  TIME         NOT NULL,
  hora_salida   TIME         DEFAULT NULL,
  total_horas   DECIMAL(5,2) DEFAULT NULL,
  id_estado     INT UNSIGNED NOT NULL,
  id_usuario    INT UNSIGNED NOT NULL,
  id_turno      INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_registro),
  CONSTRAINT fk_registro_estado   FOREIGN KEY (id_estado)  REFERENCES estado_actividad (id_estado) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_registro_usuario  FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)         ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_registro_turno    FOREIGN KEY (id_turno)   REFERENCES turno (id_turno)             ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE aprobacion (
  id_aprobacion      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  fecha_aprobacion   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  observaciones      TEXT         DEFAULT NULL,
  nivel_aprobacion   TINYINT UNSIGNED NOT NULL,
  resultado          VARCHAR(20)  NOT NULL,
  id_registro        INT UNSIGNED NOT NULL,
  id_supervisor      INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_aprobacion),
  CONSTRAINT fk_aprobacion_registro    FOREIGN KEY (id_registro)   REFERENCES registro_hora (id_registro) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_aprobacion_supervisor  FOREIGN KEY (id_supervisor) REFERENCES usuario (id_usuario)        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE historial (
  id_historial   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  accion         VARCHAR(150) NOT NULL,
  fecha          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_usuario     INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_historial),
  CONSTRAINT fk_historial_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE reporte (
  id_reporte          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  tipo                VARCHAR(50)  NOT NULL,
  fecha_generacion    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_usuario          INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_reporte),
  CONSTRAINT fk_reporte_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================================
-- Vistas
-- ============================================================

CREATE OR REPLACE VIEW vw_actividad_empleado AS
SELECT id_actividad, nombre, descripcion, fecha_limite, id_estado
FROM actividad;

CREATE OR REPLACE VIEW vw_perfil_usuario AS
SELECT id_usuario, nombre, correo
FROM usuario;

CREATE OR REPLACE VIEW vw_usuarios_supervisor AS
SELECT id_usuario, nombre, correo, estado_usuario, id_sede
FROM usuario;
