import { useState } from 'react';
import { X, Calendar, Gauge, MapPin, User, Recycle, GemIcon } from 'lucide-react';
import toastNotifications from '../utils/toastNotifications.utils';
import { useTire } from '../hooks/tire.hooks';

const TireDetailModal = ({ tire, isOpen, onClose, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const [geminiResult, setGeminiResult] = useState();
  const { recycleTire } = useTire();

  if (!isOpen || !tire) return null;

  console.log('tire', tire);

  const getConditionColor = condition => {
    switch (condition) {
      case 'Excellent':
        return 'bg-green-500 text-white';
      case 'Very Good':
        return 'bg-green-400 text-white';
      case 'Good':
        return 'bg-yellow-500 text-black';
      case 'Fair':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const sentForRecycle = async () => {
    await recycleTire(tire.id);

    toastNotifications.success('Tire recycled!');
    setGeminiResult('');
    onClose();
  };

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
      setGeminiResult('');
    }
  };

  const handleEdit = () => {
    onEdit(tire);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this tire listing?')) {
      onDelete(tire.id);
      onClose();
    }
  };

  const handleGeminiCheck = async () => {
    if (!tire.image_url) {
      toastNotifications.error('No photo URL provided');
      return;
    }

    const response = await fetch(tire.image_url);
    const blob = await response.blob();

    const base64Content = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result?.toString().split(',')[1];
        if (result) resolve(result);
        else reject('Failed to convert image to base64.');
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const payload = {
      contents: [
        {
          parts: [
            {
              inline_data: {
                mime_type: blob.type || 'image/jpeg',
                data: base64Content,
              },
            },
            {
              text: `
                            Can you please analyse this tyre with attached image and following parameters:
                            1. brand - ${tire.brand}
                            2. treadDepth - ${tire.tread_depth_mm}
                            3. price - ${tire.price}
                            4. production year - ${tire.production_year}
                            5. season - ${tire.season}.
                            
                            Give your opinion after the analysis in a couple of sentences with plain text:
                            should the tire be recycled or it can be sold on marketplace? If image do not look like tire,
                            then just say it. Do not use markdown and repeat my prompt, just your analysis with plain text
                            `,
            },
          ],
        },
      ],
    };

    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC40r_wtGOGCwrP_nef62KTRFsOT3wIE3A',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    const data = await res.json();
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      toastNotifications.info('Gemini successfully analysed the tire.');
      setGeminiResult(data.candidates[0].content.parts[0].text);
    } else {
      toastNotifications.error('No answer or something went wrong.');
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50'
      onClick={handleBackdropClick}
    >
      <div className='bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex justify-between items-center p-6 border-b border-gray-700'>
          <h2 className='text-2xl font-bold text-white'>
            {tire.brand} {tire.model || tire.size}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white transition-colors p-1 bg-transparent'
            aria-label='Close modal'
          >
            <X size={24} />
          </button>
        </div>

        <div className='p-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <div className='aspect-square bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center'>
                {tire.image_url && !imageError ? (
                  <img
                    src={tire.image_url || '/placeholder.svg'}
                    alt={`${tire.brand} ${tire.model || tire.size}`}
                    className='w-full h-full object-cover'
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className='text-center text-gray-400'>
                    <div className='w-16 h-16 mx-auto mb-2 bg-gray-700 rounded-full flex items-center justify-center'>
                      <Gauge size={32} />
                    </div>
                    <p>No image available</p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-gray-800 rounded-lg p-4 text-center'>
                  <div className='text-2xl font-bold text-green-400'>${tire.price}</div>
                  <div className='text-gray-400 text-sm'>Price</div>
                </div>
                <div className='bg-gray-800 rounded-lg p-4 text-center'>
                  <div className='text-2xl font-bold text-blue-400'>{tire.tread_depth_mm}mm</div>
                  <div className='text-gray-400 text-sm'>Tread Depth</div>
                </div>
                {geminiResult && (
                  <div className='bg-gray-800 rounded-lg p-4 text-center col-span-2'>
                    <div className='text-base font-bold text-blue-300'>{geminiResult}</div>
                    <div className='text-gray-400 text-sm'>Gemini analysis result</div>
                  </div>
                )}
              </div>
            </div>

            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold text-white mb-4'>Tire Details</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-400'>Brand:</span>
                    <span className='text-white font-medium'>{tire.brand}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-400'>Size:</span>
                    <span className='text-white font-medium'>{tire.size}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-400'>Season:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(tire.condition)}`}
                    >
                      {tire.season}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-400'>Tread Depth:</span>
                    <span className='text-white font-medium'>{tire.tread_depth_mm}mm</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-400'>Production Year:</span>
                    <span className='text-white font-medium'>
                      {tire.production_year || tire.manufactureYear}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-white mb-4'>Seller Information</h3>
                <div className='space-y-3'>
                  <div className='flex items-center gap-3'>
                    <User size={16} className='text-gray-400' />
                    <span className='text-white'>{tire.seller}</span>
                    {tire.isServiceProvider && (
                      <span className='bg-green-500 text-white px-2 py-1 rounded-full text-xs'>
                        Service Provider
                      </span>
                    )}
                  </div>
                  {tire.location && (
                    <div className='flex items-center gap-3'>
                      <MapPin size={16} className='text-gray-400' />
                      <span className='text-white'>{tire.location}</span>
                    </div>
                  )}
                  {tire.dateAdded && (
                    <div className='flex items-center gap-3'>
                      <Calendar size={16} className='text-gray-400' />
                      <span className='text-white'>
                        Listed on {new Date(tire.dateAdded).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {tire.description && (
                <div>
                  <h3 className='text-lg font-semibold text-white mb-4'>Description</h3>
                  <p className='text-gray-300 leading-relaxed'>{tire.description}</p>
                </div>
              )}

              <div className='bg-gray-800 rounded-lg p-4'>
                <h4 className='text-white font-medium mb-3'>Additional Information</h4>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-gray-400'>Listing ID:</span>
                    <div className='text-white font-mono'>{tire.id}</div>
                  </div>
                  <div>
                    <span className='text-gray-400'>Status:</span>
                    <div className='text-green-400'>Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {tire.description && (
            <div className='lg:hidden mt-6'>
              <h3 className='text-lg font-semibold text-white mb-4'>Description</h3>
              <p className='text-gray-300 leading-relaxed'>{tire.description}</p>
            </div>
          )}
        </div>

        <div className='grid grid-cols-2 gap-3 p-6 border-t border-gray-700'>
          <button
            onClick={handleGeminiCheck}
            className='bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors font-medium'
          >
            <div className='flex items-center gap-3'>
              <GemIcon size={18} />
              <div>Analyse with gemini</div>
            </div>
          </button>
          {/* <button
                        onClick={handleDelete}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                    >
                        Delete Listing
                    </button> */}
          <button onClick={sentForRecycle}>
            <div className='flex items-center gap-3 !rounded-lg'>
              <Recycle size={18} />
              <div>Move to recycling</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TireDetailModal;
