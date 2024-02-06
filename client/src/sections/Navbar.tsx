import ConnectWalletButton from '@/components/ConnectWalletButton'
import { WalletSelectorContextProvider } from '@/contexts/WalletSelectorContext'
const Navbar = () => {
    return (
        <nav className="h-16 w-full navbar_gradient border-b-[1px] border-gray-400">
            <div className="max-w-7xl mx-auto flex h-full items-center justify-between">
                <h1 className="text-3xl"> Nearmon</h1>
                <WalletSelectorContextProvider>
                    <ConnectWalletButton />
                </WalletSelectorContextProvider>
            </div>
        </nav>)
}

export default Navbar
