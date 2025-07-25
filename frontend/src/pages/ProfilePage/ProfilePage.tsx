import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/TyreLoading/TyreLoading';
import { useEffect, useState } from 'react';
import { ApplicationRoutes } from '../../utils/constants';
import TireDetailModal from '../../components/TireDetailModal';
import { CreditCard, Eye } from 'lucide-react';
import { AuthClient } from '@dfinity/auth-client';
import { createActor, canisterId } from 'declarations/backend';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [authClient, setAuthClient] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [balance, setBalance] = useState();
  const [transactions, setTransactions] = useState();
  const [tires, setTires] = useState();

  const user = {
    name: 'John Doe',
    isServiceProvider: true,
    id: 'user-abc123',
    profileImageUrl: 'https://i.pravatar.cc/150?img=3',
    tires: [
      {
        brand: 'Michelin',
        model: 'Primacy 4',
        size: '205/55 R16',
        price: 120,
        condition: 'New',
      },
      {
        brand: 'Goodyear',
        model: 'Eagle F1',
        size: '225/45 R17',
        price: 95,
        condition: 'Used - Good',
      },
    ],
    transactions: [
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
    ],
  };

  const [activeTab, setActiveTab] = useState('profile');
  const [selectedTire, setSelectedTire] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTireClick = tire => {
    setSelectedTire(tire);
    setIsModalOpen(true);
  };

  const isCurrentUserProfile = () => {
    return !id || id === authClient?.getIdentity().getPrincipal().toString();
  };

  const getAuthClient = async () => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const currentUserId = id || identity.getPrincipal().toString();
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
    const transactionsSum = transactions.reduce((a, b) => a.amount + b.amount, 0);
    const tires = (await canisterActor.get_all_tires()).filter(
      tire => tire.user_id === currentUserId,
    );

    console.log(tires);
    setTires(tires);
    setCurrentUser(currUser);
    setBalance(transactionsSum);
    setTransactions(transactions);
  };

  useEffect(() => {
    getAuthClient();
  }, []);

  if (!user) {
    return (
      <div className='loading-container'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className='container'>
        <div className='card !bg-gray-900'>
          <div className='flex items-center mb-4'>
            <img
              src={currentUser?.photo_url || '/default-avatar.png'}
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
              <h2>{currentUser?.name}</h2>
              <p>{currentUser?.is_service ? 'Service Provider' : 'Customer'}</p>
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
                  <p className='text-white font-mono'>{currentUser?.name}</p>
                </div>
                <div>
                  <label className='block text-gray-400 text-sm font-medium mb-1'>
                    Account Type
                  </label>
                  <p className='text-white font-mono'>
                    {currentUser?.is_service ? 'Service Provider' : 'Customer'}
                  </p>
                </div>
                <div>
                  <label className='block text-gray-400 text-sm font-medium mb-1'>Account ID</label>
                  <p className='text-white font-mono'>
                    {id || (authClient && authClient.getIdentity().getPrincipal().toString())}
                  </p>
                </div>
                <div>
                  <label className='block text-gray-400 text-sm font-medium mb-1'>Balance</label>
                  <p className='text-white font-mono'>{balance || 0}$</p>
                </div>
                <div>
                  <label className='block text-gray-400 text-sm font-medium mb-1'>Actions</label>
                  <div className='flex gap-4'>
                    <button>I love ICP</button>
                    {!isCurrentUserProfile() && !!currentUser?.is_service && (
                      <button>Give tires</button>
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
              {tires && tires.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {tires.map((tire, index) => (
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
                        {!tire.sent_to_recycle && (
                          <button
                            // onClick={() => handleTireClick(tire)}
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
              {transactions && transactions.length > 0 ? (
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='border-b border-gray-700'>
                        <th className='text-left py-3 px-4 font-medium text-gray-400'>Date</th>
                        <th className='text-left py-3 px-4 font-medium text-gray-400'>Type</th>
                        <th className='text-left py-3 px-4 font-medium text-gray-400'>Item</th>
                        <th className='text-left py-3 px-4 font-medium text-gray-400'>Amount</th>
                        <th className='text-left py-3 px-4 font-medium text-gray-400'>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.transactions.map((transaction, index) => (
                        <tr key={index} className='border-b border-gray-800'>
                          <td className='py-3 px-4'>{transaction?.date}</td>
                          <td className='py-3 px-4'>{transaction?.type}</td>
                          <td className='py-3 px-4'>{transaction?.item}</td>
                          <td
                            className={`py-3 px-4 ${transaction?.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}
                          >
                            ${transaction.amount}
                          </td>
                          <td className='py-3 px-4'>{transaction?.status}</td>
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
        onEdit={() => {}}
        onDelete={() => {}}
      />
    </>
  );
};

export default ProfilePage;
