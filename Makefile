create-canisters:
	dfx canister create --all

deploy-provider:
	dfx deploy ic_siws_provider --argument "( \
	    record { \
			domain = \"localhost:5173\"; \
	        uri = \"http://localhost:5173\"; \
	        salt = \"salt\"; \
          	chain_id = opt \"devnet\"; \
	        scheme = opt \"http\"; \
	        statement = opt \"Login to the Proof of recycling app\"; \
	        sign_in_expires_in = opt 900000000000; /* 5 minutes */ \
	        session_expires_in = opt 604800000000000; /* 1 week */ \
	        targets = opt vec { \
	            \"$$(dfx canister id ic_siws_provider)\"; \
				\"$$(dfx canister id backend)\"; \
				\"$$(dfx canister id dip20)\"; \
				\"$$(dfx canister id nft)\"; \
				\"$$(dfx canister id storage)\"; \
	        }; \
          runtime_features = null; \
	    } \
	)"
	dfx generate ic_siws_provider

deploy-provider-localnet:
	dfx deploy ic_siws_provider --argument "( \
	    record { \
			domain = \"be2us-64aaa-aaaaa-qaabq-cai.localhost:4943\"; \
	        uri = \"http://be2us-64aaa-aaaaa-qaabq-cai.localhost:4943\"; \
	        salt = \"salt\"; \
          	chain_id = opt \"devnet\"; \
	        scheme = opt \"http\"; \
	        statement = opt \"Login to the ICP app\"; \
	        sign_in_expires_in = opt 900000000000; /* 5 minutes */ \
	        session_expires_in = opt 604800000000000; /* 1 week */ \
	        targets = opt vec { \
	            \"$$(dfx canister id ic_siws_provider)\"; \
	        }; \
          runtime_features = null; \
	    } \
	)"
	dfx generate ic_siws_provider

upgrade-provider:
	dfx canister install ic_siws_provider --mode upgrade --upgrade-unchanged --argument "( \
	    record { \
			domain = \"localhost:5173\"; \
	        uri = \"http://localhost:5173\"; \
	        salt = \"salt\"; \
          	chain_id = opt \"mainnet\"; \
	        scheme = opt \"http\"; \
	        statement = opt \"Login to the ICP app\"; \
	        sign_in_expires_in = opt 300000000000; /* 5 minutes */ \
	        session_expires_in = opt 604800000000000; /* 1 week */ \
	        targets = opt vec { \
	            \"$$(dfx canister id ic_siws_provider)\"; \
	        }; \
          runtime_features = null; \
	    } \
	)"
	dfx generate ic_siws_provider

deploy-frontend:
	dfx deploy frontend

deploy-backend:
	dfx deploy backend
	dfx deploy dip20
	dfx deploy nft
	dfx deploy storage
	dfx deploy internet_identity
	make deploy-provider

deploy-all: create-canisters deploy-backend deploy-frontend

run-frontend:
	npm install
	npm run dev

clean:
	rm -rf .dfx
	rm -rf dist
	rm -rf node_modules
	rm -rf src/declarations
	rm -f .env
	cargo clean