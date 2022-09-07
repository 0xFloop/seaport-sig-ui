Very simple app for signing listings, fulfilling listings, signing bids, and accepting bids.

To use, add token address that you are interacting with along with token abi within the /src/token.js file

'submit buy order for above listing' will submit fulfillBasicOrder for the most recent listing sig stored in state.

'accept the above bid' will submit fulfillBasicOrder for the most recent bid sig stored in state.

'View tx on etherscan' is defaulted to Goerli but can be changed to wherever you're testing.
