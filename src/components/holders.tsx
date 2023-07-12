import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import { Pagination } from "antd";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Link } from "umi";

export const Holders: FC<{
    tick: string;
    max: number;
}> = ({ tick, max }) => {
  const [total, __total] = useState(0)
  const [page, __page] = useState(1)
  const limit = 10
  const [ts_list, __ts_list] = useState<{
     address: string;
     balance: string;
     tick: string;
  }[]>([])
  useEffect(() => {
    axios.get('/api/token_holders', {
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
            <TableCell align="center">Index</TableCell>
            <TableCell align="center">Address</TableCell>
            <TableCell align="center">Balance</TableCell>
            <TableCell align="center">Percentage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {ts_list?.map(({address, balance, tick, }, index) => {
                const _balance = parseFloat(balance) / 1e8
                const row_index = (page - 1) * limit + index;
              return <TableRow key={address}>
                 <TableCell align="center">
                    <Typography>{row_index + 1}</Typography>
                  </TableCell>
                 <TableCell align="center">
                    <Link to={`/balance/${address}`}>
                      <Typography sx={{ textTransform: 'uppercase' }}>{address.substring(0, 7) + '...' + address.substring(address.length - 8, address.length)}</Typography>
                    </Link>
                  </TableCell>
                 <TableCell width="30%" align="center">
                      <Typography sx={{ textTransform: 'uppercase' }}>{_balance}</Typography>
                  </TableCell>
                 <TableCell width="30%" align="center">
                      <Typography sx={{ textTransform: 'uppercase' }}>{(_balance / max * 100).toFixed(3)} %</Typography>
                  </TableCell>
              </TableRow>
            })}
        </TableBody>
      </Table>
    </Box>
   <Pagination defaultCurrent={1} total={total} hideOnSinglePage showSizeChanger={false} onChange={(e) => __page(e)} />
</Box>
}