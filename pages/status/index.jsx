import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);

  const responseBody = await response.json();
  return responseBody;
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-br");
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseInfo() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let databaseVersionText = "Carregando...";
  let databaseMaxConnectionsText = "Carregando...";
  let databaseOpenedConnectionsText = "Carregando...";

  if (!isLoading && data) {
    databaseVersionText = data.dependencies.database.version;
    databaseMaxConnectionsText = data.dependencies.database.max_connections;
    databaseOpenedConnectionsText =
      data.dependencies.database.opened_connections;
  }

  return (
    <div>
      Informações do Banco de Dados:
      <li>
        <ul>Versão: {databaseVersionText}</ul>
        <ul>Máximo de Conexões: {databaseMaxConnectionsText}</ul>
        <ul>Conexões Abertas: {databaseOpenedConnectionsText}</ul>
      </li>
    </div>
  );
}

export default function Status() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  console.log(isLoading);
  console.log(data);

  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseInfo />
    </>
  );
}
