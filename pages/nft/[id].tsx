import React,{useState,useEffect} from 'react'
import { useMetamask,useAddress,useDisconnect ,useContract,useNFTDrop} from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next';
import { sanityClient,urlFor } from '../../lib/client';
import { Collection } from '../../typings';
import Link from 'next/link';
import { BigNumber } from 'ethers';
import { ScaleLoader } from 'react-spinners';
import { toast,Toaster
 } from 'react-hot-toast';
interface Props {
    collection:Collection
}

function NftDropPage({collection}: Props) {
    const connectWithMetamask = useMetamask();
    const address = useAddress();
    const disconnect = useDisconnect();
    const nftDrop  = useNFTDrop(collection.address)
    const [loading, setLoading] = useState<boolean>(true)
    const [priceInEth, setPriceInEth] = useState<string>()
    const [claimedSupply, setClaimedSupply] = useState<number>(0)
    const [totalSupply, setTotalSupply] = useState<BigNumber>()

    useEffect(()=>{
        if(!nftDrop)return

        const fetchPrice = async()=>{
            const claimCondition = await nftDrop.claimConditions.getAll();
            setPriceInEth(claimCondition?.[0].currencyMetadata.displayValue)
        }

        fetchPrice();
    },[nftDrop])


   useEffect(()=>{
    if(!nftDrop)return

    const fetchNftDropData = async()=>{
        setLoading(true)
        const claimed = await nftDrop.getAllClaimed();
        const total = await nftDrop.totalSupply();
        setClaimedSupply(claimed.length);
        setTotalSupply(total)
        setLoading(false)
    }
    fetchNftDropData();

   },[nftDrop])

   const mintNft =()=>{
    if(!nftDrop || !address)return
    const quantity = 1;
    setLoading(true)
    const notification = toast.loading("Minting...",{
        style:{
            background:'white',
            color:'green',
            fontWeight:'bolder',
            fontSize:'17px',
            padding:'20px'
        }
    })
    nftDrop?.claimTo(address,quantity).then(async(tx)=>{

        const receipt = tx[0].receipt;
        const claimedTokenId = tx[0].id
        const claimedNft = await tx[0].data()
    toast("HOORAY..You Successfully Minted!",{
        duration:8000,
        style:{
            background:'green',
            color:'white',
            fontWeight:'bolder',
            fontSize:'17px',
            padding:'10px'
        }
    })
    }).catch(e=>{
        toast("Whoops..Something went wrong!",{
            style:{
                background:'red',
                color:'white',
                fontWeight:'bolder',
                fontSize:'17px',
                padding:'10px'    
            }
        })
    }).finally(()=>{
        setLoading(false)
        toast.dismiss(notification)
       
    })
   }


  return (
    <div className='flex h-screen flex-col lg:grid lg:grid-cols-10'>
        <Toaster position='bottom-center'/>
        {/* Left side of screen */}
        <div className='bg-gradient-to-r from-gray-700 via-gray-900 to-black lg:col-span-4'>
            <div className='flex flex-col items-center justify-center py-2 lg:min-h-screen'>
                <div className='bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl'>
                <img
                 className='w-44 rounded-xl object-cover lg:h-96 lg:w-72'
                 src={urlFor(collection?.mainImage).url()}
                 alt="home-ape" />
                </div>
                 <div className='text-center p-5 space-y-2'>
                    <h1 className='text-4xl  font-bold text-white'>
                       {collection.nameOfNft}
                    </h1>
                    <h2 className='text-xl text-gray-300'>{collection.description}</h2>
                 </div>
            </div>
        </div>
        {/* right side of the screen */}
        <div className='flex flex-1 flex-col p-12 lg:col-span-6 bg-gradient-to-r from-gray-700 via-gray-900 to-black md:bg-gradient-to-l from-gray-700 via-gray-900 to-black'>
            {/* Header */}
             <header className='flex items-center justify-between'>
                <Link href='/'>
                <h1 className='w-52 cursor-pointer text-xl text-white font-extralight sm:w-80'>The <span className='font-extrabold underline decoration-pink-600/50'>Yuta</span> Nft Market Place </h1>
                </Link>
                    <button
                    onClick={address ? disconnect: connectWithMetamask}
                    className='rounded-full bg-rose-500 text-white px-4 py-2 text-xs font-bold lg:px-5 lg:py-3 lg:text-base'>{address ? 'Sign out':'Sign in'}</button>      
             </header>  
             <hr className='my-2 border' />
             {address && (
                <p className='text-center text-sm text-rose-400'>Your'e logged in with wallet {address.substring(0,5)}...{address.substring(address.length-5)}</p>
             )}
            {/* Content */}
            <div className='mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:space-y-0 lg:justify-center'>
                <img
                className='w-80 object-contain pb-10 lg:h-80' 
                src={urlFor(collection.previewImage).url()}
                 alt="hero" />
                 <h1 className='text-3xl text-white font-bold lg:text-5xl lg:font-extrabold'>{collection.title}</h1>
                 {loading ? (
                        <p className='pt-2  text-xl text-green-500 animate-pulse'>Loading supply count...</p>
                 ):(
                    <p className='pt-2 text-xl text-green-500'> {claimedSupply} / {totalSupply?.toString()} NFT&apos;s claimed</p>
                 )}
                 {loading &&(
                    <div className='mt-6'>
                         <ScaleLoader color='white'/>
                    </div>
                   
                 )}
            </div>

            {/* Mint button */}
            <button
            onClick={mintNft}
            disabled={loading || claimedSupply == totalSupply?.toNumber()  || !address}
            className='h-16 bg-red-600 w-full text-white rounded-full mt-10 font-bold disabled:bg-gradient-to-l from-gray-600 via-gray-700 to-black'>
                {loading ?(
                    <>Loading</>
                ): claimedSupply===totalSupply?.toNumber()?(
                    <>Sold Out</>
                ):!address?(
                    <>Sign in to Mint</>
                ):(
                    <span className='font-bold'>Mint NFT ({priceInEth} ETH)</span>
                )}     
            </button>
        </div>
    </div>
  )
}

export const getServerSideProps:GetServerSideProps =async({params})=>{
    const query = `*[_type == "collection" && slug.current == $id][0]{
        _id,
        title,
        description,
        nameOfNft,
        address,
        slug{
          current
        },
        mainImage{
          asset
        },
        previewImage{
          asset
        },
        creator->{
          _id,
          name,
          address,
          slug{
            current
          },
          image{
            asset
          },
          bio
        }
    
      }`
  
     const collection = await sanityClient.fetch(query,{
        id:params?.id
     })


     if(!collection)
     {
        return {
            notFound:true
        }
     }

     return {
        props:{
            collection
        }
     }
}
export default NftDropPage
