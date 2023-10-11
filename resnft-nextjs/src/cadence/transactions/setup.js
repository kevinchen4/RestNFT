export const setup = `


import RestNFT from 0x18bdaac138c4e23f
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import Marketplace from 0x5b0d2b644cfa424e


// This transaction configures a user's account
// to use the NFT contract by creating a new empty collection,
// storing it in their account storage, and publishing a capability
transaction {
    prepare(acct: AuthAccount) {

        // Create a new empty collection
        let collection <- RestNFT.createEmptyCollection()

        // store the empty NFT Collection in account storage
        acct.save<@RestNFT.Collection>(<-collection, to: RestNFT.CollectionStoragePath)

        log("Collection created")

        // create a public capability for the Collection
        acct.link<&{RestNFT.NFTReceiver}>(RestNFT.CollectionPublicPath, target: RestNFT.CollectionStoragePath)

        log("Capability created")
        
        // Borrow a reference to the stored Vault
        let receiver = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)

        // borrow a reference to the nftTutorialCollection in storage
        let collectionCapability = acct.link<&RestNFT.Collection>(/private/nftCollection, target: RestNFT.CollectionStoragePath)
          ?? panic("Unable to create private link to NFT Collection")


        // Create a new Sale object,
        // initializing it with the reference to the owner's vault
        let sale <- Marketplace.createSaleCollection(ownerCollection: collectionCapability, ownerVault: receiver)

        acct.save(<-sale, to: /storage/NFTSale)
    }
}
`