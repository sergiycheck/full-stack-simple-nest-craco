export const parseConnectionString = (connectionString: string) => {
  const url = new URL(connectionString);

  return {
    dialect: url.protocol.replace(':', ''),
    host: url.hostname,
    port: Number(url.port),
    username: url.username,
    password: url.password,
    database: url.pathname.replace('/', ''),
  };
};
