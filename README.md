Very simple app for signing listings, fulfilling listings, signing bids, and accepting bids.

Everything is done with one signer via metamask. All sigs, listings, fulfills, everything.

Therefore this is not to be used in production, moreso just used for testing. IE backend testing to react to new seaport listings/bids

To use, add token address that you are interacting with along with token abi within the /src/token.js file

'submit buy order for above listing' will submit fulfillBasicOrder for the most recent listing sig stored in state.

'accept the above bid' will submit fulfillBasicOrder for the most recent bid sig stored in state.

'View tx on etherscan' is defaulted to Goerli but can be changed to wherever you're testing.
