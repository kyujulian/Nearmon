"use client";
import "@near-wallet-selector/modal-ui/styles.css"
import type { AccountState, WalletSelector } from "@near-wallet-selector/core";
import { setupModal, type WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupWalletConnect } from "@near-wallet-selector/wallet-connect";
import { setupWalletSelector } from "@near-wallet-selector/core";

import { Contract } from "near-api-js";

import type { ReactNode } from "react";
import React, {
    useCallback,
    useContext,
    useEffect,
    useState,
    useMemo,
} from "react";
import { distinctUntilChanged, map } from "rxjs";

import { Loading } from "@/components/Loading";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID;

declare global {
    interface Window {
        selector: WalletSelector;
        modal: WalletSelectorModal;
    }
}

interface WalletSelectorContextValue {
    selector: WalletSelector;
    modal: WalletSelectorModal;
    accounts: Array<AccountState>;
    accountId: string | null;
}

const WalletSelectorContext =
    React.createContext<WalletSelectorContextValue | null>(null);

export const WalletSelectorContextProvider: React.FC<{
    children: ReactNode;
}> = ({ children }) => {
    const [selector, setSelector] = useState<WalletSelector | null>(null);
    const [modal, setModal] = useState<WalletSelectorModal | null>(null);
    const [accounts, setAccounts] = useState<Array<AccountState>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [contract, setContract] = useState<Contract | null>();

    const init = useCallback(async () => {
        const _selector = await setupWalletSelector({
            network: "testnet",
            debug: true,
            modules: [
                setupMyNearWallet(),
                setupMeteorWallet(),
                setupWalletConnect({
                    projectId: "c4f79cc...",
                    metadata: {
                        name: "NEAR Wallet Selector",
                        description: "Example dApp used by NEAR Wallet Selector",
                        url: "https://github.com/near/wallet-selector",
                        icons: ["https://avatars.githubusercontent.com/u/37784886"],
                    },
                }),
            ],
        });
        const _modal = setupModal(_selector, {
            contractId: CONTRACT_ID as string,
        });
        const state = _selector.store.getState();
        setAccounts(state.accounts);


        // this is added for debugging purpose only
        // for more information (https://github.com/near/wallet-selector/pull/764#issuecomment-1498073367)
        window.selector = _selector;
        window.modal = _modal;

        setSelector(_selector);
        setModal(_modal);
        setLoading(false);


    }, []);

    useEffect(() => {
        init().catch((err) => {
            console.error(err);
            alert("Failed to initialise wallet selector");
        });
    }, [init]);

    useEffect(() => {
        if (!selector) {
            return;
        }

        const subscription = selector.store.observable
            .pipe(
                map((state) => state.accounts),
                distinctUntilChanged()
            )
            .subscribe((nextAccounts) => {
                console.log("Accounts Update", nextAccounts);

                setAccounts(nextAccounts);
            });

        const onHideSubscription = modal!.on("onHide", ({ hideReason }) => {
            console.log(`The reason for hiding the modal ${hideReason}`);
        });

        return () => {
            subscription.unsubscribe();
            onHideSubscription.remove();
        };
    }, [selector, modal]);

    const walletSelectorContextValue = useMemo<WalletSelectorContextValue>(
        () => ({
            selector: selector!,
            modal: modal!,
            accounts,
            accountId: accounts.find((account) => account.active)?.accountId || null,
        }),
        [selector, modal, accounts]
    );

    if (loading) {
        return <Loading />;
    }

    return (
        <WalletSelectorContext.Provider value={walletSelectorContextValue}>
            {children}
        </WalletSelectorContext.Provider>
    );
};

export function useWalletSelector(): WalletSelectorContextValue {
    const context = useContext(WalletSelectorContext);

    if (!context) {
        throw new Error(
            "useWalletSelector must be used within a WalletSelectorContextProvider"
        );
    }

    return context;
}

