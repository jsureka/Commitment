import { ethers } from 'ethers'
import NavbarHome from 'layouts/navbar'
import { useEffect, useState } from 'react'
import { Req__factory } from 'typechain/factories/Req__factory'
import { useAccount, useBalance } from 'wagmi'
import data from '../info/data.json'

function Challenges() {
  const [challenges, setChallenges] = useState([])
  const { address, isConnected, connector } = useAccount()
  const [txHash, setTxHash] = useState('')
  let contract
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    addressOrName: address,
  })

  useEffect(() => {
    if (isConnected) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      contract = Req__factory.connect(data.contractAddress, signer)
      contract.getVerifiers().then(res => {
        const challenges = []
        res.forEach(element => {
          challenges.push({
            challengeName: element.challengeName,
            step_count: parseInt(element.step_count),
            incentive: parseInt(element.incentive),
          })
        })
        setChallenges(challenges)
        console.log(res)
      })
    }
  }, [isConnected, connector])

  return (
    <>
      <NavbarHome current={'challenges'} />
      <div className="bg-primary h-full px-48 py-24">
        {challenges.length > 0 && (
          <div>
            <h1 className="text-4xl font-bold">Active Challenge</h1>
            <div className="border-new-gray my-8 border border-b-2" />
            <div className="flex flex-row justify-evenly space-x-48 pt-5 pb-8">
              <h1 className="text-2xl font-bold">Challenge Name</h1>
              <h1 className="text-2xl font-bold">Total Steps</h1>
              <h1 className="text-2xl font-bold">Total incentive</h1>
            </div>
            {challenges &&
              challenges.map(challenge => (
                <div className="flex flex-row justify-evenly space-x-48 pt-5 pb-8">
                  <h1 className="text-2xl font-bold">{challenge.challengeName}</h1>
                  <h1 className="text-2xl font-bold">{challenge.step_count}</h1>
                  <h1 className="text-2xl font-bold">{challenge.incentive}</h1>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Challenges
