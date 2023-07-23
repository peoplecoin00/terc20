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
import BigNumber from "bignumber.js";

export const AllOrder: FC<{
    reload?: () => void;
}> = ({ reload }) => {
  // const { web3 } = useEth()
    
  const [total, __total] = useState(0)
  const [page, __page] = useState(1)
  const [ts_list, __ts_list] = useState<{
     ID: string;
     creator: string;
     time: string;
     value: string;
     amt: string;
     tick: string;
     nonce: string;
     ato: string;
    //  sign: string;
  }[]>([])

  const [count, __count] = useState(0)
  useEffect(() => {
    axios.get('/api/ierc_order_all', {
      params: {
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
  }, [page, count])

  
    return <Box>
    <Card>
      <Table sx={{
        m: '10px 0px 20px 0px',
      }}>
        <TableHead>
          <TableRow>
            <TableCell align="center">Time</TableCell>
            <TableCell align="center">Seller</TableCell>
            <TableCell align="center">Buyer</TableCell>
            <TableCell align="center">Sell Number</TableCell>
            <TableCell align="center">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {ts_list?.map(({ID, value, tick, time, creator, amt, nonce, ato }, index) => {
              return <TableRow key={ID + nonce}>
                 <TableCell align="center">
                      <Typography sx={{ textTransform: 'uppercase' }}>{new Date(parseInt(time) * 1000).toLocaleString()}</Typography>
                  </TableCell>
                 <TableCell align="center">
                    <Link to={`/balance/${creator}`}>
                      <Typography sx={{ textTransform: 'uppercase' }}>{addressToStr(creator)}</Typography>
                    </Link>
                  </TableCell>
                 <TableCell  align="center">
                    <Link to={`/balance/${ato}`}>
                      <Typography sx={{ textTransform: 'uppercase' }}>{addressToStr(ato)}</Typography>
                    </Link>
                  </TableCell>
                 <TableCell align="center">
                      <Typography>{amt} {tick}</Typography>
                  </TableCell>
                 <TableCell align="center">
                      <Typography sx={{ textTransform: 'uppercase' }}>{new BigNumber(value).dividedBy(1e18).toFixed(5)} eth</Typography>
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