
import { providers } from "near-api-js";
import type { WalletSelector } from "@near-wallet-selector/core";

export type ViewRequest = {
    contractId: string;
    method: string;
    walletSelector: WalletSelector;
    args?: Record<string, any>;
};


const THIRTY_TGAS = '30000000000000';
const NO_DEPOSIT = '0';

export async function viewMethod(viewRequest: ViewRequest) {

    const { contractId, method, walletSelector, args } = viewRequest;
    const { network } = walletSelector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    let res = await provider.query({
        request_type: 'call_function',
        account_id: contractId,
        method_name: method,
        args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
        finality: 'optimistic',
    });
    //@ts-ignore
    return JSON.parse(Buffer.from(res.result).toString());
}



export type CallRequest = {
    contractId: string;
    method: string;
    accountId: string;
    walletSelector: WalletSelector;
    args: object;
    gas?: string;
    deposit?: string;
};
export async function callMethod(callRequest: CallRequest) {
    const { contractId, method, accountId, walletSelector, args, gas = THIRTY_TGAS, deposit = NO_DEPOSIT } = callRequest;
    // Sign a transaction with the "FunctionCall" action
    const wallet = await walletSelector.wallet();
    const outcome = await wallet.signAndSendTransaction({
        signerId: accountId,
        receiverId: contractId,
        actions: [
            {
                type: 'FunctionCall',
                params: {
                    methodName: method,
                    args,
                    gas,
                    deposit,
                },
            },
        ],
    });

    return providers.getTransactionLastResult(outcome!)
}
