import React, { useState } from "react"

export const ProfileCard = () => {
  // const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  // const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  // const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  // const { styles, attributes } = usePopper(referenceElement, popperElement, {
  //   modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
  // });

  // return (
  //   <>
  //     <button type="button" ref={setReferenceElement}>
  //       Reference element
  //     </button>
  //     <div ref={setPopperElement} style={styles.popper} {...attributes.Popper}>
  //       Popper element
  //       <div ref={setArrowElement} style={styles.arrow} />
  //     </div>
  //   </>
  // );
  return (
    <div className="p-0.5 max-w-max cursor-pointer relative shadow-outer hover-trigger space-x-2 flex items-center left-2 pr-3.5 rounded-3xl max-h-11 bg-white">
      <div className="border-transparent w-9 h-9 rounded-3xl">
        <img
          className="rounded-full"
          src="https://f8n-production.imgix.net/creators/profile/ez13q5uqy-ava-jpg-0bdy8r.jpg?q=50&w=36&h=36&auto=format%2Ccompress&fit=crop&dpr=2"
          alt=""
        />
      </div>
      <p className="font-sans text-sm font-extrabold ">@Tanzeel</p>
      <div className="w-64 hover-target self-end absolute inset-x-0 bottom-0  px-4 shadow-sm bg-white rounded-lg p-3 space-y-5">
        <div className=" flex justify-between items-center">
          <div className="border-transparent w-11 h-11 rounded-3xl">
            <img
              className="rounded-full"
              src="https://f8n-production.imgix.net/creators/profile/ez13q5uqy-ava-jpg-0bdy8r.jpg?q=50&w=36&h=36&auto=format%2Ccompress&fit=crop&dpr=2"
              alt=""
            />
          </div>
          <button className="capitalize rounded-full bg-white w-24 h-9 text-black border-gray-400 hover:text-white hover:bg-black hover:border-transparent border-2 font-bold">
            follow
          </button>
        </div>
        <div>
          <h1 className="capitalize text-lg font-sans font-bold">tanzeel</h1>
          <p className="text-base font-extrabold font-sans text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-yellow-400">
            @tanzeelabc
          </p>
        </div>
        <div className="flex space-x-8">
          <p className="font-extrabold">
            19
            <div className="font-bold capitalize font-sans  text-gray-700 hover:text-black">
              followings
            </div>
          </p>
          <div className="font-extrabold">
            111
            <div className="font-bold capitalize font-sans text-gray-700 hover:text-black">
              followers
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


// follow profile avatar code 
{/* <div class="flex -space-x-1 overflow-hidden">
  <img class="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
  <img class="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
  <img class="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="">
  <img class="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
</div> */}