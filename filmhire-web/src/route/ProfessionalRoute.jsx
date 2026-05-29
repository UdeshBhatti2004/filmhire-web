import RoleRoute from "./RoleRoute";

function ProfessionalRoute({ children }) {
  return <RoleRoute allowedRole="professional">{children}</RoleRoute>;
}

export default ProfessionalRoute;
