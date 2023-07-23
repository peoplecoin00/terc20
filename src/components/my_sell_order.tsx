import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import Search from 'antd/es/input/Search';
import {  Button, Card, Empty, Form, Input, Pagination, message as reactMessage } from 'antd';
import { ThemeProvider } from '@mui/material';
import { LightTheme } from '@/theme/theme';
import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { DEX_ADDRESS, addressToStr } from "@/hooks/address";
import { Link } from "umi";
import { useEth } from "@/hooks/useeth";

export const MySellOrder: FC<{
    addr: string;
    reload?: () => void;
}> = ({ addr, reload }) => {
  const { web3 } = useEth()
    
  const [total, __total] = useState(0)
  const [page, __page] = useState(1)
  const [ts_list, __ts_list] = useState<{
     ID: string;
     creator: string;
     time: string;
     value: string;
     amt: string;
     tick: string;
     status: string;
     nonce: string;
    //  sign: string;
  }[]>([])

  const [count, __count] = useState(0)
  useEffect(() => {
    axios.get('/api/ierc_mysell', {
      params: {
        addr,
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
  }, [addr, page, count])

  
  const [listInscLoading, __listInscLoading] = useState(false);
  const onCanelApprove = async ({ tick, nonce }: { tick: string; nonce: string}) => {
      try {
          __listInscLoading(true)
          if(web3){
              const accounts = await web3.eth.getAccounts();
              const sender = accounts[0];
              const message = JSON.stringify({
                  title: 'ierc-20 cancel approve', // one approve
                  to: DEX_ADDRESS, // platform address
                  tick,
                  // nonce: (+new Date()).toString(),
                  nonce,
              }, null, 4)
              const sign = await web3.eth.personal.sign(message, sender, '')
              console.log(message)
              console.log(sign)

              axios.post('/api/ierc_cancel_list', {
                  message,
                  sign,
                  addr: sender.toLocaleLowerCase()
              }).then(res => {
                  console.log('res--->', res.data.data)
                  if(res.data?.data){
                    reactMessage.success('cancel list success')
                      reload?.()
                      setTimeout(() => {
                        __count(+new Date())
                      }, 800)
                  }else{
                    reactMessage.error('cancel list fail')
                  }
                  __listInscLoading(false)
              }).catch(() => {
                reactMessage.error('error')
                  __listInscLoading(false)
              })
          }
      } catch (error) {
          console.error(error);
          __listInscLoading(false)
      }
    }
    return <Box>
    <Card>
      <Table sx={{
        m: '10px 0px 20px 0px',
      }}>
        <TableHead>
          <TableRow>
            <TableCell align="center">Time</TableCell>
            <TableCell align="center">Address</TableCell>
            <TableCell align="center">Sell Number</TableCell>
            <TableCell align="center">Value</TableCell>
            <TableCell align="center">Active</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {ts_list?.map(({ID, value, tick, time, creator, amt, nonce,  status }, index) => {
              return <TableRow key={ID + nonce}>
                 <TableCell align="center">
                      <Typography sx={{ textTransform: 'uppercase' }}>{new Date(+time).toLocaleString()}</Typography>
                  </TableCell>
                 <TableCell width="30%" align="center">
                    <Link to={`/balance/${creator}`}>
                      <Typography sx={{ textTransform: 'uppercase' }}>{addressToStr(creator)}</Typography>
                    </Link>
                  </TableCell>
                 <TableCell align="center">
                      <Typography>{amt} {tick}</Typography>
                  </TableCell>
                 <TableCell align="center">
                      <Typography sx={{ textTransform: 'uppercase' }}>{value} eth</Typography>
                  </TableCell>
                 <TableCell align="center">
                    {status === 'list' ? 
                      <Button disabled={listInscLoading} onClick={() => onCanelApprove({ tick, nonce })}>Cancel List</Button>:
                      '--'
                    }
                  </TableCell>
              </TableRow>
            })}
        </TableBody>
      </Table>
      {ts_list?.length === 0 && <Box sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}>
        <Empty />
      </Box>}
    </Card>
      <Pagination defaultCurrent={1} total={total} hideOnSinglePage showSizeChanger={false} onChange={(e) => __page(e)} />
    </Box>
}