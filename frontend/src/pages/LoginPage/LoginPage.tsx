import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Lock, Info, ChevronRight } from 'lucide-react';
import { createActor, canisterId } from 'declarations/backend';
import { AuthClient } from '@dfinity/auth-client';
import { ApplicationRoutes } from '../../utils/constants';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSiws } from 'ic-siws-js/react';
import { useAuth } from '../../hooks/auth.hooks';
import toastNotifications from '../../utils/toastNotifications.utils';
import LoadingSpinner from '../../components/TyreLoading/TyreLoading';

const network = process.env.DFX_NETWORK;
const identityProvider =
  network === 'ic'
    ? 'https://identity.ic0.app'
    : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943';

function LoginPage() {
  const { login: loginWithSolana, loginStatus, identity: solanaIdentity, clear } = useSiws();
  const { setSolanaIdentity } = useAuth();
  const wallet = useWallet();
  const [isConnectingIdentity, setIsConnectingIdentity] = useState(false);
  const [isConnectingSolanaWallet, setIsConnectingSolanaWallet] = useState(false);
  const formattedIdentity = solanaIdentity
    ? solanaIdentity.getPrincipal().toString().slice(0, 4) +
      '...' +
      solanaIdentity.getPrincipal().toString().slice(-4)
    : '';

  const [authClient, setAuthClient] = useState();
  const navigate = useNavigate();

  const checkIfUserExists = async (authClient: AuthClient) => {
    const identity = authClient.getIdentity();
    const canisterActor = createActor(canisterId, {
      agentOptions: {
        authClient,
      },
    });

    const isUserFirstLoggedIn = !(await canisterActor.user_exists(
      identity.getPrincipal().toString(),
    ));
    if (isUserFirstLoggedIn) {
      navigate(ApplicationRoutes.UserSpecifyInfo);
    } else {
      navigate(ApplicationRoutes.Profile);
    }
  };

  const loginWithInternetIdentity = async () => {
    setIsConnectingIdentity(true);
    const authClient = await AuthClient.create();
    await authClient.login({
      identityProvider,
      onSuccess: async () => {
        //const authClient.
        checkIfUserExists(authClient);
        console.log('Login Successful!');
      },
    });
    setIsConnectingIdentity(false);
  };

  console.log('wallet', wallet);
  useEffect(() => {
    if (wallet) {
      //setState({ ...state, data: { ...state.data, walletId: wallet.publicKey.toBase58() } });
    } else {
      //setState({ ...state, data: { ...state.data, walletId: '' } });
    }
  }, [wallet]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    // <div className='min-h-screen bg-green-50 p-4 py-10 w-full'>
    //   {/* Main Content */}
    //   <main className='flex-1 flex items-center justify-center w-full'>
    //     <div className='max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden'>
    //       <div className='p-8'>
    //         <div className='text-center mb-8'>
    //           <div className='inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4'>
    //             <LogIn className='h-8 w-8 text-green-600' />
    //           </div>
    //           <h1 className='text-2xl font-bold text-green-800'>Welcome to PoR</h1>
    //           <p className='text-gray-600 mt-2'>
    //             Sign in with Internet Identity to access your account
    //           </p>
    //         </div>

    //         {/* <button
    //           onClick={login}
    //           disabled={isConnecting}
    //           className={`w-full flex items-center justify-center mb-5 gap-2 py-3 px-4 rounded-md font-medium text-white transition-colors ${isConnecting ? "bg-green-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-700"
    //             }`}
    //         >
    //           {isConnecting ? (
    //             <>
    //               <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
    //               Connecting...
    //             </>
    //           ) : (
    //             <>
    //               <img src='/icp-logo.png' className='w-5 h-5' />
    //               Connect Internet Identity
    //             </>
    //           )}
    //         </button> */}

    //         <button
    //           onClick={loginWithInternetIdentity}
    //           disabled={isConnectingIdentity}
    //           className={`mb-5 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium secondary-button ${
    //             isConnectingIdentity ? 'cursor-not-allowed' : ''
    //           }`}
    //         >
    //           {isConnectingIdentity ? (
    //             <>
    //               <div className='animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full'></div>
    //               Connecting...
    //             </>
    //           ) : (
    //             <>
    //               <img src='/icp-logo.png' className='w-5 h-5' />
    //               Login with Internet Identity
    //             </>
    //           )}
    //         </button>

    //         {/* <button
    //           onClick={login}
    //           disabled={isConnectingIdentity}
    //           className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium secondary-button ${
    //             isConnectingIdentity ? 'cursor-not-allowed' : ''
    //           }`}
    //         >
    //           {isConnectingSolanaWallet ? (
    //             <>
    //               <div className='animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full'></div>
    //               Connecting...
    //             </>
    //           ) : (
    //             <>
    //               <img src='/solana-sol-icon.png' className='w-5 h-5' />
    //               Connect Solana Wallet
    //             </>
    //           )}
    //         </button> */}

    //         <WalletMultiButton>
    //           <img src='/solana-sol-icon.png' className='w-5 h-5' />
    //           Connect Solana Wallet
    //         </WalletMultiButton>

    //         {wallet.publicKey && (
    //           <button
    //             className='my-5 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium primary-button disabled:cursor-not-allowed'
    //             disabled={loginStatus === 'logging-in'}
    //             onClick={() => {
    //               loginWithSolana()
    //               .then(async (delegetaionIdentity) => {
    //                 setSolanaIdentity(delegetaionIdentity as any);
    //                 updateActor().then(() => {
    //                   navigate(ApplicationRoutes.Profile);
    //                 });
    //               })
    //               .catch((e) => {
    //                 toastNotifications.error(e.message || 'unexpected error occurred while signing in with solana')
    //               });
    //             }}
    //           >
    //             {loginStatus === 'logging-in' ? 'Signing in…' : 'Sign in with Solana'}
    //           </button>
    //         )}
    //         <div className='mt-6 bg-green-50 rounded-md p-4 text-sm'>
    //           <div className='flex items-start gap-3'>
    //             <Info className='h-5 w-5 text-green-600 flex-shrink-0 mt-0.5' />
    //             <div>
    //               <h3 className='font-medium text-green-800 mb-1'>About Internet Identity</h3>
    //               <p className='text-gray-600'>
    //                 Internet Identity is a blockchain authentication system that allows you to sign
    //                 in without usernames, passwords, or providing personal information. It's secure,
    //                 anonymous, and built on the Internet Computer Protocol.
    //               </p>
    //             </div>
    //           </div>
    //         </div>

    //         <div className='mt-6 flex items-center justify-center gap-2 text-sm text-gray-500'>
    //           <Lock className='h-4 w-4' />
    //           <span>Your data remains private and secure</span>
    //         </div>
    //       </div>

    //       <div className='px-8 py-4 bg-gray-50 border-t border-gray-100'>
    //         <p className='text-center text-sm text-gray-600'>
    //           Don't have an Internet Identity yet?{' '}
    //           <a
    //             href='https://identity.ic0.app/'
    //             target='_blank'
    //             rel='noopener noreferrer'
    //             className='text-green-600 hover:text-green-700 font-medium'
    //           >
    //             Create one here
    //           </a>
    //         </p>
    //       </div>
    //     </div>
    //   </main>
    // </div>

    <div className='min-h-screen bg-black text-white flex flex-col'>
      {/* Hero Section */}
      <div className='relative overflow-hidden'>
        <div className='absolute inset-0 z-0 bg-gradient-to-b from-gray-900 to-black opacity-90'></div>
        <div
          className='absolute inset-0 z-0 opacity-20'
          style={{
            backgroundImage: "url('/placeholder.svg?height=800&width=1600')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>

        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32'>
          <div className='flex items-center justify-center gap-12'>
            {/* Right Column - Login Card */}
            <div className='flex-1 w-full max-w-md'>
              <div className='bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800'>
                {isConnectingIdentity ? (
                  <div className='p-12 flex flex-col items-center'>
                    <LoadingSpinner />
                    <p className='mt-6 text-gray-300'>Connecting to Internet Identity...</p>
                  </div>
                ) : (
                  <div className='p-8 md:p-12'>
                    <div className='w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='40'
                        height='40'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <circle cx='12' cy='12' r='10' />
                        <circle cx='12' cy='12' r='4' />
                        <line x1='12' y1='2' x2='12' y2='4' />
                        <line x1='12' y1='20' x2='12' y2='22' />
                        <line x1='4.93' y1='4.93' x2='6.34' y2='6.34' />
                        <line x1='17.66' y1='17.66' x2='19.07' y2='19.07' />
                        <line x1='2' y1='12' x2='4' y2='12' />
                        <line x1='20' y1='12' x2='22' y2='12' />
                        <line x1='4.93' y1='19.07' x2='6.34' y2='17.66' />
                        <line x1='17.66' y1='6.34' x2='19.07' y2='4.93' />
                      </svg>
                    </div>
                    <h2 className='text-2xl font-bold text-center mb-2'>Welcome Back</h2>
                    <p className='text-gray-400 text-center mb-8'>
                      Sign in with Internet Identity to access your account
                    </p>
                    <button
                      onClick={loginWithInternetIdentity}
                      className='w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg text-lg font-medium transition-colors flex items-center justify-center gap-2'
                    >
                      <LogIn size={20} />
                      Login with Internet Identity
                    </button>

                    <div className='mt-4'>
                      <WalletMultiButton>
                        <img src='/solana-sol-icon.png' className='w-5 h-5' />
                        Connect Solana Wallet
                      </WalletMultiButton>
                    </div>

                    {wallet.publicKey && (
                      <button
                        className='my-5 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium primary-button disabled:cursor-not-allowed'
                        disabled={loginStatus === 'logging-in'}
                        onClick={() => {
                          loginWithSolana()
                            .then(async delegetaionIdentity => {
                              const authClient = await AuthClient.create();
                              const canisterActor = createActor(canisterId, {
                                agentOptions: {
                                  authClient,
                                },
                              });
                              const isUserFirstLoggedIn = !(await canisterActor.user_exists(
                                delegetaionIdentity.getPrincipal().toString(),
                              ));
                              if (isUserFirstLoggedIn) {
                                navigate(ApplicationRoutes.UserSpecifyInfo);
                              } else {
                                navigate(ApplicationRoutes.Profile);
                              }
                            })
                            .catch(e => {
                              toastNotifications.error(
                                e.message ||
                                  'unexpected error occurred while signing in with solana',
                              );
                            });
                        }}
                      >
                        {loginStatus === 'logging-in' ? 'Signing in…' : 'Sign in with Solana'}
                      </button>
                    )}
                    <div className='mt-8 text-center text-gray-400'>
                      <p>Don't have an Internet Identity?</p>
                      <a href='#' className='text-green-400 hover:text-green-300 mt-1 inline-block'>
                        Learn how to create one
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
