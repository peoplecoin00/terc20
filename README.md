# IERC-20

Website: https://ethinsc.xyz

IETH-20 is an Eth Inscription protocol, upgraded based on terc, with complete token transaction logic and extremely low transaction fees, as well as batch transfer capabilities.
It is very index friendly and ETHINSC has opened an API for direct use.

## prefix
data:application/json,

## Simple example

### Deploy
data:application/json,{"p":"terc-20","op":"deploy","tick":"ethi","max":"21000000","lim":"1000","wlim":"10000","dec":"8","nonce":"10"}

### Mint
data:application/json,{"p":"terc-20","op":"mint","tick":"ethi","amt":"1000","nonce":"11"}

### Transfer
data:application/json,{"p": "terc-20","op": "transfer","tick": "ethi","nonce": "45","to": [{"recv": "0x7BBAF8B409145Ea9454Af3D76c6912b9Fb99b2A9","amt": "10000"}]}


## Detailed examples

```
data:application/json,

+

// deploy; send 0eth from self to 0x0000000000000000000000000000000000000000;
{
    "p":"terc-20", //protocol name: tradable/transferrable erc-20
    "op":"deploy", //operation: deploy/mint/transfer/sell/sellAck
    "tick":"ethi", //token tick, can't be repeatable
    "max":"21000000", //max supply
    "lim":"1000", //limit for each mint
    "wlim":"10000", //limit for each address can maximum mint, address balance < deploy.wlim (Before mint, please do not receive transfers from others, transfers are also counted as balance)
    "dec":"8", //decimal for minimum divie
    "nonce":"0", //increasing interger, suggest using address original nonce
}

// mint; send 0eth from self to 0x0000000000000000000000000000000000000000;
{
    "p":"terc-20",
    "op":"mint", //mint operation
    "tick":"ethi",
    "amt":"1000", //mint amount
    "nonce":"1"
}

// transfer; send 0eth from self to 0x0000000000000000000000000000000000000000
{
  "p": "terc-20",
  "op": "transfer", //transfer operation
  "tick": "ethi",
  "nonce": "2",
  "to": [ //batch transfer, the sum of amt must equal the previous amt param
    {
      "recv": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", //receiver address
      "amt": "50" //receiver amount
    },
    {
      "recv": "0x0000000000085d4780B73119b644AE5ecd22b376",
      "amt": "50"
    }
  ]
}
```
