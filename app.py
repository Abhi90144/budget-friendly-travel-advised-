from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import json
import random
import os
from datetime import datetime, timedelta
import math

app = Flask(__name__, static_folder='static')
CORS(app)

# Data models
class TravelData:
    def __init__(self):
        self.plan_type = None  # 'quick' or 'detailed'
        self.destination = None
        self.currency = None
        self.start_date = None
        self.end_date = None
        self.travelers = None
        self.accommodation = None
        self.transportation = None
        self.food_preference = None
        self.activities = []
        self.budget = None

# Currency conversion rates
currency_rates = {
    'USD': 1,
    'INR': 83.28,
    'EUR': 0.92,
    'THB': 36.18,  # Thai Baht
    'VND': 25000,  # Vietnamese Dong
    'IDR': 15750,  # Indonesian Rupiah
    'MYR': 4.47,   # Malaysian Ringgit
    'SGD': 1.35,   # Singapore Dollar
    'PHP': 56.80   # Philippine Peso
}

# Currency symbols
currency_symbols = {
    'USD': '$',
    'INR': '₹',
    'EUR': '€',
    'THB': '฿',
    'VND': '₫',
    'IDR': 'Rp',
    'MYR': 'RM',
    'SGD': 'S$',
    'PHP': '₱'
}

# Southeast Asia destinations
sea_destinations = [
    'Thailand', 'Vietnam', 'Indonesia', 'Malaysia', 
    'Singapore', 'Philippines', 'Cambodia', 'Laos', 
    'Myanmar', 'Bali', 'Bangkok', 'Phuket', 
    'Chiang Mai', 'Hanoi', 'Ho Chi Minh City', 
    'Jakarta', 'Kuala Lumpur', 'Manila', 
    'Phnom Penh', 'Siem Reap', 'Vientiane', 
    'Yangon', 'Ubud', 'Koh Samui', 'Boracay'
]

# Helper functions
def get_local_currency(destination):
    """Get the local currency based on the destination"""
    destination_lower = destination.lower()
    if any(place in destination_lower for place in ['thailand', 'bangkok', 'phuket', 'chiang mai']):
        return 'THB'
    elif any(place in destination_lower for place in ['vietnam', 'hanoi', 'ho chi minh']):
        return 'VND'
    elif any(place in destination_lower for place in ['indonesia', 'bali', 'jakarta', 'ubud']):
        return 'IDR'
    elif any(place in destination_lower for place in ['malaysia', 'kuala lumpur']):
        return 'MYR'
    elif 'singapore' in destination_lower:
        return 'SGD'
    elif any(place in destination_lower for place in ['philippines', 'manila', 'boracay']):
        return 'PHP'
    # Default to USD if no specific currency is identified
    return 'USD'

def convert_currency(amount_in_usd, target_currency='USD'):
    """Convert amount from USD to the selected currency"""
    if not target_currency or target_currency == 'USD':
        return {'value': amount_in_usd or 0, 'symbol': '$'}
    
    rate = currency_rates.get(target_currency, 1)
    symbol = currency_symbols.get(target_currency, '$')
    
    # Ensure we're not returning NaN by checking for None, NaN, or invalid values
    if amount_in_usd is None or isinstance(amount_in_usd, float) and (math.isnan(amount_in_usd) or math.isinf(amount_in_usd)):
        converted_value = 0
    else:
        try:
            converted_value = float(amount_in_usd) * rate
        except (ValueError, TypeError):
            converted_value = 0
    
    return {
        'value': round(converted_value),
        'symbol': symbol
    }

def format_currency(amount_in_usd, target_currency='USD'):
    """Format currency for display"""
    # Handle None, NaN, or invalid amounts
    if amount_in_usd is None or isinstance(amount_in_usd, float) and (math.isnan(amount_in_usd) or math.isinf(amount_in_usd)):
        amount_in_usd = 0
        
    # Convert the currency
    converted = convert_currency(amount_in_usd, target_currency)
    
    # Format with thousand separators
    try:
        formatted_value = f"{converted['value']:,}"
    except (ValueError, TypeError):
        formatted_value = "0"
        
    return f"{converted['symbol']}{formatted_value}"

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

@app.route('/api/chat', methods=['POST'])
def chat():
    """Process chat messages and return responses"""
    data = request.json
    message = data.get('message', '').strip()
    session_data = data.get('sessionData', {})
    
    # Initialize or update session data
    travel_data = session_data.get('travelData', {})
    if not travel_data:
        travel_data = {
            'planType': None,
            'destination': None,
            'currency': None,
            'startDate': None,
            'endDate': None,
            'travelers': None,
            'accommodation': None,
            'transportation': None,
            'foodPreference': None,
            'activities': [],
            'budget': None
        }
    
    # Determine conversation state and generate appropriate response
    response = process_message(message, travel_data)
    
    return jsonify({
        'response': response.get('message'),
        'options': response.get('options', []),
        'sessionData': {
            'travelData': travel_data
        }
    })

def process_message(message, travel_data):
    """Process the user message and return appropriate response"""
    
    # If this is the start of the conversation or no destination is set yet
    if not travel_data['destination']:
        # Check if the message contains a Southeast Asian destination
        destination = find_southeast_asian_destination(message)
        if destination:
            travel_data['destination'] = destination
            return {
                'message': f"Great choice! {destination} is a beautiful destination in Southeast Asia. In which currency would you like to view your travel budget?",
                'options': [
                    {'text': "USD 💵", 'value': "USD"},
                    {'text': "EUR 💶", 'value': "EUR"},
                    {'text': "INR 🇮🇳", 'value': "INR"},
                    {'text': "Local Currency", 'value': "local"}
                ]
            }
        else:
            # Offer destination choices
            random_destinations = random.sample(sea_destinations, 5)
            return {
                'message': "Which Southeast Asian destination would you like to visit?",
                'options': [{'text': dest, 'value': dest} for dest in random_destinations] + [
                    {'text': "Other destination", 'value': "other"}
                ]
            }
    
    # If destination is set but currency is not
    if travel_data['destination'] and not travel_data['currency']:
        if message.lower() in [c.lower() for c in ['USD', 'EUR', 'INR']]:
            travel_data['currency'] = message.upper()
        elif message.lower() == 'local':
            travel_data['currency'] = get_local_currency(travel_data['destination'])
        else:
            # Try to extract a currency from the message
            extracted_currency = extract_currency(message)
            if extracted_currency:
                travel_data['currency'] = extracted_currency
            else:
                # Default to USD if no currency is specified
                travel_data['currency'] = 'USD'
        
        return {
            'message': f"Perfect! Now, would you like a quick budget estimate for {travel_data['destination']} or a detailed custom plan?",
            'options': [
                {'text': "Quick Budget Estimate", 'value': "quick"},
                {'text': "Detailed Custom Plan", 'value': "detailed"}
            ]
        }
    
    # Function to extract currency from message
    def extract_currency(message):
        message = message.upper()
        for currency in currency_rates.keys():
            if currency in message:
                return currency
        return None
    
    # Function to find Southeast Asian destination in message
    def find_southeast_asian_destination(message):
        message_lower = message.lower()
        for destination in sea_destinations:
            if destination.lower() in message_lower:
                return destination
        return None
    
    # Process plan type selection
    if travel_data['destination'] and travel_data['currency'] and not travel_data['planType']:
        if 'quick' in message.lower():
            travel_data['planType'] = 'quick'
            # For quick plan, we can provide an immediate estimate
            return get_quick_budget_plan(travel_data)
        elif 'detailed' in message.lower():
            travel_data['planType'] = 'detailed'
            # For detailed plan, we need more information
            return {
                'message': "Great! For a detailed plan, I'll need some more information. When do you plan to start your trip? (Please provide a date in MM/DD/YYYY format)",
                'options': []
            }
        else:
            # Default to quick plan if message is unclear
            travel_data['planType'] = 'quick'
            return get_quick_budget_plan(travel_data)
    
    # Handle detailed plan date input
    if travel_data['planType'] == 'detailed' and not travel_data['startDate']:
        # Try to parse date from message
        try:
            date = datetime.strptime(message, '%m/%d/%Y')
            travel_data['startDate'] = date.strftime('%Y-%m-%d')
            return {
                'message': "And when will your trip end? (Please provide a date in MM/DD/YYYY format)",
                'options': []
            }
        except ValueError:
            return {
                'message': "I couldn't understand that date format. Please provide a date in MM/DD/YYYY format (e.g., 12/25/2023).",
                'options': []
            }
    
    # Handle detailed plan end date input
    if travel_data['planType'] == 'detailed' and travel_data['startDate'] and not travel_data['endDate']:
        try:
            date = datetime.strptime(message, '%m/%d/%Y')
            travel_data['endDate'] = date.strftime('%Y-%m-%d')
            return {
                'message': "How many travelers will be joining this trip?",
                'options': [
                    {'text': "1", 'value': "1"},
                    {'text': "2", 'value': "2"},
                    {'text': "3", 'value': "3"},
                    {'text': "4+", 'value': "4"}
                ]
            }
        except ValueError:
            return {
                'message': "I couldn't understand that date format. Please provide a date in MM/DD/YYYY format (e.g., 12/25/2023).",
                'options': []
            }
    
    # Process number of travelers
    if travel_data['planType'] == 'detailed' and travel_data['startDate'] and travel_data['endDate'] and not travel_data['travelers']:
        try:
            travelers = int(message.split()[0])  # Extract first number from message
            travel_data['travelers'] = travelers
            return {
                'message': "What type of accommodation would you prefer?",
                'options': [
                    {'text': "Budget/Hostel", 'value': "budget"},
                    {'text': "Mid-range Hotel", 'value': "mid-range"},
                    {'text': "Luxury Resort", 'value': "luxury"}
                ]
            }
        except ValueError:
            # Default to 2 travelers if parsing fails
            travel_data['travelers'] = 2
            return {
                'message': "I'll assume 2 travelers for now. What type of accommodation would you prefer?",
                'options': [
                    {'text': "Budget/Hostel", 'value': "budget"},
                    {'text': "Mid-range Hotel", 'value': "mid-range"},
                    {'text': "Luxury Resort", 'value': "luxury"}
                ]
            }
    
    # Continue with the detailed plan flow...
    # (More conditions would be added to handle the rest of the conversation flow)
    
    # Default response if no conditions match
    return {
        'message': "I'm not sure how to respond to that. Can you please rephrase or ask a specific question about Southeast Asia travel?",
        'options': []
    }

def get_quick_budget_plan(travel_data):
    """Generate a quick budget plan based on the destination and currency"""
    destination = travel_data['destination']
    currency = travel_data['currency']
    
    # Base costs in USD (these would be adjusted per destination in a real system)
    daily_costs = {
        'budget': {
            'accommodation': get_accommodation_rate('budget', destination),
            'food': get_food_rate('budget', destination),
            'transportation': get_transportation_cost('budget', destination),
            'activities': get_activity_cost('budget', destination)
        },
        'mid-range': {
            'accommodation': get_accommodation_rate('mid-range', destination),
            'food': get_food_rate('mid-range', destination),
            'transportation': get_transportation_cost('mid-range', destination),
            'activities': get_activity_cost('mid-range', destination)
        },
        'luxury': {
            'accommodation': get_accommodation_rate('luxury', destination),
            'food': get_food_rate('luxury', destination),
            'transportation': get_transportation_cost('luxury', destination),
            'activities': get_activity_cost('luxury', destination)
        }
    }
    
    # Format the budget plan response
    budget_message = f"🌴 **Quick Budget Estimate for {destination}** 🌴\n\n"
    
    # Format daily costs for each budget level
    for level, costs in daily_costs.items():
        # Ensure no NaN values in the total calculation
        total_daily = 0
        for category, amount in costs.items():
            if amount is not None and not (isinstance(amount, float) and (math.isnan(amount) or math.isinf(amount))):
                total_daily += amount
        
        budget_message += f"**{level.capitalize()} Level** (per person per day):\n"
        budget_message += f"- Accommodation: {format_currency(costs['accommodation'], currency)}\n"
        budget_message += f"- Food: {format_currency(costs['food'], currency)}\n"
        budget_message += f"- Local Transportation: {format_currency(costs['transportation'], currency)}\n"
        budget_message += f"- Activities: {format_currency(costs['activities'], currency)}\n"
        budget_message += f"*Daily Total: {format_currency(total_daily, currency)}*\n\n"
    
    # Add weekly and monthly estimates for mid-range
    # Calculate sum safely to avoid NaN
    mid_daily = 0
    for category, amount in daily_costs['mid-range'].items():
        if amount is not None and not (isinstance(amount, float) and (math.isnan(amount) or math.isinf(amount))):
            mid_daily += amount
    
    budget_message += f"**Estimated totals per person (mid-range):**\n"
    budget_message += f"- 1 week: {format_currency(mid_daily * 7, currency)}\n"
    budget_message += f"- 2 weeks: {format_currency(mid_daily * 14, currency)}\n"
    budget_message += f"- 1 month: {format_currency(mid_daily * 30, currency)}\n\n"
    
    # Add some budget saving tips
    budget_message += "**Budget Saving Tips:**\n"
    budget_message += get_budget_saving_tips(destination)
    
    return {
        'message': budget_message,
        'options': [
            {'text': "Get Detailed Plan", 'value': "detailed"},
            {'text': "Must-Visit Places", 'value': "places"},
            {'text': "Local Transportation Tips", 'value': "transport"}
        ]
    }

# Helper functions for budget calculations
def get_accommodation_rate(level, destination):
    """Get accommodation rates based on level and destination"""
    # Base rates in USD
    base_rates = {
        'budget': 15,
        'mid-range': 50,
        'luxury': 150
    }
    
    # Destination multipliers
    destination_multipliers = {
        'singapore': 2.0,
        'bangkok': 0.8,
        'bali': 0.7,
        'phuket': 0.9,
        'kuala lumpur': 0.8,
        'ho chi minh city': 0.7,
        'hanoi': 0.6,
        'manila': 0.7,
        'jakarta': 0.8,
        'phnom penh': 0.5,
        'siem reap': 0.6,
        'yangon': 0.5,
        'vientiane': 0.5,
        'thailand': 0.8,
        'vietnam': 0.7,
        'indonesia': 0.7,
        'malaysia': 0.8,
        'philippines': 0.7,
        'cambodia': 0.5,
        'laos': 0.5,
        'myanmar': 0.5
    }
    
    # Find the appropriate multiplier
    multiplier = 1.0
    destination_lower = destination.lower()
    for key, value in destination_multipliers.items():
        if key in destination_lower:
            multiplier = value
            break
    
    # Safe calculation to prevent NaN
    rate = base_rates.get(level, 30) * multiplier
    if math.isnan(rate) or math.isinf(rate):
        return base_rates.get(level, 30)  # Return base rate if calculation results in NaN
    return rate

def get_food_rate(level, destination):
    """Get food rates based on level and destination"""
    # Base rates in USD
    base_rates = {
        'budget': 10,
        'mid-range': 25,
        'luxury': 60
    }
    
    # Similar destination multiplier logic as accommodation
    # (Would be implemented with specific food cost factors)
    # For now, using a simplified approach
    destination_lower = destination.lower()
    multiplier = 1.0
    
    if any(place in destination_lower for place in ['singapore']):
        multiplier = 1.5
    elif any(place in destination_lower for place in ['thailand', 'bangkok', 'phuket']):
        multiplier = 0.7
    elif any(place in destination_lower for place in ['vietnam', 'hanoi', 'ho chi minh']):
        multiplier = 0.6
    elif any(place in destination_lower for place in ['indonesia', 'bali']):
        multiplier = 0.7
    
    # Safe calculation to prevent NaN
    rate = base_rates.get(level, 25) * multiplier
    if math.isnan(rate) or math.isinf(rate):
        return base_rates.get(level, 25)  # Return base rate if calculation results in NaN
    return rate

def get_transportation_cost(level, destination):
    """Get transportation costs based on level and destination"""
    # Base rates in USD per day
    base_rates = {
        'budget': 5,
        'mid-range': 15,
        'luxury': 40
    }
    
    # Default to a safe value if level is not in base_rates
    return base_rates.get(level, 15)  # Default to mid-range if level not found

def get_activity_cost(level, destination):
    """Get activity costs based on level and destination"""
    # Base rates in USD per day
    base_rates = {
        'budget': 10,
        'mid-range': 30,
        'luxury': 80
    }
    
    # Default to a safe value if level is not in base_rates
    return base_rates.get(level, 30)  # Default to mid-range if level not found

def get_budget_saving_tips(destination):
    """Get budget saving tips specific to the destination"""
    general_tips = [
        "Travel during shoulder season to save on accommodations.",
        "Use local transportation like buses and share taxis.",
        "Eat at street food stalls and local markets.",
        "Book accommodations with free breakfast.",
        "Use water refill stations instead of buying bottled water.",
        "Download offline maps to avoid roaming charges."
    ]
    
    destination_lower = destination.lower()
    destination_specific_tips = []
    
    if any(place in destination_lower for place in ['thailand', 'bangkok', 'phuket', 'chiang mai']):
        destination_specific_tips = [
            "Use songthaews (shared pickup trucks) for cheap transportation.",
            "Visit temples on free entry days.",
            "Stay in guesthouses rather than hotels.",
            "Eat at food courts in malls for cheap, air-conditioned dining."
        ]
    elif any(place in destination_lower for place in ['vietnam', 'hanoi', 'ho chi minh']):
        destination_specific_tips = [
            "Use Grab bike instead of taxis for shorter trips.",
            "Try 'Bia Hoi' for cheap draft beer.",
            "Shop at local markets instead of tourist areas.",
            "Consider homestays outside city centers."
        ]
    elif any(place in destination_lower for place in ['bali', 'indonesia']):
        destination_specific_tips = [
            "Rent a scooter instead of using taxis.",
            "Stay in guesthouses (losmen) for budget accommodations.",
            "Eat at warungs (local food stalls).",
            "Visit beaches that don't charge entrance fees."
        ]
    
    # Combine general and destination-specific tips
    tips = destination_specific_tips[:2] + general_tips[:3]
    return "- " + "\n- ".join(tips)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True) 