# Southeast Asia Travel Budget Planner Chatbot

A domain-specific ChatGPT-style chatbot for planning travel budgets in Southeast Asia, built with Python, Flask, and modern web technologies.

## Features

- Interactive chat interface with typing animations and option buttons
- Domain-specific knowledge about Southeast Asia travel destinations
- Budget planning for different travel styles: budget, mid-range, and luxury
- Currency conversion between USD, EUR, INR, and local currencies
- Dark/light mode toggle with persistent settings

## Setup

1. Install dependencies:
```
pip install -r requirements.txt
```

2. Run the application:
```
python app.py
```

3. Open your browser and navigate to:
```
http://127.0.0.1:5000/
```

## Technologies Used

- **Backend**: Python, Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Tailwind CSS

## How It Works

The chatbot guides users through the following process:

1. Selecting a Southeast Asian destination
2. Choosing a currency for budget display
3. Selecting between a quick budget estimate or detailed custom plan
4. For detailed plans:
   - Inputting travel dates
   - Specifying number of travelers
   - Selecting accommodation preferences
   - Choosing transportation options
   - Setting food preferences
5. Generating a budget breakdown with destination-specific recommendations

## Project Structure

- `app.py`: Main Flask application with routes and chat processing logic
- `templates/`: HTML templates
  - `index.html`: Main chat interface template
- `static/`: Static assets
  - `app.js`: Client-side JavaScript for the chat interface
  - `styles.css`: Custom styles and animations

## Extending the Chatbot

The chatbot is designed to be easily extended with:

- Additional Southeast Asian destinations and their specific data
- Integration with real travel APIs for live pricing
- More detailed itinerary planning features
- User authentication for saving and loading travel plans

## License

This project is licensed under the MIT License - see the LICENSE file for details. 