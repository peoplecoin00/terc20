import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ThemeProvider } from '@mui/material';
import { LightTheme } from '@/theme/theme';
import styles from './index.less';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Search from 'antd/es/input/Search';
import { Card } from 'antd';
import { Link, useHistory, useParams } from 'umi';
import { Footer } from '@/components/footer';

export default function BalancePage() {
    const history = useHistory()
  const [balances, __balances] = useState<{ tick: string; balance: string }[]>([]);
  const { tick, address } = useParams<{ tick?: string; address?: string }>();

  const [searchAddress, __searchAddress] = useState('')
  useEffect(() => {
    axios.get(`/api/terc_balances?addr=${searchAddress || address}`).then(res => {
        __balances(res?.data?.data ?? [])
    })
  }, [address, searchAddress])
  return (
    <ThemeProvider theme={LightTheme}>
      <Box
        className={styles.slogan}
        sx={{
          p: '20px',
        }}
      >
        <Box>
          <Typography component="h1" sx={{ cursor: 'pointer' }} onClick={() => {
            history.replace('/')
          }}>IERC-20 (Beta)</Typography>
        </Box>
        <Box
          textAlign={'center'}
          sx={{
            mt: '40px',
            mb: '20px',
          }}
        >
          <Typography sx={{ fontSize: '20px', mb: '20px' }}>
            Check out IERC-20 balance of the address.
          </Typography>
          <form>
            <Search
              placeholder="input search address"
              allowClear
              defaultValue={address}
              autoComplete={"on"}
              onSearch={(value) => {
                console.log('value', value);
                if(value[0] === '0' && value[1] === 'x'){
                  __searchAddress(value)
                }
              }}
              enterButton
              style={{ maxWidth: 604 }}
            />
          </form>
        </Box>
        <Box
          sx={{
            mt: '40px',
            border: '1px solid ',
            borderRadius: '10px',
            padding: '20px 20px',
          }}
        >
          <Box
            sx={{
              // borderBottom: '1px solid ',
              mb: '20px',
              textAlign: 'center',
              lineHeight: '2em',
            }}
          >
            <Typography component="h3">The full list of IERC-20</Typography>
          </Box>

          {(balances && balances.length > 0 ? balances : [{
            tick: 'ethi',
            balance: '0.0000',
          }]).map((balance, index) => <Card key={JSON.stringify(balance)} title={balance.tick} style={{ width: 300, display: 'inline-block', marginRight: '20px' }}>
            <Typography>Balance: {balance.balance}</Typography>
          </Card>)}

          <Table>
            {/* <TableHead>
              <TableRow>
                <TableCell align="center">Method</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Balance</TableCell>
                <TableCell align="center">Date Time</TableCell>
                <TableCell align="center">Date Time</TableCell>
              </TableRow>
            </TableHead> */}
            <Box sx={{ mt: '20px' }}></Box>
            <TableBody>
              <Typography>Transaction comming soon</Typography>
              <Box>
                <Link to={`/send_list/${searchAddress || address}`}>query links all relevant data</Link>
              </Box>
            </TableBody>
          </Table>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

declare global {
  interface Window {
    ethereum: any;
  }
}
