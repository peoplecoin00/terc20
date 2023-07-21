import Web3 from 'web3';
import detectProvider, { MetaMaskEthereumProvider } from './detectProvider';

const getRpc = (chain: number) =>
  chain === 1
    ? 'https://mainnet.infura.io/v3/'
    : 'https://rinkeby.infura.io/v3/';

const defaultChain = process.env.REACT_APP_BASE_ENV === 'test' ? 4 : 1;

let web3: Web3;
let provider: MetaMaskEthereumProvider;
const ethWeb3 = () => {
  // @ts-ignore
  const ethereum = window?.ethereum;
  return {
    isConnect(): boolean {
      return ethereum?.isConnected?.() ?? false;
    },
    connect() {
      ethereum?.enable();
    },
    notAccountWeb3(chain = defaultChain) {
      var web3 = new Web3();

      web3.setProvider(new Web3.providers.HttpProvider(getRpc(chain)));
      return web3;
    },
    async web3(): Promise<Web3 | undefined> {
      const _provider = await detectProvider();
      if (_provider) {
        provider = _provider;
        web3 = new Web3(provider as any);
        return web3;
      }
    },
    getProvider: () => provider,
  };
};

export { web3, ethWeb3, provider };

