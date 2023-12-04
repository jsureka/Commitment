export default function StepOne() {
  return (
    <div className="bg-new-gray w-full text-center ">
      <div className="relative mx-auto my-4 h-20 w-20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={0.5}
          stroke="currentColor"
          className="h-20 w-20"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
      </div>
      <h1 className="mb-4 text-xl font-bold">Total Steps</h1>
      <h3 className="text-primary text-6xl font-light">0</h3>
    </div>
  )
}
