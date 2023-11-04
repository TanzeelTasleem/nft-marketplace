import Image from "next/image"
import React from "react"

export const Section = () => {
    return (
        <div>
            <div>
                <Image
                    src="/images/sideImage.png"
                    alt="hero sideImage"
                    width={222}
                    height={539}
                    className="absolute"
                />
            </div>
            <div className="flex flex-wrap mx-2 justify-between items-center h-screen-90 pt-20 px-10">
                <div className="max-w-md md:p-7 p-5 ">
                    <p className="font-sans -top-2 relative font-bold text-4xl md:text-left text-center capitalize leading-snug ">
                        Explore, collect, and sell Digital Content Creation NFTs
                    </p>
                    <p className="font-sans font-medium normal-case text-xl leading-normal top-1 relative">
                        Create your first NFTs with finest NFT marketplace
                    </p>
                    <div className="space-x-4 top-4 relative">
                        <button className="capitalize rounded-full bg-black w-24 h-9 text-white font-bold">
                            explore
                        </button>
                        <button className="capitalize rounded-full bg-white w-24 h-9 text-black border-gray-400 border-2 font-bold">
                            create
                        </button>
                    </div>
                </div>
                <div className="max-w-lg rounded-md relative hover:shadow-outer cursor-pointer">
                    <div className="bg-white rounded-lg ">
                        <Image
                            src="/images/nftImage.jpg"
                            className=" rounded-md max-h-96 max-w-full"
                            //   formats={["jpg"]}
                            alt="IMAGE TITLE"
                            // layout="fill"
                            // objectFit="cover"
                            height="420"
                            width="1000"
                        //   as="image"
                        />
                        {/* <ProfileCard /> */}
                        {/* <div className="absolute border-red-500 border p-0.5 shadow-md hover-trigger space-x-2 flex items-center left-2 pr-3.5 -mt-7 rounded-3xl max-h-11 bg-white">
            <div className="absolute overflow-auto top-14 -left-4 hover-target">
                <ProfileCard/>
            </div>
              <div className="border-transparent w-9 h-9 rounded-3xl">
              <img
                className="rounded-full"
                src="https://f8n-production.imgix.net/creators/profile/ez13q5uqy-ava-jpg-0bdy8r.jpg?q=50&w=36&h=36&auto=format%2Ccompress&fit=crop&dpr=2"
                alt=""
              />
              </div>
              <p className="font-sans text-sm font-extrabold ">@Tanzeel</p>           
            </div> */}
                        <div className="pt-4 flex space-x-4 p-2">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
