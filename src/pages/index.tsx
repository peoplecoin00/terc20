import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { ThemeProvider } from "@mui/material";
import { LightTheme } from "@/theme/theme";
import styles from './index.less';
import Web3 from "web3";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Search from 'antd/es/input/Search';
import { useHistory } from 'umi';
import { Footer } from '@/components/footer';
import { Pagination } from 'antd';

const receiver = "0x0000000000000000000000000000000000000000"

const MINT = {
  "p":"terc-20",
  "op":"mint",
  "tick":"ethi",
  // "amt":"1000",
}

axios.defaults.baseURL = location.host === 'localhost:1001' ? 'http://127.0.0.1:3000' : 'https://api.ethinsc.xyz'
// axios.defaults.baseURL = 'https://api.ethinsc.xyz'

const AntdSearch: any = Search
export default function IndexPage() {
  const history = useHistory()
  const [tick_list, __tick_list] = useState<ITickInfo[]>([])
  const [total, __total] = useState(0)
  const [page, __page] = useState(1)
  const pageSize = 20
  useEffect(() => {
    axios.get('/api/ierc_list', {
      params: {
        page,
        limit: pageSize,
      }
    }).then(async res => {
      if(res.data){
        let list = []
        for (const iterator of res.data.data) {
          const Progress = (parseInt(iterator.amount) / parseInt(iterator.max) * 100).toFixed(4)
          if(Progress === '100.0000'){
            const holder = await new Promise((ok) => {
              axios.get('/api/ierc_holder', {
                params: {
                  tick: iterator.tick
                }
              }).then(res => {
                ok(res?.data?.total || iterator?.holder)
              })
            })
            iterator.holder = holder
            
          }
          list.push({
            ...iterator,
            json: JSON.parse(iterator.json)
          })
        }

        if(list?.length){
          __tick_list(list)
        }
        __total(res?.data?.total ?? 0)
      }
    })
  }, [page])
  const onMint =  async (tick: string, lim: string) => {
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
  const onDetail = (tick: string) => {
    history.push(`/detail/${tick}`)
  }
  return (
    <ThemeProvider theme={LightTheme}>
    {!true ? <Box className={styles.slogan} sx={{
      p: '20px',
    }}>
        <Box sx={{ display: 'flex' }}>
          <Typography component="h1">IERC-20 (Beta)</Typography>
          <Typography component="h1" sx={{ml: '40px', cursor: 'pointer'}} onClick={() => {
            history.push('/deploy')
          }}>Deploy</Typography>
        </Box>
        <Box textAlign={"center"} sx={{
          mt: '40px',
          mb: '20px',
        }}>
          <Typography sx={{ fontSize: '20px', mb: '20px' }}>Check out IERC-20 balance of the address.</Typography>
          <form>
            <AntdSearch
              placeholder="input search address"
              allowClear
              autoComplete={"on"}
              name="address"
              onSearch={(value: any) => {
                console.log('value', value)
                  history.push(`/balance/${value}`)
              }}
              enterButton 
              style={{ maxWidth: 604 }}
            />
          </form>
        </Box>
        <Box sx={{
          mt: '40px',
          border: '1px solid ',
          borderRadius: '10px',
          padding: '20px 20px',
        }}>
          <Box sx={{
            // borderBottom: '1px solid ',
            mb: '20px',
            textAlign: 'center',
            lineHeight: '2em',
          }}>
            <Typography component="h3">The full list of IERC-20</Typography>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Tick</TableCell>
                <TableCell align="center">Depoly Time</TableCell>
                <TableCell align="center">Progress</TableCell>
                <TableCell align="center">Holder</TableCell>
                <TableCell align="center">Limit per mint</TableCell>
                <TableCell align="center">Mint</TableCell>
                <TableCell align="center">Detail / Trade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tick_list?.map((tick) => {
                const Progress = (parseInt(tick.amount) / parseInt(tick.max) * 100).toFixed(4)
                return <TableRow key={tick.tick + '-' + tick.holder}  sx={{
                  borderBottom: '1px solid',
                  '::hover': {
                    cursor: 'pointer',
                    background: 'rgba(0,0,0,0.5)',
                  }
                }}>
                    <TableCell  align="center">
                      <Typography sx={{ 
                        // textTransform: 'uppercase' 
                      }}>{tick.tick}</Typography>
                    </TableCell>
                    <TableCell  align="center">
                      <Typography>{new Date(parseInt(tick.time) * 1000).toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell  align="center">
                      <Typography>{ Progress } %</Typography>
                    </TableCell>
                    <TableCell  align="center">
                      <Typography>{tick.holder}</Typography>
                    </TableCell>
                    <TableCell  align="center">
                      <Typography>{tick.json.lim}</Typography>
                    </TableCell>
                    <TableCell  align="center">
                      {Progress === '100.0000' ? '--' : <Button variant='outlined'  onClick={() => onMint(tick.tick, tick.json.lim)}>Mint</Button>}
                    </TableCell>
                    <TableCell  align="center">
                      {/* <Button variant='outlined'  onClick={() => onDetail(tick.tick)}>Detail / Trade</Button> */}
                      <Button variant='outlined'  onClick={() => onDetail(tick.tick)}>Detail</Button>
                    </TableCell>
                </TableRow>
              })}
            </TableBody>
          </Table>
        </Box>
        <Box sx={{ mt: '50px' }}>
          <Pagination defaultCurrent={1} total={total} pageSize={pageSize} showSizeChanger={false} onChange={(e) => __page(e)} />
        </Box>
        <Footer />
      </Box> : <Box sx={{ p: '20px' }}>
        <Typography> Updating and maintaining</Typography>
        <Typography> * transfer record </Typography>
        <Typography> * Holder information </Typography>
        <Typography> * Fix self-transfer error </Typography>
      </Box>}
  </ThemeProvider>
  );
}


declare global {
  interface Window {
      ethereum: any;
  }
}

export type ITickInfo = {
  holder: string;
  creator: string;
  time: string;
  max: string;
  amount: string;
  tick: string;
  json: {
    lim: string;
    wlim: string;
  }
}