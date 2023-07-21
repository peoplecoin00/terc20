import { useEffect, useState } from 'react';
import { ethWeb3, web3 } from './eth';

const supportChains = [1, 4];
export const useEth = () => {
  const [_web3, setWeb3] = useState<typeof web3>();
  const [rpcWeb3, setRpcWeb3] = useState<typeof web3>();
  const { notAccountWeb3, ...eth } = ethWeb3();
  const [walletAddress, setWalletAddress] = useState<string>();
  const [chain, setChain] = useState<number>();
  const [isConnect, setIsConnect] = useState<Boolean>(false);

  const fetchSetAccount = () => {
    if (_web3 ?? web3) {
      (_web3 ?? web3).eth.getAccounts().then(res => {
        setWalletAddress(res[0]);
      });
      fetchSetChain();
    }
  };
  const fetchSetChain = async () => {
    try {
      const res = await web3?.eth?.getChainId();
      setChain(res);
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    setIsConnect(!!walletAddress && supportChains.includes(chain ?? -1));
  }, [walletAddress, chain]);

  useEffect(() => {
    setRpcWeb3(notAccountWeb3(chain));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain]);

  useEffect(() => {
    eth.web3().then(res => {
      setWeb3(res);
      eth.getProvider().on('connect', () => {
        fetchSetAccount();
      });
      eth.getProvider().on('chainChanged', () => {
        console.log('chainChanged');
        fetchSetChain();
      });
      // run accountsChanged
      eth.getProvider().on('disconnect', () => {
        console.log('disconnect');
        fetchSetAccount();
      });
      eth.getProvider().on('accountsChanged', () => {
        // console.log('accountsChanged');
        fetchSetAccount();
      });
    });
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    fetchSetAccount();
    // eslint-disable-next-line
  }, [_web3]);

  return {
    walletAddress,
    eth,
    address: walletAddress,
    chain,
    connect: eth.connect,
    web3: _web3,
    isConnect,
    rpcWeb3,
  };
};

