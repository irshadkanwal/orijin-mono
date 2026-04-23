export const Loader = () => {
  return (
    <>
      <div className="h-dvh max-h-full flex items-center justify-center z-[99999]">
        <div className="absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 flex flex-col items-center">
          <span>
            <div className="spinner"></div>
          </span>
        </div>
      </div>
    </>
  );
};
