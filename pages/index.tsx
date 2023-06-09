import Head from 'next/head'
import { useAddress } from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next'
import {sanityClient, urlFor} from '../lib/client'
import { Collection } from '../typings'
import Link from 'next/link'

interface Props{
  collections:Collection[]
}


export default function Home({collections}:Props) {
  
  return (
    <div className='bg-gradient-to-r from-gray-700 via-gray-900 to-black'>
    <div className='max-w-7xl  mx-auto flex flex-col min-h-screen py-20 px-10 2xl:px-0'>
      <Head>
        <title>Nft-Drop</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/yuta-logo.png" />
      </Head>
      <h1 className='mb-10 text-4xl flex flex-col items-center text-white font-extralight'><span className='font-extrabold animate-bounce'>Yuta&apos;s</span> Nft Market Place </h1>
      <main className='bg-gradient-to-r from-gray-700 via-gray-900 to-black p-10 shadow-xl shadow-yellow-500/20'>
        <div className='grid space-x-3   md:grid-cols-2 lg:grid-cols-3 2xl:grid:cols-4'>
          {collections.map((collection)=>(
            <Link key={collection._id} href={`/nft/${collection.slug.current}`}>
            <div  className='flex  flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105'>
              <img 
              className='h-96 w-60 rounded-2xl opacity-100 object-cover'
              src={urlFor(collection.mainImage).url()} alt="collection-image" />
              <div className='p-5 object-contain'>
                <h2 className='text-3xl text-white animate-pulse hover:animate-none'>{collection.title}</h2>
                <p className='mt-2 text-sm text-gray-200'>{collection.description}</p>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </main>
      </div>
      </div>
  )
}

export const getServerSideProps:GetServerSideProps = async()=>{
  const query = `*[_type == "collection"]{
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
  const collections = await sanityClient.fetch(query);

  return {
    props:{
      collections
    }
  }

}