import { useSelector } from "react-redux";

function App() {

  const auth = useSelector((state) => state.auth);

  console.log(auth);

  return (
    <div>
      FilmHire
    </div>
  );
}

export default App;