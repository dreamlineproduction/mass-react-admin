import { BounceLoader } from "react-spinners";

const Loading = () => (
  <div
    className="mx-auto py-5 position-absolute d-flex justify-content-center align-items-center w-100 h-100"
    style={{
      minHeight: "550px",
      height:"100%",
      zIndex: 9,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      top: 0,
      left: 0,
    }}
  >
    <div className="d-flex justify-content-center flex-column align-items-center">
      <BounceLoader size={40} color="#3b7ddd" />
      <p className="text-center">Loading...</p>
    </div>
  </div>
);

export default Loading;
