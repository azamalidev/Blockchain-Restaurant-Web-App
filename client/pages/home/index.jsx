import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import rawABI from '../../../artifacts/contracts/chai.sol/chai.json'; // Ensure this path is correct
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css'
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // Update to deployed contract address
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
        getProduct();
        getMyOrder();

        const loadProvider = async () => {
            if (window.ethereum) {
                try {
                    await window.ethereum.request({ method: "eth_requestAccounts" });
                    const prov = new ethers.BrowserProvider(window.ethereum);
                    setProvider(prov);

                    const sign = await prov.getSigner();
                    setSigner(sign?.address);

                    const userAccount = await sign.getAddress();
                    setAccount(userAccount);

                    const contractABI = rawABI.abi;
                    const cont = new ethers.Contract(contractAddress, contractABI, sign);

                    // Call the getMemos function from the contract
                    const fetchedMemos = await cont.getMemos();
                    console.log('Fetched Memos:', fetchedMemos);

                    // Format the memos for display
                    // const formattedMemos = fetchedMemos.map((memo) => ({
                    //     name: memo.name,
                    //     message: memo.message,
                    //     timestamp: new Date(parseInt(memo.timestamp) * 1000).toLocaleString(), // Safe parsing
                    //     from: memo?.from,
                    //     amount: ethers.formatEther(ethers.BigNumber.from(memo.amount)), // Convert from Wei to Ether
                    // }));

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
    const addOrder = async (data) => {
        try {
            const response = await axios.post(
                'http://localhost:3000/orders',
                data, // Ensure this is a properly formatted object
                {
                    headers: {
                        'Content-Type': 'application/json', // Set headers if needed
                    },
                }
            );
            console.log(response.data, "response");
        } catch (error) {
            console.error('Error fetching ETH price:', error);
        }
    };





    const buyNow = async (item) => {
        try {
            // Convert price to Ether based on the etherPrize
            const ether = (Number(item.price) / Number(etherPrize)).toFixed(8);
            console.log("Ethers:", ethers);// Using 8 decimal places for precision
            const value = ethers.parseEther("0.002");

            console.log("Signer:", signer);
            console.log("Ether (in wei):", value.toString());
            const userData = JSON.parse(localStorage.getItem('user'));
            console.log(userData, "userData")
            const data = {
                food: item._id,
                status: "Pending",
                user: userData._id,
                amount: item.price,
                from: signer
            };

            // Set loading to true
            setTransactionLoading(true);

            // Execute the transaction with the correct `value` parameter
            const tx = await contract.buyChai(item.name, item.description, { value: value });

            // Wait for transaction completion
            await tx.wait();

            // Add order and show success message
            addOrder(data);
            toast.success("Transaction successful!");

        } catch (error) {
            // Log error and display notification
            console.error("Transaction failed:", error);
            toast.error("Transaction failed. Please check your Ether amount.");
        } finally {
            // Reset loading state
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
            console.log(response, "responseresponse 00000000000000")
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
    console.log(memos)
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
                <h1>Wellcom <span>{user.name},</span></h1>  <button style={{ position: "relative", left: "65rem", top: "-50px" }} onClick={() => {
                    localStorage.removeItem('user')
                    window.location.href = '/login'
                }}>Logout</button>
                {account ? <span style={{
                    paddingBottom: "20px", position: "relative", left: "-59px",
                    top: "-15px",
                }}> Connected Account 🦊: <span>{account}</span></span> : ""}

            </div>

            <div className='body-card-div'>
                <span style={{ display: 'flex', color: "black" }}>
                    <h1 style={{
                        fontFamily: 'Franklin Gothic Medium', position: "relative",
                        left: "62px",
                    }}>{showOrder ? "Your Orders list" : "Order Now Any Of Product"} </h1>
                    <h5 style={{
                        float: 'right',
                        textDecoration: "underline",
                        cursor: "pointer",
                        position: "relative",
                        left: "35rem",
                        top: '0.5rem'
                    }} onClick={() => setShowOrder(!showOrder)}>{showOrder ? "Products" : "Your Order"}</h5>
                </span>
                {showOrder ? <div >
                    {memos.map((memo, index) => (
                        <div className='item-card-main '>
                            <div className='item-card'>
                            <img src={memo.foodDetails[0].image} width={100} height={100} alt='some error' />

                                <h3 className='' key={index}>{memo.foodDetails[0].name}</h3>
                                <span style={{ display: 'flex' }}>
                                    <h3 style={{ padding: '0px 10px', color: "black", }} >
                                        <span style={{
                                            color: "red", backgroundColor: "white", padding: "4px",
                                            border: "1px solid red",
                                            borderRadius: "23px"
                                        }}>{memo.status}</span>
                                    </h3>
                                    <div>
                                        <h3 style={{ padding: '0px 10px' }} >{formatTimestamp(memo.orderDate)}</h3>
                                        <h3 style={{ padding: '0px 10px' }} key={index}> ${memo.foodDetails[0].price} / {Number(memo.foodDetails[0].price / etherPrize).toFixed(4)} Eth</h3>
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
                                    <h3 style={{
                                        padding: '0px 10px', position: "relative",
                                        top: "-20px",
                                    }} >{item.description}</h3>
                                    <h3 style={{
                                        padding: '0px 10px', position: "relative",
                                        top: "-20px",
                                    }} key={index}>${item.price} / {Number(item.price / etherPrize).toFixed(4)} Eth</h3>
                                    {account ? <h1 style={{
                                        padding: '0px 10px', position: "relative",
                                        top: "-20px",
                                    }} className='order-now' onClick={() => buyNow(item)}>
                                        Order Now
                                    </h1> : ""}
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
