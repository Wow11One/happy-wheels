import LoadingSpinner from '../../components/TyreLoading/TyreLoading';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toastNotifications from '../../utils/toastNotifications.utils';
import { createActor, canisterId } from 'declarations/backend';
import { ApplicationRoutes } from '../../utils/constants';
import { AuthClient } from '@dfinity/auth-client';
import { getFileUrl, uploadFileToPinata } from '../../utils/pinata.utils';

const UserInfoForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    isServiceProvider: false,
    profileImage: null,
    imagePreview: null,
    city: '',
  });
  const [error, setError] = useState('');

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
    } else {
      toastNotifications.error('Geolocation is not supported by your browser.');
    }
  };

  const geolocationSuccess = position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getCityAndCountry(latitude, longitude);
  };

  const geolocationError = () => {
    alert('Unable to retrieve your location.');
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
          setFormData({
            ...formData,
            city: `${city}`,
          });
          toastNotifications.info('Location fetched successfully!');
        } else {
          toastNotifications.error('Location not found.');
        }
      })
      .catch(() => toastNotifications.error('Error fetching location data.'));
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = e => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = event => {
        setFormData({
          ...formData,
          profileImage: file,
          imagePreview: event.target.result,
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.name.trim()) {
      setError('Name is required');
      setIsLoading(false);
      return;
    }

    try {
      const profileData = {
        name: formData.name,
        isServiceProvider: formData.isServiceProvider,
        profileImageUrl: formData.imagePreview || '/default-avatar.png',
        tires: [], // Initialize empty tires list
        transactions: [], // Initialize empty transactions list
      };

      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();
      const canisterActor = createActor(canisterId, {
        agentOptions: {
          authClient,
        },
      });

      let imageUrl = '';
      if (formData.profileImage) {
        const uriIc = await uploadFileToPinata(formData.profileImage);
        console.log('program after');
        imageUrl = getFileUrl(uriIc);
      }

      console.log('identity.getPrincipal().toString()', identity.getPrincipal().toString());
      await canisterActor.create_user(
        identity.getPrincipal().toString(),
        formData.name,
        imageUrl,
        formData.isServiceProvider,
        formData.city,
      );

      navigate(ApplicationRoutes.Profile);
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className='loading-container'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='container'>
      <div className='max-w-2xl mx-auto mt-4'>
        <div className='card !bg-gray-900'>
          <h1 className='text-center mb-4 text-2xl'>Complete Your Profile</h1>
          <p className='text-center mb-4'>Please provide your information to continue</p>

          <form onSubmit={handleSubmit}>
            <div className='form-group overflow-hidden relative'>
              <label htmlFor='profileImage'>Profile Image</label>
              <div className='flex items-center mb-4'>
                <div
                  className='w-full flex flex-col items-center justify-center'
                  style={{
                    minHeight: '150px',
                    border: '2px dashed var(--border-color)',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px',
                  }}
                >
                  {formData.imagePreview ? (
                    <img
                      src={formData.imagePreview || '/placeholder.svg'}
                      alt='Profile preview'
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '8px',
                      }}
                    />
                  ) : (
                    <div className='flex flex-col justify-center items-center'>
                      <p>Click to upload an image</p>
                      <p className='text-sm'>(or drag and drop)</p>
                    </div>
                  )}
                  <input
                    type='file'
                    id='profileImage'
                    accept='image/*'
                    onChange={handleImageChange}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer',
                    }}
                  />
                </div>
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='name'>Full Name</label>
              <input
                type='text'
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Enter your full name'
                required
                className='w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

            <div className='form-group'>
              <label htmlFor='city'>City</label>
              <input
                type='text'
                id='city'
                name='city'
                value={formData.city}
                onChange={handleChange}
                placeholder='Enter your city'
                required
                className='w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 mb-1'
              />
              <p
                onClick={() => getUserLocation()}
                className='text-sm text-gray-200 underline underline-offset-2 transition-all hover:cursor-pointer hover:text-gray-300'
              >
                Fetch automatically
              </p>
            </div>

            <div className='form-group'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  name='isServiceProvider'
                  checked={formData.isServiceProvider}
                  onChange={handleChange}
                  style={{ width: 'auto', marginRight: '10px', marginBottom: 0 }}
                />
                <div>I am a service provider (tire shop, mechanic, etc.)</div>
              </label>
            </div>

            {error && <p className='error'>{error}</p>}

            <button type='submit' className='w-full' disabled={isLoading}>
              Complete Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfoForm;
