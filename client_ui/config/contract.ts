import { Abi } from "viem";
import artifact from "./abi.json";

export const CONTRACT_ADDRESS =
	"0x0150Ab86a8BAa4dCC4Cb0Be736617460fd4eF27B";

export const OWNER_ADDRESS =
	"0xDad91936Dcc02b4042fF2b2bcea054A1Ba7d720c";

export const CONTRACT_ABI = artifact.abi as Abi;
