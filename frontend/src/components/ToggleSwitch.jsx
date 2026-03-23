
function ToggleSwitch({ value, onChange, options = ["Users", "Posts"] }) {
  return (
    <div className="relative flex items-center bg-gray-800 rounded-full p-1 cursor-pointer select-none w-40">
      {/* Sliding indicator */}
      <div
        className={`absolute top-0 left-0 h-full w-1/2 bg-orange-500 rounded-full shadow-md transition-transform duration-300 ease-in-out`}
        style={{ transform: value ? "translateX(100%)" : "translateX(0%)" }}
      ></div>

      {/* Labels */}
      {options.map((label, idx) => {
        const isActive = (idx === 0 && !value) || (idx === 1 && value);
        return (
          <div
            key={idx}
            className={`flex-1 text-center text-sm font-medium z-10 select-none ${
              isActive ? "text-white" : "text-gray-400"
            }`}
            onClick={() => onChange(idx === 0 ? false : true)}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}

export default ToggleSwitch;