import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { contractABI, contractAddress } from '../utils/constants'

export const TransactionContext = React.createContext()

//Metamask allows us to handle ethereum/blockchain stuff via window
// <3
const { ethereum } = window

const createEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer)

    return transactionContract
}   

//creates context to call createEthereumContract, 
//wraps over app to provide info/process transaction
export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("")
    const [formData, setFormData] = useState({addressTo: '', amount: '', keyword: '', message: ''})
    const [isLoading, setIsLoading] = useState(false)
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'))
    const [transactions, setTransactions] = useState([])

    //dynamically updates form data input (advanced react concept: callback fxn. + prevstate)
    const handleChange = (e, name) => {
        setFormData((prevState) => ({...prevState, [name]: e.target.value}))
    }
    
    const getAllTransactions = async () => {
        try {
          if (ethereum) {
            const transactionsContract = createEthereumContract()
    
            const availableTransactions = await transactionsContract.getAllTransactions()
    
            //re-does the weird structure of avalibleTransactions to be better 
            const structuredTransactions = availableTransactions.map((transaction) => ({
              addressTo: transaction.receiver,
              addressFrom: transaction.sender,
              timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
              message: transaction.message,
              keyword: transaction.keyword,
              amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }))
    
            //console.log(structuredTransactions)
    
            setTransactions(structuredTransactions)
          } else {
            console.log("Ethereum is not present")
          }
        } catch (error) {
          console.log(error)
        }
      }

    const checkIfWalletIsConnected = async () => {
        try{
            if(!ethereum) return alert("Please install Metamask before proceeding")

            const accounts = await ethereum.request({ method: 'eth_accounts' })

            if (accounts.length) {
                setCurrentAccount(accounts[0])
                getAllTransactions()
            } else {

                console.log('No accounts found')
            }
        } catch {
            console.log(error)
        }

    }

    const checkIfTransactionsExists = async () => {
        try {
          if (ethereum) {
            const transactionsContract = createEthereumContract();
            const currentTransactionCount = await transactionsContract.getTransactionCount();
    
            window.localStorage.setItem("transactionCount", currentTransactionCount);
          }
        } catch (error) {
          console.log(error);
    
          throw new Error("No ethereum object");
        }
      }

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please install Metamask before proceeding")
            //gets all accounts 
            const accounts = await ethereum.request({ method: "eth_requestAccounts", })
            //connects first account
            setCurrentAccount(accounts[0])
            //window.location.reload()
        }
        catch (error) {
            console.log(error)
            throw new Error("No Ethereum object.")
        }
    }

    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert("Please install Metamask")
            //get data from form to here
            const {addressTo, amount, keyword, message} = formData
            const transactionContract = getEthereumContract()
            const parsedAmount = ethers.utils.parseEther(amount)
            
            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    //gas fee is in gwei (subunit of ether) in hex
                    gas: '0x5208', //21000 gwei
                    value: parsedAmount._hex,
                    
                }]
            })

            //async because it takes time for tranact. to go through, so loading then reset when done
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword)
            setIsLoading(true)
            console.log(`Loading - ${transactionHash.hash}`)
            await transactionHash.wait()
            setIsLoading(false)
            console.log(`Success - ${transactionHash.hash}`)

            const transactionCount = await transactionContract.getTransactionCount()
            setTransactionCount(transactionCount.toNumber())
        } catch (error) {
            console.log(error)
            throw new Error('No Ethereum object')
        }
    }
    //checks by calling at start app runtime
    useEffect(() => {
        checkIfWalletIsConnected()
        checkIfTransactionsExists()
    }, [])


    return(
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, sendTransaction, handleChange, transactions, transactionCount, isLoading }}>
            {children}
        </TransactionContext.Provider> 
    )
}
