import { useLocation, useNavigate } from 'react-router-dom';

function BackButton() {
  const location = useLocation();
  const navigate = useNavigate();

  // get previous route (default to "/" if not available)
  const previousRoute = location.state?.from || '/';

  const handleBack = () => {
    navigate(previousRoute);
  };


  return (
    <>
      {/* Floating button */}
      <button
        className="absolute top-10 right-10 w-16 h-16 bg-violet-500 hover:bg-violet-600 text-white rounded-full shadow-lg flex items-center justify-center text-lg font-bold hover:scale-110 transition-transform duration-200"
        onClick={handleBack}
      >
        Back
      </button>
    </>
  );
}

export default BackButton;