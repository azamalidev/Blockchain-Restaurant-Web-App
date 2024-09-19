import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import rawABI from '../../../artifacts/contracts/chai.sol/chai.json'; // Ensure this path is correct
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Update to deployed contract address

const Home = () => {
    const [provider, setProvider] = useState(null);
    const [showOrder, setShowOrder] = useState(false);
    const [signer, setSigner] = useState(null);
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [memos, setMemos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [transactionLoading, setTransactionLoading] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    const [food, setFood] = useState([]);
    const [etherPrize, setEthPrice] = useState()
    useEffect(() => {
        fetchEthPrice();
        getProduct()
        getMyOrder()
        const loadProvider = async () => {
            if (window.ethereum) {
                try {
                    await window.ethereum.request({ method: "eth_requestAccounts" });
                    const prov = new ethers.BrowserProvider(window.ethereum);
                    setProvider(prov);

                    const sign = await prov.getSigner();
                    setSigner(sign);

                    const userAccount = await sign.getAddress();
                    setAccount(userAccount);

                    const contractABI = rawABI.abi;
                    const cont = new ethers.Contract(contractAddress, contractABI, sign);


                    // Call the getMemos function from the contract
                    const fetchedMemos = await cont.getMemos();
                    console.log('Fetched Memos:', fetchedMemos);

                    // Format the memos for display
                    const formattedMemos = fetchedMemos.map((memo) => ({
                        name: memo.name,
                        message: memo.message,
                        timestamp: new Date(memo.timestamp * 1000).toLocaleString(),
                        from: memo.from,
                        amount: ethers.formatEther(memo.amount), // Convert from Wei to Ether
                    }));

                    // setMemos(formattedMemos);
                    setContract(cont);
                    setLoading(false);
                } catch (error) {
                    console.error('Error loading provider or contract:', error);
                }
            } else {
                console.error('Please install MetaMask');
            }
        };

        loadProvider();
    }, []);
    const fetchEthPrice = async () => {
        try {
            const response = await axios.get(
                'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
            );
            setEthPrice(response.data.ethereum.usd);
        } catch (error) {
            console.error('Error fetching ETH price:', error);
        }
    };


    const buyNow = async () => {
        if (!contract) return;
        const value = ethers.parseEther("0.01");
        try {
            setTransactionLoading(true);
            const tx = await contract.buyChai(name, message, { value });
            await tx.wait();
            toast.success("Transaction successful!")
        } catch (error) {
            console.error("Transaction failed:", error);
        } finally {
            setTransactionLoading(false);
        }
    };

    const getProduct = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/food`);
            console.log(response, "responseresponse")
            setFood(response.data)
        } catch (error) {
            console.error("Transaction failed:", error);
        } finally {
            setTransactionLoading(false);
        }
    };

    const getMyOrder = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/orders/mine`, {
                params: { userId: user._id }
            });
            console.log(response, "responseresponse")
            setMemos(response.data)
        } catch (error) {
            console.error("Transaction failed:", error);
        } finally {
            setTransactionLoading(false);
        }
    };
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
      
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} - ${hours}:${minutes}:${seconds}`;
      };
    return (
        <div>
            <ToastContainer />

            {/* <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                />
                <br />
                <label>Message:</label>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message"
                />
                <br />
                <button onClick={buyChai} disabled={transactionLoading}>
                    {transactionLoading ? 'Processing...' : 'Buy Chai'}
                </button>
            </div> */}

            <div className='title-card-div' >
                <h1>Wellcom <span>{user.name},</span></h1>
                {account ? <span style={{ paddingBottom: "20px" }}> Connected Account 🦊: <span>{account}</span></span> : ""}
            </div>

            <div className='title-card-div'>
                <span style={{ display: 'flex' }}>
                    <h1 style={{ fontFamily: 'Franklin Gothic Medium' }}>{showOrder ? "Your Orders list" : "Order Now Any Of Product"} </h1>
                    <h5 style={{
                        float: 'right',
                        textDecoration: "underline",
                        cursor: "pointer",
                        position: "relative",
                        left: "35rem",
                        top: '0.5rem'
                    }} onClick={() => setShowOrder(!showOrder)}>{showOrder ? "Products" : "Your Order"}</h5>
                </span>
                {showOrder ? <div>
                    {memos.map((memo, index) => (
                        <div className='item-card-main'>
                            <div className='item-card'>
                                <h3 className='' key={index}>{memo.food[0].name}</h3>
                                <span style={{ display: 'flex' }}>
                                <h3 style={{ padding: '0px 10px',  color:"black" }} >{memo.status}</h3>
                                    <div>
                                        <h3 style={{ padding: '0px 10px' }} >{formatTimestamp(memo.orderDate)}</h3>
                                        <h3 style={{ padding: '0px 10px' }} key={index}> ${memo.food[0].price} / {Number(memo.food[0].price / etherPrize).toFixed(4)} Eth</h3>

                                    </div>
                                </span>
                            </div>
                        </div>
                    ))}




                </div> : <>{food.map((item, index) => {
                    return <div className='item-card-main'>
                        <div className='item-card'>
                            <h3 className='' key={index}>{item.name}</h3>
                            <span style={{ display: 'flex' }}>
                                <img src={item.image} width={100} height={100} alt='some error' />
                                <div>
                                    <h3 style={{ padding: '0px 10px' }} >{item.description}</h3>
                                    <h3 style={{ padding: '0px 10px' }} key={index}>${item.price} / {Number(item.price / etherPrize).toFixed(4)} Eth</h3>
                                    <h1 style={{ padding: '0px 10px' }} className='order-now' onClick={() => buyNow()}>
                                        Order Now
                                    </h1>
                                </div>
                            </span>
                        </div>
                    </div>
                })}</>}

            </div>


        </div>
    );
}

export default Home;
