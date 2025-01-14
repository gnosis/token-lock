export const TOKEN_LOCK_ABI = [
    {
      type: "function",
      name: "balanceOf",
      constant: true,
      stateMutability: "view",
      payable: false,
      inputs: [
        {
          type: "address",
        },
      ],
      outputs: [
        {
          type: "uint256",
        },
      ],
    },
    {
      type: "function",
      name: "decimals",
      constant: true,
      stateMutability: "view",
      payable: false,
      inputs: [],
      outputs: [
        {
          type: "uint256",
        },
      ],
    },
    {
      type: "function",
      name: "deposit",
      constant: false,
      payable: false,
      inputs: [
        {
          type: "uint256",
          name: "amount",
        },
      ],
      outputs: [],
    },
    {
      type: "function",
      name: "depositDeadline",
      constant: true,
      stateMutability: "view",
      payable: false,
      inputs: [],
      outputs: [
        {
          type: "uint256",
        },
      ],
    },
    {
      type: "function",
      name: "lockDuration",
      constant: true,
      stateMutability: "view",
      payable: false,
      inputs: [],
      outputs: [
        {
          type: "uint256",
        },
      ],
    },
    {
      type: "function",
      name: "token",
      constant: true,
      stateMutability: "view",
      payable: false,
      inputs: [],
      outputs: [
        {
          type: "address",
        },
      ],
    },
    {
      type: "function",
      name: "name",
      constant: true,
      stateMutability: "view",
      payable: false,
      inputs: [],
      outputs: [
        {
          type: "string",
        },
      ],
    },
    {
      type: "function",
      name: "symbol",
      constant: true,
      stateMutability: "view",
      payable: false,
      inputs: [],
      outputs: [
        {
          type: "string",
        },
      ],
    },
    {
      type: "function",
      name: "totalSupply",
      constant: true,
      stateMutability: "view",
      payable: false,
      inputs: [],
      outputs: [
        {
          type: "uint256",
        },
      ],
    },
    {
      type: "function",
      name: "withdraw",
      constant: false,
      payable: false,
      inputs: [
        {
          type: "uint256",
          name: "amount",
        },
      ],
      outputs: [],
    },
  ]