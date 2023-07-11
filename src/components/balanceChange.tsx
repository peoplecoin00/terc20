import { addressToStr } from "@/hooks/address";
import { receiver } from "@/hooks/mint";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import { Pagination } from "antd";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Link } from "umi";

export const BalanceChange: FC<{
    tick: string;
    address: string;
}> = ({ tick, address }) => {
  const [total, __total] = useState(0)
  const [page, __page] = useState(1)
  const [ts_list, __ts_list] = useState<{
    creator: string;
    from_address: string;
    to_address: string;
    time: string;
    tick: string;
    hash: string;
    amount: number;
    b: number;
  }[]>( [])

  
  const pageSize = 15
  useEffect(() => {
    axios.get('/api/ierc_balance_change_list', {
      params: {
        addr: address,
        tick,
        page,
        limit: pageSize,
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
  }, [tick, page, address])
  

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
            <TableCell align="center">Time</TableCell>
            <TableCell align="center">Method</TableCell>
            <TableCell align="center">Amount</TableCell>
            <TableCell align="center">From</TableCell>
            <TableCell align="center">To</TableCell>
            <TableCell align="center">Scan</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {ts_list?.map(({from_address, amount, to_address, time, hash, b}, index) => {
              return <TableRow key={index}>
                 <TableCell align="center">
                      <Typography>{new Date(parseInt(time) * 1000).toLocaleString()}</Typography>
                  </TableCell>
                 <TableCell align="center">
                      <Typography>{from_address === receiver ? 'mint' : to_address === address.toLocaleLowerCase() ? 'receive' : 'send'}</Typography>
                  </TableCell>
                 <TableCell align="center">
                      <Typography>{to_address === address.toLocaleLowerCase() ? `+${amount}` : `-${amount}`}</Typography>
                  </TableCell>
                 <TableCell align="center">
                  {
                    from_address === receiver ? <Typography>ierc-20 coinbase</Typography> :
                    <Link to={`/balance/${from_address}`}>
                      <Typography>{addressToStr(from_address)}</Typography>
                    </Link>
                  }
                  </TableCell>
                 <TableCell align="center">
                    <Link to={`/balance/${to_address}`}>
                      <Typography>{addressToStr(to_address)}</Typography>
                    </Link>
                  </TableCell>
                 <TableCell align="center">
                    <a target="_blank" href={`https://etherscan.io/tx/${hash}`}>
                      <Typography sx={{ textTransform: 'uppercase' }}>{hash.substring(0, 7) + '...' + hash.substring(hash.length - 7, hash.length)}</Typography>
                    </a>
                  </TableCell>
                 <TableCell align="center">
                      <Typography sx={{ textTransform: 'uppercase' }}>{b ? 'Success' : 'Fail'}</Typography>
                  </TableCell>
              </TableRow>
            })}
        </TableBody>
      </Table>
    </Box>
   <Pagination defaultCurrent={1} total={total} hideOnSinglePage pageSize={pageSize} showSizeChanger={false} onChange={(e) => __page(e)} />
</Box>
}