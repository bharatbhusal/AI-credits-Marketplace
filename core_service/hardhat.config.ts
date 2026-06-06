import "@cofhe/hardhat-plugin";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: any = {
	solidity: {
		version: "0.8.28",
		settings: {
			evmVersion: "cancun",
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	networks: {
		sepolia: {
			// url: `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`,
			url: `https://ethereum-sepolia-rpc.publicnode.com`,
			accounts: [process.env.PRIVATE_KEY],
		},
		arbitrum: {
			url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
			accounts: [process.env.PRIVATE_KEY],
		},
		onetest: {
			url: "https://rpc-onetest-network-hfuey4hrji.t.conduit.xyz",
			accounts: [process.env.PRIVATE_KEY],
		},
		ouroboro: {
			url: "https://rpc.ouroboro.org",
			accounts: [process.env.PRIVATE_KEY],
		},
		binance: {
			url: "https://bsc-dataseed.binance.org/",
			accounts: [process.env.PRIVATE_KEY],
		},
		bsc_test: {
			url: "https://bsc-testnet-rpc.publicnode.com",
			accounts: [process.env.PRIVATE_KEY],
		},
	},

	etherscan: {
		apiKey: process.env.ETHERSCAN_API_KEY, //change this key according to the explorer.
		// apiKey: process.env.BSCSCAN_API_KEY, //change this key according to the explorer.
	},
};

export default config;
