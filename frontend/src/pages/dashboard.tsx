import StepOne from 'components/HowItWorks/Step1'
import StepTwo from 'components/HowItWorks/Step2'
import StepThree from 'components/HowItWorks/Step3'
import { format } from 'date-fns'
import NavbarHome from 'layouts/navbar'
import { useEffect, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function Dashboard() {
  const isFetchingWorkouts = true
  const [totalSteps, setTotalSteps] = useState(0)
  const [totalChallenges, setTotalChallenges] = useState(0)
  const [totalIncentive, setTotalIncentive] = useState(0)
  const workouts = []
  const [stepCountData, setStepCountData] = useState([])
  const initialData = {
    today: 0,
    week: 0,
    month: 0,
  }

  const [calories, setCalories] = useState(initialData)
  const getStepCounts = () => {
    fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':
          'Bearer ya29.a0AfB_byBPYJH2G5J0RriZ6Lsf153BDQm5w-K8tVMPzfkVAVB4oQyuCPjwXXg2kt50z8DwyJrClAssUEBywv5-l4L_I-S4AHXT1m-vcCuCDJlt74Exg9SvCayc3z0qEO3P_R4JU42nzUIJcSzX7fbU49Gs1UHR2xmrEKYeaCgYKAZYSARMSFQHGX2Mi9hptGX53WWFWzp_4oki3sA0171',
      },
      body: JSON.stringify({
        aggregateBy: [
          {
            dataTypeName: 'com.google.step_count.delta',
            dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
          },
        ],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: new Date().getTime() - 86400000 * 7,
        endTimeMillis: new Date().getTime(),
      }),
    })
      .then(async res => {
        const data = await res.json()
        const stepcounts = []
        for (const { dataset } of data.bucket) {
          for (const { point } of dataset) {
            for (const { value } of point) {
              stepcounts.push({
                date: format(new Date(point[0].startTimeNanos / 1000000), 'dd/MM'),
                steps: value[0].intVal,
              })
            }
          }
        }
        setStepCountData(stepcounts)
        const totalSteps = stepcounts.reduce((acc, curr) => acc + curr.steps, 0)
        setTotalSteps(totalSteps)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getStepCounts()
  }, []) // empty dependency array
  return (
    <div className=" space-y-10">
      <NavbarHome current={null} />
      <div className=" px-48">
        <div className=" grid grid-cols-3 grid-rows-1 gap-4">
          <StepOne data={totalSteps} />
          <StepTwo data={totalChallenges} />
          <StepThree data={totalIncentive} />
        </div>
      </div>
      <main className=" my-12 flex items-center px-48 sm:flex-col lg:flex-row">
        <section className=" rounded-xl bg-purple-900 text-white lg:w-72">
          <div className="space-y-10 p-10">
            <h2 className="text-lg text-white">Workouts</h2>
            <div className="space-y-1">
              <h5 className="text-sm font-light text-white">TOTAL</h5>
              <h3 className="text-6xl font-light text-white">{isFetchingWorkouts ? 0 : workouts.length}</h3>
            </div>
          </div>
          {/* <WorkoutChart /> */}
        </section>
        <section className=" ml-10 flex-grow rounded-xl bg-slate-200 lg:flex ">
          <div className="space-y-10 p-10">
            <h2 className="text-primary text-lg">Calories</h2>
            <div className="space-y-1">
              <h5 className="text-primary text-sm font-light">TODAY</h5>
              <h3 className="text-primary text-6xl font-light">
                {stepCountData.length > 0 ? stepCountData[stepCountData.length - 1].steps : 0}
              </h3>
            </div>
            <div className="space-y-1">
              <h5 className="text-primary text-sm font-light">YESTERDAY</h5>
              <h3 className="text-primary text-6xl font-light">
                {stepCountData.length > 1 ? stepCountData[stepCountData.length - 2].steps : 0}
              </h3>
            </div>
          </div>
          <div className="flex-grow p-4">
            <ResponsiveContainer width="99%" height={500}>
              <AreaChart
                data={stepCountData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFB7E4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FFB7E4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="steps"
                  stroke="#de8cbf"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
