import { useEffect, useState } from 'react'
import { ethers, Contract } from 'ethers';
import { Web3Provider}  from '@ethersproject/providers';

import Navigation from './components/Navigation';
import Search from './components/Search';

//import config from '../config.json'

import CookieNFT from '../abis/CookieNFT.json'
import CookieVote from '../abis/CookieVote.json'

//import Cookie from './components/Cookie';
import Cookie from './components/Cookie';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';


import heart from '../src/assets/react.svg';

import './App.css'

const config = {
  11155111: { // Sepolia chain ID
    cookieNFT: {
      address: import.meta.env.VITE_CONTRACT_COOKIE_NFT,
    },
    cookieVote: {
      address: import.meta.env.VITE_CONTRACT_VOTING,
    }
  }
};


function App() {

  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null); 

  const [cookies, setCookies ] = useState([])
  const [cookie, setCookie] = useState([])
  const [cookieVote, setCookieVote] = useState(null);

  const [voteCounts, setVoteCounts] = useState({})
  const [hasVoted, setHasVoted] = useState(false)

  const loadBCdata = async () => {
    //const provider = new ethers.providers.Web3Provider(window.ethereum)
    const provider = new Web3Provider(window.ethereum); // need this due to v6 update
    setProvider(provider)
    
    const network = await provider.getNetwork()

    console.log("Using contract config:", config[network.chainId]);
    console.log("Chain ID from provider:", network.chainId);

    const cookieNFT = new Contract(config[network.chainId].cookieNFT.address, CookieNFT, provider)
    console.log("NFT contract from env:", import.meta.env.VITE_CONTRACT_COOKIE_NFT);
    console.log('contract address:', cookieNFT.target);  // ethers v6 uses `.target`
    console.log("ABI methods:", CookieNFT.map(f => f.name))

    console.log("Vote contract from env:", import.meta.env.VITE_CONTRACT_COOKIE_VOTE);
    const cookieVote = new Contract(config[network.chainId].cookieVote.address, CookieVote, provider)
    //console.log("Vote contract from env:", import.meta.env.VITE_CONTRACT_COOKIE_VOTE);
    setCookieVote(cookieVote)

    console.log('contract address:', cookieVote.target);

    const totalSupply = await cookieNFT.totalSupply()
    console.log("total", totalSupply.toString())
    const cookies = []

    for(let i = 1; i <= totalSupply; i++) {
      const uri = await cookieNFT.tokenURI(i);
      const response = await fetch(uri)
      const metadata = await response.json()
      cookies.push(metadata)
      console.log('metad', metadata)
      
    }
    const tokenUri = await cookieNFT.tokenURI(1);
    console.log("tURI", tokenUri);
    setCookies(cookies) 

    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
      const account = ethers.getAddress(accounts[0])

      setAccount(account)
    })

  }

  const castVote = async (tokenId) => {
    console.log('casting vote...')

    const signer = provider.getSigner()
    const address = await signer.getAddress();

    console.log("signer", address)
    console.log("cookieVote", cookieVote);
    const cookieVoteWithSigner = cookieVote.connect(signer)

    //User casts vote 
    console.log('attempting to cast vote...')
    console.log("tokenId:", tokenId, typeof tokenId);
    let transaction = await cookieVoteWithSigner.vote(tokenId);
    console.log('vote casted');
    //await transaction.wait()
    await provider.waitForTransaction(transaction.hash);

    console.log('getting vote count...')
    //Fetch update vote count
    const upDatedVoteCount = await cookieVote.getVotes(tokenId)
    //setVoteCount(upDatedVoteCount.toNumber())
    //setVoteCounts(prev => ({...prev, [tokenId]: upDatedVoteCount.toNumber()}))
    setVoteCounts(prev => ({...prev, [tokenId]: Number(upDatedVoteCount)}));

    //set hasvoted to true for address
    setHasVoted(true)
  }

  useEffect(() => {
    loadBCdata()
  }, [])
         //<Cookie cookie={cookie} provider={provider} account={account} />
  return (
    <div >
      <div>
        <Navigation account={account} setAccount={setAccount} />
      </div>
      
      <Search />

      <h3 style={{color: 'black'}}>This Weeks Cookies</h3>

      <hr/>

      <div className='voting__display'>
        {cookies.map((cookie, index) => (
          <div key={index} className='voting__section'>
            <img src={cookie.image} className='cookie__images' />
            <div className="cookie__content">
              <h2 style={{color: 'black'}}>{cookie.name}</h2>
              <h3 className='cookie__description'>{cookie.description}</h3>
              <br />
              <div className='vote__submit'>
                <p>Served: {cookie.attributes[0].value}</p>
              </div>

              <div className='vote'>
                <button className='vote__button' onClick={() => castVote(index + 1)}>
                  <ArrowUpwardIcon /> {/**need to add hasVoted */}
                </button>
                <p style={{paddingLeft: 5, marginBottom: 8}}>Votes: {/*voteCounts[cookie.tokenId] || 0*/ voteCounts[index + 1] ?? voteCounts[index] }</p>
              </div>
                  
            

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
