import Web3 from "web3";
export const MINT = {
    "p":"terc-20",
    "op":"mint",
    // "tick":"ethi",
    // "amt":"1000",
}
export const receiver = "0x0000000000000000000000000000000000000000"

export const onMint =  async (tick: string, lim: string) => {
    const dataString = JSON.stringify({
      ...MINT,
      tick,
      nonce: new Date().getTime().toString().substring(7, 13),
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
            const tx = await web3.eth.sendTransaction({from: sender, to: receiver, value: value, nonce: 93, data: data});
            console.log(`Transaction hash: ${tx.transactionHash}`);
            alert(`Transaction hash: ${tx.transactionHash}`)
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log('MetaMask is not installed!');
    }
  }