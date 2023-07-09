import { Box, Button, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material';
import { LightTheme } from '@/theme/theme';
import styles from './index.less';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Search from 'antd/es/input/Search';
import {  Card, Form, Input } from 'antd';
import { useHistory, useParams } from 'umi';
import { Footer } from '@/components/footer';
const receiver = "0x0000000000000000000000000000000000000000"

const MuiButton = Button as any
export default function DeployPage() {
  const history = useHistory();

  const onFinish = async (values: {Tick: string, Supply: string, Limit: string}) => {
    console.log('Success:', values);
    const json = {
        "p":"terc-20",
        "op":"deploy",
        "tick": values.Tick,
        "max":values.Supply,
        "lim":values.Limit,
        "wlim": (parseInt(values.Limit) * 10).toString(),
        "dec":"8",
        nonce: new Date().getTime().toString().substring(7, 13),
    }
    const dataString = JSON.stringify(json)
    console.log('json--->', json)
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
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <ThemeProvider theme={LightTheme}>
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
      
        <Box sx={{ textAlign: 'center', form: {
            border: '1px solid',
            borderRadius: '10px',
            p: '40px 20px',
        } }}>
          <Typography sx={{ fontSize: '24px', mt: '30px', mb: '30px' }}>Deploy</Typography>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            // wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600, margin: '0px auto' }}
            // initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            initialValues={{
                Tick: "",
                Supply: "21000000",
                Limit: "1000",
            }}
          >
            <Form.Item
              label="Tick"
              name="Tick"
              rules={[{ required: true, message: 'Deploy Tick' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Supply"
              name="Supply"
              rules={[{ required: true, message: 'Deploy Supply' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Limit "
              name="Limit"
              rules={[{ required: true, message: 'Limit Per Mint' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <MuiButton variant='contained' type="primary" htmlType="submit">
              Deploy
              </MuiButton>
            </Form.Item>
          </Form>
        </Box>

        {/* <Button variant='contained' onClick={deploy}>Deploy</Button> */}
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
