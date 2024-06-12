import globalStyle from "./globalStyle.module.css";
import Map from "./components/Map";

function App() {

  return (
    <div className={globalStyle.mapContainerWrapper}>
      <Map /> 
    </div>
  )
}

export default App;
