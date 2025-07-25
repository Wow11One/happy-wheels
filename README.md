# Happy wheels

![Happy wheels](https://res.cloudinary.com/dbkgbcqcf/image/upload/v1753361335/happy_whells_preview_uy3iji.png)

This project is a decentralised marketplace for the secondary tyre market, built on the Internet Computer Protocol (ICP). It leverages artificial intelligence to automatically assess the condition of used tyres through image analysis. This enables users to determine whether a tyre is still suitable for resale or should be sent for recycling.

The platform enhances user experience with smart features such as automatic geolocation, which helps identify nearby tyre service stations and recycling points. By combining blockchain technology with AI, the solution ensures transparency, trust, and sustainability in the used tyre ecosystem.

This application is written in Rust, TypeScript (React).

## Project Structure

### `backend`
The `backend` folder contains the **Rust smart contract**, which handles the core application logic. It defines and manages three primary entities:

- **User**
- **Transaction**
- **Tire**

These entities are implemented as Rust `structs` and stored using `Vector` and `HashMap` data structures for efficient access and management.

---

### `frontend`
The `frontend` folder includes all web assets responsible for the **user interface**. It is developed using:

- **React** – for building dynamic and interactive UIs.
- **TailwindCSS** – for responsive and modern styling.

The frontend also integrates with external APIs to enhance functionality:

-  **Gemini AI API** – analyses uploaded tyre images and descriptions to determine whether a tyre should be **recycled** or **resold**.
-  **OpenCageData API** – simplifies the process of locating tyre service providers in the user’s city.


This structure ensures a clear separation between the application’s logic (smart contract) and its presentation (user interface), enabling maintainability and scalability.

## How to start project locally

The project includes `Makefile`, so you can start it in the local environment just using the command:

```
make deploy-all
```

If you do not want to use `Makefile`, then you can write all required commands by yourself. You can use this command to generate IDs for the canister:

```
dfx canister create --all
```

To deploy the backend canisters for local development:

```
dfx deploy backend
dfx deploy internet_identity
```

To deploy the frontend canister for local development:

```
dfx deploy frontend
```

To run the frontend part in a watch mode:

```
npm install
npm run dev
```

## Expected Results:

1. Improved Tyre Reuse and Recycling Decisions
Users will be able to accurately determine the condition of used tyres using AI-powered image analysis, helping them decide whether to sell or recycle each tyre responsibly.

2. Increased Accessibility to Tyre Services
Through automated geolocation, users will easily find the nearest tyre service stations or recycling centres, promoting local reuse and proper disposal.

3. Transparent and Trustworthy Marketplace
Leveraging ICP’s decentralised infrastructure, all listings, transactions, and tyre evaluations will be securely stored on-chain, reducing fraud and improving trust between buyers and sellers.

4. Enhanced User Engagement and Circular Economy Adoption
By simplifying the selling and recycling process, the platform is expected to increase user participation in the circular economy, reducing waste and environmental impact.

5. Scalable Architecture for Future Growth
The use of ICP canisters ensures scalability and low-latency interactions, enabling the platform to handle large volumes of users and data as adoption grows.

Data-Driven Insights for Policy and Industry
Aggregated tyre condition and location data can be used to support sustainability initiatives, optimise recycling logistics, and inform public or private sector decisions.

## Links

 - [Deployed project on ICP](https://ue6ep-wiaaa-aaaaf-qat2q-cai.icp0.io/)
