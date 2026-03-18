export default function Spinner({ size = 2, color = "white" }) {
  const dimension = `${size}rem`; // or `${size}px` if you prefer pixels
  const borderColor = color === "white" ? "border-white" : `border-${color}-400`;

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div
        className={`border-4 ${borderColor} border-t-transparent rounded-full animate-spin`}
        style={{ width: dimension, height: dimension }}
      ></div>
    </div>
  );
}