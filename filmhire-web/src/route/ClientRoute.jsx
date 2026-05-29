import RoleRoute from "./RoleRoute";

function ClientRoute({ children }) {
  return <RoleRoute allowedRole="client">{children}</RoleRoute>;
}

export default ClientRoute;
