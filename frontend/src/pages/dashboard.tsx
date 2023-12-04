import StepOne from 'components/HowItWorks/Step1'
import StepTwo from 'components/HowItWorks/Step2'
import StepThree from 'components/HowItWorks/Step3'
import { format } from 'date-fns'
import NavbarHome from 'layouts/navbar'
import { useEffect, useState } from 'react'
import CalorieChart from '../components/CalorieChart'
import WorkoutChart from '../components/WorkoutChart'
import { CALORIES_PER_HOUR } from '../constants'

function Dashboard() {
  const isFetchingWorkouts = true
  const workouts = []

  const initialData = {
    today: 0,
    week: 0,
    month: 0,
  }

  const [calories, setCalories] = useState(initialData)

  useEffect(() => {
    setCalories(initialData)

    const today = new Date()
    const dayOfYear = format(today, 'd')
    const weekNum = format(today, 'w')
    const monthNum = format(today, 'L')

    const calcCalories = () => {
      for (const { createdAt, secondsPassed } of workouts) {
        const formattedDate = new Date(createdAt.seconds * 1000)
        const day = format(formattedDate, 'd')
        const week = format(formattedDate, 'w')
        const month = format(formattedDate, 'L')

        const newCalories = CALORIES_PER_HOUR * (secondsPassed / 3600)

        if (dayOfYear === day) {
          setCalories(calories => ({
            ...calories,
            today: calories.today + newCalories,
          }))
        }
        if (weekNum === week) {
          setCalories(calories => ({
            ...calories,
            week: calories.week + newCalories,
          }))
        }
        if (monthNum === month) {
          setCalories(calories => ({
            ...calories,
            month: calories.month + newCalories,
          }))
        }
      }
    }

    if (!isFetchingWorkouts && workouts.length) {
      calcCalories()
    }
  }, [isFetchingWorkouts, workouts])

  return (
    <div className=" space-y-10">
      <NavbarHome current={null} />
      <div className=" px-48">
        <div className=" grid grid-cols-3 grid-rows-1 gap-4">
          <StepOne />
          <StepTwo />
          <StepThree />
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
          <WorkoutChart />
        </section>
        <section className=" ml-10 flex-grow rounded-xl bg-slate-200 lg:flex ">
          <div className="space-y-10 p-10">
            <h2 className="text-primary text-lg">Calories</h2>
            <div className="space-y-1">
              <h5 className="text-primary text-sm font-light">TODAY</h5>
              <h3 className="text-primary text-6xl font-light">{isFetchingWorkouts ? 0 : calories.today}</h3>
            </div>
            <div className="space-y-1">
              <h5 className="text-primary text-sm font-light">THIS WEEK</h5>
              <h3 className="text-primary text-6xl font-light">{isFetchingWorkouts ? 0 : calories.week}</h3>
            </div>
            <div className="space-y-1">
              <h5 className="text-primary text-sm font-light">THIS MONTH</h5>
              <h3 className="text-primary text-6xl font-light">{isFetchingWorkouts ? 0 : calories.month}</h3>
            </div>
          </div>
          <div className="flex-grow">
            <CalorieChart />
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
