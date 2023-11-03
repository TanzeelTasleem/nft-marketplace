// contexts/web3.js
'use client'
import React from 'react'
import { FC } from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { getLibrary } from '@/utils/web3-config';

// export const Web3Provider = (params:any) => {
//     return(
//         <h1></h1>
//     )
// }

export const Web3Provider: FC<{ children: React.ReactNode }> = ({ children }) => (
    // <Web3Context>
    <Web3ReactProvider getLibrary={getLibrary}>
        {children}
    </Web3ReactProvider>
    // </Web3Context>
)

