import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/TyreLoading/TyreLoading';
import toastNotifications from '../../utils/toastNotifications.utils';
import { createActor, canisterId } from 'declarations/backend';
import { AuthClient } from '@dfinity/auth-client';
import { useNavigate } from 'react-router-dom';
import { ApplicationRoutes } from '../../utils/constants';

const ServiceProviders = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    service: '',
    rating: '',
  });

  const fetchServiceProviders = async () => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    //setAuthClient(authClient);

    const canisterActor = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });

    const providers = await canisterActor.get_all_users();

    setProviders(providers.filter(provider => provider.is_service));
    setFilteredProviders(providers.filter(provider => provider.is_service));
    setLoading(false);
  };

  useEffect(() => {
    fetchServiceProviders();
  }, []);

  useEffect(() => {
    const filtered = providers.filter(provider => {
      return (
        (filters.location === '' ||
          provider.city.toLowerCase().includes(filters.location.toLowerCase())) &&
        (filters.service === '' ||
          provider.services.some(service =>
            service.toLowerCase().includes(filters.service.toLowerCase()),
          )) &&
        (filters.rating === '' || provider.rating >= Number.parseFloat(filters.rating))
      );
    });
    setFilteredProviders(filtered);
  }, [filters, providers]);

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      service: '',
      rating: '',
    });
  };

  const handleContactProvider = provider => {
    alert(`Contacting ${provider.name} at ${provider.phone}`);
  };

  const renderStars = rating => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className='text-yellow-400 text-lg'>
          ★
        </span>,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key='half' className='text-yellow-400 text-lg opacity-50'>
          ★
        </span>,
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className='text-gray-600 text-lg'>
          ★
        </span>,
      );
    }

    return stars;
  };

  const getCityAndCountry = (lat, lon) => {
    const apiKey = '8739517405194a86adfc82e0c169c068';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}&language=en`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          const location = data.results[0].components;
          const city = location.city || location.town || location.village;
          const country = location.country;
          console.log(`City: ${city}, Country: ${country}`);
          setFilters({
            ...filters,
            location: `${city}`,
          });
          toastNotifications.info('Location fetched successfully!');
        } else {
          toastNotifications.error('Location not found.');
        }
      })
      .catch(() => toastNotifications.error('Error fetching location data.'));
  };

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
    } else {
      toastNotifications.error('Geolocation is not supported by your browser.');
    }
  };

  const geolocationSuccess = async (position: any) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getCityAndCountry(latitude, longitude);
  };

  const geolocationError = () => {
    alert('Unable to retrieve your location.');
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-black text-white flex items-center justify-center'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-black text-white p-4 lg:p-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold mb-2'>Service Providers</h1>
          <p className='text-gray-300 text-lg'>Find trusted tire service providers in your area</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Filters Sidebar */}
          <div className='lg:col-span-1'>
            <div className='bg-gray-900 rounded-lg p-6 sticky top-4'>
              <div className='flex justify-between items-center mb-6 pb-4 border-b border-gray-700'>
                <h3 className='text-xl font-semibold'>Filters</h3>
                <button
                  onClick={clearFilters}
                  className='text-green-400 border border-green-400 px-3 py-1 rounded text-sm hover:bg-green-400 hover:text-black transition-colors'
                >
                  Clear All
                </button>
              </div>

              <div className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium mb-2'>City</label>
                  <input
                    type='text'
                    name='location'
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder='City'
                    className='w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 !mb-2'
                  />

                  <p
                    onClick={() => getUserLocation()}
                    className='text-sm text-gray-200 underline underline-offset-2 transition-all hover:cursor-pointer hover:text-gray-300'
                  >
                    Fetch automatically
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-medium mb-2'>Minimum Rating</label>
                  <select
                    name='rating'
                    value={filters.rating}
                    onChange={handleFilterChange}
                    className='w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500'
                  >
                    <option value=''>Any Rating</option>
                    <option value='4.5'>4.5+ Stars</option>
                    <option value='4.0'>4.0+ Stars</option>
                    <option value='3.5'>3.5+ Stars</option>
                    <option value='3.0'>3.0+ Stars</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Provider Listings */}
          <div className='lg:col-span-3'>
            <div className='mb-6'>
              <h3 className='text-2xl font-semibold'>
                Service Providers ({filteredProviders.length})
              </h3>
            </div>

            {filteredProviders.length === 0 ? (
              <div className='bg-gray-900 rounded-lg p-12 text-center'>
                <p className='text-gray-300 text-lg mb-4'>
                  No service providers found matching your criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className='bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors'
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
                {filteredProviders.map(provider => (
                  <div
                    key={provider.id}
                    className='bg-gray-900 rounded-lg overflow-hidden hover:transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-200'
                  >
                    {/* Provider Header */}
                    <div className='flex p-6 border-b border-gray-700'>
                      <div className='w-20 h-20 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center mr-4'>
                        <img
                          src={provider.photo_url || '/placeholder.svg'}
                          alt={provider.name}
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-1'>
                          <h4 className='text-xl font-semibold'>{provider.name}</h4>
                          <span className='bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium'>
                            ✓ Verified
                          </span>
                        </div>
                        <p className='text-gray-300 mb-2'>{provider.city}</p>
                        <div className='flex items-center gap-2'>
                          <div className='flex'>{renderStars(4.5)}</div>
                          <span className='text-gray-300 text-sm'>4 (10 reviews)</span>
                        </div>
                      </div>
                    </div>

                    {/* Provider Details */}
                    <div className='p-6'>
                      <div className='space-y-3 mb-4'>
                        <div className='flex justify-between'>
                          {/* <span className="text-gray-400">Years in Business:</span> */}
                          <span className='text-white'>20 years</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-400'>Email:</span>
                          <span className='text-white'>{provider.email}</span>
                        </div>
                      </div>

                      {/* <div className="mb-4">
                                                <h5 className="text-white font-medium mb-2">Services Offered:</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {provider.services.map((service, index) => (
                                                        <span key={index} className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                                                            {service}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div> */}

                      <div className='mb-6'>
                        <h5 className='text-white font-medium mb-2'>Specialties:</h5>
                        <div className='flex flex-wrap gap-2'>
                          <span className='bg-gray-600 text-white px-3 py-1 rounded-full text-sm'>
                            Perfomance tires
                          </span>

                          <span className='bg-gray-600 text-white px-3 py-1 rounded-full text-sm'>
                            Truck tires
                          </span>
                        </div>
                      </div>

                      <div className='flex gap-3'>
                        <button className='flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors'>
                          Contact Provider
                        </button>
                        <button
                          className='flex-1 border border-gray-600 text-white hover:bg-gray-600 py-2 px-4 rounded-md transition-colors'
                          onClick={() => navigate(`${ApplicationRoutes.Profile}/${provider.id}`)}
                        >
                          View Full Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviders;
