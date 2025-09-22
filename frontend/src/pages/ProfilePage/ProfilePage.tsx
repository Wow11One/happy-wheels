import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/TyreLoading/TyreLoading';
import { useEffect, useState } from 'react';
import { ApplicationRoutes } from '../../utils/constants';
import TireDetailModal from '../../components/TireDetailModal';
import { CreditCard, Eye } from 'lucide-react';
<<<<<<< HEAD
import { AuthClient } from '@dfinity/auth-client';
import { createActor, canisterId } from 'declarations/backend';
import Modal from '../../components/Modal';
import toastNotifications from '../../utils/toastNotifications.utils';
=======
import { useAuth } from '../../hooks/auth.hooks';
import { AuthenticatedUser } from '../../storage/auth/auth.types';
>>>>>>> 94629d682281cfbcca959575a2117305d735b503

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
<<<<<<< HEAD
  const [authClient, setAuthClient] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState();
  const [tires, setTires] = useState([]);
  const [authenticatedUserTires, setAuthenticatedUserTires] = useState([]);
  const [isAuthenticatedUserTiresModalVisible, setIsAuthenticatedUserTiresModalVisible] = useState(false);
  const [selectedTireId, setSelectedTireId] = useState('');
=======
  const [balance, setBalance] = useState(0n);
>>>>>>> 94629d682281cfbcca959575a2117305d735b503

  const { authUser, isFetchingAuthentication } = useAuth<AuthenticatedUser>();

  const mockTransactions = [
    {
      date: '2025-05-20',
      type: 'Purchase',
      item: 'Michelin Primacy 4',
      amount: 120,
      status: 'Completed',
    },
    {
      date: '2025-05-22',
      type: 'Sale',
      item: 'Goodyear Eagle F1',
      amount: 95,
      status: 'Pending',
    },
  ];

  const [activeTab, setActiveTab] = useState('profile');
  const [selectedTire, setSelectedTire] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTireClick = (tire: any) => {
    setSelectedTire(tire);
    setIsModalOpen(true);
  };

  const isCurrentUserProfile = () => {
<<<<<<< HEAD
    return !id || id === authClient?.getIdentity().getPrincipal().toString();
  };

  const getAuthClient = async () => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const authenticatedUserId = identity.getPrincipal().toString();
    const currentUserId = id || authenticatedUserId;
    setAuthClient(authClient);

    const canisterActor = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });

    const currUser = (await canisterActor.get_user_by_principal(currentUserId))[0];
    console.log(
      'await canisterActor.get_user_by_principal(identity.getPrincipal().toString()',
      currUser,
    );
    const transactions = await canisterActor.get_transactions_by_user(currentUserId);
    let transactionsSum = 0;
    transactions.forEach((transaction: any) => {
      transactionsSum += Number(transaction.amount);
    });
    const tires = (await canisterActor.get_all_tires()).filter(
      tire => currUser?.is_service ? tire.service_id[0] === currentUserId : (tire.user_id === currentUserId && !tire.service_id?.length),
    );

    const authenticatedUserTires = (await canisterActor.get_all_tires()).filter(
      tire => tire.user_id === authenticatedUserId && !tire.service_id?.length,
    );

    console.log('tires', await canisterActor.get_all_tires());
    setTires(tires);
    setAuthenticatedUserTires(authenticatedUserTires);
    setCurrentUser(currUser);
    setBalance(Number(transactionsSum));
    setTransactions(transactions);
=======
    return !id || (authUser.isAuthenticated && id === authUser.principal.toString());
>>>>>>> 94629d682281cfbcca959575a2117305d735b503
  };

  const giveTire = async () => {
    try {
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();
      const canisterActor = createActor(canisterId, {
        agentOptions: {
          identity,
        },
      });

      await canisterActor.assign_tire_to_service(
        selectedTireId,
        id
      );
      setTires([
        ...(tires || []),
        ...(authenticatedUserTires.filter(authTire => authTire.id === selectedTireId) || [])
      ] as any);
      setAuthenticatedUserTires([
        ...(authenticatedUserTires.filter(authTire => authTire.id !== selectedTireId) || [])
      ]);
      setSelectedTireId('');
      setIsAuthenticatedUserTiresModalVisible(false);
      toastNotifications.success('Tire was successfully given to the service provider')
    } catch (err: any) {
      toastNotifications.error('Error while passing the tire')
    }
  };

  const topUpBalance = async () => {
    try {
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();
      const canisterActor = createActor(canisterId, {
        agentOptions: {
          identity,
        },
      });

      const newTransactionId = crypto.randomUUID();
      const description = 'money for the love to the icp';
      await canisterActor.create_transaction(
        newTransactionId,
        1000,
        description
      );
      setTransactions([
        ...(transactions || []),
        {
          id: newTransactionId,
          user_id: currentUser!.id,
          amount: 1000,
          description,
          timestamp: new Date().getTime()
        }
      ] as any);
      setBalance((prevValue: number) => prevValue + 1000);
      toastNotifications.success('You successfully added funds to your balance!')
    } catch (err: any) {
      toastNotifications.error('Error while adding funds')
    }
  };

  const buyTire = async (tireId: string) => {
    try {
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();
      const canisterActor = createActor(canisterId, {
        agentOptions: {
          identity,
        },
      });

      const tire = tires?.filter(tire => tire.id === tireId)[0];

      if (tire) {
        let transactionId = crypto.randomUUID();
        let description = `money spent to buy the tire "${tire.brand}"`;
        await canisterActor.create_user_transaction(
          transactionId,
          BigInt(-tire.price),
          description,
          identity.getPrincipal().toString()
        );

        transactionId = crypto.randomUUID();
        description = `50 % of money received from selling the tire "${tire.brand}"`;
        await canisterActor.create_user_transaction(
          transactionId,
          BigInt(Math.round(Number(tire.price) * 0.5)),
          description,
          tire.service_id[0] || ''
        );

        transactionId = crypto.randomUUID();
        await canisterActor.create_user_transaction(
          transactionId,
          BigInt(Math.round(Number(tire.price) * 0.5)),
          description,
          tire.user_id
        );

        await canisterActor.change_tire_owner(
          tire.id,
          identity.getPrincipal().toString()
        );

        setTires(
          tires.filter(listTire => tire.id !== listTire.id)
        )

        toastNotifications.success('You successfully bought a tire!')
      }
    } catch (err: any) {
      console.log(err)
      toastNotifications.error('Error while buying a tire')
    }
  };


  useEffect(() => {
    if (authUser.isAuthenticated) {
      const balance = authUser.transactions.reduce((a, b) => a + b.amount, 0n);

      setBalance(balance);
    }
  }, [authUser]);

  if (isFetchingAuthentication) {
    return (
      <div className='loading-container'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {isAuthenticatedUserTiresModalVisible && (
        <Modal
          className='max-w-[668px]'
          title='Select tire to give to the service'
          onClose={() => setIsAuthenticatedUserTiresModalVisible(false)}
        >
          <div className='flex flex-col gap-4 items-center mt-10 w-full'>
            <div className='w-[50%]'>
              <select
                id='size'
                name='size'
                value={selectedTireId}
                onChange={(event) => setSelectedTireId(event.target.value)}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors`}
              >
                <option value=''>Select tire to give</option>
                {authenticatedUserTires.map(tire => (
                  <option key={tire.id} value={tire.id}>
                    {tire.brand}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={giveTire} disabled={!selectedTireId}>
              Give tire
            </button>
          </div>

        </Modal>
      )}
      <div className='container'>
        <div className='card !bg-gray-900'>
          <div className='flex items-center mb-4'>
            <img
              src={authUser.profile.photo_url || '/default-avatar.png'}
              alt='Profile'
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: '20px',
              }}
            />
            <div>
              <h2>{authUser.profile.name}</h2>
              <p>{authUser.profile.is_service ? 'Service Provider' : 'Customer'}</p>
            </div>
          </div>
        </div>

        <div className='card !bg-gray-900' style={{ marginTop: '20px' }}>
          <div className='flex mb-4' style={{ borderBottom: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                padding: '10px 20px',
                background: activeTab === 'profile' ? 'var(--accent-color)' : 'transparent',
                borderRadius: '4px 4px 0 0',
              }}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('tires')}
              style={{
                padding: '10px 20px',
                background: activeTab === 'tires' ? 'var(--accent-color)' : 'transparent',
                borderRadius: '4px 4px 0 0',
              }}
            >
              Tires
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              style={{
                padding: '10px 20px',
                background: activeTab === 'transactions' ? 'var(--accent-color)' : 'transparent',
                borderRadius: '4px 4px 0 0',
              }}
            >
              Transactions
            </button>
          </div>

          {activeTab === 'profile' && (
            <div>
              <h3 className='text-xl font-semibold mb-6'>Profile Information</h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-gray-400 text-sm font-medium mb-1'>Name</label>
                  <p className='text-white font-mono'>{authUser.profile.name}</p>
                </div>
                <div>
                  <label className='block text-gray-400 text-sm font-medium mb-1'>
                    Account Type
                  </label>
                  <p className='text-white font-mono'>
                    {authUser.profile.is_service ? 'Service Provider' : 'Customer'}
                  </p>
                </div>
                <div>
                  <label className='block text-gray-400 text-sm font-medium mb-1'>Account ID</label>
                  <p className='text-white font-mono'>
                    {id ||
                      (authUser.authClient &&
                        authUser.authClient.getIdentity().getPrincipal().toString())}
                  </p>
                </div>
                <div>
                  <label className='block text-gray-400 text-sm font-medium mb-1'>Balance</label>
                  <p className='text-white font-mono'>{Number(balance || 0n)}$</p>
                </div>
                <div>
                  <label className='block text-gray-400 text-sm font-medium mb-1'>Actions</label>
                  <div className='flex gap-4'>
<<<<<<< HEAD
                    <button onClick={topUpBalance}>I love ICP</button>
                    {!isCurrentUserProfile() && !!currentUser?.is_service && (
                      <button onClick={() => setIsAuthenticatedUserTiresModalVisible(true)}>
                        Give tires
                      </button>
=======
                    <button>I love ICP</button>
                    {!isCurrentUserProfile() && !!authUser.profile.is_service && (
                      <button>Give tires</button>
>>>>>>> 94629d682281cfbcca959575a2117305d735b503
                    )}
                    {isCurrentUserProfile() && (
                      <button onClick={() => navigate(ApplicationRoutes.TyreCreateForm)}>
                        Add tire
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tires' && (
            <div>
              <h3 className='text-xl font-semibold mb-6'>Tires</h3>
              {authUser.tires && authUser.tires.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {authUser.tires.map((tire, index) => (
                    <div
                      key={index}
                      className='flex flex-col flex-1 bg-gray-800 rounded-lg p-4 gap-2'
                    >
                      <div className='flex flex-col flex-1'>
                        <div className='h-48 bg-gray-800 flex items-center justify-center'>
                          <img
                            src={tire.image_url}
                            alt={`${tire.brand}`}
                            className='max-w-full max-h-full object-cover rounded-xl'
                          />
                        </div>
                        <h4 className='font-semibold text-lg mb-2'>{tire.brand}</h4>
                        <div className='space-y-2 text-sm'>
                          <p>
                            <span className='text-gray-400'>Size:</span> {tire.size}
                          </p>
                          <p>
                            <span className='text-gray-400'>Price:</span>{' '}
                            <span className='text-green-400'>${tire.price}</span>
                          </p>
                          {tire.sent_to_recycle && (
                            <p>
                              <span className='text-gray-200 bg-green-600 p-1 rounded-xl '>
                                Sent for recycle
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className='flex flex-col gap-2'>
                        <button
                          onClick={() => handleTireClick(tire)}
                          className='flex-1  text-white py-2 px-3 rounded text-sm transition-colors flex items-center justify-center gap-1'
                        >
                          <Eye size={14} />
                          View
                        </button>
                        {!tire.sent_to_recycle && !!currentUser.is_service && (
                          <button
                            onClick={() => buyTire(tire.id)}
                            className='flex-1  text-white py-2 px-3 rounded text-sm transition-colors flex items-center justify-center gap-1'
                          >
                            <CreditCard size={14} />
                            Buy
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center p-4'>
                  <p>
                    {isCurrentUserProfile() ? "You don't" : "User doesn't"} have any tires listed
                    yet.
                  </p>
                  {isCurrentUserProfile() && <button className='mt-4'>Add New Tire</button>}
                </div>
              )}
            </div>
          )}

          {activeTab === 'transactions' && (
            <div>
              <h3 className='text-xl font-semibold mb-6'>Transaction History</h3>
              {authUser.transactions && authUser.transactions.length > 0 ? (
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='border-b border-gray-700'>
                        <th className='text-left py-3 px-4 font-medium text-gray-400'>Date</th>
                        <th className='text-left py-3 px-4 font-medium text-gray-400'>Description</th>
                        <th className='text-left py-3 px-4 font-medium text-gray-400'>Amount</th>
                        <th className='text-left py-3 px-4 font-medium text-gray-400'>Status</th>
                      </tr>
                    </thead>
                    <tbody>
<<<<<<< HEAD
                      {transactions.map((transaction, index) => (
                        <tr key={index} className='border-b border-gray-800'>
                          <td className='py-3 px-4'>{new Date().toLocaleDateString()}</td>
                          <td className='py-3 px-4'>{transaction?.description}</td>
=======
                      {mockTransactions.map((transaction, index) => (
                        <tr key={index} className='border-b border-gray-800'>
                          <td className='py-3 px-4'>
                            {new Date(Number(transaction.date)).toLocaleDateString('en-US')}
                          </td>
                          <td className='py-3 px-4'>{transaction.type}</td>
                          <td className='py-3 px-4'>{transaction.item}</td>
>>>>>>> 94629d682281cfbcca959575a2117305d735b503
                          <td
                            className={`py-3 px-4 ${Number(transaction?.amount) >= 0 ? 'text-green-400' : 'text-red-400'}`}
                          >
<<<<<<< HEAD
                            {Number(transaction.amount)}$
                          </td>
                          <td className='py-3 px-4'>Completed</td>
=======
                            ${transaction.amount.toString()}
                          </td>
                          <td className='py-3 px-4'>{transaction.status}</td>
>>>>>>> 94629d682281cfbcca959575a2117305d735b503
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className='text-center p-4'>
                  <p>
                    {isCurrentUserProfile() ? "You don't" : "User doesn't"} have any transactions
                    yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <TireDetailModal
        tire={selectedTire}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEdit={() => { }}
        onDelete={() => { }}
      />
    </>
  );
};

export default ProfilePage;
