import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import { Pagination } from "antd";
import axios from "axios"
import { useEffect, useState } from "react";
import { useHistory, useParams } from "umi";

export default function SendList() {
    const history = useHistory()
    const { address } = useParams<{ tick?: string; address?: string }>();
    const [ts_list, __ts_list] = useState<{
        ID: string;
        blockNumber: string;
        afrom: string;
        hash: string;
        op: string;
        tick: string;
    }[]>([])
    
    
  const [total, __total] = useState(0)
  const [page, __page] = useState(1)
  useEffect(() => {
    axios.get(`/api/ierc_send_list?addr=${address}`).then(res => {
        const data = res?.data
        const _total = data?.total
        const list = data?.data
        if(_total){
          __total(data.total)
        }
        __ts_list(list)
    })
  }, [address])
    return <Box sx={{ p: '20px' }}>
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
          <Typography sx={{ color: 'red', fontSize: '18px', p: '40px 0px' }}>Here is the full data, not verified, for reference only</Typography>
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
        <Box>
          <Pagination defaultCurrent={1} total={total} hideOnSinglePage simple onChange={(e) => __page(e)} />
        </Box>
    </Box>
}