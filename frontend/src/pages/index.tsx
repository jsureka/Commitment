import StepOne from 'components/HowItWorks/Step1'
import StepTwo from 'components/HowItWorks/Step2'
import StepThree from 'components/HowItWorks/Step3'
import Footer from 'layouts/footer'
import NavbarHome from 'layouts/navbar'

export default function Home() {
  return (
    <div className="bg-primary">
      <NavbarHome current={null} />
      <div className="px-48">
        <div className="my-12 flex items-center sm:flex-col lg:flex-row">
          <div className="w-3/5 pr-12">
            <h1 className="text-6xl font-bold capitalize leading-normal">
              Fitness{' '}
              <span className="from-secondary-1 to-secondary-2 bg-gradient-to-br bg-clip-text ">encouraged</span> with{' '}
              incentives
            </h1>
            <h4 className="font-body mt-6 text-2xl capitalize leading-normal">
              FitLife, your ultimate fitness companion, encourages and empowers you on your wellness journey through
              personalized incentives{' '}
            </h4>
            <button className=" font-display mt-8 rounded-2xl bg-violet-800 px-10 py-3 text-lg font-semibold text-white">
              Get Started
            </button>
            <div className="my-12 flex flex-row space-x-16">
              <h1 className="text-2xl">
                <b className="text-3xl">240K+</b>
                <br />
                Total challenges
              </h1>
              <h1 className="text-2xl">
                <b className="text-3xl">100K+</b>
                <br />
                Verifiers
              </h1>
              <h1 className="text-2xl">
                <b className="text-3xl">260K+</b>
                <br />
                Total rewards
              </h1>
            </div>
          </div>
          <div className="flex w-2/5 justify-center">
            <div className="max-w-5xl overflow-hidden rounded-lg shadow-lg ">
              <img className="aspect-video w-full object-cover" src="/dashboard-nft.png" alt="The Cat" />
              <div className="bg-new-gray px-6 py-4">
                <div className="mb-2 text-lg">The Wool Cat</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-36">
          <div className="flex flex-row items-end justify-between">
            <div>
              <h1 className="text-4xl font-bold">
                How It{' '}
                <span className="from-secondary-1 to-secondary-2 bg-gradient-to-br bg-clip-text text-transparent">
                  Works
                </span>
              </h1>
              <h4 className="font-body my-6 text-2xl capitalize">Find Out How To Get Started</h4>
              <div className="my-12 grid grid-cols-3 grid-rows-1 gap-4">
                <StepOne data={null} />
                <StepTwo data={null} />
                <StepThree data={null} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
