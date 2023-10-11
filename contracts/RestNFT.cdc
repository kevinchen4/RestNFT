// RestNFT
//
// This is a complete version of the RestNFT contract
// that includes withdraw and deposit functionality, as well as a
// collection resource that can be used to bundle NFTs together.
//
pub contract RestNFT {

    // Declare Path constants so paths do not have to be hardcoded
    // in transactions and scripts

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    // Tracks the unique IDs of the NFT
    pub var idCount: UInt64

    pub resource interface NFTPublic{
        pub fun getData(): {String: String}
    }

    // Declare the NFT resource type
    pub resource NFT: NFTPublic {
        // The unique ID that differentiates each NFT
        pub let id: UInt64
        pub let data: String
        pub let bond: UInt64
        pub let creator: Address
        pub let royalties: UFix64
        pub let name: String

        // Initialize both fields in the init function
        init(initID: UInt64, initData: String, initBond: UInt64, initCreator: Address,
            initRoyalties: UFix64, initName: String) {
            self.id = initID
            self.data = initData
            self.bond = initBond
            self.creator = initCreator
            self.royalties = initRoyalties
            self.name = initName
        }

        pub fun getData(): {String: String} {
            let map = {"ID": self.id.toString(), "Data": self.data, "Bond": self.bond.toString(), 
                "Creator": self.creator.toString(), "Royalties": self.royalties.toString(), "Name": self.name}
            return map
        }
    }

    // We define this interface purely as a way to allow users
    // to create public, restricted references to their NFT Collection.
    // They would use this to publicly expose only the deposit, getIDs,
    // and idExists fields in their Collection
    pub resource interface NFTReceiver {

        pub fun deposit(token: @NFT)

        pub fun getIDs(): [UInt64]

        pub fun idExists(id: UInt64): Bool

        pub fun getAllData(): [{String:String}]

        pub fun getData(key: UInt64): {String: String}
    }

    // The definition of the Collection resource that
    // holds the NFTs that a user owns
    pub resource Collection: NFTReceiver {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        pub var ownedNFTs: @{UInt64: NFT}

        // Initialize the NFTs field to an empty collection
        init () {
            self.ownedNFTs <- {}
        }

        // withdraw
        //
        // Function that removes an NFT from the collection
        // and moves it to the calling context
        pub fun withdraw(withdrawID: UInt64): @NFT {
            // If the NFT isn't found, the transaction panics and reverts
            let token <- self.ownedNFTs.remove(key: withdrawID)
                ?? panic("Cannot withdraw the specified NFT ID")

            return <-token
        }

        // deposit
        //
        // Function that takes a NFT as an argument and
        // adds it to the collections dictionary
        pub fun deposit(token: @NFT) {
            // add the new token to the dictionary with a force assignment
            // if there is already a value at that key, it will fail and revert
            self.ownedNFTs[token.id] <-! token
        }

        // idExists checks to see if a NFT
        // with the given ID exists in the collection
        pub fun idExists(id: UInt64): Bool {
            return self.ownedNFTs[id] != nil
        }

        // getIDs returns an array of the IDs that are in the collection
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun getAll(): [{String: String}] {
            var result: [{String: String}] = []
            let tokenIDs = self.ownerCollection.getIDs()
            
            for tokenID in tokenIDs {
                let tokenData = self.ownerCollection.getData(key: tokenID)
                result.append(tokenData)
            }
            return result
        }

        pub fun getData(key: UInt64): {String: String} {
            let token <- self.ownedNFTs.remove(key: key)
            ?? panic("Cannot withdraw the specified NFT ID")
            let output = token.getData()
            self.ownedNFTs[key] <-! token
            return output
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    // creates a new empty Collection resource and returns it
    pub fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }

    // mintNFT
    //
    // Function that mints a new NFT with a new ID
    // and returns it to the caller
    pub fun mintNFT(mintData: String, mintCreator: Address, bond: UInt64, mintRoyalties: UFix64, 
        mintName: String): @NFT {

        // create a new NFT
        var newNFT <- create NFT(initID: self.idCount, initData: mintData, initBond: bond, 
            initCreator: mintCreator, initRoyalties: mintRoyalties, initName: mintName)

        // change the id so that each ID is unique
        self.idCount = self.idCount + 1

        return <-newNFT
    }

    pub resource NFTMinter {

        // the ID that is used to mint NFTs
        // it is only incremented so that NFT ids remain
        // unique. It also keeps track of the total number of NFTs
        // in existence
        pub var idCount: UInt64

        init() {
            self.idCount = 1
        }

        // mintNFT 
        //
        // Function that mints a new NFT with a new ID
        // and returns it to the caller
        pub fun mintNFT(mintData: String, mintCreator: Address, bond: UInt64, mintRoyalties: UFix64, 
        mintName: String): @NFT {

            // create a new NFT
            var newNFT <- create NFT(initID: self.idCount, initData: mintData, initBond: bond, 
            initCreator: mintCreator, initRoyalties: mintRoyalties, initName: mintName)

            // change the id so that each ID is unique
            self.idCount = self.idCount + 1
            
            return <-newNFT
        }
    }

	init() {
        self.CollectionStoragePath = /storage/nftCollection
        self.CollectionPublicPath = /public/nftCollection
        self.MinterStoragePath = /storage/nftMinter

        // initialize the ID count to one
        self.idCount = 1

        // store an empty NFT Collection in account storage
        self.account.save(<-self.createEmptyCollection(), to: self.CollectionStoragePath)

        // publish a reference to the Collection in storage
        self.account.link<&{NFTReceiver}>(self.CollectionPublicPath, target: self.CollectionStoragePath)
	}
}
 