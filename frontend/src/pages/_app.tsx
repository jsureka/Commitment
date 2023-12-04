import HeadGlobal from 'components/HeadGlobal'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import 'styles/style.scss'
// Web3Wrapper deps:
import { Chain, RainbowKitProvider, darkTheme, getDefaultWallets, lightTheme } from '@rainbow-me/rainbowkit'
import { app } from 'appConfig'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { WagmiConfig, chain, configureChains, createClient } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import { ToastContainer } from 'react-toastify'

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <HeadGlobal />
      <Web3Wrapper>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Component key={router.asPath} {...pageProps} />
      </Web3Wrapper>
    </ThemeProvider>
  )
}
export default App

// Add Custom Chain
const gnosisChain: Chain = {
  id: 100,
  name: 'Gnosis',
  network: 'gnosis',
  iconUrl: 'https://gnosis.io/wp-content/themes/lessrain/images/favicon/apple-touch-icon.png',
  iconBackground: '#000',
  nativeCurrency: {
    decimals: 18,
    name: 'xDai',
    symbol: 'XDAI',
  },
  rpcUrls: {
    default: 'https://gnosischain-rpc.gateway.pokt.network',
  },
  blockExplorers: {
    default: { name: 'BlockScout', url: 'https://blockscout.com/xdai/mainnet' },
  },
  testnet: true,
}

const sepoliaChain: Chain = {
  id: 11155111,
  name: 'Sepolia',
  network: 'sepolia',
  iconUrl:
    'https://assets-global.website-files.com/5f973c97cf5aea614f93a26c/6449630da0da61343b5adba1_ethereum-logo.png',
  iconBackground: '#000',
  nativeCurrency: {
    decimals: 18,
    name: 'eth',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: 'https://rpc.sepolia.org',
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
  },
  testnet: true,
}

// Web3 Configs
const { chains, provider } = configureChains(
  [
    chain.mainnet,
    chain.polygon,
    chain.optimism,
    chain.arbitrum,
    gnosisChain,
    chain.rinkeby,
    chain.ropsten,
    sepoliaChain,
  ],
  [
    infuraProvider({ infuraId: process.env.NEXT_PUBLIC_INFURA_ID !== '' && process.env.NEXT_PUBLIC_INFURA_ID }),
    jsonRpcProvider({
      rpc: chain => {
        if (chain.id !== gnosisChain.id && chain.id !== sepoliaChain.id) return null
        return { http: chain.rpcUrls.default }
      },
    }),
    publicProvider(),
  ]
)
const { connectors } = getDefaultWallets({ appName: app.name, chains })
const wagmiClient = createClient({ autoConnect: true, connectors, provider })

// Web3Wrapper
export function Web3Wrapper({ children }) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        initialChain={1} // Optional, initialChain={1}, initialChain={chain.mainnet}, initialChain={gnosisChain}
        showRecentTransactions={true}
        theme={resolvedTheme === 'dark' ? darkTheme() : lightTheme()}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
