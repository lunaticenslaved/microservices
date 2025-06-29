process.env.APP_ENV = 'test';

process.env.DATABASE_URL = 'test'; // Will be set in testcontainers
process.env.TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE = '/var/run/docker.sock';
