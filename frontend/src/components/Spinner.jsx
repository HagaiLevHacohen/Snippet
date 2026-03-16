export default function Spinner({ size = 8, color = "white" }) {
  return (
    <div
      className={`w-${size} h-${size} border-4 border-${color}-400 border-t-transparent rounded-full animate-spin`}
    ></div>
  );
}