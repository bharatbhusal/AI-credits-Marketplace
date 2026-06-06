import { Abi } from "viem";
import artifact from "./abi.json";

export const CONTRACT_ADDRESS =
	"0x12b2939Baa7A44c3A90Fd4D78510415Fe0322aAE";

export const OWNER_ADDRESS =
	"0xDad91936Dcc02b4042fF2b2bcea054A1Ba7d720c";

export const CONTRACT_ABI = artifact.abi as Abi;
