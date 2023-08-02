import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material';
import { LightTheme, maxWidthSx } from '@/theme/theme';
import styles from './index.less';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Search from 'antd/es/input/Search';
import {  Button, Card, Divider, Form, Input, Pagination } from 'antd';
import { Link, useHistory, useParams } from 'umi';
import { ITickInfo } from '.';
import { onMint } from '@/hooks/mint';
import { Transfer } from '@/components/transfer';
import { Footer } from '@/components/footer';
import { Transactions } from '@/components/transactions';
import { Holders } from '@/components/holders';
import { addressToStr } from '@/hooks/address';
import { Header } from '@/components/header';

interface typeTickInfo extends  ITickInfo {
  data: {
    lim: string;
    wlim: string;
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
    <>
        <Header />
      <Box
        className={styles.slogan}
        sx={{
          p: '20px',
        }}
      >
        <Box sx={{
          ...maxWidthSx
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '40px', }}>
              <Typography sx={{fontSize: '24px', fontWeight: 500, textTransform: 'uppercase'}}>{tick}</Typography>
              {
                isCompleted ? <Typography>Mint</Typography> : prog === 100 ? <span></span> : <Button disabled={mintLoading} size='small' onClick={async () => {
                  __mintLoading(true)
                  tickInfo ? await onMint(tickInfo.tick, tickInfo.data.lim) : void 0;
                  __mintLoading(false)
                }}>Mint Directly</Button>
              }
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '10px' }}>
            <Box sx={{ flex: 1, mr: '14px', background: 'rgba(0,0,0,0.15)', borderRadius: '5px', height: '6px', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{position: 'absolute', height: '100%', width: `${prog}%`, background: '#1677ff'}}></Box>
            </Box>
            <Typography sx={{ fontWeight: 600 }}>{ prog.toFixed(4)} %</Typography>
          </Box>
          <Card style={{ marginTop: '40px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',  p: '20px 20px 0px 20px' }}>
              <Typography sx={{ fontSize: '18px' }}>Overview</Typography>
              <Box>
                <Link to={`/market?tick=${tick}`}>
                  <Button>Trade</Button>
                </Link>
              </Box>
            </Box>
            <Box sx={{ p: '0px 20px 20px 20px', '.MuiTypography-root': {
              lineHeight: '2em'
              } }}>
              <Divider />
              <Typography>Supply: {tickInfo?.max}</Typography>
              <Typography>Minted: {tickInfo?.amount}</Typography>
              <Typography>Limit per mint: {tickInfo?.data?.lim}</Typography>
              <Typography>Maximum minting times for a single address: {Number(tickInfo?.data?.wlim ?? '0') / Number(tickInfo?.data?.lim ?? '0')}</Typography>
              <Typography>Decimal: {tickInfo?.data?.dec}</Typography>
              <Typography>Deploy By: 
                <a target="_blank" href={`https://etherscan.io/address/${tickInfo?.creator}`}>{addressToStr(tickInfo?.creator ?? '')}</a></Typography>
              <Typography>Deploy Time: {new Date(parseInt(tickInfo?.time || '0') * 1000).toLocaleString()}</Typography>
              {/* <Typography>Completed Time: {''}</Typography> */}
              <Typography>Holders: {holder || tickInfo?.holder}</Typography>
              <Typography>Total Transactions: {total}</Typography>
            </Box>
          </Card>
          <Card style={{ marginTop: '40px' }}>
            <Box>
              <Typography sx={{fontSize: '20px'}}>Holder</Typography>
            </Box>
            <Holders tick={tick || ''} max={parseInt(tickInfo?.max || '0') || 0} />
          </Card>
          
          <Card style={{ marginTop: '40px' }}>
            <Box>
              <Typography sx={{fontSize: '20px'}}>Transactions</Typography>
            </Box>
            <Transactions tick={tick || ''} total={total} __total={__total} />
          </Card>
        
          <Card style={{ marginTop: '40px' }}>
            <Box>
                <Typography sx={{fontSize: '20px'}}>Send Token</Typography>
            </Box>
            <Box>
              <Transfer tick={tick || ''} />
            </Box>
          </Card>
        </Box>
        <Footer />
      </Box>
    </>
  );
}

declare global {
  interface Window {
    ethereum: any;
  }
}
