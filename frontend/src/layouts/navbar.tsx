import { Disclosure } from '@headlessui/react'
import ConnectWallet from 'components/Connect/ConnectWallet'
import ThemeToggleButton from 'components/Theme/ThemeToggleButton'
import Link from 'next/link'
import { useState } from 'react'

export default function NavbarHome({ current }) {
  const [name, setName] = useState('Tasmia Zerin')
  const [connected, setConnected] = useState(true)

  return (
    <Disclosure as="nav" className="bg-primary sticky top-0 z-50 p-2">
      {() => (
        <div className="max-w-8xl mx-auto px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden" />
            <div className="flex items-center justify-start sm:items-center sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/">
                  <img className="block h-8 w-auto lg:hidden" src="\logo-BUET.svg" alt="ArteVerse" />
                </Link>
                <img className="hidden h-8 w-auto lg:block" src="\logo-BUET.svg" alt="ArteVerse" />
                <h1 className="font-display ml-2 text-xl font-bold">
                  <Link href="/">FitLife.</Link>
                </h1>
              </div>
            </div>
            <div className="flex pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button type="button" className="mx-6 font-semibold">
                {current === 'dashboard' ? (
                  <h1 className="from-secondary-1  bg-purple-400 text-white p-3 rounded-lg">
                    Dashboard
                  </h1>
                ) : (
                  <h1>
                    <Link href="/dashboard">Dashboard</Link>
                  </h1>
                )}
              </button>
              <button type="button" className="mx-6 font-semibold">
                {current === 'challenges' ? (
                  <h1 className="from-secondary-1 bg-purple-400 text-white p-3 rounded-lg">Challenges</h1>
                ) : (
                  <h1>
                    <Link href="/challenges">Challenges</Link>
                  </h1>
                )}
              </button>
              {/* Register as verifier */}
              <button type="button" className="bg-black-500 mx-6 rounded-lg px-6 font-semibold dark:bg-slate-400">
                {current === 'verifier' ? (
                  // plus sign

                  <h1 className="from-secondary-1 to-secondary-2 ">Verifier</h1>
                ) : (
                  <h1>
                    <Link href="/verifier">Verifier</Link>
                  </h1>
                )}
              </button>
              <div className="flex w-full flex-col items-center">
                <ConnectWallet />
              </div>
              <div className="  ml-5 flex flex-col items-center">
                <ThemeToggleButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </Disclosure>
  )
}
