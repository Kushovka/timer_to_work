const Button = ({ children, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="no-drag border px-4 py-2 rounded hover:bg-gray-200/30 transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
};

export default Button;
