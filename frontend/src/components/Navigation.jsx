import { ethers } from 'ethers';
import logo from '../assets/Crumbl.png';

const Navigation = ({ account, setAccount }) => {

    const connectWallet = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const selectedAccount = ethers.getAddress(accounts[0]) // no longer need ethers.utils as v6 removes
        setAccount(selectedAccount);
    }

    return (
        <nav>
            <ul className="nav__links">
                <li><a href="#">Voting</a></li>
                <li><a href="#">Flavor Map</a></li>
                <li><a href="#">Reviews</a></li>
            </ul>

            <div className='nav__brand'>
                <img src={logo} alt="Logo" style={{width: '30%', height: '40%'}}/>
                <h1 style={{color: 'black', fontSize: "40px"}}>NFT Voting</h1>
            </div>

            {account ? (
                    <button
                        type="button"
                        className='nav__connect'
                    >
                        {account.slice(0, 6) + '...' + account.slice(38, 42)}
                    </button>
                ) : (
                    <button
                        type="button"
                        className='nav__connect'
                        onClick={connectWallet}
                    >
                        Connect
                    </button>
                )}
        </nav>
    
    )
}

export default Navigation;