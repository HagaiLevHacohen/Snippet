function FormInput({ label, name, type = "text", value, onChange, placeholder, required = false }) {
  return (
    <div className="flex justify-between items-center gap-2">
      <label htmlFor={name} className="text-gray-300 font-medium whitespace-nowrap text-center">{label}:</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-70 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-white outline-none
                   transition-all duration-200 hover:border-pink-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30"
      />
    </div>
  );
}

export default FormInput;