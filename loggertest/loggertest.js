import winston from "winston";

// Definir sistema de niveles
const levels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5
};

// Configuración para logger de desarrollo
const developmentLogger = winston.createLogger({
  levels,
  transports: [
    new winston.transports.Console({
      level: 'fatal'
    })
  ]
});

// Configuración para logger de producción
const productionLogger = winston.createLogger({
  levels,
  transports: [
    new winston.transports.File({
      filename: 'errors.log',
      level: 'error'
    })
  ]
});

// Exporta el logger correspondiente al entorno
const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger;
export default logger;

