import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import Search from 'antd/es/input/Search';
import {  Card, Form, Input, Pagination } from 'antd';
import { ThemeProvider } from '@mui/material';
import { LightTheme } from '@/theme/theme';
import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { addressToStr } from "@/hooks/address";
import { Link } from "umi";

export const Transactions: FC<{
    tick: string;
    total: number;
    __total: React.Dispatch<React.SetStateAction<number>>;
}> = ({ tick, total, __total }) => {
    
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

    return <Box>
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
                 <TableCell width="30%" align="center">
                    <Link to={`/balance/${afrom}`}>
                      <Typography sx={{ textTransform: 'uppercase' }}>{addressToStr(afrom)}</Typography>
                    </Link>
                  </TableCell>
                 <TableCell width="30%" align="center">
                      <Typography sx={{ textTransform: 'uppercase' }}>{op}</Typography>
                  </TableCell>
                 <TableCell width="30%" align="center">
                    <a target="_blank" href={`https://etherscan.io/tx/${hash}`}>
                      <Typography sx={{ textTransform: 'uppercase' }}>{hash.substring(0, 4) + '...' + hash.substring(hash.length - 5, hash.length)}</Typography>
                    </a>
                  </TableCell>
              </TableRow>
            })}
        </TableBody>
      </Table>
    </Box>
      <Pagination defaultCurrent={1} total={total} hideOnSinglePage showSizeChanger={false} onChange={(e) => __page(e)} />
    </Box>
}