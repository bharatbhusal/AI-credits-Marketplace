import "@cofhe/hardhat-plugin";
import "@nomicfoundation/hardhat-toolbox";

const config = {
	solidity: {
		version: "0.8.28", // or 0.8.25
		settings: {
			evmVersion: "cancun",
		},
	},
};

export default config;
