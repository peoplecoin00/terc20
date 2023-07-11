import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material';
import { LightTheme } from '@/theme/theme';
import styles from './index.less';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Search from 'antd/es/input/Search';
import {  Card, Form, Input, Pagination } from 'antd';
import { useHistory, useParams } from 'umi';
import { ITickInfo } from '.';
import { onMint } from '@/hooks/mint';
import { Transfer } from '@/components/transfer';
import { Footer } from '@/components/footer';
import { Transactions } from '@/components/transactions';
import { Holders } from '@/components/holders';
import { addressToStr } from '@/hooks/address';

interface typeTickInfo extends  ITickInfo {
  data: {
    lim: string;
    dec: string;
  }
}
export default function DetailPage() {
  const history = useHistory();
  const { tick } = useParams<{ tick?: string; }>();
  const [tickInfo, __tickInfo] = useState<typeTickInfo>()
  const [holder, __holder] = useState<number>(0)
  const [total, __total] = useState(0)
  
  useEffect(() => {
    axios.get('/api/tick_info', {
      params: {
        tick
      }
    }).then(res => {
      const data = res?.data?.data
      // console.log(data)
      if(data){
        __tickInfo({
          ...data,
          data: JSON.parse(data.json)
        })
      }
    })
    
    axios.get('/api/ierc_holder', {
      params: {
        tick
      }
    }).then(res => {
      __holder(res?.data?.total)
    })
  }, [tick])

  const isCompleted = false
  const prog = (parseInt(tickInfo?.amount || '0') / parseInt(tickInfo?.max || '0') * 100)

  const [mintLoading, __mintLoading] = useState(false)
  return (
      <Box
        className={styles.slogan}
        sx={{
          p: '20px',
        }}
      >
        <Box>
          <Typography
            component="h1"
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              history.replace('/');
            }}
          >
            IERC-20 (Beta)
          </Typography>
        </Box>
      
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '40px' }}>
              <Typography sx={{fontSize: '24px', fontWeight: 500, textTransform: 'uppercase'}}>{tick}</Typography>
              {
                isCompleted ? <Typography>Mint</Typography> : prog === 100 ? <span></span> : <Button disabled={mintLoading} size='small' variant="contained" onClick={async () => {
                  __mintLoading(true)
                  tickInfo ? await onMint(tickInfo.tick, tickInfo.data.lim) : void 0;
                  __mintLoading(false)
                }}>Mint Directly</Button>
              }
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '10px' }}>
            <Box sx={{ flex: 1, mr: '14px', background: 'rgba(0,0,0,0.15)', borderRadius: '5px', height: '6px', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{position: 'absolute', height: '100%', width: `${prog}%`, background: 'rgb(58, 200, 154)'}}></Box>
            </Box>
            <Typography sx={{ fontWeight: 600 }}>{ prog.toFixed(4)} %</Typography>
          </Box>
          <Box sx={{ border: '1px solid', borderRadius: '10px', mt: '20px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',  p: '20px 20px 0px 20px' }}>
              <Typography>Overview</Typography>
              <Box>
                <Button disabled>Trade</Button>
              </Box>
            </Box>
            <Box sx={{ p: '10px 20px 20px 20px', '.MuiTypography-root': {
              lineHeight: '2em'
              } }}>
              <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.2)', mb: '10px' }}></Box>
              <Typography>Supply: {tickInfo?.max}</Typography>
              <Typography>Minted: {tickInfo?.amount}</Typography>
              <Typography>Limit per mint: {tickInfo?.data?.lim}</Typography>
              <Typography>Decimal: {tickInfo?.data?.dec}</Typography>
              <Typography>Deploy By: 
                <a target="_blank" href={`https://etherscan.io/address/${tickInfo?.creator}`}>{addressToStr(tickInfo?.creator ?? '')}</a></Typography>
              <Typography>Deploy Time: {new Date(parseInt(tickInfo?.time || '0') * 1000).toLocaleString()}</Typography>
              {/* <Typography>Completed Time: {''}</Typography> */}
              <Typography>Holders: {holder || tickInfo?.holder}</Typography>
              <Typography>Total Transactions: {total}</Typography>
            </Box>
          </Box>
          <Box sx={{ mt: '30px' }}>
            <Typography sx={{fontSize: '20px'}}>Holder</Typography>
          </Box>
          <Holders tick={tick || ''} max={parseInt(tickInfo?.max || '0') || 0} />
          <Box sx={{ mt: '30px' }}>
            <Typography sx={{fontSize: '20px'}}>Transactions</Typography>
          </Box>
          <Transactions tick={tick || ''} total={total} __total={__total} />
        
        <Box sx={{ mt: '30px' }}>
            <Typography sx={{fontSize: '20px'}}>Send Token</Typography>
        </Box>
        <Box>
          <Transfer tick={tick || ''} />
        </Box>
        <Footer />
      </Box>
  );
}

declare global {
  interface Window {
    ethereum: any;
  }
}
