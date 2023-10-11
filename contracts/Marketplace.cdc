import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import RestNFT from 0x18bdaac138c4e23f

pub contract Marketplace {

    pub event ForSale(id: UInt64, price: UFix64, owner: Address?)
    pub event PriceChanged(id: UInt64, newPrice: UFix64, owner: Address?)
    pub event TokenPurchased(id: UInt64, price: UFix64, seller: Address?, buyer: Address?)
    pub event SaleCanceled(id: UInt64, seller: Address?)

    pub resource interface SalePublic {
        pub fun purchase(tokenID: UInt64, recipient: Capability<&AnyResource{RestNFT.NFTReceiver}>, buyTokens: @FungibleToken.Vault)
        pub fun idPrice(tokenID: UInt64): UFix64?
        pub fun getIDs(): [UInt64]
    }

    pub resource SaleCollection: SalePublic {

        access(self) var ownerCollection: Capability<&RestNFT.Collection>
        access(self) var prices: {UInt64: UFix64}
        access(account) let ownerVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>

        init (ownerCollection: Capability<&RestNFT.Collection>, 
            ownerVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>) {

            pre {
                // Check that the owner's collection capability is correct
                ownerCollection.check(): 
                    "Owner's NFT Collection Capability is invalid!"
            }
            self.ownerCollection = ownerCollection
            self.ownerVault = ownerVault
            self.prices = {}
        }

        // cancelSale gives the owner the opportunity to cancel a sale in the collection
        pub fun cancelSale(tokenID: UInt64) {
            // remove the price
            self.prices.remove(key: tokenID)
            self.prices[tokenID] = nil

            // Nothing needs to be done with the actual token because it is already in the owner's collection
        }

        // listForSale lists an NFT for sale in this collection
        pub fun listForSale(tokenID: UInt64, price: UFix64) {
            pre {
                self.ownerCollection.borrow()!.idExists(id: tokenID):
                    "NFT to be listed does not exist in the owner's collection"
            }
            // store the price in the price array
            self.prices[tokenID] = price

            emit ForSale(id: tokenID, price: price, owner: self.owner?.address)
        }

        // changePrice changes the price of a token that is currently for sale
        pub fun changePrice(tokenID: UInt64, newPrice: UFix64) {
            self.prices[tokenID] = newPrice

            emit PriceChanged(id: tokenID, newPrice: newPrice, owner: self.owner?.address)
        }

        // purchase lets a user send tokens to purchase an NFT that is for sale
        pub fun purchase(tokenID: UInt64, recipient: Capability<&AnyResource{RestNFT.NFTReceiver}>, buyTokens: @FungibleToken.Vault) {
            pre {
                self.prices[tokenID] != nil:
                    "No token matching this ID for sale!"
                buyTokens.balance >= (self.prices[tokenID] ?? 0.0):
                    "Not enough tokens to buy the NFT!"
                recipient.borrow != nil:
                    "Invalid NFT receiver capability!"
            }

            // get the value out of the optional
            let price = self.prices[tokenID]!

            self.prices[tokenID] = nil

            let vaultRef = self.ownerVault.borrow()
                ?? panic("Could not borrow reference to owner token vault")

            // deposit the purchasing tokens into the owners vault
            vaultRef.deposit(from: <-buyTokens)

            // borrow a reference to the object that the receiver capability links to
            // We can force-cast the result here because it has already been checked in the pre-conditions
            let receiverReference = recipient.borrow()!

            // deposit the NFT into the buyers collection
            receiverReference.deposit(token: <-self.ownerCollection.borrow()!.withdraw(withdrawID: tokenID))

            emit TokenPurchased(id: tokenID, price: price, seller: self.owner?.address, buyer: receiverReference.owner?.address)
        }

        // idPrice returns the price of a specific token in the sale
        pub fun idPrice(tokenID: UInt64): UFix64? {
            return self.prices[tokenID]
        }

        // getIDs returns an array of token IDs that are for sale
        pub fun getIDs(): [UInt64] {
            return self.prices.keys
        }

        pub fun getAll(): [{String:String}] {
            let array: [{String:String}] = []
            let val = self.ownerCollection.borrow()!
            for tokenID in self.prices.keys {
                array.append(val.getData(key: tokenID))
            }
            return array
        }
    }

    // createCollection returns a new collection resource to the caller
    pub fun createSaleCollection(ownerCollection: Capability<&RestNFT.Collection>, 
                             ownerVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>): @SaleCollection {
    return <- create SaleCollection(ownerCollection: ownerCollection, ownerVault: ownerVault)
    }
}
 