# Sealed Bid Auction with Shutter Network

A privacy-preserving sealed bid auction application built with Next.js and integrated with Shutter Network's threshold encryption API. This application allows users to submit encrypted bids that remain private until the auction ends, ensuring fair and transparent bidding.

## Features

- **🔐 Encrypted Bidding**: Bids are encrypted using Shutter Network's threshold encryption
- **👛 Multi-Wallet Support**: Connect with MetaMask, Coinbase Wallet, WalletConnect, and other popular wallets
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices  
- **🔒 Privacy-First**: Bid amounts remain completely private until the auction ends
- **✍️ Message Signing**: Users sign messages to prove bid ownership
- **🛡️ Form Validation**: Comprehensive client-side validation with Zod
- **⚡ Real-time Status**: Live feedback during the bid submission process

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Wallet Integration**: Wagmi v2, Web3Modal
- **Encryption**: Shutter Network SDK
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **State Management**: TanStack Query

## How It Works

1. **Wallet Connection**: Users connect their preferred wallet (MetaMask, Coinbase, etc.)
2. **Bid Submission**: Users fill out the form with their name, email, and bid amount
3. **Encryption Process**:
   - Registers an identity with Shutter API
   - Retrieves encryption keys from Shutter Network
   - Encrypts bid amount using threshold encryption
4. **Message Signing**: User signs a message to prove ownership of the bid
5. **Backend Submission**: Encrypted bid and signature are sent to the backend
6. **Privacy Guarantee**: Bid remains encrypted until the auction's decryption timestamp

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- A Web3 wallet (MetaMask recommended)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd paddlebattle-nextjs
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables (optional):

Create a `.env.local` file in the root directory:
```env
# Optional: Add your own WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ConnectWallet.tsx    # Wallet connection component
│   │   └── SealedBidForm.tsx    # Main bidding form with encryption
│   │   
│   ├── api/
│   │   └── submit-bid/
│   │       └── route.ts         # Backend API endpoint
│   │   
│   ├── config.ts                # Wagmi configuration
│   │   
│   ├── layout.tsx               # App layout with providers
│   │   
│   ├── page.tsx                 # Main page component
│   │   
│   └── globals.css              # Global styles
```

## Key Components

### ConnectWallet Component
- Handles wallet connection/disconnection
- Supports multiple wallet providers
- Displays connection status and wallet address

### SealedBidForm Component
- Form validation with Zod schema
- Shutter API integration for encryption
- Message signing functionality
- Real-time submission status
- Privacy-focused UI with hidden bid amounts

### Backend API
- Validates form submissions
- Logs encrypted bids (ready for database integration)
- Handles errors gracefully
- Sample implementation for testing

## Shutter Network Integration

The application integrates with Shutter Network's API to provide threshold encryption:

- **API Endpoint**: Uses Chiado testnet (`https://shutter-api.chiado.staging.shutter.network/api`)
- **Identity Registration**: Registers unique identities for each bid
- **Threshold Encryption**: Encrypts bid data that can only be decrypted after a set time
- **Decentralized**: No single party can decrypt bids before the auction ends

### Encryption Workflow

1. Register identity with decryption timestamp (1 hour in the future)
2. Retrieve encryption keys from Shutter Network
3. Encrypt bid data locally using Shutter SDK
4. Submit encrypted data to backend
5. Bids remain encrypted until decryption timestamp is reached

## Security Features

- **Client-Side Encryption**: Bid amounts are encrypted on the client before transmission
- **Message Signing**: Users sign messages to prove bid ownership
- **Input Validation**: Comprehensive validation on both client and server
- **Privacy Protection**: Bid amounts are hidden in the UI and encrypted in storage
- **Threshold Encryption**: Decentralized encryption prevents single-party manipulation

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Setup

For production deployment, consider:

1. Setting up a proper database to store encrypted bids
2. Implementing signature verification on the backend
3. Adding email notifications for bid confirmations
4. Setting up monitoring and logging
5. Configuring proper CORS policies

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or support:
- Check the [Shutter Network documentation](https://docs.shutter.network)
- Open an issue on GitHub
- Join the Shutter Network community

---

**Powered by Shutter Network** - Privacy-preserving threshold encryption for Web3
