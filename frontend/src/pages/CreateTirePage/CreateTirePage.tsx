import LoadingSpinner from "../../components/TyreLoading/TyreLoading"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toastNotifications from "../../utils/toastNotifications.utils"
import { createActor, canisterId } from 'declarations/backend';
import { uploadFileToPinata, getFileUrl } from "../../utils/pinata.utils";
import { AuthClient } from "@dfinity/auth-client";

const AddTire = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        brand: "",
        size: "",
        treadDepth: "",
        productionYear: 2025,
        imageUrl: "",
        price: "",
        season: '',
        description: "",
        imagePreview: null,
        profileImage: null,
    })
    const [errors, setErrors] = useState({})

    const tireSizes = ["205/55 R16", "215/60 R16", "225/45 R17"]
    const treadDepthOptions = [2, 3, 4, 5, 6, 7, 8, 9]
    const seasonOptions = ['Winter', 'Summer']
    const currentYear = new Date().getFullYear()
    const yearOptions = Array.from({ length: 15 }, (_, i) => currentYear - i)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            })
        }

        // // Handle image URL preview
        // if (name === "imageUrl" && value) {
        //     setImagePreview(value)
        // }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]

        if (file) {
            setFormData({
                ...formData,
                profileImage: file,
            })

        }
    }

    const validateForm = () => {
        const newErrors: any = {}

        // if (!formData.brand.trim()) {
        //     newErrors.brand = "Brand is required"
        // }

        // if (!formData.size) {
        //     newErrors.size = "Tire size is required"
        // }

        // if (!formData.treadDepth) {
        //     newErrors.treadDepth = "Tread depth is required"
        // }

        // if (!formData.productionYear) {
        //     newErrors.productionYear = "Production year is required"
        // } else if (formData.productionYear < 2000 || formData.productionYear > currentYear) {
        //     newErrors.productionYear = `Year must be between 2000 and ${currentYear}`
        // }

        // if (!formData.description.trim()) {
        //     newErrors.description = "Description is required"
        // }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        const authClient = await AuthClient.create();
        const identity = authClient.getIdentity();

        const canisterActor = createActor(canisterId, {
            agentOptions: {
                identity,
            },
        });
        setLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000))

            let imageUrl = '';
            if (formData.profileImage) {
                const uriIc = await uploadFileToPinata(formData.profileImage);
                imageUrl = getFileUrl(uriIc);
            }

            
            await canisterActor.create_tire(
                crypto.randomUUID(),
                formData.brand,
                formData.size,
                formData.season,
                Number(formData.treadDepth),
                Number(formData.productionYear),
                imageUrl,
            );
            toastNotifications.success("Tire listing added successfully!")
           // navigate("/marketplace")
        } catch (error) {
            console.error("Error adding tire:", error)
            toastNotifications.error("Failed to add tire listing. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        navigate(-1) // Go back to previous page
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-300">Adding your tire listing...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 lg:p-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">Add New Tire</h1>
                    <p className="text-gray-300 text-lg">List your tire for sale on the marketplace</p>
                </div>

                <div className="my-6 bg-gray-900 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-green-400">Tips for a Great Listing</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start">
                            <span className="text-green-400 mr-2">•</span>
                            Use clear, high-quality photos showing the tire's condition
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-400 mr-2">•</span>
                            Be honest about the tire's condition and any wear patterns
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-400 mr-2">•</span>
                            Include details about storage conditions and usage history
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-400 mr-2">•</span>
                            Price competitively based on condition and market value
                        </li>
                    </ul>
                </div>

                <div className="bg-gray-900 rounded-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-group overflow-hidden relative">
                            <label htmlFor="profileImage">Tire Image *</label>
                            <div className="flex items-center mb-4">
                                <div
                                    className="w-full flex flex-col items-center justify-center"
                                    style={{
                                        minHeight: "150px",
                                        border: "2px dashed var(--border-color)",
                                        borderRadius: "8px",
                                        padding: "16px",
                                        marginBottom: "16px",
                                    }}
                                >
                                    {formData.profileImage ? (
                                        <img
                                            src={URL.createObjectURL(formData.profileImage)}
                                            alt="Profile preview"
                                            style={{
                                                maxWidth: "100%",
                                                maxHeight: "300px",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    ) : (
                                        <div className="flex flex-col justify-center items-center">
                                            <p>Click to upload an image</p>
                                            <p className="text-sm">(or drag and drop)</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="profileImage"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{
                                            position: "absolute",
                                            width: "100%",
                                            height: "100%",
                                            opacity: 0,
                                            cursor: "pointer",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="brand" className="block text-sm font-medium mb-2">
                                Brand and model *
                            </label>
                            <input
                                type="text"
                                id="brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="e.g., Michelin, Bridgestone, Continental"
                                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${errors.brand ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-green-500"
                                    }`}
                            />
                        </div>

                        <div>
                            <label htmlFor="size" className="block text-sm font-medium mb-2">
                                Tire Size *
                            </label>
                            <select
                                id="size"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${errors.size ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-green-500"
                                    }`}
                            >
                                <option value="">Select tire size</option>
                                {tireSizes.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                            {errors.size && <p className="mt-1 text-red-400 text-sm">{errors.size}</p>}
                        </div>

                        {/* Tread Depth */}
                        <div>
                            <label htmlFor="treadDepth" className="block text-sm font-medium mb-2">
                                Tread Depth (mm) *
                            </label>
                            <select
                                id="treadDepth"
                                name="treadDepth"
                                value={formData.treadDepth}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${errors.treadDepth ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-green-500"
                                    }`}
                            >
                                <option value="">Select tread depth</option>
                                {treadDepthOptions.map((depth) => (
                                    <option key={depth} value={depth}>
                                        {depth}mm
                                    </option>
                                ))}
                            </select>
                            {errors.treadDepth && <p className="mt-1 text-red-400 text-sm">{errors.treadDepth}</p>}
                        </div>

                        {/* Production Year */}
                        <div>
                            <label htmlFor="productionYear" className="block text-sm font-medium mb-2">
                                Production Year *
                            </label>
                            <select
                                id="productionYear"
                                name="productionYear"
                                value={formData.productionYear}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${errors.productionYear ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-green-500"
                                    }`}
                            >
                                <option value="">Select production year</option>
                                {yearOptions.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            {errors.productionYear && <p className="mt-1 text-red-400 text-sm">{errors.productionYear}</p>}
                        </div>

                        <div>
                            <label htmlFor="condition" className="block text-sm font-medium mb-2">
                                Season *
                            </label>
                            <select
                                id="condition"
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${errors.condition ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-green-500"
                                    }`}
                            >
                                <option value="">Select season</option>
                                {seasonOptions.map((condition) => (
                                    <option key={condition} value={condition}>
                                        {condition}
                                    </option>
                                ))}
                            </select>
                            {errors.condition && <p className="mt-1 text-red-400 text-sm">{errors.condition}</p>}
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 px-6 py-3 border border-gray-600 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                            >
                                {loading ? "Adding Tire..." : "Add Tire"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddTire
