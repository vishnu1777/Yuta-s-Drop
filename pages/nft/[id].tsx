import React from 'react'
import { useMetamask,useAddress,useDisconnect } from '@thirdweb-dev/react'
type Props = {}

function NftDropPage({}: Props) {

    const connectWithMetamask = useMetamask();
    const address = useAddress();
    const disconnect = useDisconnect();


  return (
    <div className='flex h-screen flex-col lg:grid lg:grid-cols-10'>
        {/* Left side of screen */}
        <div className='bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4'>
            <div className='flex flex-col items-center justify-center py-2 lg:min-h-screen'>
                <div className='bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl'>
                <img
                 className='w-44 rounded-xl object-cover lg:h-96 lg:w-72'
                 src="https://image.binance.vision/editor-uploads-original/9c15d9647b9643dfbc5e522299d13593.png"
                 alt="home-ape" />
                </div>
                 <div className='text-center p-5 space-y-2'>
                    <h1 className='text-4xl font-bold text-white'>
                        Yuta Apes
                    </h1>
                    <h2 className='text-xl text-gray-300'>A massive collection of Yuta Apes in the studio</h2>
                 </div>
            </div>
        </div>
        {/* right side of the screen */}
        <div className='flex flex-1 flex-col p-12 lg:col-span-6'>
            {/* Header */}
             <header className='flex items-center justify-between'>
                <h1 className='w-52 cursor-pointer text-xl font-extralight sm:w-80'>The <span className='font-extrabold underline decoration-pink-600/50'>Yuta</span> Nft Market Place </h1>
                    <button
                    onClick={address ? disconnect: connectWithMetamask}
                    className='rounded-full bg-rose-400 text-white px-4 py-2 text-xs font-bold lg:px-5 lg:py-3 lg:text-base'>{address ? 'Sign out':'Sign in'}</button>      
             </header>  
             <hr className='my-2 border' />
             {address && (
                <p className='text-center text-sm text-rose-400'>Your'e logged in with wallet {address.substring(0,5)}...{address.substring(address.length-5)}</p>
             )}
            {/* Content */}
            <div className='mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:space-y-0 lg:justify-center'>
                <img
                className='w-80 object-cover pb-10 lg:h-40' 
                src="https://cryptosrus.com/wp-content/uploads/2021/11/BAYC.jpeg"
                 alt="hero" />
                 <h1 className='text-3xl font-bold lg:text-5xl lg:font-extrabold'>The Yuta Ape Collection Zone</h1>
                 <p className='pt-2 text-xl text-green-500'>15 / 30 NFT's claimed</p>
            </div>

            {/* Mint button */}
            <button className='h-16 bg-red-600 w-full text-white rounded-full mt-10 font-bold'>
                Mint NFT (0.01 ETH)
            </button>
        </div>
    </div>
  )
}

export default NftDropPage