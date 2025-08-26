import LoadingSpinner from '../../components/TyreLoading/TyreLoading';
import { useState, useEffect } from 'react';
import { useTire } from '../../hooks/tire.hooks';
import { Tire } from '../../../../src/declarations/backend/backend.did';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);


const Marketplace = () => {
  const [tires, setTires] = useState<Tire[]>([]);
  const [filteredTires, setFilteredTires] = useState<Tire[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brand: '',
    size: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    location: '',
  });
  const [aiQuery, setAiQuery] = useState("");

  const { fetchAllTires } = useTire();

  const getAuthClient = async () => {
    setLoading(true);

    const allTires = await fetchAllTires();
    const tires = allTires.filter(tire => !tire.sent_to_recycle);

    console.log('TIRES', tires);

    setTires(tires);
    setFilteredTires(tires);
    setLoading(false);
  };

  useEffect(() => {
    getAuthClient();
  }, []);

  const handleAiSearch = async () => {
    if (!aiQuery.trim()) return;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
  Extract structured tire filters from this user request: "${aiQuery}".
  Return JSON with keys: brand, size, condition, minPrice, maxPrice, location.
  Example:
  { "brand": "Michelin", "size": "225/45R17", "condition": "Good", "minPrice": "50", "maxPrice": "150", "location": "Kyiv" }
  `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
      const parsed = JSON.parse(text);
      setFilters(prev => ({
        ...prev,
        ...parsed,
      }));
    } catch (err) {
      console.error("AI parsing error", err, text);
      alert("Could not understand your request, please try again.");
    }
  };


  useEffect(() => {
    setTimeout(() => {
      // setTires(mockTires)
      // setFilteredTires(mockTires)
      // setLoading(false)
    }, 1500);
  }, []);

  useEffect(() => {
    // Apply filters
    const filtered = tires.filter(tire => {
      return (
        (filters.brand === '' || tire.brand.toLowerCase().includes(filters.brand.toLowerCase())) &&
        (filters.size === '' || tire.size.includes(filters.size)) &&
        (filters.condition === '' || tire.condition === filters.condition) &&
        (filters.minPrice === '' || tire.price >= Number.parseInt(filters.minPrice)) &&
        (filters.maxPrice === '' || tire.price <= Number.parseInt(filters.maxPrice)) &&
        (filters.location === '' ||
          tire.location.toLowerCase().includes(filters.location.toLowerCase()))
      );
    });
    setFilteredTires(filtered);
  }, [filters, tires]);

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      size: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      location: '',
    });
  };

  const handleContactSeller = tire => {
    alert(`Contacting ${tire.seller} about ${tire.brand} ${tire.model}`);
  };

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
          <h1 className='text-4xl font-bold mb-2'>Tire Marketplace</h1>
          <p className='text-gray-300 text-lg'>Find the perfect used tires for your vehicle</p>
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
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">AI Search</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={e => setAiQuery(e.target.value)}
                    placeholder="e.g., cheap winter tires in Kyiv"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleAiSearch}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>


              <div className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium mb-2'>Brand</label>
                  <input
                    type='text'
                    name='brand'
                    value={filters.brand}
                    onChange={handleFilterChange}
                    placeholder='e.g., Michelin, Bridgestone'
                    className='w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium mb-2'>Tire Size</label>
                  <input
                    type='text'
                    name='size'
                    value={filters.size}
                    onChange={handleFilterChange}
                    placeholder='e.g., 225/45R17'
                    className='w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium mb-2'>Condition</label>
                  <select
                    name='condition'
                    value={filters.condition}
                    onChange={handleFilterChange}
                    className='w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500'
                  >
                    <option value=''>All Conditions</option>
                    <option value='Excellent'>Excellent</option>
                    <option value='Very Good'>Very Good</option>
                    <option value='Good'>Good</option>
                    <option value='Fair'>Fair</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium mb-2'>Price Range</label>
                  <div className='grid grid-cols-2 gap-2'>
                    <input
                      type='number'
                      name='minPrice'
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder='Min $'
                      className='px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500'
                    />
                    <input
                      type='number'
                      name='maxPrice'
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder='Max $'
                      className='px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium mb-2'>City</label>
                  <input
                    type='text'
                    name='location'
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder='City or State'
                    className='w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tire Listings */}
          <div className='lg:col-span-3'>
            <div className='mb-6'>
              <h3 className='text-2xl font-semibold'>Available Tires ({filteredTires.length})</h3>
            </div>

            {filteredTires.length === 0 ? (
              <div className='bg-gray-900 rounded-lg p-12 text-center'>
                <p className='text-gray-300 text-lg mb-4'>No tires found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className='bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors'
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {filteredTires.map(tire => (
                  <div
                    key={tire.id}
                    className='bg-gray-900 rounded-lg overflow-hidden hover:transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-200'
                  >
                    <div className='h-48 bg-gray-800 flex items-center justify-center'>
                      <img
                        src={tire.image_url}
                        alt={`${tire.brand} ${tire.model}`}
                        className='max-w-full max-h-full object-cover'
                      />
                    </div>

                    <div className='p-6'>
                      <h4 className='text-xl font-semibold mb-1'>
                        {tire.brand} {tire.model}
                      </h4>
                      <p className='text-green-400 font-semibold mb-3'>{tire.size}</p>
                      <p className='text-gray-300 text-sm mb-4 line-clamp-2'>{tire.description}</p>

                      <div className='space-y-2 mb-4'>
                        <div className='flex justify-between'>
                          <span className='text-gray-400'>Tread Depth:</span>
                          <span className='text-white'>{tire.tread_depth_mm}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-400'>Year:</span>
                          <span className='text-white'>{tire.production_year}</span>
                        </div>
                      </div>

                      <div className='border-t border-gray-700 pt-4 mb-4'>
                        <div className='flex items-center justify-between mb-1'>
                          <div className='flex items-center space-x-2'>
                            {tire.isServiceProvider && (
                              <span className='bg-green-500 text-white px-2 py-1 rounded-full text-xs'>
                                Service Provider
                              </span>
                            )}
                          </div>
                        </div>
                        <span className='text-gray-400 text-sm'>{tire.location}</span>
                      </div>

                      <div className='flex justify-between items-center'>
                        <div className='text-2xl font-bold text-green-400'>${tire.price}</div>
                        <button
                          onClick={() => handleContactSeller(tire)}
                          className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors'
                        >
                          Contact Seller
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

export default Marketplace;
