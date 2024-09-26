import HashLoader from "react-spinners/GridLoader";
const Loading = () =>
{
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100vw",
      height: "100vh",
    }}>
      <HashLoader color="#20bf6b" />
    </div>
  )
}

export default Loading