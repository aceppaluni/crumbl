import { useEffect, useState } from 'react';

const Cookie = ({ cookie, provider, account }) => {
    const fetchDetails = async () => {
       
    }

    useEffect(() => {
        fetchDetails()
    }, [hasSold])

    return (
        <div className="home">
            <div className='home__details'>
                <div className="home__image">
                    <img src={cookie.image} alt="Home" />
                </div>
            </div>
        </div >
    );
}

export default Cookie;