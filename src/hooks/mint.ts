import Web3 from "web3";
export const MINT = {
    "p":"terc-20",
    "op":"mint",
    // "tick":"ethi",
    // "amt":"1000",
}
const prefix = "data:application/json,";
// data:application/json,{"p": "terc-20","op": "transfer","tick": "ethi","nonce": "45","to": [{"recv": "0x7BBAF8B409145Ea9454Af3D76c6912b9Fb99b2A9","amt": "10000"}]}
const TRANSFER = {
    "p": "terc-20",
    "op": "transfer",
}
export const receiver = "0x0000000000000000000000000000000000000000"

export const onMint =  async (tick: string, lim: string) => {
    const dataString = JSON.stringify({
      ...MINT,
      tick,
      nonce: new Date().getTime().toString(),
      amt: lim,
    })
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
            const accounts = await web3.eth.getAccounts();
            const sender = accounts[0];
            const value = web3.utils.toWei('0', 'ether');
            const data = web3.utils.asciiToHex('data:application/json,' + dataString);
            const tx = await web3.eth.sendTransaction({from: sender, to: receiver, value: value, data: data});
            console.log(`Transaction hash: ${tx.transactionHash}`);
            alert(`Transaction hash: ${tx.transactionHash}`)
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log('MetaMask is not installed!');
    }
}

export const onTransfer =  async (tick: string, to: {
    recv: string; 
    amt: string
}[]) => {
    const dataString = JSON.stringify({
      ...TRANSFER,
      tick,
      nonce: new Date().getTime().toString(),
      to,
    })
    console.log('dataString--->', dataString)
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
            const accounts = await web3.eth.getAccounts();
            const sender = accounts[0];
            const value = web3.utils.toWei('0', 'ether');
            const data = web3.utils.asciiToHex(prefix + dataString);
            const tx = await web3.eth.sendTransaction({from: sender, to: receiver, value: value, data: data});
            console.log(`Transaction hash: ${tx.transactionHash}`);
            alert(`Transaction hash: ${tx.transactionHash}`)
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log('MetaMask is not installed!');
    }
}