import React, { useState, useEffect } from 'react';

const specialtiesList = [
    "General Physician", "Dentist", "Dermatologist", "Paediatrician", "Gynaecologist",
    "ENT", "Diabetologist", "Cardiologist", "Physiotherapist", "Endocrinologist",
    "Orthopaedic", "Ophthalmologist", "Gastroenterologist", "Pulmonologist",
    "Psychiatrist", "Urologist", "Dietitian/Nutritionist", "Psychologist",
    "Sexologist", "Nephrologist", "Neurologist", "Oncologist", "Ayurveda", "Homeopath",
    "Gynaecologist and Obstetrician"
];

function App() {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [consultationType, setConsultationType] = useState('');
    const [selectedSpecialties, setSelectedSpecialties] = useState([]);
    const [sortOption, setSortOption] = useState('');

    useEffect(() => {
        fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json')
            .then(response => response.json())
            .then(data => {
                const normalizedData = data.map(doctor => ({
                    ...doctor,
                    specialities: doctor.specialities.map(spec => spec.name),
                    fees: parseInt(doctor.fees.replace(/[^0-9]/g, '')),
                    experience: parseInt(doctor.experience.match(/\d+/)[0])
                }));
                setDoctors(normalizedData);
                setFilteredDoctors(normalizedData);
                loadFiltersFromURL(normalizedData);
            });
    }, []);

    useEffect(() => {
        filterDoctors();
        updateURL();
    }, [searchTerm, consultationType, selectedSpecialties, sortOption]);

    const loadFiltersFromURL = (data) => {
        const params = new URLSearchParams(window.location.search);
        const search = params.get('search') || '';
        const consult = params.get('consultation') || '';
        const specs = params.get('specialties')?.split(',')?.filter(s => s) || [];
        const sort = params.get('sort') || '';

        setSearchTerm(search);
        setConsultationType(consult);
        setSelectedSpecialties(specs);
        setSortOption(sort);

        filterDoctors(data, search, consult, specs, sort);
    };

    const filterDoctors = (data = doctors, search = searchTerm, consult = consultationType, specs = selectedSpecialties, sort = sortOption) => {
        let filtered = [...data];

        if (search) {
            filtered = filtered.filter(doctor =>
                doctor.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (consult) {
            filtered = filtered.filter(doctor =>
                consult === 'Video Consult' ? doctor.video_consult : doctor.in_clinic
            );
        }

        if (specs.length > 0) {
            filtered = filtered.filter(doctor =>
                specs.every(spec => doctor.specialities.includes(spec))
            );
        }

        if (sort === 'fees') {
            filtered.sort((a, b) => a.fees - b.fees);
        } else if (sort === 'experience') {
            filtered.sort((a, b) => b.experience - a.experience);
        }

        setFilteredDoctors(filtered);

        if (search) {
            const matches = data
                .filter(doctor => doctor.name.toLowerCase().includes(search.toLowerCase()))
                .slice(0, 3)
                .map(doctor => doctor.name);
            setSuggestions(matches);
        } else {
            setSuggestions([]);
        }
    };

    const updateURL = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (consultationType) params.set('consultation', consultationType);
        if (selectedSpecialties.length > 0) params.set('specialties', selectedSpecialties.join(','));
        if (sortOption) params.set('sort', sortOption);
        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSuggestionClick = (name) => {
        setSearchTerm(name);
        setSuggestions([]);
    };

    const handleConsultationChange = (type) => {
        setConsultationType(type);
    };

    const handleSpecialtyChange = (specialty) => {
        setSelectedSpecialties(prev =>
            prev.includes(specialty)
                ? prev.filter(s => s !== specialty)
                : [...prev, specialty]
        );
    };

    const handleSortChange = (option) => {
        setSortOption(option);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-6">
                {/* Search Bar */}
                <div className="relative mb-8">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search for doctors..."
                        className="w-full p-4 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        data-testid="autocomplete-input"
                    />
                    <svg
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    {suggestions.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-40 overflow-y-auto">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="p-3 hover:bg-blue-50 cursor-pointer transition duration-200"
                                    data-testid="suggestion-item"
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Main Layout */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Filter Panel */}
                    <div className="lg:w-1/4 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Filters</h2>

                        {/* Consultation Mode */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-700 mb-3" data-testid="filter-header-moc">
                                Consultation Mode
                            </h3>
                            <label className="flex items-center mb-2">
                                <input
                                    type="radio"
                                    name="consultation"
                                    checked={consultationType === 'Video Consult'}
                                    onChange={() => handleConsultationChange('Video Consult')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    data-testid="filter-video-consult"
                                />
                                <span className="ml-2 text-gray-600">Video Consult</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="consultation"
                                    checked={consultationType === 'In Clinic'}
                                    onChange={() => handleConsultationChange('In Clinic')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    data-testid="filter-in-clinic"
                                />
                                <span className="ml-2 text-gray-600">In Clinic</span>
                            </label>
                        </div>

                        {/* Speciality */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-700 mb-3" data-testid="filter-header-speciality">
                                Speciality
                            </h3>
                            <div className="max-h-64 overflow-y-auto pr-2">
                                {specialtiesList.map(specialty => (
                                    <label key={specialty} className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedSpecialties.includes(specialty)}
                                            onChange={() => handleSpecialtyChange(specialty)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            data-testid={`filter-specialty-${specialty.replace(/\/| and /g, '-')}`}
                                        />
                                        <span className="ml-2 text-gray-600">{specialty}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Sort */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-700 mb-3" data-testid="filter-header-sort">
                                Sort
                            </h3>
                            <label className="flex items-center mb-2">
                                <input
                                    type="radio"
                                    name="sort"
                                    checked={sortOption === 'fees'}
                                    onChange={() => handleSortChange('fees')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    data-testid="sort-fees"
                                />
                                <span className="ml-2 text-gray-600">Fees (Low to High)</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="sort"
                                    checked={sortOption === 'experience'}
                                    onChange={() => handleSortChange('experience')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    data-testid="sort-experience"
                                />
                                <span className="ml-2 text-gray-600">Experience (High to Low)</span>
                            </label>
                        </div>
                    </div>

                    {/* Doctor List */}
                    <div className="lg:w-3/4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {filteredDoctors.map(doctor => (
                                <div
                                    key={doctor.id}
                                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                                    data-testid="doctor-card"
                                >
                                    <div className="flex items-start">
                                        <img
                                            src={doctor.photo}
                                            alt={doctor.name}
                                            className="w-20 h-20 rounded-full object-cover mr-4"
                                        />
                                        <div>
                                            <h3
                                                className="text-xl font-semibold text-gray-800"
                                                data-testid="doctor-name"
                                            >
                                                {doctor.name}
                                            </h3>
                                            <p
                                                className="text-gray-600 text-sm"
                                                data-testid="doctor-specialty"
                                            >
                                                {doctor.specialities.join(', ')}
                                            </p>
                                            <p
                                                className="text-gray-600 text-sm"
                                                data-testid="doctor-experience"
                                            >
                                                {doctor.experience} years of experience
                                            </p>
                                            <p
                                                className="text-blue-600 font-medium"
                                                data-testid="doctor-fee"
                                            >
                                                ₹{doctor.fees}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;