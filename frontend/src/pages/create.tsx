import { ethers } from 'ethers'
import NavbarHome from 'layouts/navbar'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Req__factory } from 'typechain/factories/Req__factory'
import { useAccount, useBalance } from 'wagmi'
import data from '../info/data.json'

function Create() {
  const [challengeName, setChallengeName] = useState('')
  const [stepCount, setStepCount] = useState(0)
  const [incentive, setIncentive] = useState(0)
  const { address, isConnected, connector } = useAccount()
  const [txHash, setTxHash] = useState('')
  let contract
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    addressOrName: address,
  })
  const router = useRouter()
  const handleSubmit = async e => {
    e.preventDefault()
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    contract = Req__factory.connect(data.contractAddress, signer)
    let tx = await contract.createChallenge(challengeName, incentive, stepCount, {
      from: signer.getAddress(),
      gasLimit: 2000000,
      value: incentive * 1000000000000,
    })
    let reciept = await tx.wait()
    console.log(reciept)
    setTxHash(reciept.transactionHash)
    toast.success('Successfully created challenge')
    router.push('/dashboard')
  }
  return (
    <div className="bg-primary">
      <NavbarHome current={'create'} />
      <div className="flex flex-col py-24 px-48">
        <h1 className="mb-12 text-5xl font-bold">Create New Challenge</h1>
        <form className="pr-8" onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="font-display my-4 text-xl">Name</h2>
            <input
              className="focus:shadow-outline w-hundred appearance-none rounded-md border px-4 py-3 leading-normal shadow focus:outline-none"
              id="username"
              type="text"
              placeholder="Challenge Name"
              value={challengeName}
              onChange={e => setChallengeName(e.target.value)}
            />
          </div>
          <div className="mb-8">
            <h2 className="font-display my-4 text-xl">Step Count</h2>
            <input
              className="focus:shadow-outline w-hundred appearance-none rounded-md border px-4 py-3 leading-normal shadow focus:outline-none"
              id="stepCount"
              type="number"
              placeholder="Step Count"
              value={stepCount}
              onChange={e => setStepCount(parseInt(e.target.value))}
            />
          </div>
          <div className="mb-8">
            <h2 className="font-display my-4 text-xl">Incentive</h2>
            <input
              className="focus:shadow-outline w-hundred appearance-none rounded-md border px-4 py-3 leading-normal shadow focus:outline-none"
              id="incentive"
              type="number"
              placeholder="Incentive"
              value={incentive}
              onChange={e => setIncentive(parseInt(e.target.value))}
            />
          </div>
          <div className="flex items-center">
            <button
              type="submit"
              onClick={handleSubmit}
              className=" font-display mt-16 rounded-lg bg-indigo-700 px-12 py-4 text-lg font-bold text-white"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Create
