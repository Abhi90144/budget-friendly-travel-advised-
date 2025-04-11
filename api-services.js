/**
 * API Services for AI Travel Budget Planner
 * 
 * This file contains placeholder functions for API integrations
 * These would be replaced with actual API calls in a production environment
 */

// Flight Price API Service
class FlightPriceService {
    static async getFlightPrices(origin, destination, departDate, returnDate, passengers) {
        // This would be replaced with actual API call to e.g., Skyscanner, Amadeus, Kiwi, etc.
        console.log(`Fetching flight prices from ${origin} to ${destination}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return mock flight data
        return {
            success: true,
            currency: 'USD',
            data: [
                {
                    airline: 'Delta Airlines',
                    price: Math.floor(Math.random() * 300) + 200,
                    duration: '2h 15m',
                    stops: 0
                },
                {
                    airline: 'United Airlines',
                    price: Math.floor(Math.random() * 250) + 180,
                    duration: '2h 45m',
                    stops: 1
                },
                {
                    airline: 'American Airlines',
                    price: Math.floor(Math.random() * 350) + 220,
                    duration: '2h 05m',
                    stops: 0
                }
            ]
        };
    }
}

// Hotel/Accommodation API Service
class AccommodationService {
    static async getAccommodationPrices(location, checkIn, checkOut, guests, type) {
        // This would be replaced with actual API call to e.g., Booking.com, Hotels.com, etc.
        console.log(`Fetching ${type} accommodation in ${location}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Price ranges based on accommodation type
        let priceRange;
        if (type.toLowerCase().includes('luxury') || type.toLowerCase().includes('resort')) {
            priceRange = [250, 500];
        } else if (type.toLowerCase().includes('mid') || type.toLowerCase().includes('airbnb')) {
            priceRange = [100, 200];
        } else {
            priceRange = [50, 100];
        }
        
        // Return mock accommodation data
        return {
            success: true,
            currency: 'USD',
            data: [
                {
                    name: `${location} ${type} 1`,
                    price: Math.floor(Math.random() * (priceRange[1] - priceRange[0])) + priceRange[0],
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    amenities: ['WiFi', 'Air Conditioning', 'Pool']
                },
                {
                    name: `${location} ${type} 2`,
                    price: Math.floor(Math.random() * (priceRange[1] - priceRange[0])) + priceRange[0],
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    amenities: ['WiFi', 'Breakfast', 'Gym']
                },
                {
                    name: `${location} ${type} 3`,
                    price: Math.floor(Math.random() * (priceRange[1] - priceRange[0])) + priceRange[0],
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    amenities: ['WiFi', 'Restaurant', 'Bar']
                }
            ]
        };
    }
}

// Currency Exchange API Service
class CurrencyService {
    static async getExchangeRate(fromCurrency, toCurrency) {
        // This would be replaced with actual API call to e.g., Open Exchange Rates, Fixer.io, etc.
        console.log(`Fetching exchange rate from ${fromCurrency} to ${toCurrency}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock exchange rates (based on common rates)
        const rates = {
            'USD': {
                'EUR': 0.85,
                'GBP': 0.75,
                'JPY': 110.58,
                'CAD': 1.25,
                'AUD': 1.35
            },
            'EUR': {
                'USD': 1.18,
                'GBP': 0.88,
                'JPY': 130.00,
                'CAD': 1.48,
                'AUD': 1.59
            }
            // Add more currencies as needed
        };
        
        // Return mock exchange rate data
        return {
            success: true,
            from: fromCurrency,
            to: toCurrency,
            rate: rates[fromCurrency]?.[toCurrency] || 1,
            date: new Date().toISOString().split('T')[0]
        };
    }
}

// Weather API Service
class WeatherService {
    static async getWeatherForecast(location, startDate, endDate) {
        // This would be replaced with actual API call to e.g., OpenWeatherMap, AccuWeather, etc.
        console.log(`Fetching weather forecast for ${location}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generate random weather data for the given period
        const weatherTypes = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Thunderstorm', 'Snowy'];
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        const daysDiff = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24));
        
        const forecast = [];
        for (let i = 0; i < daysDiff; i++) {
            const currentDate = new Date(startDateObj);
            currentDate.setDate(startDateObj.getDate() + i);
            
            forecast.push({
                date: currentDate.toISOString().split('T')[0],
                weather: weatherTypes[Math.floor(Math.random() * weatherTypes.length)],
                tempHigh: Math.floor(Math.random() * 15) + 15, // 15-30 C
                tempLow: Math.floor(Math.random() * 10) + 5,  // 5-15 C
                precipitation: Math.floor(Math.random() * 100) // 0-100%
            });
        }
        
        // Return mock weather data
        return {
            success: true,
            location: location,
            forecast: forecast
        };
    }
}

// Activities API Service
class ActivitiesService {
    static async getActivities(location, preferences = []) {
        // This would be replaced with actual API call to e.g., Viator, GetYourGuide, etc.
        console.log(`Fetching activities for ${location}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Sample activities data
        const allActivities = [
            { name: "Museum/Gallery Visit", description: "Explore local art and history", cost: Math.floor(Math.random() * 15) + 15, category: "cultural" },
            { name: "Food Tour", description: "Taste local cuisine with a knowledgeable guide", cost: Math.floor(Math.random() * 60) + 60, category: "food" },
            { name: "City Walking Tour", description: "Discover hidden gems with local guides", cost: Math.floor(Math.random() * 30) + 20, category: "tour" },
            { name: "Bike Rental & Tour", description: "Explore the city on two wheels", cost: Math.floor(Math.random() * 30) + 30, category: "adventure" },
            { name: "Boat Cruise", description: "See the sights from the water", cost: Math.floor(Math.random() * 60) + 40, category: "tour" },
            { name: "Landmark Visit", description: "Visit the famous attractions", cost: Math.floor(Math.random() * 25) + 15, category: "sightseeing" },
            { name: "National Park Entrance", description: "Experience natural beauty", cost: Math.floor(Math.random() * 20) + 10, category: "nature" },
            { name: "Beach/Water Activities", description: "Enjoy water sports and relaxation", cost: Math.floor(Math.random() * 70) + 50, category: "adventure" },
            { name: "Adventure Activity", description: "Get your adrenaline pumping", cost: Math.floor(Math.random() * 120) + 80, category: "adventure" },
            { name: "Wine/Brewery Tour", description: "Sample local drinks and learn about production", cost: Math.floor(Math.random() * 50) + 50, category: "food" },
            { name: "Cultural Performance", description: "Experience local arts and traditions", cost: Math.floor(Math.random() * 110) + 40, category: "cultural" },
            { name: "Historical Site Visit", description: "Step back in time at important locations", cost: Math.floor(Math.random() * 20) + 20, category: "cultural" }
        ];
        
        // Filter by preferences if provided
        let activities = allActivities;
        if (preferences && preferences.length > 0) {
            activities = allActivities.filter(activity => 
                preferences.some(pref => activity.category.includes(pref.toLowerCase()))
            );
        }
        
        // If no activities match preferences, return a sample
        if (activities.length === 0) {
            activities = allActivities.slice(0, 5);
        }
        
        // Shuffle and take up to 8 activities
        activities = shuffleArray(activities).slice(0, 8);
        
        // Return mock activities data
        return {
            success: true,
            location: location,
            data: activities
        };
    }
}

// Helper function to shuffle arrays
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Export services
export {
    FlightPriceService,
    AccommodationService,
    CurrencyService,
    WeatherService,
    ActivitiesService
}; 