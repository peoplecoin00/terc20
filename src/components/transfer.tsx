import { onTransfer } from "@/hooks/mint";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Box, Input, Typography } from "@mui/material"
import { Button, Card, Form, InputNumber, Space } from "antd";
import { FC, useState } from "react";

// const MuiButton = Button as any
export const Transfer: FC<{
    tick: string;
}> = ({
    tick,
}) => {
    const [send_loading, __send_loading] = useState(false)
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    const onFinish = async (values: {transfer: {recv: string, amt: string}[]}) => {
        __send_loading(true)
        const _to = values.transfer
        if(_to.length){
            const to = _to.map((e) => {
                return {
                    ...e,
                    recv: e.recv.toLocaleLowerCase()
                }
            })
            await onTransfer(tick, to)
        }
        __send_loading(false)
        console.log('Success:', values);
    }
    return <Card style={{ margin: '20px 0px' }}>
        <Typography sx={{ mb: '20px', fontSize: '16px', }}>Bulk Transfer</Typography>
        <Form
            name="basic"
            labelCol={{ span: 4 }}
            // wrapperCol={{ span: 16 }}
            style={{ 
                // maxWidth: 800, 
                // margin: '0px auto' 
            }}
            // initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            initialValues={{
                transfer: [
                    {recv: '', amt: ''}
                ]
            }}
          >
            <Form.List name="transfer">{(fields, { add, remove }) => {
                return <>
                {fields.map(({ key, name, ...restField }) => (<Space key={key} style={{ display: 'flex', marginBottom: '30px',  }} align="center">
                    <Form.Item
                        {...restField}
                        name={[name, 'recv']}
                        rules={[{ required: true, message: 'Missing recv address', len: 42 }]}
                        style={{ marginBottom: '0px' }}
                    >
                        <Input style={{width: '450px'}} placeholder="recv address" />
                    </Form.Item>
                    <Form.Item
                        {...restField}
                        name={[name, 'amt']}
                        rules={[{ required: true, message: 'Missing amt' }]}
                        style={{ marginLeft: '40px', marginBottom: '0px' }}
                    >
                        <InputNumber addonAfter={tick.toLocaleUpperCase()} placeholder={`${tick} amount`} />
                    </Form.Item>
                    <MinusCircleOutlined style={{ marginLeft: '20px' }} onClick={() => remove(name)} />
                </Space>))}
                <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add transfer account
                    </Button>
                </Form.Item>
                </>
            }}</Form.List>
            <Form.Item>
            <Button loading={send_loading} type="primary" htmlType="submit">
            Send an {tick.toLocaleUpperCase()} inscription
            </Button>
            </Form.Item>
        </Form>
        <Typography sx={{ fontSize: '16px', mb: '4px', color: 'rgba(20,0,0,0.5)' }}>TIPS:</Typography>
        <Typography sx={{ color: 'rgba(20,0,0,0.5)' }}>* Please make sure you have enough balance, you check your balance first.</Typography>
        <Typography sx={{ color: 'rgba(20,0,0,0.5)' }}>* Before mint, please do not receive transfers from others, transfers are also counted as balance.</Typography>
    </Card>
}