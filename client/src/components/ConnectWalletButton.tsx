"use client"
import { useWalletSelector } from '@/contexts/WalletSelectorContext';



const ConnectWalletButton = () => {
    const walletSelectorContext = useWalletSelector();


    const handleSignOut = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        walletSelectorContext.selector.wallet().then((wallet) => wallet.signOut())
    }
    return (
        <div>{
            (walletSelectorContext.selector.isSignedIn()) ?
                <div className="flex flex-row gap-2 items-center">
                    <p> Connected as <span className="font-semibold">{walletSelectorContext.accountId}</span></p>
                    <a href="#" onClick={handleSignOut} className="text-md underline  text-black hover:scale-110 transition p-2" >
                        Sign Out </a>
                </div>
                :

                <button onClick={walletSelectorContext.modal.show} className=" rounded-md bg-black text-md text-white hover:scale-110 transition p-2" >
                    Connect Wallet
                </button >
        }</div>

    )
}

export default ConnectWalletButton
