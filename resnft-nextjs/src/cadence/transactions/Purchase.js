export const purchase = `
// PurchaseSale.cdc

import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import RestNFT from 0x18bdaac138c4e23f
import Marketplace from 0x5b0d2b644cfa424e

// This transaction uses the signers Vault tokens to purchase an NFT
// from the Sale collection of account addr.

transaction(addr: Address, tokenID: UInt64, price: UFix64) {

    // Capability to the buyer's NFT collection where they
    // will store the bought NFT
    let collectionCapability: Capability<&AnyResource{RestNFT.NFTReceiver}>

    // Vault that will hold the tokens that will be used to
    // but the NFT
    var temporaryVault: @FungibleToken.Vault

    prepare(acct: AuthAccount) {

        // get the references to the buyer's fungible token Vault and NFT Collection Receiver
        self.collectionCapability = acct.getCapability<&AnyResource{RestNFT.NFTReceiver}>(RestNFT.CollectionPublicPath)

        let vaultRef = acct.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)
			?? panic("Could not borrow a reference to the owner's vault")

        // withdraw tokens from the buyers Vault
        self.temporaryVault <- vaultRef.withdraw(amount: price)
    }

    execute {
        // get the read-only account storage of the seller
        let seller = getAccount(addr)
        // get the reference to the seller's sale
        let saleRef = seller.getCapability(/public/NFTSale)
                            .borrow<&AnyResource{Marketplace.SalePublic}>()
                            ?? panic("Could not borrow seller's sale reference")

        // purchase the NFT the the seller is selling, giving them the capability
        // to your NFT collection and giving them the tokens to buy it
        saleRef.purchase(tokenID: tokenID, recipient: self.collectionCapability, buyTokens: <-self.temporaryVault)
    }
}

`