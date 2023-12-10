import { ethers } from 'ethers'
import NavbarHome from 'layouts/navbar'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Req__factory } from 'typechain/factories/Req__factory'
import { useAccount, useBalance } from 'wagmi'
import data from '../info/data.json'

function Verifier() {
  const [isVerifier, setIsVerifier] = useState(false)
  const [verifierAddress, setVerifierAddress] = useState('')
  const [incentive, setIncentive] = useState(0)
  const [stepCount, setStepCount] = useState(0)
  const [challengeName, setChallengeName] = useState('')
  const { address, isConnected, connector } = useAccount()
  const [txHash, setTxHash] = useState('')
  let contract
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    addressOrName: address,
  })

  const actAsVerifier = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    contract = Req__factory.connect(data.contractAddress, signer)
    let tx = await contract.setVerifier()
    let reciept = await tx.wait()
    console.log(reciept)
    setTxHash(reciept.transactionHash)
    toast.success('Successfully set as verifier')
    setIsVerifier(true)
  }

  useEffect(() => {
    if (isConnected) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      contract = Req__factory.connect(data.contractAddress, signer)
      contract.getVerifier().then(res => {
        if (parseInt(res.verifier_address) === 0) {
          setIsVerifier(false)
          return
        }
        setIsVerifier(true)
        setVerifierAddress(res)
        setIncentive(Number(res.incentive))
        setStepCount(Number(res.step_count))
        setChallengeName(res.challengeName)
        console.log(res)
      })

      contract.getCompletionList().then(res => {
        console.log(res)
        
      })
    }
  }, [isConnected, connector])
  return (
    <div>
      <NavbarHome current={null} />
      <div className="bg-primary h-full px-48 py-24">
        {/* Act as verifier? */}
        {/* buttons center, yes no */}
        {!isVerifier && (
          <div>
            <h1 className=" text-center text-4xl font-bold">Act as verifier?</h1>

            <div className="flex flex-row justify-center space-x-12 pt-12 pb-8">
              <button
                className="rounded-lg bg-green-800 p-4 text-xl font-bold text-white"
                onClick={() => actAsVerifier()}
              >
                Yes
              </button>
              <Link href="/dashboard">
                <button className="rounded-lg bg-red-800 p-4 text-xl font-bold text-white">No</button>
              </Link>
            </div>
          </div>
        )}
        {isVerifier && (
          <div>
            <Link href="/create">
              <button className="mb-3 rounded-lg bg-violet-800 p-4 text-xl font-bold text-white">
                Create a new challenge
              </button>
            </Link>
            {/* Create a new challenge */}

            {challengeName !== '' && (
              <div>
                <h1 className="text-4xl font-bold">Current Challenge</h1>
                <div className="border-new-gray my-8 border border-b-2" />
                <div className="flex flex-row justify-evenly space-x-48 pt-5 pb-8">
                  <h1 className="text-2xl font-bold">Challenge Name</h1>
                  <h1 className="text-2xl font-bold">Total Steps</h1>
                  <h1 className="text-2xl font-bold">Total workouts</h1>
                </div>
                <div className="flex flex-row justify-evenly space-x-48 border border-2 pt-5 pb-8">
                  <h1 className="text-lg font-semibold">{challengeName}</h1>
                  <h1 className="text-lg font-semibold">{stepCount}</h1>
                  <h1 className="text-lg font-semibold">0</h1>
                </div>
              </div>
            )}
            <h1 className="mt-5 pt-5 text-2xl font-bold">Verify Completed Challenges</h1>
            <div className="border-new-gray my-8 border border-b-2" />
            <div className="flex flex-row justify-evenly space-x-48 pt-12 pb-8">
              <h1 className="text-xl font-bold">Address</h1>
              <h1 className="text-xl font-bold">Step Count</h1>
              <h1 className="text-xl font-bold">Verify</h1>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Verifier
