import { Buffer } from "buffer";
import React from "react";
import "./App.css";
const { ethers } = require("ethers");
const { Seaport } = require("@opensea/seaport-js");
window.Buffer = Buffer;

const { abi, tokenAddress } = require("./token");

function App() {
  const [sig, setSig] = React.useState();
  const [tokenId, setTokenId] = React.useState();
  const [mintNum, setMintNum] = React.useState();
  const [txHash, setTxHash] = React.useState();

  const [listingOrder, setListingOrder] = React.useState();
  const [listingBid, setListingBid] = React.useState();
  const [bidAmount, setBidAmount] = React.useState();

  async function signSeaportSell(tokenId) {
    // Get the ContractFactory and Signers here.
    let provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();
    const seaport = new Seaport(provider);
    const address = await signer.getAddress();
    // All properties on a domain are optional
    const { executeAllActions } = await seaport.createOrder(
      {
        offer: [
          {
            itemType: 2, //erc721
            token: tokenAddress,
            identifier: tokenId.toString(),
          },
        ],
        consideration: [
          {
            amount: ethers.utils.parseEther("0.1").toString(),
            recipient: address,
          },
        ],
      },
      address
    );
    let order = await executeAllActions();
    setListingOrder(order);
    setSig(order["signature"]);
  }

  async function fulfillSeaportListing() {
    let provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();

    const seaport = new Seaport(provider);
    let order = listingOrder;
    const { executeAllActions: executeAllFulfillActions } = await seaport.fulfillOrder({
      order,
    });

    const transaction = await executeAllFulfillActions();
    setTxHash(transaction["hash"]);
  }
  async function signSeaportBid() {
    // Get the ContractFactory and Signers here.
    let provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();
    const seaport = new Seaport(provider);
    const address = await signer.getAddress();

    // All properties on a domain are optional
    const { executeAllActions } = await seaport.createOrder(
      {
        offer: [
          {
            amount: ethers.utils.parseEther(bidAmount.toString()).toString(),
            // Goerli WETH
            token: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
          },
        ],
        consideration: [
          {
            itemType: 2,
            token: tokenAddress,
            identifier: tokenId,
            recipient: address,
          },
        ],
      },
      address
    );
    let bid = await executeAllActions();
    setListingBid(bid);
  }

  async function acceptSeaportBid() {
    let provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();

    const seaport = new Seaport(provider);
    let order = listingBid;

    const { executeAllActions: executeAllFulfillActions } = await seaport.fulfillOrder({
      order,
      accountAddress: await signer.getAddress(),
    });
    const transaction = await executeAllFulfillActions();
    setTxHash(transaction["hash"]);
  }
  async function mintTokens(amount) {
    let provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();
    const address = await signer.getAddress();

    const minterContract = new ethers.Contract(tokenAddress, abi, signer);

    await minterContract.mint(address, amount);
  }

  const handleTokenIdChange = (event) => {
    setTokenId(event.target.value);
  };
  const handleMintNumChange = (event) => {
    setMintNum(event.target.value);
  };
  const handleBidAmountChange = (event) => {
    setBidAmount(event.target.value);
  };

  return (
    <div className="App">
      <input
        type="text"
        id="mintNum"
        placeholder="num of tokens to mint"
        className="tokenId"
        onChange={handleMintNumChange}
      />

      <button className="sign-seaport-sell" onClick={() => mintTokens(mintNum)}>
        mint tokens
      </button>
      <br />
      <br />
      <div className="selling">
        <input
          type="text"
          id="tokenId"
          placeholder="tokenId"
          className="tokenId"
          onChange={handleTokenIdChange}
        />

        <button className="sign-seaport-sell" onClick={() => signSeaportSell(tokenId)}>
          sign seaport listing message
        </button>
        <p className="sig">Sig: {sig}</p>
        <br />
        <br />
        <button className="sign-seaport-sell" onClick={() => fulfillSeaportListing()}>
          submit buy order for above listing
        </button>
        <br />
        <br />

        <a href={`https://goerli.etherscan.io/tx/` + txHash} className="viewTx" target="_blank">
          View tx on etherscan
        </a>
      </div>
      <br />
      <br />
      <br />
      <br />
      <div className="bidding">
        <input
          type="text"
          id="tokenId"
          placeholder="tokenId to bid on"
          className="tokenId"
          onChange={handleTokenIdChange}
        />
        <input
          type="text"
          id="bidAmoutn"
          placeholder="bid amount in ether"
          className="tokenId"
          onChange={handleBidAmountChange}
        />
        <button className="sign-seaport-sell" onClick={() => signSeaportBid()}>
          sign seaport bid
        </button>
        <p className="bid">Bid: {JSON.stringify(listingBid)}</p>
        <br />
        <br />
        <button className="sign-seaport-sell" onClick={() => acceptSeaportBid()}>
          accept the above bid
        </button>
        <br />
        <br />

        <a href={`https://goerli.etherscan.io/tx/` + txHash} className="viewTx" target="_blank">
          View tx on etherscan
        </a>
      </div>
    </div>
  );
}

export default App;
