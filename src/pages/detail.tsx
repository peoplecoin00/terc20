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
  }, [tick])

  const [total, __total] = useState(0)
  const [page, __page] = useState(1)
  const [ts_list, __ts_list] = useState<{
     ID: string;
     blockNumber: string;
     afrom: string;
     hash: string;
     op: string;
     tick: string;
  }[]>([])
  useEffect(() => {
    axios.get('/api/token_transaction', {
      params: {
        tick,
        page,
      }
    }).then((res) => {
      const data = res?.data
      const _total = data?.total
      const list = data?.data
      if(_total){
        __total(data.total)
      }
      __ts_list(list)
    })
  }, [tick, page])

  console.log('tick---->', tickInfo, ts_list, total)
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
                isCompleted ? <Typography>Mint</Typography> : <Button disabled={mintLoading} size='small' variant="contained" onClick={async () => {
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
                <a target="_blank" href={`https://etherscan.io/address/${tickInfo?.creator}`}>{tickInfo?.creator}</a></Typography>
              <Typography>Deploy Time: {new Date(parseInt(tickInfo?.time || '0') * 1000).toLocaleString()}</Typography>
              <Typography>Completed Time: {''}</Typography>
              <Typography>Holders: {tickInfo?.holder}</Typography>
              <Typography>Total Transactions: {total}</Typography>
            </Box>
          </Box>
          <Box sx={{ mt: '30px' }}>
            <Typography sx={{fontSize: '20px'}}>Transactions</Typography>
          </Box>
        <Box>
        <Box sx={{
          border: '1px solid',
          borderRadius: '10px!important',
          m: '10px 0px 20px 0px',
        }}>
          <Table sx={{
            m: '10px 0px 20px 0px',
          }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">blockNumber</TableCell>
                <TableCell align="center">Address</TableCell>
                <TableCell align="center">Method</TableCell>
                <TableCell align="center">Hash</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {ts_list?.map(({ID, blockNumber, afrom, hash, op, tick, }, index) => {
                  return <TableRow key={ID}>
                     <TableCell align="center">
                          <Typography sx={{ textTransform: 'uppercase' }}>{blockNumber}</Typography>
                      </TableCell>
                     <TableCell align="center">
                          <Typography sx={{ textTransform: 'uppercase' }}>{afrom}</Typography>
                      </TableCell>
                     <TableCell align="center">
                          <Typography sx={{ textTransform: 'uppercase' }}>{op}</Typography>
                      </TableCell>
                     <TableCell align="center">
                        <a target="_blank" href={`https://etherscan.io/tx/${hash}`}>
                          <Typography sx={{ textTransform: 'uppercase' }}>{hash.substring(0, 4) + '...' + hash.substring(hash.length - 5, hash.length)}</Typography>
                        </a>
                      </TableCell>
                  </TableRow>
                })}
            </TableBody>
          </Table>
        </Box>
          <Pagination defaultCurrent={1} total={total} hideOnSinglePage simple onChange={(e) => __page(e)} />
        </Box>
        
        <Box sx={{ mt: '30px' }}>
            <Typography sx={{fontSize: '20px'}}>Send Token</Typography>
        </Box>
        <Box>
          <Transfer tick={tick || ''} />
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          sx={{
            svg: {
              p: '16px',
              width: '40px',
            },
          }}
        >
          <a href="https://twitter.com/EthinscXYZ" target="_blank">
            <svg
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2174"
              width="200"
              height="200"
            >
              <path
                d="M512 0C228.430769 0 0 228.430769 0 512s228.430769 512 512 512 512-228.430769 512-512S795.569231 0 512 0z m248.123077 366.276923c-3.938462 3.938462-3.938462 7.876923-7.876923 7.876923-7.876923 7.876923-15.753846 11.815385-23.630769 15.753846-3.938462 0-3.938462 3.938462-3.938462 7.876923 3.938462 43.323077-3.938462 86.646154-19.692308 129.969231-27.569231 74.830769-86.646154 133.907692-157.538461 169.353846-59.076923 35.446154-129.969231 47.261538-192.984616 31.507693-31.507692-3.938462-59.076923-15.753846-82.707692-31.507693l-3.938461-3.938461c0-3.938462 3.938462-7.876923 7.876923-7.876923 19.692308 0 39.384615-3.938462 59.076923-11.815385 19.692308-7.876923 39.384615-19.692308 55.138461-31.507692l3.938462-3.938462c0-3.938462 0-7.876923-3.938462-7.876923-15.753846-3.938462-27.569231-11.815385-39.384615-19.692308-15.753846-7.876923-27.569231-23.630769-35.446154-39.384615v-3.938461c0-3.938462 3.938462-7.876923 7.876923-7.876924h11.815385c3.938462 0 3.938462 0 3.938461-3.938461 3.938462-3.938462 0-7.876923-3.938461-11.815385-15.753846-7.876923-27.569231-19.692308-39.384616-31.507692-15.753846-15.753846-23.630769-35.446154-23.630769-55.138462v-3.938461c0-3.938462 7.876923-3.938462 7.876923-3.938462 3.938462 0 7.876923 3.938462 11.815385 3.938462h7.876923c3.938462 0 3.938462 0 7.876923-3.938462s3.938462-7.876923 0-11.815384c-15.753846-15.753846-27.569231-35.446154-31.507692-59.076923-3.938462-19.692308 0-43.323077 7.876923-63.015385v-3.938461c-7.876923 3.938462-3.938462 3.938462 0 7.876923 27.569231 27.569231 55.138462 51.2 90.584615 70.892307 39.384615 19.692308 82.707692 31.507692 126.030769 31.507693 3.938462 0 7.876923-3.938462 7.876923-7.876923 0-23.630769 7.876923-102.4 78.769231-122.092308 35.446154-11.815385 78.769231-3.938462 106.338462 27.569231 0 0 3.938462 3.938462 7.876923 3.938461 7.876923 0 15.753846-3.938462 27.569231-3.938461 7.876923-3.938462 15.753846-3.938462 23.630769-7.876923h7.876923c3.938462 0 3.938462 7.876923 3.938461 11.815384-3.938462 7.876923-11.815385 15.753846-19.692307 23.630769l-3.938462 3.938462c-3.938462 0-3.938462 3.938462-3.938461 7.876923s3.938462 7.876923 7.876923 7.876923 7.876923 0 15.753846-3.938461h7.876923c-3.938462-3.938462-3.938462 3.938462-7.876923 3.938461z"
                fill="#515151"
                p-id="2175"
              ></path>
            </svg>
          </a>
          <a href="https://github.com/peoplecoin00/terc20" target="_blank">
            <svg
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1667"
              id="mx_n_1682104723756"
              width="200"
              height="200"
            >
              <path
                d="M0 524.992q0 166.016 95.488 298.496t247.488 185.504q6.016 0.992 10.016 0.992t6.496-1.504 4-3.008 2.016-4.992 0.512-4.992v-100.512q-36.992 4-66.016-0.512t-45.504-14.016-28.992-23.488-16.992-25.504-8.992-24-5.504-14.496q-8.992-15.008-27.008-27.488t-27.008-20-2.016-14.496q50.016-26.016 112.992 66.016 34.016 51.008 119.008 30.016 10.016-40.992 40-70.016Q293.984 736 237.984 670.976t-56-158.016q0-87.008 55.008-151.008-22.016-64.992 6.016-136.992 28.992-2.016 64.992 11.488t50.496 23.008 25.504 17.504q56.992-16 128.512-16t129.504 16q12.992-8.992 28.992-19.008t48.992-21.504 60.992-9.504q27.008 71.008 7.008 135.008 56 64 56 151.008 0 92.992-56.992 158.496t-172 85.504q43.008 43.008 43.008 104v128.992q0 0.992 0.992 3.008 0 6.016 0.512 8.992t4.512 6.016 12 3.008q152.992-52 250.496-185.504t97.504-300.512q0-104-40.512-199.008t-108.992-163.488-163.488-108.992T512.032 12.96 313.024 53.472 149.536 162.464t-108.992 163.488-40.512 199.008z"
                p-id="1668"
                fill="#515151"
              ></path>
            </svg>
          </a>
        </Box>
      </Box>
  );
}

declare global {
  interface Window {
    ethereum: any;
  }
}
